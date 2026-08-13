"use client";

import React from 'react';

const WatchContentSkeleton = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center px-4">
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

            <div className="relative w-full lg:w-[85%] h-[20rem] lg:h-[35rem] mt-8">
                <div className="relative w-full h-full rounded-[24px] skeleton-bg animate-shimmer shadow-[0_20px_50px_rgba(0,0,0,0.3)]"></div>
            </div>
        </div>
    );
};

export default WatchContentSkeleton;
