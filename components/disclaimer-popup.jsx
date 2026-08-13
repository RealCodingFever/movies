'use client';

import { useState, useEffect } from 'react';

export default function DisclaimerPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    useEffect(() => {
        const TIME_THRESHOLD = 90; // 1.5 minutes in seconds

        // 1. If user has already agreed, do nothing.
        if (localStorage.getItem('disclaimer-agreed')) {
            return;
        }

        // 2. Get the time already spent on the site from previous sessions.
        let timeSpent = parseInt(localStorage.getItem('time-spent-on-site') || '0', 10);

        // 3. If they've already met the threshold, show the popup immediately.
        if (timeSpent >= TIME_THRESHOLD) {
            setIsVisible(true);
            return;
        }

        // 4. Otherwise, start a timer to track their time on the site.
        const timer = setInterval(() => {
            timeSpent += 1;
            localStorage.setItem('time-spent-on-site', timeSpent.toString());

            // 5. When the 2-minute mark is hit, show the popup and stop the timer.
            if (timeSpent >= TIME_THRESHOLD) {
                setIsVisible(true);
                clearInterval(timer);
            }
        }, 1000);

        // 6. Clean up the timer if the user navigates away or closes the tab.
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsButtonEnabled(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVisible]);

    const handleAgree = () => {
        localStorage.setItem('disclaimer-agreed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-slide-in {
                    animation: slideIn 0.4s ease-out;
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }

                /* Scrollbar styling */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2a2a2a;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e94560;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ff6b6b;
                }
            `}</style>

            <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex justify-center items-center z-[9999] animate-[fadeIn_0.3s_ease-out]">
                <div className={`
                    relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#333] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] 
                    w-[90%] max-w-[1000px] max-h-[80vh] overflow-y-auto animate-slide-in custom-scrollbar
                    md:w-[95%] md:max-h-[85vh] md:m-5
                    sm:w-[98%] sm:m-2.5 sm:rounded-xl
                `}>
                    {/* Top Shimmer Border */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r from-[#e94560] via-[#ff6b6b] to-[#e94560] rounded-t-2xl animate-shimmer bg-[size:200%_auto]"></div>

                    <div className="p-6 pb-4 border-b border-[#333] text-center sm:p-4">
                        <h2 className="text-white text-[1.8rem] font-bold m-0 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] md:text-[1.5rem] sm:text-[1.3rem]">
                            DISCLAIMER
                        </h2>
                    </div>

                    <div className="p-6 px-6 text-[#e0e0e0] leading-relaxed text-[0.95rem] md:text-[0.9rem] md:px-5 sm:text-[0.85rem] sm:px-4">
                        <p className="mb-4 text-justify">Welcome to AKMovies. Please read this disclaimer carefully before using this website.</p>

                        <p className="mb-4 text-justify">All content displayed on AKMovies (including but not limited to movies, images, posters, and related information) is sourced from <strong className="text-[#e94560] font-semibold">third-party providers through APIs or embedding.</strong> I do not host, store, or distribute any media files on my servers. The website merely aggregates content that is already available on the internet.</p>

                        <p className="mb-4 text-justify">By using AKMovies, you acknowledge that I bear no responsibility for user actions, content accuracy, or any direct or indirect damages arising from the use of this website. Users are solely responsible for their actions while using this service. I respect intellectual property rights and will respond to legitimate requests from copyright holders for content removal.</p>

                        <p className="mb-0 text-justify">This website should only be used for learning purposes. Any illegal activities, including but not limited to unauthorized downloading, redistribution of content, or commercial use, are strictly prohibited. By using AKMovies, you agree to these terms and acknowledge that <strong className="text-[#e94560] font-semibold">you use the service at your own risk.</strong></p>
                    </div>

                    <div className="p-6 pt-5 text-center border-t border-[#333] md:p-5 sm:p-4">
                        <button
                            className={`
                                relative overflow-hidden text-white border-0 px-8 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 min-w-[120px] 
                                md:px-6 md:py-2.5 md:text-[0.95rem]
                                sm:px-5 sm:py-2 sm:text-[0.9rem] sm:min-w-[100px]
                                ${isButtonEnabled
                                    ? 'bg-gradient-to-br from-[#e94560] to-[#ff6b6b] translate-y-0 shadow-[0_4px_15px_rgba(233,69,96,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(233,69,96,0.6)]'
                                    : 'bg-gradient-to-br from-[#555] to-[#666] cursor-not-allowed text-[#aaa] shadow-none transform-none'}
                                group
                            `}
                            onClick={handleAgree}
                            disabled={!isButtonEnabled}
                        >
                            <span className={`absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-[left] duration-500 group-hover:left-full`}></span>
                            {isButtonEnabled ? 'Agree' : `Agree (${timeLeft}s)`}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
