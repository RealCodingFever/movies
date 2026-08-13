"use client";

import { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import HeroSlideControls from "./hero-slide-controls";
import HeroSkeleton from "./hero-skeleton";

const HeroSliderWrapper = ({ children, totalCount }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
        Autoplay({ delay: 6000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fade in effect
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => emblaApi.off("select", onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    // If no children or count is 0, show skeleton
    if (!totalCount) return <HeroSkeleton />;

    return (
        <div className={`relative w-full h-screen min-h-[35rem] overflow-hidden bg-black transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                <div className="flex h-full">
                    {children}
                </div>
            </div>

            <HeroSlideControls
                onPrev={scrollPrev}
                onNext={scrollNext}
                selectedIndex={selectedIndex}
                totalCount={totalCount}
                onDotClick={scrollTo}
            />
        </div>
    );
};

export default HeroSliderWrapper;
