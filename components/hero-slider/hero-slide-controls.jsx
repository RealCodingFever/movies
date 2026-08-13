const HeroSlideControls = ({
    onPrev,
    onNext,
    selectedIndex,
    totalCount,
    onDotClick
}) => {
    return (
        <div className="absolute inset-0 w-full max-w-[2000px] mx-auto pointer-events-none">
            {/* Navigation Arrows */}
            <button
                className="pointer-events-auto absolute bottom-3 right-18 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white rounded-full text-[20px] cursor-pointer z-20 transition-all duration-300 backdrop-blur-[10px] flex items-center justify-center hover:bg-[rgba(233,69,96,0.3)] hover:border-[rgba(233,69,96,0.5)] hover:scale-110 w-[35px] h-[35px]"
                onClick={onPrev}
                aria-label="Previous slide"
            >
                ‹
            </button>

            <button
                className="pointer-events-auto absolute bottom-3 right-5 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white rounded-full text-[20px] cursor-pointer z-20 transition-all duration-300 backdrop-blur-[10px] flex items-center justify-center hover:bg-[rgba(233,69,96,0.3)] hover:border-[rgba(233,69,96,0.5)] hover:scale-110 w-[35px] h-[35px]"
                onClick={onNext}
                aria-label="Next slide"
            >
                ›
            </button>

            {/* Dots Indicator */}
            <div className="pointer-events-auto absolute bottom-10 left-10 flex gap-3 z-20 md:bottom-[15px] md:gap-2 sm:bottom-[10px]">
                {Array.from({ length: totalCount }).map((_, index) => (
                    <button
                        key={index}
                        className={`w-[9px] h-[9px] rounded-full border-none cursor-pointer transition-all duration-300 md:w-[8px] md:h-[8px] sm:w-[8px] sm:h-[8px] ${selectedIndex === index ? 'bg-[#e94560] scale-130' : 'bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.6)] hover:scale-120'}`}
                        onClick={() => onDotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlideControls;
