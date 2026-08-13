'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from '@/components/movie-card';

const MovieSection = ({
    title,
    items,
    isLarge = false,
    type = 'normal',
    onRemove,
    isLoading = false,
    showSection = true,
    maxWidth = '1500px'
}) => {
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            // Increased threshold to 5px to prevent "ghost" arrows from small offsets
            setCanScrollLeft(scrollLeft > 5);
            // Math.ceil handles high-DPI screens where sub-pixels cause rounding errors
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
        }
    };

    useEffect(() => {
        const currentRef = carouselRef.current;
        if (currentRef) {
            // Initial check after mount/update
            const timeoutId = setTimeout(checkScroll, 100);
            currentRef.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);

            return () => {
                currentRef.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
                clearTimeout(timeoutId);
            };
        }
    }, [items, isLoading]);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const { current } = carouselRef;
            const scrollAmount = direction === 'left'
                ? -current.offsetWidth
                : current.offsetWidth;

            current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading) {
        return (
            <div
                className="w-full mx-auto my-12 px-2 md:px-6 space-y-4"
                style={{ maxWidth }}
            >
                <style jsx>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .animate-shimmer { animation: shimmer 2s infinite; }
                `}</style>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-l-4 border-[#e94560] pl-4">
                    {title}
                </h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`flex-shrink-0 rounded-xl bg-[linear-gradient(90deg,rgba(20,20,20,0.8)_25%,rgba(30,30,30,0.8)_50%,rgba(20,20,20,0.8)_75%)] bg-[size:200%_100%] animate-shimmer ${isLarge ? 'w-[200px] h-[300px]' : 'w-[140px] md:w-[180px] h-[210px] md:h-[270px]'}`} />
                    ))}
                </div>
            </div>
        );
    }

    if (!showSection || !items || items.length === 0) return null;

    return (
        <>
            <div
                className="w-full mx-auto my-12 px-3 md:px-6 space-y-4 "
                style={{ maxWidth }}
            >
                {isLarge ? (
                    <div className="flex items-end gap-3 mb-6">
                        <span className="text-4xl md:text-8xl font-black tracking-tighter leading-none mr-1 md:mr-4"
                            style={{
                                WebkitTextStroke: '2px #e94560',
                                color: 'transparent'
                            }}>
                            TOP 20
                        </span>
                        <div className="pb-2">
                            <h2 className="text-md md:text-2xl font-bold text-white capitalize tracking-widest leading-none">
                                {title}
                            </h2>
                        </div>
                    </div>
                ) : (
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                        {title}
                    </h2>
                )}

                <div className="relative group/carousel">
                    <div
                        ref={carouselRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide rounded-xl relative z-10 select-none"
                        style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
                    >
                        {/* Buffer to ensure the first item snaps correctly without triggering left arrow */}
                        <div className="w-1 flex-shrink-0" />

                        {items.map((item, index) => (
                            <div
                                key={item.id || index}
                                className={`relative flex-shrink-0 transition-transform duration-300 ${isLarge ? 'w-[12rem] sm:w-[14rem]' : 'w-[140px] md:w-[180px]'}`}
                                style={{ scrollSnapAlign: "start" }}
                            >
                                <MovieCard
                                    item={item}
                                    isLarge={isLarge}
                                    type={type}
                                    onRemove={onRemove}
                                />
                            </div>
                        ))}

                        <div className="w-[-1px] flex-shrink-0" />
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className={`absolute top-1/2 -translate-y-1/2 left-[-20px] z-30 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-[#e94560] text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:flex ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            }`}
                        aria-label="Scroll left"
                    >
                        <FaChevronLeft className="text-xs md:text-sm" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className={`absolute top-1/2 -translate-y-1/2 right-[-20px] z-30 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-[#e94560] text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:flex ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            }`}
                        aria-label="Scroll right"
                    >
                        <FaChevronRight className="text-xs md:text-sm" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default MovieSection;