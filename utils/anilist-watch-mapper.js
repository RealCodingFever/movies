import { mapAnilistToCard } from "./anilist-api";

// Pure adapter — takes the raw AniList Media payload + the normalized AniZip
// meta payload (from getAnimeMeta) and produces an object shaped like the
// TMDB movie/TV detail response. This lets the existing watch page render
// anime without any media-type forks in most components.
//
// The non-TMDB fields are prefixed with an underscore so we can spot them
// downstream (e.g. _animeEpisodes drives the episode-list component).

const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, "").trim() : "");

const pickTitle = (t) =>
    t?.english || t?.userPreferred || t?.romaji || t?.native || "Untitled";

const formatFuzzyDate = (d) => {
    if (!d?.year) return null;
    const mm = String(d.month || 1).padStart(2, "0");
    const dd = String(d.day || 1).padStart(2, "0");
    return `${d.year}-${mm}-${dd}`;
};

const buildVideos = (anilist) => {
    const t = anilist?.trailer;
    if (!t?.id || t.site !== "youtube" && t.site !== "YouTube") return { results: [] };
    return {
        results: [
            {
                key: t.id,
                site: "YouTube",
                type: "Trailer",
                name: "Official Trailer",
            },
        ],
    };
};

const buildCast = (anilist) =>
    (anilist?.characters?.edges ?? [])
        .slice(0, 12)
        .map((edge, i) => ({
            id: edge.node?.id ?? i,
            name: edge.node?.name?.full ?? "",
            character: edge.role ?? "",
            profile_path: edge.node?.image?.large || edge.node?.image?.medium || null,
        }))
        .filter((c) => c.name);

const buildCrew = (anilist) => {
    const crew = [];
    for (const edge of anilist?.staff?.edges ?? []) {
        const role = (edge.role || "").toLowerCase();
        // Map common anime credit roles to the closest TMDB job names so the
        // existing watch-detail Directors row finds something to display.
        let job = null;
        if (role.includes("director") && !role.includes("animation director")) job = "Director";
        else if (role.includes("series composition")) job = "Series Composition";
        else if (role.includes("original creator")) job = "Original Creator";
        if (job) {
            crew.push({
                id: edge.node?.id,
                name: edge.node?.name?.full,
                job,
                profile_path: edge.node?.image?.large || null,
            });
        }
    }
    return crew;
};

const buildRecommendations = (anilist) => {
    const nodes = anilist?.recommendations?.nodes ?? [];
    const results = nodes
        .map((n) => mapAnilistToCard(n.mediaRecommendation))
        .filter(Boolean);
    return { results };
};

const buildSeasons = (anilist, anizip) => {
    if (anilist?.format === "MOVIE") return null;
    const episodeCount =
        anilist?.episodes ?? anizip?.episodeCount ?? anizip?.episodes?.length ?? 0;
    if (!episodeCount) return null;
    return [
        {
            id: 1,
            season_number: 1,
            episode_count: episodeCount,
            name: "Season 1",
        },
    ];
};

const COUNTRY_NAMES = {
    JP: "Japan",
    CN: "China",
    KR: "South Korea",
    TW: "Taiwan",
};

export const mapAnilistToWatchData = (anilist, anizip) => {
    if (!anilist) return null;

    const title = pickTitle(anilist.title);
    const date = formatFuzzyDate(anilist.startDate);
    const country = anilist.countryOfOrigin || "JP";
    const studios =
        anilist.studios?.edges
            ?.filter((e) => e.isMain)
            ?.map((e) => ({ id: e.node?.id, name: e.node?.name }))
        || anilist.studios?.nodes?.map((s) => ({ id: s.id, name: s.name }))
        || [];

    return {
        id: anilist.id,
        title,
        name: title,
        original_title: anilist.title?.native || title,
        overview: stripHtml(anilist.description),
        poster_path:
            anilist.coverImage?.extraLarge ||
            anilist.coverImage?.large ||
            anizip?.images?.poster ||
            null,
        backdrop_path:
            anizip?.images?.fanart ||
            anilist.bannerImage ||
            anizip?.images?.banner ||
            null,
        release_date: date,
        first_air_date: date,
        vote_average: anilist.averageScore != null ? anilist.averageScore / 10 : null,
        vote_count: anilist.popularity ?? 0,
        runtime: anilist.duration ?? null,
        episode_run_time: anilist.duration ? [anilist.duration] : [],
        genres: (anilist.genres ?? []).map((g) => ({ id: g, name: g })),
        production_countries: [{ name: COUNTRY_NAMES[country] || country }],
        production_companies: studios,
        videos: buildVideos(anilist),
        credits: { cast: buildCast(anilist), crew: buildCrew(anilist) },
        recommendations: buildRecommendations(anilist),
        seasons: buildSeasons(anilist, anizip),

        // Anime-specific extensions (prefixed with `_` so they don't collide
        // with any TMDB field name we might want to render later).
        _animeFormat: anilist.format,
        _animeStatus: anilist.status,
        _animeEpisodes: anizip?.episodes ?? [],
        _animeTitles: anizip?.titles ?? {},
        _animeMappings: anizip?.mappings ?? {},
    };
};
