import { tmdbClient } from "./tmdb-api";
import { filterValidContent, ensureUniqueKeys } from "./utils-functions";
import { cache } from "react";
import { getAnimeById } from "./anilist-api";
import { getAnimeMeta } from "./anizip-api";
import { mapAnilistToWatchData } from "./anilist-watch-mapper";

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
    if (!path) return '/placeholder-movie.jpg';
    if (path.startsWith('http') || path.startsWith('https')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${TMDB_IMAGE_BASE_URL}/${size}/${cleanPath}`;
};

export const getDetails = async (mediaType, id) => {
    if (mediaType === 'anime') {
        const [anilist, anizip] = await Promise.all([
            getAnimeById(id),
            getAnimeMeta(id).catch(() => null),
        ]);
        return mapAnilistToWatchData(anilist, anizip);
    }

    return await tmdbClient.get(
        `/${mediaType}/${id}`,
        { append_to_response: "videos,images,credits" },
        {
            cache: "no-store"
        }
    );
};

export const getCachedDetails = cache(async (type, id) => {
    return await getDetails(type, id);
});

export const getMovieDetails = async (movieId) => {
    return await tmdbClient.get(`/movie/${movieId}`, {
        append_to_response: 'credits,videos,recommendations,release_dates'
    });
};

export const getTVShowDetails = async (tvId) => {
    return await tmdbClient.get(`/tv/${tvId}`, {
        append_to_response: 'credits,videos,recommendations,content_ratings'
    });
};

export const searchMulti = async (query, page = 1) => {
    const data = await tmdbClient.get('/search/multi', { query, page });
    let filteredData = filterValidContent(data.results || []);

    // filteredData = filteredData.filter(item => {
    //     const isAnimation = item.genre_ids?.includes(16);
    //     const isJapanese = item.original_language === 'ja' || item.origin_country?.includes('JP');
    //     if (isAnimation && isJapanese) return false;
    //     return true;
    // });

    return {
        results: ensureUniqueKeys(filteredData),
        totalPages: data.total_pages,
        page: data.page
    };
};

export const getMovieImages = async (movieId) => await tmdbClient.get(`/movie/${movieId}/images`);
export const getTVShowImages = async (tvId) => await tmdbClient.get(`/tv/${tvId}/images`);

const createDiscoverFunction = (mediaType, baseParams = {}) => {
    return async (overrideParams = {}, options = {}) => {
        const fetchMultiplePages = async (currentParams) => {
            const pagePromises = [1, 2, 3].map(page =>
                tmdbClient.get(`/discover/${mediaType}`, { ...currentParams, page }, options)
            );
            const pageResults = await Promise.all(pagePromises);
            return pageResults.flatMap(page => page?.results || []);
        };

        const params = { ...baseParams, ...overrideParams };
        const allResults = await fetchMultiplePages(params);
        const filteredData = filterValidContent(allResults);
        return ensureUniqueKeys(filteredData);
    };
};

export const getTopMovies = createDiscoverFunction('movie', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': 1000,
});

export const getTopTVShows = createDiscoverFunction('tv', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': 500,
});

const getCurrentDate = () => new Date().toISOString().split('T')[0];
const getThreeMonthsAgo = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
};

export const getRecentMovies = createDiscoverFunction('movie', {
    sort_by: 'popularity.desc',
    'primary_release_date.gte': getThreeMonthsAgo(),
    'primary_release_date.lte': getCurrentDate(),
    'vote_count.gte': 10,
});

export const getRecentTVShows = createDiscoverFunction('tv', {
    sort_by: 'popularity.desc',
    'first_air_date.gte': getThreeMonthsAgo(),
    'first_air_date.lte': getCurrentDate(),
    'vote_count.gte': 10,
});

export const getTopHorror = createDiscoverFunction('movie', {
    with_genres: 27,
    sort_by: 'vote_average.desc',
    'vote_count.gte': 200,
});

export const getTopComedy = createDiscoverFunction('movie', {
    with_genres: 35,
    sort_by: 'vote_average.desc',
    'vote_count.gte': 200,
});

export const getTopKDramas = createDiscoverFunction('tv', {
    with_origin_country: 'KR',
    with_genres: 18,
    sort_by: 'popularity.desc',
});

export const getTrending = async (mediaType = 'all', timeWindow = 'week', options = {}) => {
    const data = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`, {}, options);
    return filterValidContent(data.results || []);
};

export const getPopularMovies = createDiscoverFunction('movie', { sort_by: 'popularity.desc' });
export const getPopularTVShows = createDiscoverFunction('tv', { sort_by: 'popularity.desc' });

const studioNetworkMap = {
    2: 2739, 420: 2739, 12: 2739, 25: 1013, 7521: 2739,
    174: 49, 9993: 49, 120462: 49, 17: 49,
    33: 3353, 56: 3353, 6704: 3353,
    4: 4330, 5: 209, 34: 209,
    21: 213, 20580: 2552, 41077: 49,
    7505: 318, 8411: 2552, 10342: 453,
};

export const getCompanyDetails = async (companyId) => await tmdbClient.get(`/company/${companyId}`);

export const getTopContentByStudio = async (companyId, mediaType = 'movie') => {
    const fetchMultiplePages = async (baseParams) => {
        const pagePromises = [1, 2, 3].map(page =>
            tmdbClient.get(`/discover/${mediaType}`, { ...baseParams, page })
        );
        const pageResults = await Promise.all(pagePromises);
        return pageResults.flatMap(page => page?.results || []);
    };

    const primaryParams = {
        with_companies: companyId,
        sort_by: 'vote_average.desc',
        'vote_count.gte': mediaType === 'tv' ? 200 : 300,
    };

    const networkId = studioNetworkMap[companyId];
    if (mediaType === 'tv' && networkId) {
        primaryParams.with_networks = networkId;
    }

    let allResults = await fetchMultiplePages(primaryParams);
    let validResults = filterValidContent(allResults);

    validResults = validResults.filter(item => {
        const dateString = item.release_date || item.first_air_date;
        if (!dateString) return false;
        return new Date(dateString).getFullYear() >= 2000;
    });

    if (validResults.length < 20) {
        const fallbackParams = {
            with_companies: companyId,
            sort_by: 'popularity.desc',
        };
        allResults = await fetchMultiplePages(fallbackParams);
        validResults = filterValidContent(allResults);
    }

    const uniqueResults = Array.from(new Map(validResults.map(item => [item.id, item])).values());
    return uniqueResults.slice(0, 50);
};

export const getNowPlayingMovies = async (page = 1) => tmdbClient.get('/movie/now_playing', { page });
export const getUpcomingMovies = async (page = 1) => tmdbClient.get('/movie/upcoming', { page });
export const getMovieGenres = async () => (await tmdbClient.get('/genre/movie/list')).genres;
export const getTVGenres = async () => (await tmdbClient.get('/genre/tv/list')).genres;

export const getTitleLogo = async (mediaType, id) => {
    try {
        const images = mediaType === 'movie' ? await getMovieImages(id) : await getTVShowImages(id);
        if (images?.logos?.length > 0) {
            const englishLogo = images.logos.find(logo => logo.iso_639_1 === 'en');
            const bestLogo = englishLogo || images.logos.sort((a, b) => b.vote_average - a.vote_average)[0];
            return getImageUrl(bestLogo.file_path, 'original');
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const getTVSeasonDetails = async (tvId, seasonNumber) => {
    return await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}`);
};

export const getReviews = async (mediaType, id, page = 1) => {
    const endpoint = mediaType === 'movie' ? `/movie/${id}/reviews` : `/tv/${id}/reviews`;
    const data = await tmdbClient.get(endpoint, { page });
    return data?.results || [];
};

export const getTopRatedMovies = async (page = 1) => tmdbClient.get('/movie/top_rated', { page });
export const getTopRatedTVShows = async (page = 1) => tmdbClient.get('/tv/top_rated', { page });
export const getOnTheAirTVShows = async (page = 1) => tmdbClient.get('/tv/on_the_air', { page });
export const getAiringTodayTVShows = async (page = 1) => tmdbClient.get('/tv/airing_today', { page });
export const getExternalIds = async (mediaType, id) => {
    return await tmdbClient.get(`/${mediaType}/${id}/external_ids`);
};

export const discoverContent = async (mediaType, params = {}) => tmdbClient.get(`/discover/${mediaType}`, params);
