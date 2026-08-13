'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';
import { useProgress } from '@/context/progress-context';
import { getContinueWatchingItem } from '@/utils/firestore-functions';
import { getTVSeasonDetails, getMovieDetails, getTVShowDetails, getTitleLogo, getExternalIds } from '@/utils/actions';
import { getAnimeById } from '@/utils/anilist-api';
import { getAnimeMeta } from '@/utils/anizip-api';
import { mapAnilistToWatchData } from '@/utils/anilist-watch-mapper';
import { filterValidContent } from '@/utils/utils-functions';
import { mutate } from "swr";
import { notFound } from "next/navigation";

// Anime uses its own server preference key so picking "Dub" on an anime
// doesn't bleed into the Main/Hindi choice on movies/TV.
const getStoredServer = (type) => {
    if (typeof window === 'undefined') return type === 'anime' ? 'sub' : '1';
    if (type === 'anime') return localStorage.getItem('selectedServerAnime') || 'sub';
    const stored = localStorage.getItem('selectedServer');
    if (stored === '1' || stored === '2') return stored;
    return '1';
};

// Create Context
export const WatchContext = createContext(undefined);

// Initial State
const initialState = {
    data: null,
    loading: true,
    error: false,
    type: 'movie',
    id: null,
    selectedServer: '1',
    selectedSeason: 1,
    selectedEpisode: 1,
    browsingSeason: 1,
    isPlaying: false,
    progress: 0,
    duration: 0,
    initialProgress: 0,
    similarContent: [],
    reviews: [],
    titleLogo: null,
    trailerKey: null,
    seasonEpisodes: [],
    episodesLoading: false,
    imdbId: null,
};

export const WatchProvider = ({ children, type, id }) => {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const { getProgress, setProgress } = useProgress();

    // Extract the actual ID from the combined id-name parameter
    const actualId = id ? id.split('-')[0] : null;

    // Single state object managing all variables
    const [state, setState] = useState({
        ...initialState,
        type: type || 'movie',
        id: id || null,
        selectedServer: getStoredServer(type || 'movie'),
    });

    // Helper to update state partially
    const updateState = useCallback((updates) => {
        setState((prev) => ({
            ...prev,
            ...updates
        }));
    }, []);

    // --------------------------------------------------------------------------
    // Effects
    // --------------------------------------------------------------------------

    // 1. Reset state when id or type changes
    useEffect(() => {
        if ((type && type !== state.type) || (id && id !== state.id)) {
            updateState({
                type,
                id,
                loading: true,
                data: null,
                selectedServer: getStoredServer(type),
                reviews: [],
                similarContent: [],
                seasonEpisodes: [],
                seasonEpisodes: [],
                initialProgress: 0,
                progress: 0,
                duration: 0,
                selectedSeason: 1,
                selectedEpisode: 1,
                browsingSeason: 1,
                titleLogo: null,
                trailerKey: null,
                imdbId: null
            });
        }
    }, [type, id, updateState, state.id, state.type]);

    // 2. Initial Data Load (Firestore + LocalStorage)
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            if (!actualId || !state.type) return;

            let season = 1;
            let episode = 1;

            // Sync with Firestore (Continue Watching) — TV and anime both
            // track per-episode resume position.
            if (isAuthenticated && user?.uid && (state.type === 'tv' || state.type === 'anime')) {
                try {
                    const continueItem = await getContinueWatchingItem(user.uid, parseInt(actualId), state.type);
                    if (continueItem) {
                        season = continueItem.season;
                        episode = continueItem.episode;
                    }
                } catch (e) {
                    console.error("Error loading continue watching:", e);
                }
            }

            if (!isMounted) return;

            // Sync with LocalStorage via Context
            const savedProgress = getProgress(state.type, actualId, season, episode);

            updateState({
                selectedSeason: season,
                selectedEpisode: episode,
                browsingSeason: season,
                initialProgress: savedProgress ? savedProgress.progress : 0,
                progress: savedProgress ? savedProgress.progress : 0,
                duration: savedProgress ? savedProgress.duration : 0,
            });
        };

        if (actualId) {
            loadInitialData();
        }

        return () => {
            isMounted = false;
        };
    }, [actualId, state.type, isAuthenticated, user, getProgress, updateState]);


    // 3. Fetch Details (Movie/TV + Recommendations + Trailer)
    useEffect(() => {
        let isMounted = true;

        const fetchDetails = async () => {
            if (!actualId) return;
            try {
                updateState({ loading: true });
                let data;

                if (state.type === 'movie') {
                    data = await getMovieDetails(actualId);
                } else if (state.type === 'tv') {
                    data = await getTVShowDetails(actualId);
                } else if (state.type === 'anime') {
                    // AniList for primary metadata, AniZip for artwork + per-episode info.
                    // AniZip is best-effort — if it fails, anime still renders from AniList alone.
                    const [anilist, anizip] = await Promise.all([
                        getAnimeById(actualId),
                        getAnimeMeta(actualId).catch(() => null),
                    ]);
                    data = mapAnilistToWatchData(anilist, anizip);
                }

                if (!isMounted) return;

                const updates = { data };

                // Extract trailer key
                if (data?.videos?.results) {
                    const trailer = data.videos.results.find(
                        video => video.type === 'Trailer' && video.site === 'YouTube'
                    );
                    if (trailer) updates.trailerKey = trailer.key;
                }

                // Filter recommendations — TMDB-style filter assumes vote_count/poster/etc,
                // which anime cards already supply, but the safer path is to skip the
                // strict filter for anime and use the curated list straight from AniList.
                if (data?.recommendations?.results) {
                    const list = state.type === 'anime'
                        ? data.recommendations.results
                        : filterValidContent(data.recommendations.results);
                    updates.similarContent = list.slice(0, 15);
                }

                updateState(updates);

                // External IDs — TMDB only. Anime has no imdb_id on AniList directly
                // (it's on the AniZip mappings payload, but Server 4 isn't used for
                // anime anyway), so skip the call.
                if (state.type !== 'anime') {
                    try {
                        const externalIds = await getExternalIds(state.type, actualId);
                        if (isMounted) {
                            updateState({ imdbId: externalIds?.imdb_id || null });
                        }
                    } catch (e) {
                        console.error("Error fetching external IDs:", e);
                    }
                }

            } catch (error) {
                console.error('Error fetching details:', error);
                if (isMounted) {
                    updateState({ error: true });
                }
            } finally {
                if (isMounted) {
                    updateState({ loading: false });
                }
            }
        };

        fetchDetails();

        return () => {
            isMounted = false;
        };
    }, [actualId, state.type, updateState]);

    // 4. Fetch Title Logo
    useEffect(() => {
        let isMounted = true;

        const fetchLogo = async () => {
            if (!actualId || !state.type) return;
            // Anime is rendered with plain text titles by design — skip the
            // TMDB logo fetch (it would 404 anyway).
            if (state.type === 'anime') {
                updateState({ titleLogo: null });
                return;
            }
            try {
                const logoUrl = await getTitleLogo(state.type, parseInt(actualId));
                if (!isMounted) return;
                updateState({ titleLogo: logoUrl });
            } catch (e) {
                if (!isMounted) return;
                updateState({ titleLogo: null });
            }
        };
        fetchLogo();

        return () => {
            isMounted = false;
        };
    }, [actualId, state.type, updateState]);


    // 5. Fetch Season Data (for TV). Anime episode data ships with the
    // mapper from AniZip, so no separate fetch is needed.
    useEffect(() => {
        if (state.type !== 'tv' || !actualId) return;

        let isMounted = true;

        const fetchSeasonData = async () => {
            try {
                updateState({ episodesLoading: true });
                const seasonData = await getTVSeasonDetails(actualId, state.browsingSeason);
                if (!isMounted) return;
                updateState({
                    seasonEpisodes: seasonData.episodes || [],
                    episodesLoading: false
                });
            } catch (error) {
                console.error("Failed to fetch season details:", error);
                if (!isMounted) return;
                updateState({
                    seasonEpisodes: [],
                    episodesLoading: false
                });
            }
        };

        fetchSeasonData();

        return () => {
            isMounted = false;
        };
    }, [actualId, state.type, state.browsingSeason, updateState]);


    // 6. Load reviews
    useEffect(() => {
        let isMounted = true;

        const loadReviews = async () => {
            try {
                if (!actualId || !state.type) return;
                // TMDB-only endpoint. AniList has no equivalent in our query —
                // the review section just renders empty for anime, which is fine.
                if (state.type === 'anime') {
                    updateState({ reviews: [] });
                    return;
                }
                const { getReviews } = await import('@/utils/actions');
                const list = await getReviews(state.type, parseInt(actualId));
                if (!isMounted) return;
                updateState({ reviews: list.slice(0, 12) });
            } catch (e) {
                if (!isMounted) return;
                updateState({ reviews: [] });
            }
        };
        loadReviews();

        return () => {
            isMounted = false;
        };
    }, [actualId, state.type, updateState]);


    // 7. Reset progress on server change
    useEffect(() => {
        updateState({
            progress: 0,
            duration: 0
        });
    }, [state.selectedServer, updateState]);


    // --------------------------------------------------------------------------
    // Actions
    // --------------------------------------------------------------------------


    // Actions
    const checkHistoryLimit = async () => {
        if (!user?.uid || isAdmin) return true;

        const { getHistoryCount, getContinueWatchingItem } = await import('@/utils/firestore-functions');

        // Check if already in history
        const existingItem = await getContinueWatchingItem(user.uid, parseInt(actualId), state.type);
        if (existingItem) return true;

        // Check limit
        const count = await getHistoryCount(user.uid);
        if (count >= 20) {
            toast.error("Continue watching limit reached (20). Please remove items.");
            return false;
        }

        return true;
    };

    const saveToHistory = async (contentDetails, season = null, episode = null) => {
        if (!contentDetails) return;

        const currentSeason = (state.type === 'tv' || state.type === 'anime') ? (season || state.selectedSeason) : 1;
        const currentEpisode = (state.type === 'tv' || state.type === 'anime') ? (episode || state.selectedEpisode) : 1;

        // Save to Firebase if user is logged in
        if (isAuthenticated && user?.uid) {
            const allowed = await checkHistoryLimit();
            if (!allowed) return;

            import('@/utils/firestore-functions').then(async ({ addToHistory, updateContinueWatchingProgress }) => {
                await addToHistory(user.uid, {
                    ...contentDetails,
                    mediaType: state.type,
                    season: currentSeason,
                    episode: currentEpisode,
                    // Map TMDB fields to expected Firebase fields
                    posterPath: contentDetails.poster_path || contentDetails.posterPath,
                    backdropPath: contentDetails.backdrop_path || contentDetails.backdropPath,
                    title: contentDetails.title || contentDetails.name
                });
                await updateContinueWatchingProgress(
                    user.uid,
                    actualId,
                    state.type,
                    currentSeason,
                    currentEpisode
                );
            });
        }
    };

    const updateProgressForEpisode = (s, e) => {
        const saved = getProgress(state.type, actualId, s, e);

        // Update Firebase history progress if logged in and progress exists
        if (isAuthenticated && user?.uid && saved?.progress > 0) {
            import('@/utils/firestore-functions').then(({ updateHistoryProgress }) => {
                updateHistoryProgress(user.uid, actualId, saved.progress);
            });
        }

        updateState({
            initialProgress: saved ? saved.progress : 0,
            progress: saved ? saved.progress : 0,
            selectedSeason: s,
            selectedEpisode: e
        });
    };

    const setSelectedServer = (serverId) => {
        const key = state.type === 'anime' ? 'selectedServerAnime' : 'selectedServer';
        localStorage.setItem(key, serverId);
        updateState({ selectedServer: serverId });
    };

    // Navigation Logic
    const getAnimeEpisodeCount = () =>
        state.data?._animeEpisodes?.length || state.data?.seasons?.[0]?.episode_count || 0;

    const canGoPrevious = () => {
        if (state.type === 'anime') {
            return getAnimeEpisodeCount() > 0 && state.selectedEpisode > 1;
        }
        if (state.type !== 'tv' || !state.data?.seasons) return false;
        const firstSeason = state.data.seasons.find(s => s.season_number > 0);
        return !(state.selectedSeason === firstSeason?.season_number && state.selectedEpisode === 1);
    };

    const canGoNext = () => {
        if (state.type === 'anime') {
            const count = getAnimeEpisodeCount();
            if (count > 0 && state.selectedEpisode < count) {
                const nextEp = state.data?._animeEpisodes?.find(ep => ep.number === state.selectedEpisode + 1);
                if (nextEp) {
                    const airDateStr = nextEp.airDate || nextEp.airdate;
                    if (airDateStr) {
                        try {
                            const dateObj = new Date(airDateStr);
                            if (!isNaN(dateObj.getTime()) && dateObj.getTime() > Date.now()) {
                                return false; // Airs in the future
                            }
                        } catch (e) {}
                    }
                }
                return true;
            }
            return false;
        }
        if (state.type !== 'tv' || !state.data?.seasons) return false;
        const currentSeason = state.data.seasons.find(s => s.season_number === state.selectedSeason);
        const lastSeason = state.data.seasons[state.data.seasons.length - 1];
        if (state.selectedSeason === lastSeason?.season_number && state.selectedEpisode === currentSeason?.episode_count) return false;
        
        // Check if next TV episode has aired (only if it's in the currently loaded season episodes)
        if (state.seasonEpisodes?.length > 0) {
            let nextEpNum = state.selectedEpisode + 1;
            if (nextEpNum <= currentSeason?.episode_count) {
                const nextEp = state.seasonEpisodes.find(ep => ep.episode_number === nextEpNum);
                if (nextEp && nextEp.air_date) {
                    try {
                        const dateObj = new Date(nextEp.air_date);
                        if (!isNaN(dateObj.getTime()) && dateObj.getTime() > Date.now()) {
                            return false; // Airs in the future
                        }
                    } catch (e) {}
                }
            }
        }
        return true;
    };

    const goToPreviousEpisode = () => {
        if (!canGoPrevious()) return;

        let newSeason = state.selectedSeason;
        let newEpisode = state.selectedEpisode;

        if (state.selectedEpisode > 1) {
            newEpisode -= 1;
        } else {
            const prevSeasonData = state.data.seasons.find(s => s.season_number === state.selectedSeason - 1);
            if (prevSeasonData) {
                newSeason -= 1;
                newEpisode = prevSeasonData.episode_count;
            }
        }

        updateProgressForEpisode(newSeason, newEpisode);
        updateState({ browsingSeason: newSeason });
        saveToHistory(state.data, newSeason, newEpisode);
    };

    const goToNextEpisode = () => {
        if (!canGoNext()) return;

        let newSeason = state.selectedSeason;
        let newEpisode = state.selectedEpisode;
        const currentSeasonData = state.data.seasons.find(s => s.season_number === state.selectedSeason);

        if (state.selectedEpisode < currentSeasonData.episode_count) {
            newEpisode += 1;
        } else {
            const nextSeasonData = state.data.seasons.find(s => s.season_number === state.selectedSeason + 1);
            if (nextSeasonData) {
                newSeason += 1;
                newEpisode = 1;
            }
        }

        updateProgressForEpisode(newSeason, newEpisode);
        updateState({ browsingSeason: newSeason });
        saveToHistory(state.data, newSeason, newEpisode);
    };

    const handleSeasonSelect = (seasonNumber) => {
        updateState({ browsingSeason: seasonNumber });
    };

    const handleEpisodeSelect = async (episodeNumber) => {
        if (state.selectedSeason === state.browsingSeason && state.selectedEpisode === episodeNumber) return;

        const allowed = await checkHistoryLimit();
        if (!allowed) return;

        updateProgressForEpisode(state.browsingSeason, episodeNumber);
        await saveToHistory(state.data, state.browsingSeason, episodeNumber);

        if (user?.uid) {
            mutate(["history", user.uid]);
        }
    };

    if (state.error || (!state.loading && !state.data)) {
        notFound();
    }

    return (
        <WatchContext.Provider value={{
            state,
            updateState,
            saveToHistory,
            setProgress,
            getProgress,
            updateProgressForEpisode,
            setSelectedServer,
            goToNextEpisode,
            goToPreviousEpisode,
            canGoNext,
            canGoPrevious,
            handleSeasonSelect,
            handleEpisodeSelect,
            checkHistoryLimit,
            actualId
        }}>
            {children}
        </WatchContext.Provider>
    );
};

// Custom Hook
export const useWatch = () => {
    const context = useContext(WatchContext);
    if (!context) {
        throw new Error('useWatch must be used within a WatchProvider');
    }
    return context;
};
