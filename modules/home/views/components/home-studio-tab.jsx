'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

const studios = [
    { id: 'disney', name: 'Disney', logo: '/studio/disney.png' },
    { id: 'pixar', name: 'Pixar', logo: '/studio/pixar.png' },
    { id: 'marvel', name: 'Marvel', logo: '/studio/marvel.png' },
    { id: 'star-wars', name: 'Lucasfilm', logo: '/studio/20th-century.png' }, // Note: 20th century placeholder for now based on file list, user might want specific
    { id: 'national-geographic', name: 'National Geographic', logo: '/studio/columbia.png' }, // Placeholder
    { id: 'dc', name: 'DC', logo: '/studio/dc.png' },
    { id: 'dreamworks', name: 'Dreamworks', logo: '/studio/dreamworks.png' },
    { id: 'lionsgate', name: 'Lionsgate', logo: '/studio/lionsgate.png' },
    { id: 'netflix', name: 'Netflix', logo: '/studio/netflix.png' },
    { id: 'paramount', name: 'Paramount', logo: '/studio/paramount.png' },
    { id: 'prime', name: 'Prime Video', logo: '/studio/prime.png' },
    { id: 'sony', name: 'Sony', logo: '/studio/sony.png' },
    { id: 'universal', name: 'Universal', logo: '/studio/universal.png' },
    { id: 'warner-bros', name: 'Warner Bros', logo: '/studio/warner-bros.png' },
];

const HomeStudioTab = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
        containScroll: 'trimSnaps',
        dragFree: true
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const checkScroll = useCallback((api) => {
        if (!api) return;
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        checkScroll(emblaApi);
        emblaApi.on('reInit', checkScroll);
        emblaApi.on('select', checkScroll);

        return () => {
            emblaApi.off('reInit', checkScroll);
            emblaApi.off('select', checkScroll);
        };
    }, [emblaApi, checkScroll]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="w-full max-w-[1500px] mx-auto my-12 px-6">
            <div className="relative group/carousel">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y gap-4 py-4">
                        {studios.map((studio) => (
                            <div
                                key={studio.id}
                                className="flex-[0_0_auto] min-w-0 pl-4 relative"
                            >
                                <div className="
                                    group relative w-[200px] h-[112px] md:w-[320px] md:h-[180px] 
                                    rounded-xl border border-white/10 bg-[#1a1a2e] 
                                    shadow-lg cursor-pointer overflow-hidden
                                    transition-all duration-300 hover:scale-105 hover:border-[#e94560]/50 hover:shadow-[#e94560]/20
                                ">
                                    {/* Image Container */}
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={studio.logo}
                                            alt={studio.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 200px, 320px"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Left Arrow */}
                {canScrollPrev && (
                    <button
                        onClick={scrollPrev}
                        className="absolute top-1/2 -translate-y-1/2 left-[-20px] z-30 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-[#e94560] text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10"
                        aria-label="Scroll left"
                    >
                        <FaChevronLeft className="text-xs md:text-sm" />
                    </button>
                )}

                {/* Right Arrow */}
                {canScrollNext && (
                    <button
                        onClick={scrollNext}
                        className="absolute top-1/2 -translate-y-1/2 right-[-20px] z-30 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-[#e94560] text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10"
                        aria-label="Scroll right"
                    >
                        <FaChevronRight className="text-xs md:text-sm" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default HomeStudioTab;
