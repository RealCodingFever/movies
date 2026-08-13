import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getTitleLogo } from '@/utils/actions';
import { addBookmark, removeBookmark, isBookmarked } from '@/utils/firestore-functions';
import { toast } from 'react-hot-toast';

export const useHeroSliderLogic = (movies, user, isAuthenticated, onBookmarkChange) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [titleLogos, setTitleLogos] = useState({});
    const [bookmarkStatuses, setBookmarkStatuses] = useState({});

    // Fetch data
    useEffect(() => {
        const fetchTitleLogos = async () => {
            const logos = {};
            for (const movie of movies) {
                try {
                    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
                    const logoUrl = await getTitleLogo(mediaType, movie.id);
                    if (logoUrl) {
                        logos[movie.id] = logoUrl;
                    }
                } catch (error) {
                    console.error('Error fetching logo for movie:', movie.id, error);
                }
            }
            setTitleLogos(logos);
        };

        const fetchBookmarkStatuses = async () => {
            if (!isAuthenticated || !user?.uid) {
                setBookmarkStatuses({});
                return;
            }

            const statuses = {};
            for (const movie of movies) {
                try {
                    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
                    const bookmarkStatus = await isBookmarked(user.uid, movie.id, mediaType);
                    statuses[movie.id] = bookmarkStatus;
                } catch (error) {
                    console.error('Error checking bookmark status for movie:', movie.id, error);
                    statuses[movie.id] = false;
                }
            }
            setBookmarkStatuses(statuses);
        };

        if (movies?.length > 0) {
            fetchTitleLogos();
            fetchBookmarkStatuses();
        }
    }, [movies, isAuthenticated, user?.uid]);

    // Carousel events
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    // Navigation
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback((index) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    // Bookmarking
    const handleBookmarkClick = async (e, item) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login first to bookmark content');
            return;
        }

        const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
        const isCurrentlyBookmarked = bookmarkStatuses[item.id];

        try {
            if (isCurrentlyBookmarked) {
                const success = await removeBookmark(user.uid, item.id, mediaType);
                if (success) {
                    setBookmarkStatuses(prev => ({ ...prev, [item.id]: false }));
                    if (onBookmarkChange) onBookmarkChange();
                    window.dispatchEvent(new CustomEvent('bookmarkChanged'));
                    toast.success("Removed from bookmarks");
                }
            } else {
                const bookmarkData = {
                    id: item.id,
                    title: item.title || item.name,
                    overview: item.overview,
                    posterPath: item.poster_path,
                    backdropPath: item.backdrop_path,
                    mediaType: mediaType,
                    releaseDate: item.release_date || item.first_air_date,
                    voteAverage: item.vote_average
                };

                const success = await addBookmark(user.uid, bookmarkData);
                if (success) {
                    setBookmarkStatuses(prev => ({ ...prev, [item.id]: true }));
                    if (onBookmarkChange) onBookmarkChange();
                    window.dispatchEvent(new CustomEvent('bookmarkChanged'));
                }
            }
        } catch (error) {
            console.error('Error handling bookmark:', error);
            toast.error('Failed to update bookmark');
        }
    };

    return {
        emblaRef,
        selectedIndex,
        titleLogos,
        bookmarkStatuses,
        scrollPrev,
        scrollNext,
        scrollTo,
        handleBookmarkClick
    };
};