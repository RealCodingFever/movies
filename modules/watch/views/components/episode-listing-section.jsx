"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useWatch } from '../../provider/watch.provider';
import { getImageUrl } from '@/utils/actions';
import { FaSearch, FaDownload, FaChevronDown, FaCalendarAlt } from 'react-icons/fa';

import EpisodeListingSkeleton from './skeleton/episode-listing-skeleton';

const EpisodeListingSection = () => {
    const { state, handleSeasonSelect, handleEpisodeSelect } = useWatch();
    const {
        data: details,
        type,
        seasonEpisodes,
        episodesLoading,
        selectedSeason,
        selectedEpisode,
        browsingSeason
    } = state;

    const animeEpisodes = details?._animeEpisodes;

    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [episodesRendered, setEpisodesRendered] = useState(false);
    const episodeListRef = useRef(null);

    // Detect when episodes are rendered using MutationObserver
    useEffect(() => {
        if (!episodeListRef.current) {
            setEpisodesRendered(false);
            return;
        }

        const container = episodeListRef.current;

        // Check immediately
        const checkRendered = () => {
            const hasChildren = container.children && container.children.length > 0;
            setEpisodesRendered(hasChildren);
        };

        checkRendered();

        // Use MutationObserver to detect when children are added
        const observer = new MutationObserver(checkRendered);
        observer.observe(container, { childList: true, subtree: true });

        // Also check after a delay to catch cases where observer might miss
        const timeoutId = setTimeout(checkRendered, 500);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [seasonEpisodes, animeEpisodes, searchQuery, browsingSeason]);

    // Scroll to active episode when rendered or changed
    useEffect(() => {
        if (episodesRendered && selectedEpisode && episodeListRef.current) {
            const activeEpisodeElement = episodeListRef.current.querySelector(`[data-episode="${selectedEpisode}"]`);
            if (activeEpisodeElement) {
                // Scroll the container to center the episode
                activeEpisodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [episodesRendered, selectedEpisode]);

    // For anime, episodes come from the AniZip-normalized list on the adapter.
    // Project them into the same shape TV episodes use so the render block
    // below stays media-agnostic.
    const isAnime = type === 'anime';
    const sourceEpisodes = isAnime
        ? (details?._animeEpisodes ?? [])
            // Skip specials/compilations: AniZip mixes them in with keys like
            // "S1" which decode to NaN and don't belong on the main episode list.
            .filter((ep) => Number.isInteger(ep.number) && ep.number > 0)
            .map((ep) => ({
                id: ep.number,
                name: ep.title,
                episode_number: ep.number,
                still_path: ep.image || null,
                overview: ep.overview,
                summary: ep.overview,
                air_date: ep.airDate,
            }))
        : seasonEpisodes;

    // Filter episodes
    const filteredEpisodes = sourceEpisodes?.filter(ep =>
        (ep.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.episode_number.toString().includes(searchQuery)
    );

    if (type !== 'tv' && type !== 'anime') return null;
    if (isAnime && details?._animeFormat === 'MOVIE') return null;
    if (!details) return <EpisodeListingSkeleton />;

    return (
        <div className="w-full max-w-[1300px] mx-auto my-8 min-h-[400px] px-4">
            {/* Header */}
            <div className="flex flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-6">
                    {/* Season Selector - Only show if more than 1 season (usually TV) */}
                    {details.seasons?.length > 1 && (
                        <div className="relative z-30">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center justify-between gap-3 bg-[#2a2a2a] border-2 border-[rgba(233,69,96,0.3)] text-white px-4 py-2 lg:px-5 lg:py-2.5 rounded-[25px] font-semibold text-sm min-w-[140px] hover:border-[#e94560] hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                            >
                                <span>Season {browsingSeason}</span>
                                <FaChevronDown className={`text-xs transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showDropdown && (
                                <div className="absolute top-[110%] left-0 w-full bg-[#1a1a1a] border border-[rgba(233,69,96,0.3)] rounded-xl overflow-y-auto max-h-60 shadow-2xl animate-[fadeIn_0.2s_ease]">
                                    {details.seasons?.filter(s => s.season_number > 0).map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => {
                                                handleSeasonSelect(s.season_number);
                                                setShowDropdown(false);
                                            }}
                                            className={`px-4 py-3 text-sm cursor-pointer transition-colors border-b border-white/5 hover:bg-[rgba(233,69,96,0.2)] hover:text-white ${browsingSeason === s.season_number ? 'bg-[rgba(233,69,96,0.3)] font-semibold text-white' : 'text-gray-300'}`}
                                        >
                                            Season {s.season_number}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search episodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-[250px] bg-[#1a1a1a] border-2 border-[rgba(233,69,96,0.3)] text-white px-4 py-2 lg:px-5 lg:py-2.5 rounded-[25px] text-sm focus:outline-none focus:border-[#e94560] focus:shadow-[0_0_15px_rgba(233,69,96,0.2)] transition-all placeholder-gray-500"
                    />
                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                </div>
            </div>

            {/* Episodes List */}
            <div
                ref={episodeListRef}
                className="bg-[#0a0a0a]/30 border border-white/10 rounded-xl overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
            >
                {episodesLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-[#e94560] rounded-full animate-spin"></div>
                    </div>
                ) : filteredEpisodes && filteredEpisodes.length > 0 ? (
                    <div className="flex flex-col">
                        {filteredEpisodes.map((ep) => {
                            const isActive = selectedSeason === browsingSeason && selectedEpisode === ep.episode_number;

                            // Parse and format air date
                            const airDateStr = ep.airDate || ep.air_date;
                            let formattedDate = null;
                            let isAired = true;
                            if (airDateStr) {
                                try {
                                    const dateObj = new Date(airDateStr);
                                    if (!isNaN(dateObj.getTime())) {
                                        isAired = dateObj.getTime() <= Date.now();
                                        formattedDate = dateObj.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        });
                                    }
                                } catch (e) { }
                            }

                            const handleClick = () => {
                                if (isAired) {
                                    handleEpisodeSelect(ep.episode_number);
                                }
                            };

                            return (
                                <div
                                    key={ep.id}
                                    data-episode={ep.episode_number}
                                    onClick={handleClick}
                                    className={`
                                        group flex items-center gap-4 md:gap-6 p-4 md:p-6 border-b border-white/5 transition-all duration-300
                                        ${isAired ? 'cursor-pointer hover:bg-[rgba(233,69,96,0.05)]' : 'cursor-not-allowed opacity-50'}
                                        ${isActive && isAired ? 'bg-[rgba(233,69,96,0.1)] border-l-4 border-l-[#e94560]' : 'border-l-4 border-l-transparent'}
                                    `}
                                >
                                    {/* Number */}
                                    <div className={`text-2xl md:text-4xl font-light min-w-[40px] md:min-w-[60px] text-center ${isActive ? 'text-[#e94560]' : 'text-gray-500'}`}>
                                        {ep.episode_number}
                                    </div>

                                    {/* Image */}
                                    {/* Image or Fallback */}
                                    <div className="relative flex-shrink-0 w-[100px] h-[60px] md:w-[140px] md:h-[80px] rounded-lg overflow-hidden bg-[#222]">
                                        {ep.still_path ? (
                                            <>
                                                <Image
                                                    src={getImageUrl(ep.still_path, 'w300')}
                                                    alt={ep.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                            </>
                                        ) : (
                                            <div className="relative w-full h-full bg-neutral-900">
                                                <Image
                                                    src={getImageUrl(details.backdrop_path || details.poster_path, 'w780')}
                                                    alt={`Episode ${ep.episode_number}`}
                                                    fill
                                                    className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                                    <div className="text-white/90 text-xs font-bold select-none drop-shadow-md">
                                                        akmovies
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-1.5 md:mb-2">
                                            <div className="">
                                                <h3 className={`text-sm md:text-lg font-semibold truncate ${isActive ? 'text-[#e94560]' : 'text-white'}`}>
                                                    {ep.name}
                                                </h3>
                                            </div>
                                            {formattedDate && (
                                                <div className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-md border flex-shrink-0 transition-colors ${isActive ? 'border-[#e94560]/20' : 'bg-gray-500/10 border-gray-500/20'
                                                    } `}>
                                                    <FaCalendarAlt className={`text-[10px] sm:text-[11px] ${isActive ? 'text-[#e94560]' : 'text-gray-400'}`} />
                                                    <span className={`text-[10px] sm:text-[11px] font-medium tracking-wide ${isActive ? 'text-[#e94560]' : 'text-gray-400'}`}>
                                                        {formattedDate}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                            {ep.overview || ep.summary || 'No description available.'}
                                        </p>
                                    </div>

                                    {/* Actions (Hidden on mobile mostly) */}
                                    <div className="hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* <button className="p-2 text-white/50 hover:text-[#e94560] transition-colors" title="Download">
                                             <FaDownload />
                                         </button> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        {searchQuery ? `No episodes found matching "${searchQuery}"` : 'No episodes found for this season.'}
                    </div>
                )}
            </div>

        </div>
    );
};

export default EpisodeListingSection;
