import { useHeroSliderLogic } from './utils';
import HeroSingleSlide from './hero-single-slide';
import HeroSlideControls from './hero-slide-controls';

const HeroSlider = ({ initialData }) => {
    const {
        emblaRef,
        selectedIndex,
        titleLogos,
        bookmarkStatuses,
        scrollPrev,
        scrollNext,
        scrollTo,
        handleBookmarkClick
    } = useHeroSliderLogic(initialData);

    if (!initialData || initialData.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-screen min-h-[35rem] overflow-hidden bg-black">
            <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                <div className="flex h-full">
                    {initialData.map((item) => (
                        <HeroSingleSlide
                            key={item.id}
                            item={item}
                            titleLogo={titleLogos[item.id]}
                            isBookmarked={bookmarkStatuses[item.id]}
                            onBookmarkClick={handleBookmarkClick}
                        />
                    ))}
                </div>
            </div>

            <HeroSlideControls
                onPrev={scrollPrev}
                onNext={scrollNext}
                selectedIndex={selectedIndex}
                totalCount={initialData.length}
                onDotClick={scrollTo}
            />
        </div>
    );
};

export default HeroSlider;
