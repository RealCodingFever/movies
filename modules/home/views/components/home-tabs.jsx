"use client";

import Link from "next/link";

import { useRef } from "react";
import { FaHome, FaFilm, FaTv, FaGhost, FaLaugh, FaMagic, FaNewspaper, FaEdit, FaPlayCircle } from 'react-icons/fa';
import HomeStudioTab from "./home-studio-tab";
import { useAuth } from "@/context/auth-context";

import { usePathname, useRouter } from "next/navigation";
import { playTabTransition } from "@/components/tab-transition-overlay";

const HomeTabs = () => {
    const tabsRef = useRef(null);
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // Derived active tab from pathname
    let activeTab = 'movie'; // Default
    if (pathname === '/tv') activeTab = 'tv';
    else if (pathname === '/anime') activeTab = 'anime';
    else if (pathname === '/editor') activeTab = 'editor';
    else if (pathname === '/studio') activeTab = 'studio';

    const tabs = [
        { id: 'movie', label: 'Movies' },
        { id: 'tv', label: 'TV' },
        { id: 'anime', label: 'Anime' },
        { id: 'editor', label: 'Editor' },
    ];

    const getIcon = (id) => {
        switch (id) {
            case 'home': return <FaHome className="text-xl mb-1" />;
            case 'movie': return <FaFilm className="text-xl mb-1" />;
            case 'tv': return <FaTv className="text-xl mb-1" />;
            case 'anime': return <span className="text-[22px] font-black mb-1 leading-none">乇</span>;
            case 'editor': return <FaEdit className="text-xl mb-1" />;
            default: return <FaMagic className="text-xl mb-1" />;
        }
    };

    const handleTabClick = (e, tabId, href) => {
        // Skip the transition when re-clicking the active tab — only scroll.
        if (activeTab === tabId) {
            if (tabId !== 'editor' && tabsRef.current) {
                const yOffset = isAuthenticated ? 400 : 50;
                const y = tabsRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
            return;
        }

        // Intercept navigation so the overlay can play. router.push wraps
        // the route swap in a React transition; without a small defer the
        // overlay's first paint races the navigation and gets skipped.
        e.preventDefault();
        playTabTransition(tabId);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => router.push(href));
        });
    };

    return (
        <>
            <div ref={tabsRef} className="relative w-full flex justify-center mt-8 z-30 px-4">
                <div className="flex items-center justify-center gap-2 sm:gap-4 px-6 py-4 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const href = tab.id === 'movie' ? '/' : `/${tab.id}`;

                        return (
                            <Link
                                key={tab.id}
                                href={href}
                                onClick={(e) => handleTabClick(e, tab.id, href)}
                                className={`
                                group flex flex-col items-center justify-center min-w-[4rem] py-2 transition-all duration-300 relative
                                ${isActive ? 'text-[#e94560]' : 'text-gray-400 hover:text-gray-200'}
                            `}
                            >
                                {/* Icon */}
                                <span className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                                    {getIcon(tab.id)}
                                </span>

                                {/* Label */}
                                <span className="text-xs font-medium tracking-wide">
                                    {tab.label}
                                </span>

                                {/* Active Dot */}
                                {isActive && (
                                    <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#e94560] shadow-[0_0_8px_#e94560]" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
            `}</style>
            </div>

            {/* Render Studio Tab Content */}
            {activeTab === 'studio' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <HomeStudioTab />
                </div>
            )}
        </>
    );
};

export default HomeTabs;
