import React from 'react';

const TopBannerSkeleton = () => {
    return (
        <div className="w-full h-[35vh] relative overflow-hidden bg-black">
            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
            <div className="absolute top-0 left-0 w-full h-full z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_25%,rgba(40,40,40,0.6)_50%,rgba(0,0,0,0.6)_75%)] bg-[size:200%_100%] animate-shimmer"></div>
        </div>
    );
};

export default TopBannerSkeleton;
