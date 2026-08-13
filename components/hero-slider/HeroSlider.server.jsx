import Link from 'next/link';
import { getTitleLogo } from "@/utils/actions";
import HeroSliderWrapper from "./hero-slider.wrapper";
import HeroSingleSlide from "./hero-single-slide";

const HeroSliderServer = async ({ initialData }) => {
    const slides = initialData?.slice(0, 7) || [];
    const firstSlide = slides[0];

    const slidesWithLogos = await Promise.all(
        slides.map(async (movie) => {
            const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
            let logoUrl = null;
            try {
                logoUrl = await getTitleLogo(mediaType, movie.id);
            } catch (error) {
                console.error(`Error fetching logo for ${movie.id}:`, error);
            }
            return { ...movie, logoUrl };
        })
    );

    return (
        <>
            <link
                rel="preload"
                as="image"
                href={`https://image.tmdb.org/t/p/original${firstSlide?.backdrop_path}`}
            />

            <HeroSliderWrapper totalCount={slidesWithLogos.length}>
                {slidesWithLogos.map((item) => (
                    <HeroSingleSlide
                        key={item.id}
                        item={item}
                        titleLogo={item.logoUrl}
                    />
                ))}
            </HeroSliderWrapper>
        </>
    );
};

export default HeroSliderServer;

