"use client"

import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/actions';
import { formatDescription, formatRuntime, getContentRating } from '@/modules/watch/utils/format';
import ShowTrailer from './show-trailler';
import BookmarkButton from './bookmark-button';
import ImdbRating from './imdb-rating';
import MalRating from './mal-rating';
import PosterImage from './poster-image';
import ShareButton from './share-button';
import { useWatch } from '../../provider/watch.provider';
import WatchDetailSkeleton from './skeleton/watch-detail-skeleton';

const WatchDetailSection = () => {
    const { state } = useWatch();
    const details = state.data;
    const type = state.type;

    if (!details) {
        return <WatchDetailSkeleton />;
    }

    const actualId = details?.id;
    const trailer = details?.videos?.results?.find(
        (video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
    );
    const trailerKey = trailer?.key;
    const titleLogo = state.titleLogo;


    const title = details.title || details.name;
    const releaseDate = details.release_date || details.first_air_date;
    const runtime = details.runtime || (details.episode_run_time ? details.episode_run_time[0] : null);

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-0 lg:gap-12 w-full max-w-[1100px] mx-auto px-4">
            {/* Image Container - Hidden on Mobile */}
            <div className="hidden lg:flex w-[30%] justify-end items-center">
                <PosterImage type={type} id={actualId} details={details} />
            </div>

            {/* Info Content */}
            <div className="w-full lg:w-[70%] flex flex-col justify-center items-center">

                {titleLogo ? (
                    <div className="mb-2 max-w-[250px] lg:max-w-[400px] h-[50px] lg:h-20 flex items-center relative w-full justify-center">
                        <Image
                            src={titleLogo}
                            alt={title}
                            fill
                            className="object-contain drop-shadow-md"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="text-[1.8rem] lg:text-[2.5rem] font-black text-white text-center mb-2 leading-tight">
                        {title}
                    </div>
                )}

                {/* Metadata */}
                {/* Metadata */}
                <div className="flex items-center flex-wrap gap-3 mb-3 justify-center mt-2">
                    <>
                        <ImdbRating type={type} id={actualId} />
                        {type === 'anime' && <MalRating type={type} />}
                        <div className="bg-[rgba(52,152,219,0.2)] text-[#3498db] px-2.5 py-1 rounded-[15px] text-[10px] font-bold border border-[rgba(52,152,219,0.3)]">
                            {getContentRating(type, details)}
                        </div>
                        <div className="bg-[rgba(255,193,7,0.2)] text-[#ffc107] px-3 py-1 rounded-[15px] text-[12px] font-medium backdrop-blur-[10px] border border-[rgba(255,255,255,0.1)]">
                            {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
                        </div>
                        {runtime && (
                            <div className="bg-[rgba(255,255,255,0.1)] text-white px-3 py-1 rounded-[15px] text-[12px] font-medium backdrop-blur-[10px] border border-[rgba(255,255,255,0.1)]">
                                {formatRuntime(runtime * 60)}
                            </div>
                        )}
                    </>
                </div>

                {/* Description */}
                <div className="text-[14px] leading-relaxed mb-4 shadow-sm text-center text-[#cccccc] max-w-2xl">
                    {formatDescription(details.overview)}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2.5 mb-5 justify-center">
                    {details.genres?.slice(0, 5).map((genre) => (
                        <span
                            key={genre.id}
                            className="bg-[rgba(233,69,96,0.2)] text-[#e94560] border border-[rgba(233,69,96,0.4)] px-3 py-1 rounded-[20px] text-[10px] font-black uppercase tracking-[0.5px]"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row w-full gap-1 lg:gap-0">
                    <div className="w-full lg:w-1/2 flex flex-col items-center gap-1">
                        <div className="text-[14px] text-[#cccccc]">
                            <span className="font-semibold text-white">Country: </span>
                            <span>
                                {details.production_countries?.[0]?.name || 'United States'}
                            </span>
                        </div>
                        <div className="text-[14px] text-[#cccccc]">
                            <span className="font-semibold text-white">Released Date: </span>
                            {releaseDate ? new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                        </div>
                        <div className="text-[14px] text-[#cccccc]">
                            <span className="font-semibold text-white">Production: </span>
                            {details.production_companies?.[0]?.name || 'N/A'}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col items-center gap-1 mt-2 lg:mt-0">
                        <div className="text-[14px] text-[#cccccc] text-center">
                            <span className="font-semibold text-white">Directors: </span>
                            {details.credits?.crew?.filter(c => c.job === 'Director').length > 0
                                ? details.credits.crew.filter(c => c.job === 'Director').slice(0, 3).map(d => d.name).join(', ')
                                : 'N/A'}
                        </div>
                        <div className="text-[14px] text-[#cccccc] text-center">
                            <span className="font-semibold text-white">Cast: </span>
                            {details.credits?.cast?.length > 0
                                ? details.credits.cast.slice(0, 3).map(a => a.name).join(', ')
                                : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center my-8">
                    <ShowTrailer trailerKey={trailerKey} />

                    <BookmarkButton details={details} type={type} actualId={actualId} />

                    <ShareButton details={details} />
                </div>

            </div>
        </div>
    );
};

export default WatchDetailSection;
