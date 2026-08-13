import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getImageUrl } from '@/utils/actions';
import { useAuth } from '@/context/auth-context';
import { useProgress } from '@/context/progress-context';

const MovieCard = ({ item, isLarge = false, type = 'normal', onRemove }) => {
    const { isAuthenticated } = useAuth();
    const { getProgress } = useProgress();
    const [progressData, setProgressData] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    const isContinueWatching = type === 'continue';
    const isRecommendation = type === 'recommendations';
    const isBookmark = type === 'bookmarks';
    const isAnime = (item.media_type || item.mediaType) === 'anime';

    useEffect(() => {
        if (isContinueWatching) {
            const data = getProgress(
                item.mediaType,
                item.id,
                item.season || 1,
                item.episode || 1
            );
            setProgressData(data);
        }
    }, [item, isContinueWatching, getProgress]);

    const progressPercentage = progressData && progressData.duration > 0
        ? (progressData.progress / progressData.duration) * 100
        : 0;

    const title = (isContinueWatching || isRecommendation || isBookmark) ? item.title : (item.title || item.name);
    const releaseDate = (isContinueWatching || isRecommendation || isBookmark) ? null : (item.release_date || item.first_air_date);
    // Updated to check both camelCase and snake_case
    const mediaType = (isContinueWatching || isRecommendation || isBookmark) ? item.mediaType : (item.media_type || item.mediaType || (item.title ? 'movie' : 'tv'));
    // Updated to check both camelCase and snake_case
    const posterPath = (isContinueWatching || isRecommendation || isBookmark) ? item.posterPath : (item.poster_path || item.posterPath);
    const voteAverage = (isContinueWatching || isRecommendation || isBookmark) ? null : item.vote_average;
    const itemId = (isContinueWatching || isRecommendation || isBookmark) ? item.id : item.id;

    const formatProgressTime = (totalSeconds) => {
        if (isNaN(totalSeconds) || totalSeconds < 0) return '0:00';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    const formatTitle = (title) => {
        return title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const getWatchUrl = (item) => {
        const title = (isContinueWatching || isRecommendation || isBookmark) ? item.title : (item.title || item.name);
        const mediaType = (isContinueWatching || isRecommendation || isBookmark) ? item.mediaType : (item.media_type || item.mediaType || (item.title ? 'movie' : 'tv'));

        const formattedTitle = formatTitle(title);

        return `/watch/${mediaType}/${itemId}-${formattedTitle}`;
    };

    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemove) {
            onRemove(item);
        }
    };

    return (
        <Link href={getWatchUrl(item)}>
            <div
                className={`
                    relative transition-all duration-300 ease-in-out cursor-pointer z-10 overflow-hidden group
                    ${isLarge ? 'w-[12rem] h-[18rem] sm:w-[14rem] sm:h-[20rem]' : 'w-[9rem] h-[13.5rem] sm:w-[11rem] sm:h-[16rem]'}
                    hover:z-20
                `}
                style={{
                    borderRadius: "calc(var(--radius-base) * var(--brm))",
                    cornerShape: "squircle",
                }}
            >
                <div 
                    className="relative w-full h-full shadow-md transition-all duration-300 group-hover:shadow-xl bg-[#1a1a1a]"
                    style={{
                        borderRadius: "calc(var(--radius-base) * var(--brm))",
                        cornerShape: "squircle",
                    }}
                >

                    {/* Remove Buttons */}
                    {((isContinueWatching || isBookmark) && onRemove) || (isRecommendation && onRemove && isAuthenticated) ? (
                        <button
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-all duration-300 z-20 hover:bg-red-500 hover:border-red-500 hover:scale-110 opacity-100 md:opacity-0 group-hover:opacity-100"
                            onClick={handleRemove}
                            title="Remove"
                        >
                            <FaTimes className="w-3 h-3" />
                        </button>
                    ) : null}

                    {/* Shimmer Placeholder - Visible while loading */}
                    {imageLoading && (
                        <div 
                            className="absolute inset-0 bg-neutral-800 animate-pulse z-10 overflow-hidden"
                            style={{
                                borderRadius: "calc(var(--radius-base) * var(--brm))",
                                cornerShape: "squircle",
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12" />
                        </div>
                    )}

                    {/* Poster Image */}
                    {posterPath ? (
                        <Image
                            src={getImageUrl(posterPath, 'w500')}
                            alt={title}
                            fill
                            className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${imageLoading ? 'opacity-0 scale-105 blur-xl' : 'opacity-100 scale-100 blur-0'
                                }`}
                            style={{
                                borderRadius: "calc(var(--radius-base) * var(--brm))",
                                cornerShape: "squircle",
                            }}
                            sizes="(max-width: 768px) 144px, 176px"
                            onLoad={() => setImageLoading(false)}
                            onError={(e) => {
                                setImageLoading(false);
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}

                    {/* Fallback Placeholder */}
                    <div
                        className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-white text-2xl font-bold uppercase"
                        style={{ 
                            display: (!posterPath && !imageLoading) ? 'flex' : 'none',
                            borderRadius: "calc(var(--radius-base) * var(--brm))",
                            cornerShape: "squircle",
                        }}
                    >
                        <span>{title?.charAt(0) || '?'}</span>
                    </div>

                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" 
                        style={{
                            borderRadius: "calc(var(--radius-base) * var(--brm))",
                            cornerShape: "squircle",
                        }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-end transition-transform duration-300 group-hover:-translate-y-2">
                        {/* Anime title — anime covers don't bake the title into the art the way TMDB posters often do, so we render it on the card. */}
                        {isAnime && (
                            <div className="mb-2 flex justify-between items-start gap-2">
                                <div className={`${isLarge ? 'text-[14px]' : 'text-[13px]'} font-semibold text-white leading-tight line-clamp-2`}>
                                    {title}
                                </div>
                                {item.episode ? (
                                    <span className="bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider whitespace-nowrap shrink-0">
                                        Ep {item.episode}
                                    </span>
                                ) : null}
                            </div>
                        )}

                        <div className="flex justify-between items-center gap-2 text-[10px] text-gray-300 font-medium">
                            <span className="bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {mediaType}
                            </span>

                            {releaseDate && (
                                <span className="text-gray-400">
                                    {(() => {
                                        try {
                                            const year = new Date(releaseDate).getFullYear();
                                            return isNaN(year) ? '' : year;
                                        } catch {
                                            return '';
                                        }
                                    })()}
                                </span>
                            )}

                            {isContinueWatching && mediaType === 'tv' && item.episode && (
                                <div className="mt-1 text-[10px] capitalize text-rose-500 font-semibold">
                                    {`S${item.season} E${item.episode}`}
                                </div>
                            )}
                        </div>



                        {/* Continue / Recommend / Bookmark Indicators */}
                        {(isContinueWatching || isRecommendation || isBookmark) && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className={`w-1.5 h-1.5 rounded-full ${isRecommendation ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
                                <span className={isRecommendation ? 'text-indigo-400' : 'text-rose-500'}>
                                    {isContinueWatching ? 'Continue' : isRecommendation ? 'Recommended' : 'Bookmarked'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {isContinueWatching && progressData && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 z-20">
                            <div
                                className="h-full bg-rose-500 relative"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
