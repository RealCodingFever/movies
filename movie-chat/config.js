// Widget config + helpers to resolve runtime env variables.

export const CHAT_CONFIG = {
  maxHistory: 16,
  historySentToAi: 10,
  maxItemsPerReply: 5,
  storageKeyPrefix: "akmovies:chat",
  contextStorageKeyPrefix: "akmovies:ctx",
  tmdbImageBase: "https://image.tmdb.org/t/p/w342",
  tmdbApiBase: "https://api.themoviedb.org/3",
  tmdbCacheTtlMs: 1000 * 60 * 60 * 24,
  requestTimeoutMs: 20_000,
};

export function resolveWorkerUrl(override) {
  const url = override ?? process.env.NEXT_PUBLIC_MOVIE_CHAT_WORKER_URL;
  if (!url) {
    throw new Error(
      "[movie-chat] Missing worker URL. Pass `workerUrl` prop or set NEXT_PUBLIC_MOVIE_CHAT_WORKER_URL."
    );
  }
  return url;
}

export function resolveTmdbToken(override) {
  const token = override ?? process.env.NEXT_PUBLIC_TMDB_TOKEN;
  if (!token) {
    throw new Error(
      "[movie-chat] Missing TMDB token. Pass `tmdbToken` prop or set NEXT_PUBLIC_TMDB_TOKEN."
    );
  }
  return token;
}

export function resolveTurnstileSiteKey(override) {
  return override ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}
