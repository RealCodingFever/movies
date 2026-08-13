'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { searchMulti } from '@/utils/actions';
import { searchAnime, mapAnilistToCard } from '@/utils/anilist-api';
import NavbarSlider from './navbar-slider';
import NavbarAuth from './navbar-auth';
import NavbarSearch from './navbar-search';
import { useInstallPrompt } from '@/hooks/use-install-prompt';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    // 'all' = movies+tv (TMDB), 'anime' = AniList
    const [searchType, setSearchType] = useState('all');
    const [loadedSrc, setLoadedSrc] = useState(null);

    // PWA Install Prompt Hook
    const { installPrompt, handleInstallClick } = useInstallPrompt();

    const { user, isAuthenticated, login, logout, isAdmin } = useAuth();

    // Swap brand logo on anime routes; replay shimmer when the src changes.
    const pathname = usePathname();
    const isAnimeRoute = pathname === '/anime' || pathname?.startsWith('/watch/anime');
    const logoSrc = isAnimeRoute ? '/akanime.png' : '/logo.png';
    const isCurrentLogoLoaded = loadedSrc === logoSrc;
    const imgRef = useRef(null);

    // If the image is cached, onLoad might not fire. Check manually:
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setLoadedSrc(logoSrc);
        }
    }, [logoSrc]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    // Search Logic — branches on the active type toggle.
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

    // Debounced search effect — refires when the toggle flips.
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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    };



    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 animate-[slideDown_0.6s_ease-out] ${isScrolled ? 'bg-black/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]' : 'bg-transparent'
                }`}>
                <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between relative">
                    <NavbarSlider
                        isMenuOpen={isMenuOpen}
                        toggleMenu={toggleMenu}
                        toggleSearch={toggleSearch}
                        isAuthenticated={isAuthenticated}
                        isAdmin={isAdmin}
                        user={user}
                        installPrompt={installPrompt}
                        handleInstallClick={() => {
                            handleInstallClick();
                            setIsMenuOpen(false);
                        }}
                    />
                    {/* Centered brand. Swaps to the anime brandmark on
                        /anime + /watch/anime/* with a shimmer fallback
                        (same MovieCard skeleton pattern) while loading. */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-center">
                        <Link
                            href={isAnimeRoute ? '/anime' : '/'}
                            className={`relative block ${
                                isAnimeRoute 
                                    ? 'w-[120px] md:w-[160px] h-[32px] md:h-[53px]' 
                                    : 'w-[150px] md:w-[200px] h-[40px] md:h-[55px]'
                            }`}
                        >
                            {!isCurrentLogoLoaded && (
                                <div className="absolute inset-0 bg-neutral-800/40 rounded-md overflow-hidden animate-pulse">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                                </div>
                            )}
                            <img
                                ref={imgRef}
                                key={logoSrc}
                                src={logoSrc}
                                alt={isAnimeRoute ? 'AKMovies Anime' : 'AKMovies'}
                                onLoad={() => setLoadedSrc(logoSrc)}
                                onError={() => setLoadedSrc(logoSrc)}
                                className={`w-full h-full object-contain transition-opacity duration-300 ${isCurrentLogoLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </Link>
                    </div>
                    <NavbarAuth
                        user={user}
                        isAuthenticated={isAuthenticated}
                        login={login}
                        logout={logout}
                        isSigningIn={isSigningIn}
                        setIsSigningIn={setIsSigningIn}
                    />
                </div>
            </nav>
            <NavbarSearch
                isSearchOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                searchType={searchType}
                setSearchType={setSearchType}
            />
        </>
    );
};

export default Navbar;