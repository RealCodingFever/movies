import React from 'react';

const WatchDetailSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-0 lg:gap-12 w-full max-w-[1100px] mx-auto px-4 mt-8">
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

            {/* Image Container - Hidden on Mobile */}
            <div className="hidden lg:flex w-[30%] justify-end items-center">
                <div className="w-[17rem] h-[25.5rem] rounded-[10px] skeleton-bg animate-shimmer"></div>
            </div>

            {/* Info Content */}
            <div className="w-full lg:w-[70%] flex flex-col justify-center items-center lg:items-start">

                {/* Title */}
                <div className="w-[250px] lg:w-[400px] h-[40px] lg:h-[60px] mb-4 rounded-md skeleton-bg animate-shimmer"></div>

                {/* Metadata */}
                <div className="flex items-center flex-wrap gap-3 mb-5 justify-center lg:justify-start">
                    <div className="w-[60px] h-[24px] rounded-[15px] skeleton-bg animate-shimmer"></div>
                    <div className="w-[40px] h-[24px] rounded-[15px] skeleton-bg animate-shimmer"></div>
                    <div className="w-[50px] h-[24px] rounded-[15px] skeleton-bg animate-shimmer"></div>
                    <div className="w-[60px] h-[24px] rounded-[15px] skeleton-bg animate-shimmer"></div>
                </div>

                {/* Description */}
                <div className="w-full max-w-2xl lg:max-w-full flex flex-col items-center lg:items-start gap-2 mb-6">
                    <div className="w-full h-[14px] rounded skeleton-bg animate-shimmer"></div>
                    <div className="w-[90%] h-[14px] rounded skeleton-bg animate-shimmer"></div>
                    <div className="w-[95%] h-[14px] rounded skeleton-bg animate-shimmer"></div>
                    <div className="w-[80%] h-[14px] rounded skeleton-bg animate-shimmer"></div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2.5 mb-8 justify-center lg:justify-start">
                    <div className="w-[80px] h-[24px] rounded-[20px] skeleton-bg animate-shimmer"></div>
                    <div className="w-[100px] h-[24px] rounded-[20px] skeleton-bg animate-shimmer"></div>
                    <div className="w-[70px] h-[24px] rounded-[20px] skeleton-bg animate-shimmer"></div>
                </div>

                {/* Main Info Columns */}
                <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-0 mb-8">
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-2">
                        <div className="w-[200px] h-[16px] rounded skeleton-bg animate-shimmer"></div>
                        <div className="w-[180px] h-[16px] rounded skeleton-bg animate-shimmer"></div>
                        <div className="w-[220px] h-[16px] rounded skeleton-bg animate-shimmer"></div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-2 mt-2 lg:mt-0">
                        <div className="w-[250px] h-[16px] rounded skeleton-bg animate-shimmer"></div>
                        <div className="w-[280px] h-[16px] rounded skeleton-bg animate-shimmer"></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start my-4">
                    <div className="w-[140px] h-[40px] rounded-[20px] skeleton-bg animate-shimmer"></div>
                    <div className="w-[120px] h-[40px] rounded-[20px] skeleton-bg animate-shimmer"></div>
                    <div className="w-[100px] h-[40px] rounded-[20px] skeleton-bg animate-shimmer"></div>
                </div>

            </div>
        </div>
    );
};

export default WatchDetailSkeleton;
