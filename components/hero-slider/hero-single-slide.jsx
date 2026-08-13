import Link from 'next/link';
import { getImageUrl } from '@/utils/actions';
import { getGenreName } from './constants';
import HeroBookmarkButton from './hero-bookmark-button';

const HeroSingleSlide = ({
    item,
    titleLogo,
}) => {
    const title = item.title || item.name;
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

    const formatDuration = (minutes) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const formatTitle = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const getWatchUrl = (item) => {
        const title = item.title || item.name;
        const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
        const formattedTitle = formatTitle(title);
        return `/watch/${mediaType}/${item.id}-${formattedTitle}`;
    };

    const getReleaseYear = (item) => {
        const date = item.release_date || item.first_air_date;
        return date ? new Date(date).getFullYear() : '';
    };

    const getGenres = (item) => {
        if (item.genre_ids) {
            return item.genre_ids.slice(0, 3);
        }
        if (item.genres && Array.isArray(item.genres)) {
            return item.genres.slice(0, 3).map(genre => genre.id);
        }
        return [];
    };

    return (
        <div className="flex-[0_0_100%] min-w-0 relative h-full group">
            <style>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.8s ease-out;
                }
            `}</style>
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[600ms] ease-linear"
                style={{
                    backgroundImage: `url(${getImageUrl(item.backdrop_path, 'original')})`
                }}
            >
                {/* Overlays */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent via-[rgba(0,0,0,0.2)_70%] to-[rgba(0,0,0,0.95)] ... from-[rgba(0,0,0,0.95)] via-[rgba(0,0,0,0.4)_50%] to-transparent opacity-100 bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_70%,transparent_100%)]" />
                <div className="absolute top-0 left-0 w-full h-[120px] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_50%,transparent_100%)] z-[5]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_50%,transparent_100%)] z-[5]" />

                {/* Slide Content */}
                <div className="relative z-10 h-full flex items-center max-w-[2000px] mx-auto px-10 lg:px-[30px] md:px-5 sm:px-[15px]">
                    <div className="max-w-[600px] text-white animate-slide-in-left lg:max-w-[600px] md:max-w-full md:px-5">
                        {/* Title Logo or Text */}
                        {titleLogo ? (
                            <div className="mb-6 max-w-[500px] h-[120px] flex items-center lg:max-w-[400px] lg:h-[100px] md:max-w-[300px] md:h-[80px] md:mb-4 sm:max-w-[250px] sm:h-[60px] sm:mb-3">
                                <img
                                    src={titleLogo}
                                    alt={title}
                                    className="max-w-full max-h-full object-contain drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)]"
                                />
                            </div>
                        ) : (
                            <h2 className="text-[3.2rem] font-bold mb-6 leading-[1.1] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)] font-[Poppins] tracking-[-0.02em] lg:text-[2.8rem] md:text-[2.2rem] md:mb-4 sm:text-[1.8rem] sm:mb-3">{title}</h2>
                        )}

                        <div className="mb-5 md:mb-3 sm:mb-4">
                            <div className="flex items-center flex-wrap gap-3 mb-3 md:gap-2 md:mb-2.5">
                                {getGenres(item).map((genreId, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[rgba(233,69,96,0.2)] text-[#e94560] border border-[rgba(233,69,96,0.4)] px-3 py-1 rounded-[20px] text-[10px] font-medium uppercase tracking-[0.5px] no-underline transition-all duration-300 inline-block md:text-[9px] md:px-2 md:py-[3px]"
                                    >
                                        {getGenreName(genreId)}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center flex-wrap gap-3 mb-3 md:gap-2 md:mb-2.5">
                                {getReleaseYear(item) && (
                                    <span className="bg-[rgba(255,255,255,0.1)] text-white px-3 py-1 rounded-[15px] text-[10px] font-medium backdrop-blur-[10px] border border-[rgba(255,255,255,0.1)] md:text-[9px] md:px-2 md:py-[3px]">{getReleaseYear(item)}</span>
                                )}

                                {(item.runtime || item.episode_run_time?.[0]) && (
                                    <span className="bg-[rgba(255,255,255,0.1)] text-white px-3 py-1 rounded-[15px] text-[10px] font-medium backdrop-blur-[10px] border border-[rgba(255,255,255,0.1)] md:text-[9px] md:px-2 md:py-[3px]">
                                        {formatDuration(item.runtime || item.episode_run_time?.[0])}
                                    </span>
                                )}

                                {item.vote_average > 0 && (
                                    <span className="bg-[rgba(255,193,7,0.2)] text-[#ffc107] px-3 py-1 rounded-[15px] text-[10px] font-semibold flex items-center gap-1 border border-[rgba(255,193,7,0.3)] md:text-[9px] md:px-2 md:py-[3px]">
                                        <span className="text-[12px]">★</span>
                                        {item.vote_average.toFixed(1)}
                                    </span>
                                )}

                                <span className="bg-[rgba(52,152,219,0.2)] text-[#3498db] px-[10px] py-1 rounded-[15px] text-[10px] font-bold border border-[rgba(52,152,219,0.3)] md:text-[9px] md:px-2 md:py-[3px]">PG-13</span>

                                <span className="bg-[rgba(142,68,173,0.2)] text-[#8e44ad] px-3 py-1 rounded-[15px] text-[10px] font-bold border border-[rgba(142,68,173,0.3)] md:text-[9px] md:px-2 md:py-[3px]">
                                    {mediaType.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <p className="text-[14px] leading-[1.6] text-[rgba(255,255,255,0.9)] mb-8 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] md:text-[0.9rem] md:mb-5 md:leading-[1.5] sm:text-[0.85rem] sm:mb-4">
                            {item.overview && item.overview.length > 200
                                ? `${item.overview.substring(0, 200)}...`
                                : item.overview
                            }
                        </p>

                        <div className="flex items-center gap-4">
                            <a href={getWatchUrl(item)} className="relative inline-flex items-center gap-3 bg-gradient-to-br from-[#e94560] to-[#c73650] text-white px-5 py-2.5 rounded-[50px] text-[14px] font-semibold no-underline transition-all duration-300 shadow-[0_8px_25px_rgba(233,69,96,0.3)] border-0 cursor-pointer uppercase tracking-[0.5px] overflow-visible hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(233,69,96,0.4)] hover:bg-gradient-to-br hover:from-[#c73650] hover:to-[#b12d47] md:text-[0.9rem] md:px-5 md:py-2.5 sm:text-[0.85rem] sm:px-4 sm:py-2">
                                <span className="text-[13px] flex items-center md:text-[0.8rem] md:mr-1.5">▶</span>
                                Watch Now
                            </a>
                            <HeroBookmarkButton item={item} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSingleSlide;

