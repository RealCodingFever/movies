'use client';

import { useState } from 'react';
import MovieCard from '@/components/movie-card';

const VerticalResults = ({
    title,
    items = [],
    loading = false,
    hasMore = false,
    onLoadMore,
    emptyMessage = "No items found",
    showLoadMore = true,
    gridCols = 6,
    type = 'normal',
    onRemove
}) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleLoadMore = async () => {
        if (onLoadMore && !isLoadingMore) {
            setIsLoadingMore(true);
            try {
                await onLoadMore();
            } finally {
                setIsLoadingMore(false);
            }
        }
    };

    const getGridClass = () => {
        const gridClasses = {
            2: 'grid-cols-2',
            3: 'grid-cols-2 sm:grid-cols-3',
            4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
            5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
            6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'
        };
        return gridClasses[gridCols] || gridClasses[6];
    };

    if (loading && items.length === 0) {
        return (
            <div className="w-full mb-8">
                {title && <h2 className="text-[2rem] font-bold text-white mb-6 text-center lg:text-[1.75rem] md:text-[1.5rem] md:mb-4 sm:text-[1.25rem]">{title}</h2>}
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center sm:min-h-[200px]">
                    <div className="w-12 h-12 border-3 border-[#e945604d] border-t-[#e94560] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#9ca3af] text-[1.1rem]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!loading && items.length === 0) {
        return (
            <div className="w-full mb-8">
                {title && <h2 className="text-[2rem] font-bold text-white mb-6 text-center lg:text-[1.75rem] md:text-[1.5rem] md:mb-4 sm:text-[1.25rem]">{title}</h2>}
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 sm:min-h-[200px]">
                    <div className="text-[4rem] mb-4 sm:text-[3rem]">📺</div>
                    <p className="text-[#9ca3af] text-[1.1rem] max-w-[400px] leading-[1.6] sm:text-[1rem]">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mb-8">
            {title && <h2 className="text-[2rem] font-bold text-white mb-6 text-center lg:text-[1.75rem] md:text-[1.5rem] md:mb-4 sm:text-[1.25rem]">{title}</h2>}

            <div className={`grid gap-4 mb-8 sm:gap-3 xs:gap-2 ${getGridClass()}`}>
                {items.map((item) => (
                    <div key={item.uniqueKey || item.id} className="flex justify-center">
                        <MovieCard item={item} type={type} onRemove={onRemove} />
                    </div>
                ))}
            </div>

            {showLoadMore && hasMore && (
                <div className="flex justify-center mt-15">
                    <button
                        className="flex items-center gap-2 px-8 py-3 bg-[#e94560] text-white border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-300 hover:bg-[#d63384] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none md:py-2.5 md:px-6 md:text-[0.9rem] xs:w-full xs:justify-center"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Loading...</span>
                            </>
                        ) : (
                            <span>Load More</span>
                        )}
                    </button>
                </div>
            )}

            {loading && items.length > 0 && (
                <div className="flex items-center justify-center gap-3 p-4 text-[#9ca3af]">
                    <div className="w-5 h-5 border-2 border-[#e94560]/30 border-t-[#e94560] rounded-full animate-spin"></div>
                    <span>Loading more...</span>
                </div>
            )}
        </div>
    );
};

export default VerticalResults;
