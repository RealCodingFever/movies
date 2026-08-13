'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { FaUser, FaSignOutAlt, FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import { searchMulti } from '@/utils/actions';
import { searchAnime, mapAnilistToCard } from '@/utils/anilist-api';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(null);
    // Search popup type: 'all' = movies+tv (TMDB), 'anime' = AniList
    const [searchType, setSearchType] = useState('all');
    const [logoLoaded, setLogoLoaded] = useState(false);
    const { user, isAuthenticated, login, logout } = useAuth();

    const router = useRouter();
    const pathname = usePathname();

    // Swap brand logo on anime routes. Reset the loaded flag when the source
    // changes so the shimmer plays through the new image.
    const isAnimeRoute = pathname === '/anime' || pathname?.startsWith('/watch/anime');
    const logoSrc = isAnimeRoute ? '/akanime.png' : '/xmas-logo.png';
    useEffect(() => { setLogoLoaded(false); }, [logoSrc]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    // Debounced search effect — re-runs when the toggle flips so results
    // refresh immediately on switch.
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim().length > 2) {
                performSearch(searchQuery.trim(), searchType);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchType]);

    const performSearch = async (query, type) => {
        try {
            setIsSearching(true);
            if (type === 'anime') {
                const data = await searchAnime(query, 1, 6);
                const mapped = (data.results || []).map(mapAnilistToCard).filter(Boolean).slice(0, 4);
                setSearchResults(mapped);
            } else {
                const data = await searchMulti(query, 1);
                const filtered = (data.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv').slice(0, 4);
                setSearchResults(filtered);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInstallClick = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    };

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
        // route through the same builder cleanly.
        const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
        const formattedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        router.push(`/watch/${mediaType}/${item.id}-${formattedTitle}`);
    };

    const handleAuthClick = async () => {
        if (isAuthenticated) {
            try {
                await logout();
                localStorage.clear();
            } catch (error) { console.error(error); }
        } else {
            setIsSigningIn(true);
            try { await login(); }
            finally { setIsSigningIn(false); }
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 animate-[slideDown_0.6s_ease-out] ${isScrolled ? 'bg-black/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]' : 'bg-transparent'
                }`}>
                <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between relative">
                    {/* Left: Hamburger & Search */}
                    <div className="flex items-center gap-6 md:gap-10">
                        <button
                            onClick={toggleMenu}
                            className="flex flex-col justify-around w-6 h-6 bg-transparent border-none cursor-pointer p-0 z-[1001]"
                            aria-label="Toggle menu"
                        >
                            <span className={`w-full h-[3px] bg-white rounded-sm transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                            <span className={`w-full h-[3px] bg-white rounded-sm transition-all duration-300 ${isMenuOpen ? 'opacity-0 -translate-x-5' : 'ml-[5px]'}`}></span>
                            <span className={`w-full h-[3px] bg-white rounded-sm transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : 'ml-[10px]'}`}></span>
                        </button>
                        <button onClick={toggleSearch} className="text-white hover:text-[#e94560] transition-colors">
                            <FaSearch className="text-xl" />
                        </button>
                    </div>

                    {/* Logo - Centered. Swaps to the anime brandmark on
                        /anime and /watch/anime/* with a shimmer fallback
                        (same pattern as MovieCard) while the new image loads. */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-center">
                        <Link href={isAnimeRoute ? '/anime' : '/'} className="relative block w-[150px] md:w-[200px] h-[40px] md:h-[55px]">
                            {!logoLoaded && (
                                <div className="absolute inset-0 bg-neutral-800/40 rounded-md overflow-hidden animate-pulse">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                                </div>
                            )}
                            <img
                                key={logoSrc}
                                src={logoSrc}
                                alt={isAnimeRoute ? 'AKMovies Anime' : 'AKMovies'}
                                onLoad={() => setLogoLoaded(true)}
                                onError={() => setLogoLoaded(true)}
                                className={`w-full h-full object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </Link>
                    </div>

                    {/* Right: Auth */}
                    <div className="flex items-center">
                        <button
                            onClick={handleAuthClick}
                            disabled={isSigningIn}
                            className="group bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 cursor-pointer transition-all duration-300 backdrop-blur-lg hover:bg-[#e94560]/20 hover:border-[#e94560]/40 hover:scale-105 active:scale-95 disabled:opacity-70 text-white font-medium text-sm"
                        >
                            {isSigningIn ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-[#e94560] rounded-full animate-spin"></div>
                            ) : isAuthenticated ? (
                                <>
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border-2 border-white/20 object-cover" />
                                    ) : (
                                        <FaUser className="text-white group-hover:text-[#e94560]" />
                                    )}
                                    <span className="hidden sm:inline group-hover:text-[#e94560]">{user?.displayName?.split(' ')[0] || 'User'}</span>
                                    <FaSignOutAlt className="text-[#e94560] group-hover:text-red-500 w-3.5 h-3.5" />
                                </>
                            ) : (
                                <>
                                    <FaUser className="text-white group-hover:text-[#e94560]" />
                                    <span className="hidden sm:inline group-hover:text-[#e94560]">Login</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Sidebar */}
                    <div className={`fixed top-0 left-0 h-screen w-[300px] bg-[#151515]/95 backdrop-blur-[25px] flex flex-col p-24 gap-4 transition-all duration-500 z-[999] border-r border-white/10 ${isMenuOpen ? 'translate-x-0 opacity-100 shadow-[10px_0_40px_rgba(0,0,0,0.4)]' : '-translate-x-full opacity-0'}`}>
                        {['Home', 'Browse', 'Netflix'].map((text, i) => (
                            <Link
                                key={text}
                                href={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
                                onClick={toggleMenu}
                                className="text-white text-lg font-medium p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:translate-x-2 hover:text-[#e94560] hover:bg-[#e94560]/10 hover:border-[#e94560]/20"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {text}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Link href="/continue" onClick={toggleMenu} className="text-white text-lg font-medium p-4 rounded-xl border border-white/10 bg-white/5 hover:translate-x-2 hover:text-[#e94560] transition-all">Continue</Link>
                        )}
                        {installPrompt && (
                            <button onClick={handleInstallClick} className="text-left text-white text-lg font-medium p-4 rounded-xl border border-white/10 bg-white/5 hover:translate-x-2 hover:text-[#e94560] transition-all">Install App</button>
                        )}
                        {isAuthenticated && (
                            <div className="mt-auto flex items-center gap-3 p-4 bg-[#e94560]/10 border border-[#e94560]/20 rounded-xl backdrop-blur-md">
                                <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center bg-white/10">
                                    {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <FaUser className="text-white" />}
                                </div>
                                <span className="text-white font-medium truncate">{user?.displayName || 'User'}</span>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Backdrop */}
                    {isMenuOpen && <div onClick={toggleMenu} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] transition-opacity animate-pulse"></div>}
                </div>
            </nav>

            {/* Search Popup */}
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
                                        className="bg-transparent border-none text-white text-sm md:text-base outline-none py-3 flex-1"
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
                                                            // Anime poster_path is an absolute AniList URL; TMDB posters
                                                            // are bare paths that need the CDN prefix.
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
};

export default Navbar;