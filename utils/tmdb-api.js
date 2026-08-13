import { ApiClient } from "./api-client";
import { filterValidContent, ensureUniqueKeys } from "./utils-functions";

const TMDB_BASE_URL = "https://akmovies-tmdb-url.realakmovies.workers.dev/3";

export const tmdbClient = new ApiClient(TMDB_BASE_URL);

// Helper for tmdbFetch
const tmdbFetch = async (endpoint, params = {}) => {
    return await tmdbClient.get(endpoint, params);
};

export const searchMulti = async (query, page = 1) => {
    // If no query, return empty structure
    if (!query) {
        return { results: [], totalPages: 0, page: 1 };
    }

    const data = await tmdbFetch('/search/multi', { query, page });

    // Safety check if data is null/undefined
    if (!data) {
        return { results: [], totalPages: 0, page: 1 };
    }

    let filteredData = filterValidContent(data.results || []);

    return {
        results: ensureUniqueKeys(filteredData),
        totalPages: data.total_pages || data.total_pages || 0,
        page: data.page || 1
    };
};
