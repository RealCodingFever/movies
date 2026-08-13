// Looks up TMDB metadata (poster/rating/year) for AI-suggested titles. Cached in memory.

import { CHAT_CONFIG } from "../config";

const cache = new Map();

const cacheKey = (type, title, year) => `${type}:${title.toLowerCase()}:${year ?? ""}`;

export async function fetchMedia(items, token) {
  const results = await Promise.all(items.map((i) => searchOne(i, token).catch(() => null)));
  return results.filter(Boolean);
}

async function searchOne(item, token) {
  const key = cacheKey(item.type, item.title, item.year);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const endpoint = item.type === "movie" ? "search/movie" : "search/tv";
  const { url, headers } = buildTmdbUrl(endpoint, token, {
    query: item.title,
    ...(item.year ? { year: item.year } : {}),
  });

  const res = await fetch(url, { headers });
  if (!res.ok) return null;

  const data = await res.json();
  const first = data?.results?.[0];
  if (!first || typeof first !== "object") return null;

  const media = toMedia(item.type, first);
  if (!media) return null;

  cache.set(key, { value: media, expiresAt: Date.now() + CHAT_CONFIG.tmdbCacheTtlMs });
  return media;
}

function buildTmdbUrl(endpoint, token, params = {}) {
  // Bearer tokens are long (v4 auth); short tokens are v3 api_key
  const isBearer = token.length > 50;
  const searchParams = new URLSearchParams({ language: "en-US", ...params });

  if (isBearer) {
    return {
      url: `${CHAT_CONFIG.tmdbApiBase}/${endpoint}?${searchParams}`,
      headers: { authorization: `Bearer ${token}`, accept: "application/json" },
    };
  }

  searchParams.set("api_key", token);
  return {
    url: `${CHAT_CONFIG.tmdbApiBase}/${endpoint}?${searchParams}`,
    headers: { accept: "application/json" },
  };
}

function toMedia(type, raw) {
  const id = typeof raw.id === "number" ? raw.id : null;
  if (!id) return null;

  const title = type === "movie" ? raw.title ?? raw.original_title : raw.name ?? raw.original_name;
  const dateField = type === "movie" ? raw.release_date : raw.first_air_date;
  const poster = raw.poster_path;

  return {
    id,
    type,
    title: title ?? "Untitled",
    posterUrl: poster ? `${CHAT_CONFIG.tmdbImageBase}${poster}` : null,
    rating: typeof raw.vote_average === "number" ? Number(raw.vote_average.toFixed(1)) : 0,
    year: dateField ? dateField.slice(0, 4) : null,
    overview: raw.overview ?? "",
  };
}
