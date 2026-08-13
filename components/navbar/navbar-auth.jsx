'use client';

import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function NavbarAuth({
    user,
    isAuthenticated,
    login,
    logout,
    isSigningIn,
    setIsSigningIn
}) {
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
                        <span className="hidden sm:inline group-hover:text-[#e94560]">{user?.displayName || 'User'}</span>
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
    );
}