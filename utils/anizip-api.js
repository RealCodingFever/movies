import { ApiClient } from "./api-client";

// AniZip mapping API. Aggregates titles, episode metadata, artwork, and
// cross-site IDs (MAL, Kitsu, TVDB, TMDB, IMDB, etc) keyed off one ID.
const ANIZIP_BASE_URL = "https://api.ani.zip";

export const anizipClient = new ApiClient(ANIZIP_BASE_URL);

// ---------------------------------------------------------------------------
// Raw mapping fetch
// ---------------------------------------------------------------------------

const fetchMapping = (params) => anizipClient.get("/mappings", params);

export const getMappingByAnilistId = (anilistId) =>
  fetchMapping({ anilist_id: anilistId });

export const getMappingByMalId = (malId) =>
  fetchMapping({ mal_id: malId });

export const getMappingByAnidbId = (anidbId) =>
  fetchMapping({ anidb_id: anidbId });

export const getMappingByKitsuId = (kitsuId) =>
  fetchMapping({ kitsu_id: kitsuId });

export const getMappingByTvdbId = (tvdbId) =>
  fetchMapping({ thetvdb_id: tvdbId });

export const getMappingByTmdbId = (tmdbId) =>
  fetchMapping({ themoviedb_id: tmdbId });

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

const pickTitle = (titleObj, fallback = "") => {
  if (!titleObj) return fallback;
  return (
    titleObj.en ||
    titleObj["x-jat"] ||
    titleObj.ja ||
    titleObj.romaji ||
    Object.values(titleObj)[0] ||
    fallback
  );
};

const normalizeEpisode = (key, ep) => {
  const parsedKey = Number(key);
  const number = !isNaN(parsedKey) ? parsedKey : (ep?.episodeNumber ?? NaN);
  return {
    number,
    key, // raw key from the API ("1", "S1", etc.)
    title: pickTitle(ep?.title, `Episode ${number}`),
    titles: ep?.title || {},
    overview: ep?.overview || ep?.summary || "",
    image: ep?.image || null,
    airDate: ep?.airDate || ep?.airdate || null,
    airDateUtc: ep?.airDateUtc || null,
    runtime: ep?.runtime ?? ep?.length ?? null,
    rating: ep?.rating != null ? Number(ep.rating) : null,
    seasonNumber: ep?.seasonNumber ?? null,
    episodeNumber: ep?.episodeNumber ?? number,
    absoluteEpisodeNumber: ep?.absoluteEpisodeNumber ?? null,
    ids: {
      tvdbId: ep?.tvdbId ?? null,
      tvdbShowId: ep?.tvdbShowId ?? null,
      anidbEid: ep?.anidbEid ?? null,
    },
  };
};

const normalizeImages = (images = []) => {
  const byType = (type) => images.find((i) => i.coverType === type)?.url || null;
  return {
    poster: byType("Poster"),
    banner: byType("Banner"),
    fanart: byType("Fanart"),
    clearLogo: byType("Clearlogo"),
    all: images,
  };
};

// ---------------------------------------------------------------------------
// Convenience getters
// ---------------------------------------------------------------------------

export const getEpisodes = async (anilistId) => {
  const data = await getMappingByAnilistId(anilistId);
  if (!data?.episodes) return [];
  return Object.entries(data.episodes)
    .map(([key, ep]) => normalizeEpisode(key, ep))
    .sort((a, b) => a.number - b.number);
};

export const getEpisode = async (anilistId, episodeNumber) => {
  const data = await getMappingByAnilistId(anilistId);
  const ep = data?.episodes?.[String(episodeNumber)];
  return ep ? normalizeEpisode(String(episodeNumber), ep) : null;
};

export const getImages = async (anilistId) => {
  const data = await getMappingByAnilistId(anilistId);
  return normalizeImages(data?.images);
};

export const getTitles = async (anilistId) => {
  const data = await getMappingByAnilistId(anilistId);
  return data?.titles ?? {};
};

export const getExternalIds = async (anilistId) => {
  const data = await getMappingByAnilistId(anilistId);
  return data?.mappings ?? {};
};

// Full normalized payload — one fetch, everything the watch page needs.
export const getAnimeMeta = async (anilistId) => {
  const data = await getMappingByAnilistId(anilistId);
  if (!data) return null;

  const episodes = data.episodes
    ? Object.entries(data.episodes)
        .map(([key, ep]) => normalizeEpisode(key, ep))
        .sort((a, b) => a.number - b.number)
    : [];

  return {
    titles: data.titles ?? {},
    title: pickTitle(data.titles),
    images: normalizeImages(data.images),
    episodes,
    episodeCount: data.episodeCount ?? episodes.length,
    specialCount: data.specialCount ?? 0,
    mappings: data.mappings ?? {},
  };
};
