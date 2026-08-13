'use client';

import { useRouter } from 'next/navigation';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

export default function NavbarSearch({
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    searchType,
    setSearchType,
}) {
    const router = useRouter();

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    // This function can be called from here or passed down if it needs to be triggered by other events
    // For now we assume the duplicate logic in parent (useEffect) handles the typing
    // But we might want to expose a manual trigger if needed
    // However, since the debounced effect was in Navbar, let's keep it there or similar.
    // The previous code had `performSearch` but it was defined inside the component and used in useEffect.
    // Ideally we should move the search logic here if possible, but let's stick to the previous pattern 
    // where state was lifted, OR move logic here.
    // To minimize breakage, we will assume the parent handles the `useEffect` that calls a search function,
    // OR we re-implement the search logic here if we move the `useEffect` here.
    // The previous file `navbar.jsx` had the `useEffect` calling `performSearch` which was defined in `navbar-search.jsx` (which was weird because `navbar-search.jsx` was a snippet).
    // Actually, looking at the previous file content of `navbar.jsx`, it called `performSearch`.
    // But `performSearch` was NOT defined in `navbar.jsx`, it was in `navbar-search.jsx`.
    // This implies `navbar.jsx` was probably importing it? No, `navbar.jsx` line 8 imported `searchMulti`, line 47 called `performSearch`.
    // `navbar-search.jsx` line 1 defined `performSearch`.
    // It seems the user provided code where `Navbar` was split into files but maybe not properly imported/exported?
    // Or maybe they were all in one file and user split them for me to see?
    // Regardless, I will put the logic inside `NavbarSearch` for better encapsulation.

    // BUT, `Navbar` (parent) had the `useEffect`. If I move logic here, I must move `useEffect` here too.
    // I will pass `handleSearchSubmit` and `handleResultClick` logic here.

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            const typeParam = searchType === 'anime' ? 'anime' : 'movie';
            router.push(`/search?type=${typeParam}&q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleResultClick = (item) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        const title = item.title || item.name;
        // mapAnilistToCard already sets media_type:'anime', so anime results
        // route to /watch/anime/{id}-... cleanly.
        const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
        const formattedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        router.push(`/watch/${mediaType}/${item.id}-${formattedTitle}`);
    };

    return (
        <>
            {isSearchOpen && (
                <div className="fixed inset-0 z-[2000] flex flex-col items-center">
                    <div onClick={toggleSearch} className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"></div>

                    <div className="relative w-full max-w-3xl mt-12 px-4 z-[2001] animate-in slide-in-from-top-10 duration-500">
                        <form onSubmit={handleSearchSubmit} className="mb-8">
                            <div className="flex flex-col gap-3 items-stretch">
                                {/* Content-type toggle */}
                                <div className="flex items-center justify-center gap-2 self-center bg-white/5 border border-white/10 rounded-full p-1">
                                    {[
                                        { id: 'all', label: 'Movies & TV' },
                                        { id: 'anime', label: 'Anime' },
                                    ].map((opt) => (
                                        <button
                                            type="button"
                                            key={opt.id}
                                            onClick={() => setSearchType(opt.id)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${searchType === opt.id
                                                ? 'bg-[#e94560] text-white shadow-[0_0_15px_rgba(233,69,96,0.35)]'
                                                : 'text-gray-300 hover:text-white'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative flex-1 w-full bg-white/10 border-b border-white/20 rounded-xl focus-within:bg-white/15 focus-within:border-[#e94560] focus-within:scale-[1.02] transition-all flex items-center px-4">
                                    <FaSearch className="text-gray-400 mr-3" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={searchType === 'anime' ? 'Search anime...' : 'Search movies, TV shows...'}
                                        className="bg-transparent border-none text-white text-sm md:text-md outline-none py-2 flex-1"
                                        autoFocus
                                    />
                                    {isSearching && <div className="w-5 h-5 border-2 border-[#e94560]/30 border-t-[#e94560] rounded-full animate-spin"></div>}
                                </div>
                            </div>
                        </form>

                        {/* Search Results */}
                        {searchQuery.trim().length > 2 && (
                            <div className="animate-in slide-in-from-bottom-5 duration-500 delay-150">
                                {isSearching ? (
                                    <div className="flex items-center justify-center gap-3 text-gray-400 py-10 animate-pulse">
                                        <div className="w-5 h-5 border-2 border-[#e94560]/30 border-t-[#e94560] rounded-full animate-spin"></div>
                                        <span>Searching...</span>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <div className="flex justify-between items-center text-white mb-4">
                                            <span className="font-medium">Quick Results</span>
                                            <button onClick={handleSearchSubmit} className="text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                                                View All <FaArrowRight />
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {searchResults.map((item, i) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleResultClick(item)}
                                                    className="group flex items-center gap-4 p-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer transition-all hover:bg-white/10 hover:translate-x-2 hover:border-[#e94560]/30 animate-in slide-in-from-right-4 fill-mode-both"
                                                    style={{ animationDelay: `${i * 75}ms` }}
                                                >
                                                    <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                                                        {(() => {
                                                            // Anime poster_path is an absolute AniList URL; TMDB
                                                            // posters are bare paths that need the CDN prefix.
                                                            const raw = item.poster_path;
                                                            const src = !raw
                                                                ? '/placeholder-movie.jpg'
                                                                : raw.startsWith('http')
                                                                    ? raw
                                                                    : `https://image.tmdb.org/t/p/w92${raw}`;
                                                            return (
                                                                <img
                                                                    src={src}
                                                                    alt={item.title || item.name}
                                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-white font-semibold truncate group-hover:text-[#e94560] transition-colors">{item.title || item.name}</h3>
                                                        <p className="text-[#e94560] text-xs uppercase font-medium mt-1">{item.mediaType || item.media_type || 'Media'}</p>
                                                        {item.release_date && <span className="text-gray-400 text-xs">{new Date(item.release_date).getFullYear()}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400 py-10">No results found for "{searchQuery}"</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}