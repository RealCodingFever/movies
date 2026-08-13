"use client";

import React, { useEffect, useRef } from 'react';
import { FaPlay, FaCloud, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useWatch } from '../../provider/watch.provider';
import { useProgress } from '@/context/progress-context';
import { handleProgressMessage } from '../../utils/get-progress';
import { getPlayerUrl } from '../../utils/player';
import { getImageUrl } from '@/utils/actions';
import { TbArrowBadgeLeftFilled, TbArrowBadgeRightFilled } from "react-icons/tb";
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';
import { mutate } from "swr";


import WatchContentSkeleton from './skeleton/watch-content-skeleton';

const WatchContentSection = () => {
    const { state, updateState, saveToHistory, goToNextEpisode, goToPreviousEpisode, canGoNext, canGoPrevious, checkHistoryLimit } = useWatch();
    const { user, isAdmin } = useAuth();
    const {
        data: details,
        type,
        id: actualId,
        selectedServer,
        selectedSeason,
        selectedEpisode,
        initialProgress,
        isPlaying,
        imdbId
    } = state;

    const handlePlayClick = async () => {
        const allowed = await checkHistoryLimit();
        if (!allowed) return;

        updateState({ isPlaying: true });

        if (details) {
            await saveToHistory(details);

            if (user?.uid) {
                mutate(["history", user.uid]);
            }
        }
    };




    // Handle Progress Messages
    const { setProgress } = useProgress();
    useEffect(() => {
        const onMessage = (event) => {
            handleProgressMessage(
                event,
                { actualId, type, selectedSeason, selectedEpisode },
                (data) => {
                    // Update Local State for UI if needed (keeping it synced)
                    updateState({
                        progress: data.progress,
                        duration: data.duration
                    });

                    // Save to Global Context/Storage
                    setProgress(
                        data.itemType,
                        data.itemId,
                        data.season,
                        data.episode,
                        data.progress,
                        data.duration
                    );
                }
            );
        };

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [actualId, type, selectedSeason, selectedEpisode, updateState, setProgress]);

    if (!details) return <WatchContentSkeleton />;

    const playerUrl = getPlayerUrl({
        type,
        id: actualId,
        imdbId,
        season: selectedSeason,
        episode: selectedEpisode,
        server: selectedServer,
        progress: initialProgress
    });

    const canPrev = (type === 'tv' || type === 'anime') && canGoPrevious();
    const canNext = (type === 'tv' || type === 'anime') && canGoNext();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center px-4">
            {/* Wrapper for positioning indicator outside overflow-hidden */}
            <div className="relative w-full lg:w-[85%] h-[20rem] lg:h-[35rem] mt-8 group/player">

                {/* Change Server Indicator */}
                {isPlaying && (selectedSeason !== 1 && selectedServer !== 3) && <div className="absolute top-[-50px] left-1 md:left-4 z-20 w-[180px]">
                    <img src="/change-server.png" alt="" />
                </div>}

                <div
                    className="relative w-full h-full rounded-[24px] bg-cover bg-center bg-no-repeat bg-black overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(233,69,96,0.15)]"
                    style={{
                        backgroundImage: !isPlaying ? `url(${getImageUrl(details.backdrop_path || details.poster_path, 'original')})` : 'none'
                    }}
                >
                    {!isPlaying ? (
                        <div
                            className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-black/30 flex justify-center items-center cursor-pointer group transition-all duration-500 hover:bg-black/40"
                            onClick={handlePlayClick}
                        >
                            {/* Pulse Effect Rings */}
                            <div className="absolute w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-[#e94560] opacity-0 group-hover:animate-ping transition-all duration-1000" />

                            {/* Main Play Button */}
                            <div className="relative w-16 h-16 lg:w-24 lg:h-24 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:bg-[#e94560] group-hover:border-[#e94560] shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_50px_rgba(233,69,96,0.6)]">
                                <FaPlay className="text-[1.5rem] lg:text-[2.5rem] text-white ml-2 drop-shadow-lg" />
                            </div>

                            {/* Text Hint */}
                            <div className="absolute mt-32 lg:mt-40 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <span className="text-white font-bold tracking-[2px] text-sm uppercase bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                                    Click to Play
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-black relative animate-[fadeIn_0.5s_ease-out] rounded-[24px] overflow-hidden">
                            <iframe
                                src={playerUrl}
                                className="w-full h-full border-0"
                                allowFullScreen
                                allow="autoplay; encrypted-media"
                                scrolling="no"
                            ></iframe>
                        </div>
                    )}
                </div>
                {(type === 'tv' || type === 'anime') && <div className="flex justify-between items-center mt-4 px-1">
                    <button
                        className={`flex items-center gap-1.5 text-white font-bold text-sm transition-all duration-300 ${canPrev
                            ? 'opacity-100 hover:text-[#e94560] cursor-pointer hover:translate-x-[-2px]'
                            : 'opacity-30 cursor-not-allowed'
                            }`}
                        onClick={goToPreviousEpisode}
                        disabled={!canPrev}
                    >
                        <TbArrowBadgeLeftFilled className="text-xl" /> Prev
                    </button>
                    <button
                        className={`flex items-center gap-1.5 text-white font-bold text-sm transition-all duration-300 ${canNext
                            ? 'opacity-100 hover:text-[#e94560] cursor-pointer hover:translate-x-[2px]'
                            : 'opacity-30 cursor-not-allowed'
                            }`}
                        onClick={goToNextEpisode}
                        disabled={!canNext}
                    >
                        Next <TbArrowBadgeRightFilled className="text-xl" />
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default WatchContentSection;
