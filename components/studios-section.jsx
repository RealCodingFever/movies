'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { studios } from '@/lib/studioData';
import StudioCard from './studio-card';

const StudiosSection = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
        slidesToScroll: 1
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (!studios || studios.length === 0) {
        return null;
    }

    return (
        <section className="mb-12 md:py-6 sm:py-4">
            <div className="flex justify-between items-center mb-5 sm:flex-col sm:items-start sm:gap-4">
                <h2 className="text-2xl font-semibold text-white md:text-xl">Top Studios</h2>
            </div>

            <div className="relative w-full">
                <div className="overflow-hidden w-full" ref={emblaRef}>
                    <div className="flex gap-6 py-1 md:gap-4 sm:gap-4">
                        {studios.map((studio) => (
                            <StudioCard key={studio.id} studio={studio} />
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                {canScrollPrev && (
                    <button
                        className="absolute top-1/2 -translate-y-1/2 left-[-20px] bg-black/80 border border-white/20 text-white w-10 h-10 rounded-full text-xl cursor-pointer z-10 transition-all duration-300 backdrop-blur-[10px] flex items-center justify-center hover:bg-[#e94560]/30 hover:border-[#e94560]/50 hover:-translate-y-1/2 hover:scale-110 lg:w-9 lg:h-9 lg:text-lg lg:left-[-18px] md:w-8 md:h-8 md:text-base md:left-[-16px]"
                        onClick={scrollPrev}
                        aria-label="Previous studio"
                    >
                        ‹
                    </button>
                )}

                {canScrollNext && (
                    <button
                        className="absolute top-1/2 -translate-y-1/2 right-[-20px] bg-black/80 border border-white/20 text-white w-10 h-10 rounded-full text-xl cursor-pointer z-10 transition-all duration-300 backdrop-blur-[10px] flex items-center justify-center hover:bg-[#e94560]/30 hover:border-[#e94560]/50 hover:-translate-y-1/2 hover:scale-110 lg:w-9 lg:h-9 lg:text-lg lg:right-[-18px] md:w-8 md:h-8 md:text-base md:right-[-16px]"
                        onClick={scrollNext}
                        aria-label="Next studio"
                    >
                        ›
                    </button>
                )}
            </div>
        </section>
    );
};

export default StudiosSection;
