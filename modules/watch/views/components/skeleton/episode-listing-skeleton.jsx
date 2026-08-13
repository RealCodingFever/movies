"use client";

import React from 'react';

const EpisodeListingSkeleton = () => {
    return (
        <div className="w-full max-w-[1300px] mx-auto my-8 min-h-[400px] px-4">
            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .skeleton-bg {
                    background: linear-gradient(90deg, rgba(20,20,20,0.6) 25%, rgba(80,80,80,0.6) 50%, rgba(20,20,20,0.6) 75%);
                    background-size: 200% 100%;
                }
            `}</style>

            {/* Header */}
            <div className="flex flex-row justify-between items-center mb-6 gap-4">
                {/* Season Selector Placeholder */}
                <div className="w-[140px] h-[40px] rounded-[25px] skeleton-bg animate-shimmer"></div>

                {/* Search Placeholder */}
                <div className="w-full md:w-[250px] h-[40px] rounded-[25px] skeleton-bg animate-shimmer"></div>
            </div>

            {/* Episodes List */}
            <div className="bg-[#0a0a0a]/30 border border-white/10 rounded-xl overflow-hidden max-h-[600px] flex flex-col">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 border-b border-white/5">
                        {/* Number */}
                        <div className="w-[40px] h-[30px] rounded skeleton-bg animate-shimmer"></div>

                        {/* Image */}
                        <div className="w-[100px] h-[60px] md:w-[140px] md:h-[80px] rounded-lg skeleton-bg animate-shimmer flex-shrink-0"></div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="w-[60%] h-[20px] rounded skeleton-bg animate-shimmer"></div>
                            <div className="w-[90%] h-[14px] rounded skeleton-bg animate-shimmer"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EpisodeListingSkeleton;
