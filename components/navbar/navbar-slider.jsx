'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch, FaUser, FaTimes } from 'react-icons/fa';

export default function NavbarSlider({
    isMenuOpen,
    toggleMenu,
    toggleSearch,
    isAuthenticated,
    isAdmin,
    user,
    installPrompt,
    handleInstallClick
}) {
    const pathname = usePathname();

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'Bookmark', href: '/bookmark', authRequired: true },
        { name: 'Install App', action: 'install', show: !!installPrompt },
        { name: 'Admin', href: '/admin', authRequired: true, adminOnly: true },
    ];

    return (
        <>

            <div className="flex items-center gap-6 md:gap-10">
                <button
                    onClick={toggleMenu}
                    className="flex flex-col justify-around w-6 h-6 bg-transparent border-none cursor-pointer p-0 z-[10001] relative"
                    aria-label="Toggle menu"
                >
                    {/* Hamburger / Close Icon Animation */}
                    <span className={`w-full h-[3px] bg-white rounded-sm transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                    <span className={`w-full h-[3px] bg-white rounded-sm transition-all duration-300 ${isMenuOpen ? 'opacity-0 -translate-x-5' : 'ml-[5px]'}`}></span>
                    <span className={`w-full h-[3px] bg-white rounded-sm transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : 'ml-[10px]'}`}></span>
                </button>
                <button onClick={toggleSearch} className="text-white hover:text-[#e94560] transition-colors">
                    <FaSearch className="text-xl" />
                </button>
            </div>

            <div
                className={`absolute inset-0 bg-black/80 backdrop-blur-sm z-[9998] transition-opacity duration-300 w-[100vw] h-[100vh] ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                onClick={toggleMenu}
            >

                {/* Menu Drawer - Left side */}
                <div className={`absolute top-0 left-[-15px] h-screen w-[320px] bg-[#0a0a0a] flex flex-col p-6 gap-4 transition-all duration-500 z-[9999] border-r border-white/5 shadow-2xl ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>

                    <div className="flex flex-col gap-3 mt-20">
                        {menuItems.map((item, i) => {
                            if (item.authRequired && !isAuthenticated) return null;
                            if (item.adminOnly && !isAdmin) return null;
                            if (item.show === false) return null;

                            const isActive = pathname === item.href;

                            if (item.action === 'install') {
                                return (
                                    <button
                                        key={item.name}
                                        onClick={handleInstallClick}
                                        className="text-left w-full text-white text-base font-medium p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]"
                                        style={{ transitionDelay: `${i * 50}ms` }}
                                    >
                                        {item.name}
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={toggleMenu}
                                    className={`text-white text-base font-medium p-4 rounded-xl border transition-all active:scale-[0.98] ${isActive
                                        ? 'bg-[#e94560]/10 border-[#e94560]/50 text-[#e94560]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    style={{ transitionDelay: `${i * 50}ms` }}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {isAuthenticated && (
                        <div className="mt-auto">
                            <div className="flex items-center gap-3 p-4 bg-[#e94560]/10 border border-[#e94560]/20 rounded-xl">
                                <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center bg-white/10 flex-shrink-0">
                                    {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <FaUser className="text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate text-sm">{user?.displayName || 'User'}</p>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-white/20 text-xs">© 2025 AKMovies. All rights reserved.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}