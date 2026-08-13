"use client";

import React from 'react';

const ServerButtonsSkeleton = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center my-8 px-4">
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

            {/* Disclaimer Text Placeholder */}
            <div className="w-[400px] h-[16px] rounded mb-4 skeleton-bg animate-shimmer"></div>

            <div className="flex justify-center flex-wrap gap-4 w-full max-w-3xl">
                {/* Server Buttons Placeholders */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-[150px] h-[40px] rounded-[25px] skeleton-bg animate-shimmer"></div>
                ))}

                {/* Download Button Placeholder */}
                <div className="w-[120px] h-[40px] rounded-[25px] skeleton-bg animate-shimmer"></div>
            </div>
        </div>
    );
};

export default ServerButtonsSkeleton;
