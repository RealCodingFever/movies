'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchMulti } from '@/utils/tmdb-api';
import { searchAnime, mapAnilistToCard } from '@/utils/anilist-api';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export function SearchProvider({ children }) {
    const searchParams = useSearchParams();
    const router = useRouter();


    // Initial state from URL
    const initialQuery = searchParams.get('q') || '';
    const initialType = searchParams.get('type') === 'anime' ? 'anime' : 'all';

    const [query, setQuery] = useState(initialQuery);
    const [searchType, setSearchType] = useState(initialType);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const isAnime = searchType === 'anime';
    const typeLabel = isAnime ? 'Anime' : 'Movies & TV Shows';

    // Dynamic title based on search query
    useEffect(() => {
        // Only run on client
        if (typeof document !== 'undefined') {
            if (query.trim()) {
                document.title = `Search ${typeLabel}: "${query}" | AKMovies`;
            } else {
                document.title = `Search ${typeLabel} | AKMovies`;
            }
        }
    }, [query, typeLabel]);

    const performSearch = useCallback(async (searchQuery, page = 1, type = 'all') => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            let items;
            let pages;

            if (type === 'anime') {
                const data = await searchAnime(searchQuery, page, 20);
                items = (data.results || []).map(mapAnilistToCard).filter(Boolean);
                pages = data.pageInfo?.lastPage || 1;
            } else {
                const data = await searchMulti(searchQuery, page);
                items = (data.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv');
                pages = data.totalPages || data.total_pages || 1;
            }

            if (page === 1) {
                setResults(items);
            } else {
                setResults(prev => [...prev, ...items]);
            }
            setTotalPages(pages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search effect — re-runs on type change so flipping the toggle
    // refetches without an extra effect.
    useEffect(() => {
        const typeParam = isAnime ? 'anime' : 'movie';
        const timeoutId = setTimeout(() => {
            if (query.trim().length > 2) {
                performSearch(query.trim(), 1, searchType);
                const url = `/search?type=${typeParam}&q=${encodeURIComponent(query.trim())}`;
                window.history.pushState({}, '', url);
            } else if (query.trim().length === 0) {
                setResults([]);
                const url = `/search?type=${typeParam}`;
                window.history.pushState({}, '', url);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, searchType, performSearch, isAnime]);

    // Trigger search when searchType changes and query is present
    // Note: The previous effect already covers this somewhat, but this specific effect was in original code
    // to reset page to 1 when type changes? 
    // In original code: 
    // useEffect(() => { if (query.trim().length > 2) { performSearch(query.trim(), 1); } }, [searchType]);
    // The debounce effect above also runs on [searchType] change.
    // If I keep both, it might trigger twice. 
    // In original code, the debounce effect also depended on [query, searchType].
    // So if searchType changes, debounce effect runs.
    // But debounce waits 300ms.
    // The second effect runs immediately?

    // Let's refine. If I remove `searchType` from debounce effect dependency, it won't auto-update on type change.
    // If I keep it, it debounces.
    // Original code had both.
    // Effect 1: [query, searchType] -> debounce -> performSearch / pushState
    // Effect 2: [searchType] -> immediate performSearch(1)

    // If I change type:
    // Effect 1 triggers (timeout set).
    // Effect 2 triggers (immediate performSearch).
    // result: immediate search, then 300ms later another search?
    // We should probably rely on the debounce or just one of them. 
    // However, looking at original code:
    // Effect 1 (Debounce): `[query, searchType]`
    // Effect 2: `[searchType]`

    // This seems redundant/race-condition prone in original code.
    // I will simplify: When searchType changes, we want to search immediately or debounce?
    // Usually debounce is fine. But if I switch tab, I expect immediate result.
    // I will stick to one effect (Debounce) but include `searchType` in dependency.
    // Actually, if I change type, I want to reset results immediately?

    // Let's follow original logic but maybe clean it up?
    // "performSearch" clears results if query empty.

    // I'll keep the debounce effect as the primary driver.

    // Also handling initialQuery logic
    useEffect(() => {
        if (initialQuery && query !== initialQuery) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    // Same sync for the type — covers nav from the navbar popup
    // (router.push('/search?type=anime&q=...')) while the page stays mounted.
    useEffect(() => {
        if (initialType !== searchType) {
            setSearchType(initialType);
        }
    }, [initialType]);

    const handleLoadMore = async () => {
        if (currentPage < totalPages && !loading) {
            await performSearch(query, currentPage + 1, searchType);
        }
    };

    const hasMore = currentPage < totalPages;

    const value = {
        query,
        setQuery,
        searchType,
        setSearchType,
        typeLabel,
        results,
        loading,
        hasMore,
        handleLoadMore,
        totalResults: results.length // Optional usage
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}
