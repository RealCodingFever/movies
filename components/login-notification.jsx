'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { signInWithGoogle } from '@/utils/auth';
import { FaTimes, FaUser, FaCloud, FaHistory, FaBookmark, FaSync } from 'react-icons/fa';

export default function LoginNotification() {
    const { isAuthenticated, loading } = useAuth();
    const [status, setStatus] = useState('loading'); // 'loading', 'visible', 'hidden'
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        // Wait for auth to finish initializing before showing anything
        if (loading) {
            setStatus('loading');
            return;
        }

        // If the user is authenticated, we never want to show it.
        if (isAuthenticated) {
            setStatus('hidden');
            return;
        }

        // Check if the notification was dismissed within the last 2 days.
        const dismissalData = localStorage.getItem('loginNotificationDismissed');
        if (dismissalData) {
            try {
                const { timestamp } = JSON.parse(dismissalData);
                const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

                if (Date.now() - timestamp < twoDaysInMs) {
                    setStatus('hidden'); // Dismissal is still valid.
                    return;
                } else {
                    // Dismissal expired, so we can show the notification.
                    localStorage.removeItem('loginNotificationDismissed');
                }
            } catch (error) {
                localStorage.removeItem('loginNotificationDismissed');
            }
        }

        // If we reach here, it means the user is not logged in and hasn't dismissed.
        // Show the notification after a short delay.
        const timer = setTimeout(() => {
            setStatus('visible');
        }, 2000);

        return () => clearTimeout(timer);
    }, [isAuthenticated, loading]);

    const handleDismiss = () => {
        setStatus('hidden');
        const dismissalData = { timestamp: Date.now() };
        localStorage.setItem('loginNotificationDismissed', JSON.stringify(dismissalData));
    };

    const handleLogin = async () => {
        setIsSigningIn(true);
        try {
            await signInWithGoogle();
            // Auth state change will trigger useEffect and hide the component.
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsSigningIn(false);
        }
    };

    // While loading or if it should be hidden, render nothing. This prevents the flash.
    if (status !== 'visible') {
        return null;
    }

    return (
        <>
            <style jsx>{`
                @keyframes slideIn {
                    0% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-2px);
                    }
                }
                .animate-slide-float {
                    animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards, float 3s ease-in-out infinite 1s;
                }
            `}</style>

            <div className={`
                fixed top-5 right-5 z-[1000] max-w-[350px] 
                bg-gradient-to-br from-[#141414]/95 to-[#282828]/95 backdrop-blur-[20px] 
                border border-[#e94560]/30 rounded-2xl 
                shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(233,69,96,0.1)] 
                translate-x-full opacity-0 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
                animate-slide-float
                md:top-2.5 md:right-2.5 md:left-2.5 md:max-w-none md:translate-x-0
                sm:top-[5px] sm:right-[5px] sm:left-[5px]
            `}>
                <div className="p-5 md:p-4">
                    <div className="flex items-start gap-3 mb-4 md:mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#e94560] to-[#ff6b7a] rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(233,69,96,0.3)] md:w-9 md:h-9">
                            <FaUser className="text-white text-[18px] md:text-[16px]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white text-[16px] font-semibold m-0 mb-1 leading-[1.3] md:text-[15px]">Unlock Full Experience</h3>
                            <p className="text-white/70 text-[13px] m-0 leading-[1.4] md:text-[12px]">Sign in to access premium features</p>
                        </div>
                        <button
                            className="bg-transparent border-none text-white/50 cursor-pointer p-1 rounded-md transition-all duration-200 shrink-0 hover:text-white hover:bg-white/10"
                            onClick={handleDismiss}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-1 md:gap-1.5">
                        <div className="flex items-center gap-2 p-2 px-3 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/[0.08] hover:border-[#e94560]/30 md:px-2.5 md:py-1.5">
                            <FaCloud className="text-[#e94560] text-[12px] shrink-0" />
                            <span className="text-white/80 text-[12px] font-medium md:text-[11px]">Sync across devices</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 px-3 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/[0.08] hover:border-[#e94560]/30 md:px-2.5 md:py-1.5">
                            <FaHistory className="text-[#e94560] text-[12px] shrink-0" />
                            <span className="text-white/80 text-[12px] font-medium md:text-[11px]">Watch history</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 px-3 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/[0.08] hover:border-[#e94560]/30 md:px-2.5 md:py-1.5">
                            <FaBookmark className="text-[#e94560] text-[12px] shrink-0" />
                            <span className="text-white/80 text-[12px] font-medium md:text-[11px]">Bookmarks & favorites</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 px-3 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/[0.08] hover:border-[#e94560]/30 md:px-2.5 md:py-1.5">
                            <FaSync className="text-[#e94560] text-[12px] shrink-0" />
                            <span className="text-white/80 text-[12px] font-medium md:text-[11px]">Progress tracking</span>
                        </div>
                    </div>

                    <div className="flex gap-2 md:flex-col">
                        <button
                            className={`
                                flex-1 bg-gradient-to-br from-[#e94560] to-[#ff6b7a] text-white border-none py-2.5 px-4 rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(233,69,96,0.3)]
                                hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(233,69,96,0.4)]
                                active:translate-y-0
                                disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[0_4px_12px_rgba(233,69,96,0.3)]
                                md:py-3 md:px-4 md:text-[14px]
                            `}
                            onClick={handleLogin}
                            disabled={isSigningIn}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                        <button
                            className="bg-white/10 text-white/70 border border-white/20 py-2.5 px-4 rounded-lg text-[14px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/[0.15] hover:text-white hover:border-white/30 md:py-3 md:px-4 md:text-[14px]"
                            onClick={handleDismiss}
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
