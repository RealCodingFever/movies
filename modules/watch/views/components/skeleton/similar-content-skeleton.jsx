"use client";

import React from 'react';

const SimilarContentSkeleton = () => {
    return (
        <div className="lg:pt-3 pt-0 w-full max-w-[1300px] mx-auto">
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

            {/* Title */}
            <div className="px-4 mb-4">
                <div className="w-[200px] h-[24px] rounded skeleton-bg animate-shimmer"></div>
            </div>

            {/* Cards Row */}
            <div className="flex gap-4 overflow-hidden px-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[160px] md:w-[200px] flex flex-col gap-2">
                        {/* Poster */}
                        <div className="w-full aspect-[2/3] rounded-[10px] skeleton-bg animate-shimmer"></div>
                        {/* Title */}
                        <div className="w-[80%] h-[14px] rounded skeleton-bg animate-shimmer"></div>
                        {/* Meta */}
                        <div className="w-[40%] h-[12px] rounded skeleton-bg animate-shimmer"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarContentSkeleton;
