import { ApiClient } from "./api-client";

// AniList GraphQL endpoint. POSTs only.
const ANILIST_BASE_URL = "https://graphql.anilist.co";

export const anilistClient = new ApiClient(ANILIST_BASE_URL);

// ---------------------------------------------------------------------------
// GraphQL fragments
// ---------------------------------------------------------------------------

// Fields needed for cards / list rows.
const MEDIA_CARD_FIELDS = `
  id
  idMal
  title { romaji english native userPreferred }
  coverImage { extraLarge large medium color }
  bannerImage
  description(asHtml: false)
  episodes
  duration
  status
  season
  seasonYear
  startDate { year month day }
  endDate { year month day }
  averageScore
  meanScore
  popularity
  favourites
  trending
  genres
  format
  source
  countryOfOrigin
  isAdult
  studios(isMain: true) { nodes { id name } }
  nextAiringEpisode { airingAt timeUntilAiring episode }
`;

// Extra fields for the single-anime detail page.
const MEDIA_DETAIL_FIELDS = `
  ${MEDIA_CARD_FIELDS}
  synonyms
  hashtag
  trailer { id site thumbnail }
  characters(perPage: 12, sort: [ROLE, RELEVANCE]) {
    edges {
      role
      node { id name { full native } image { large medium } }
      voiceActors(language: JAPANESE) {
        id
        name { full native }
        image { large medium }
      }
    }
  }
  staff(perPage: 8) {
    edges { role node { id name { full } image { large } } }
  }
  relations {
    edges {
      relationType
      node {
        id type format status
        title { romaji english userPreferred }
        coverImage { large medium }
      }
    }
  }
  recommendations(perPage: 12, sort: RATING_DESC) {
    nodes {
      mediaRecommendation {
        id
        title { romaji english userPreferred }
        coverImage { large }
        averageScore
        format
      }
    }
  }
  externalLinks { id site url type }
  streamingEpisodes { title thumbnail url site }
  rankings { rank type season year allTime context }
  tags { id name rank isMediaSpoiler }
`;

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

const anilistFetch = (query, variables = {}, options = {}) =>
  anilistClient.post("", { query, variables }, options);

const unwrapPage = (res) => res?.data?.Page;
const unwrapMedia = (res) => res?.data?.Media;

export const getCurrentSeason = () => {
  const m = new Date().getUTCMonth() + 1;
  if (m <= 3) return "WINTER";
  if (m <= 6) return "SPRING";
  if (m <= 9) return "SUMMER";
  return "FALL";
};

export const getCurrentSeasonYear = () => new Date().getUTCFullYear();

const getNextSeason = (season = getCurrentSeason(), year = getCurrentSeasonYear()) => {
  const order = ["WINTER", "SPRING", "SUMMER", "FALL"];
  const idx = order.indexOf(season);
  const nextSeason = order[(idx + 1) % 4];
  const nextYear = idx === 3 ? year + 1 : year;
  return { season: nextSeason, seasonYear: nextYear };
};

// GraphQL types for any filter we pass through listMedia.
const FILTER_TYPES = {
  search: "String",
  season: "MediaSeason",
  seasonYear: "Int",
  status: "MediaStatus",
  status_in: "[MediaStatus]",
  status_not: "MediaStatus",
  status_not_in: "[MediaStatus]",
  format: "MediaFormat",
  format_in: "[MediaFormat]",
  genre: "String",
  genre_in: "[String]",
  tag: "String",
  startDate_greater: "FuzzyDateInt",
  startDate_lesser: "FuzzyDateInt",
  averageScore_greater: "Int",
  popularity_greater: "Int",
  isAdult: "Boolean",
  countryOfOrigin: "CountryCode",
};

// Global content gate. AniList's `isAdult` flag is set only for hentai /
// explicit nudity, so this excludes that bucket without touching anime that
// are mature for violence, themes, etc. We also strip out unreleased titles
// from any "what to watch right now" feed. Callers can opt out with safe:false
// (used by getUpcomingNextSeason, which specifically wants future titles).
const applySafeFilters = (filters = {}, safe = true) => {
  if (!safe) return filters;
  const next = { ...filters };
  if (next.isAdult === undefined) next.isAdult = false;
  const hasStatusFilter =
    next.status !== undefined ||
    next.status_in !== undefined ||
    next.status_not !== undefined ||
    next.status_not_in !== undefined;
  if (!hasStatusFilter) {
    next.status_not = "NOT_YET_RELEASED";
  }
  return next;
};

// Generic Page(media: ...) helper. Dynamic filter args.
const listMedia = async ({
  page = 1,
  perPage = 20,
  sort = "POPULARITY_DESC",
  filters = {},
  safe = true,
} = {}) => {
  filters = applySafeFilters(filters, safe);
  const argDecls = ["$page: Int", "$perPage: Int", "$sort: [MediaSort]"];
  const mediaArgs = ["type: ANIME", "sort: $sort"];
  const variables = {
    page,
    perPage,
    sort: Array.isArray(sort) ? sort : [sort],
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value == null || value === "") continue;
    const gqlType = FILTER_TYPES[key] || "String";
    argDecls.push(`$${key}: ${gqlType}`);
    mediaArgs.push(`${key}: $${key}`);
    variables[key] = value;
  }

  const query = `
    query (${argDecls.join(", ")}) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(${mediaArgs.join(", ")}) {
          ${MEDIA_CARD_FIELDS}
        }
      }
    }
  `;

  const res = await anilistFetch(query, variables);
  const p = unwrapPage(res);
  return {
    results: p?.media ?? [],
    pageInfo: p?.pageInfo ?? null,
  };
};

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export const searchAnime = async (search, page = 1, perPage = 20, safe = true) => {
  if (!search) return { results: [], pageInfo: null };

  // Route through listMedia so the same global filter applies (adult + unreleased).
  return listMedia({
    page,
    perPage,
    sort: "SEARCH_MATCH",
    filters: { search },
    safe,
  });
};

// ---------------------------------------------------------------------------
// Discovery feeds
// ---------------------------------------------------------------------------

export const getTopAnime = (page = 1, perPage = 20) =>
  listMedia({ page, perPage, sort: "SCORE_DESC" });

export const getMostPopular = (page = 1, perPage = 20) =>
  listMedia({ page, perPage, sort: "POPULARITY_DESC" });

// AniList computes "trending" as a rolling rank of recent activity. There is
// no native day/week/month window, so we approximate:
//   - day    → currently-airing items ordered by trending
//   - week   → current season, trending + popularity
//   - month  → current year, popularity + trending
export const getTrending = (page = 1, perPage = 20) =>
  listMedia({ page, perPage, sort: "TRENDING_DESC" });

export const getTrendingToday = (page = 1, perPage = 20) =>
  listMedia({
    page,
    perPage,
    sort: ["TRENDING_DESC", "POPULARITY_DESC"],
    filters: { status: "RELEASING" },
  });

export const getTrendingThisWeek = (page = 1, perPage = 20) =>
  listMedia({
    page,
    perPage,
    sort: ["TRENDING_DESC", "POPULARITY_DESC"],
    filters: {
      season: getCurrentSeason(),
      seasonYear: getCurrentSeasonYear(),
    },
  });

export const getTrendingThisMonth = (page = 1, perPage = 20) =>
  listMedia({
    page,
    perPage,
    sort: ["POPULARITY_DESC", "TRENDING_DESC"],
    filters: { seasonYear: getCurrentSeasonYear() },
  });

// Convenience switcher for day | week | month.
export const getTrendingByTimeframe = (timeframe = "day", page = 1, perPage = 20) => {
  switch (timeframe) {
    case "week":  return getTrendingThisWeek(page, perPage);
    case "month": return getTrendingThisMonth(page, perPage);
    case "day":
    default:      return getTrendingToday(page, perPage);
  }
};

export const getPopularThisSeason = (page = 1, perPage = 20) =>
  listMedia({
    page,
    perPage,
    sort: "POPULARITY_DESC",
    filters: {
      season: getCurrentSeason(),
      seasonYear: getCurrentSeasonYear(),
    },
  });

export const getUpcomingNextSeason = (page = 1, perPage = 20) => {
  const { season, seasonYear } = getNextSeason();
  return listMedia({
    page,
    perPage,
    sort: "POPULARITY_DESC",
    filters: { season, seasonYear, status: "NOT_YET_RELEASED" },
    safe: false,
  });
};

// Currently-airing, ranked by popularity. Distinct from "trending today" —
// this is "the live seasonal lineup people are actively watching".
export const getTopAiring = (page = 1, perPage = 20) =>
  listMedia({
    page,
    perPage,
    sort: ["POPULARITY_DESC", "SCORE_DESC"],
    filters: { status: "RELEASING" },
  });

export const getTopMovies = (page = 1, perPage = 20) =>
  listMedia({
    page,
    perPage,
    sort: "SCORE_DESC",
    filters: { format: "MOVIE" },
  });

export const getRecentlyAdded = (page = 1, perPage = 20) =>
  listMedia({ page, perPage, sort: "ID_DESC" });

export const getAnimeByGenre = (genre, page = 1, perPage = 20) =>
  listMedia({ page, perPage, sort: "POPULARITY_DESC", filters: { genre } });

export const getAnimeByFormat = (format, page = 1, perPage = 20) =>
  listMedia({ page, perPage, sort: "POPULARITY_DESC", filters: { format } });

// Generic pass-through so the UI can build custom filter views.
export const discoverAnime = (params = {}) => listMedia(params);

// ---------------------------------------------------------------------------
// Single anime
// ---------------------------------------------------------------------------

export const getAnimeById = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${MEDIA_DETAIL_FIELDS}
      }
    }
  `;
  const res = await anilistFetch(query, { id: Number(id) });
  return unwrapMedia(res);
};

export const getAnimeByMalId = async (idMal) => {
  const query = `
    query ($idMal: Int) {
      Media(idMal: $idMal, type: ANIME) {
        ${MEDIA_DETAIL_FIELDS}
      }
    }
  `;
  const res = await anilistFetch(query, { idMal: Number(idMal) });
  return unwrapMedia(res);
};

// Lightweight version for hover cards / quick previews.
export const getAnimeCardById = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${MEDIA_CARD_FIELDS}
      }
    }
  `;
  const res = await anilistFetch(query, { id: Number(id) });
  return unwrapMedia(res);
};

// ---------------------------------------------------------------------------
// Genre / metadata helpers
// ---------------------------------------------------------------------------

export const getGenres = async () => {
  const res = await anilistFetch(`query { GenreCollection }`);
  return res?.data?.GenreCollection ?? [];
};

// ---------------------------------------------------------------------------
// Latest released episodes
// ---------------------------------------------------------------------------

// Pulls airing schedule entries that already aired in the last `hoursBack`
// window, newest first. Adult titles are dropped post-fetch (the airing
// schedule endpoint doesn't expose an `isAdult` filter directly).
export const getLatestEpisodes = async ({
  page = 1,
  perPage = 24,
  hoursBack = 72,
} = {}) => {
  const now = Math.floor(Date.now() / 1000);
  const airingAt_greater = now - hoursBack * 3600;

  const query = `
    query ($page: Int, $perPage: Int, $airingAt_lesser: Int, $airingAt_greater: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        airingSchedules(
          airingAt_lesser: $airingAt_lesser,
          airingAt_greater: $airingAt_greater,
          sort: TIME_DESC
        ) {
          id
          airingAt
          timeUntilAiring
          episode
          mediaId
          media {
            ${MEDIA_CARD_FIELDS}
          }
        }
      }
    }
  `;

  // Always hit the network — this feed needs to stay fresh.
  const res = await anilistFetch(
    query,
    {
      page,
      perPage,
      airingAt_lesser: now,
      airingAt_greater,
    },
    { cache: "no-store" }
  );

  const p = unwrapPage(res);
  const schedules = (p?.airingSchedules ?? []).filter(
    (s) => s.media && !s.media.isAdult
  );

  return {
    results: schedules,
    pageInfo: p?.pageInfo ?? null,
  };
};

// ---------------------------------------------------------------------------
// Card-shape mappers — flatten AniList payloads into the {poster_path, title,
// vote_average, media_type, ...} shape the existing MovieCard expects.
// ---------------------------------------------------------------------------

const pickAnimeTitle = (t) =>
  t?.english || t?.userPreferred || t?.romaji || t?.native || "Untitled";

const formatFuzzyDate = (d) => {
  if (!d?.year) return null;
  const mm = String(d.month || 1).padStart(2, "0");
  const dd = String(d.day || 1).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
};

export const mapAnilistToCard = (m) => {
  if (!m) return null;
  return {
    id: m.id,
    title: pickAnimeTitle(m.title),
    name: pickAnimeTitle(m.title),
    poster_path: m.coverImage?.extraLarge || m.coverImage?.large || m.coverImage?.medium || null,
    backdrop_path: m.bannerImage || null,
    vote_average: m.averageScore != null ? m.averageScore / 10 : null,
    vote_count: m.popularity ?? 0,
    release_date: formatFuzzyDate(m.startDate),
    first_air_date: formatFuzzyDate(m.startDate),
    media_type: "anime",
    overview: m.description ? m.description.replace(/<[^>]*>/g, "") : "",
    original_language: "ja",
    genre_ids: [],
    genres: m.genres ?? [],
    anilist: {
      idMal: m.idMal,
      format: m.format,
      status: m.status,
      episodes: m.episodes,
      duration: m.duration,
      season: m.season,
      seasonYear: m.seasonYear,
      color: m.coverImage?.color,
      nextAiringEpisode: m.nextAiringEpisode,
      studios: m.studios?.nodes ?? [],
    },
  };
};

// Schedule entry → card. Adds an `episode` label so feeds like "Recently
// Released" can surface "Ep 3" alongside the poster.
export const mapAiringScheduleToCard = (s) => {
  if (!s?.media) return null;
  const base = mapAnilistToCard(s.media);
  return {
    ...base,
    episode: s.episode,
    air_date: s.airingAt ? new Date(s.airingAt * 1000).toISOString() : null,
    airing_at: s.airingAt,
  };
};
