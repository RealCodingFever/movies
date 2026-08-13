"use client";

import React, { useState } from 'react';
import { useWatch } from '../../provider/watch.provider';
import { FaCloud, FaPlay, FaDownload, FaStar } from 'react-icons/fa';
import DownloadPopupV2 from '../../../../components/download-popup-v2';
import { addRecommendation } from '@/utils/firestore-functions';
import { useAuth } from '@/context/auth-context';
import { toast } from 'react-hot-toast';

import ServerButtonsSkeleton from './skeleton/server-buttons-skeleton';

const ServerButtonsSection = () => {
    const { state, setSelectedServer, actualId } = useWatch();
    const { selectedServer, data: details } = state;
    const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
    const { user, isAuthenticated, isAdmin } = useAuth();

    if (!details) return <ServerButtonsSkeleton />;

    const isAnime = state.type === 'anime';
    const servers = isAnime
        ? [{ id: 'sub', name: 'Sub' }, { id: 'dub', name: 'Dub' }]
        : [{ id: '1', name: 'Main 1' }, { id: '2', name: 'Main 2' }];

    const handleAddRecommendation = async () => {
        if (!isAuthenticated || !user?.uid || !details) return;

        // Check if user is admin
        if (!isAdmin) {
            toast.error('Only admin can add recommendations');
            return;
        }

        try {
            const recommendationData = {
                id: parseInt(actualId),
                title: details.title || details.name,
                description: details.overview,
                posterPath: details.poster_path,
                mediaType: state.type,
                addedBy: user.email
            };

            await addRecommendation(recommendationData);
            toast.success('Recommendation added successfully');
        } catch (error) {
            console.error('Error adding recommendation:', error);
            toast.error('Failed to add recommendation');
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center my-8 px-4">
            <div className="flex flex-col items-center justify-center text-white/80 text-sm font-light tracking-wide gap-2 mb-4">
                <div className="flex items-center gap-2 text-center">
                    <span>If the content is wrong or not working, please try switching to other servers.</span>
                </div>
            </div>

            <div className="flex justify-center flex-wrap gap-4 w-full max-w-4xl">
                {servers.map((server) => (
                    <button
                        key={server.id}
                        onClick={() => setSelectedServer(server.id)}
                        className={`
                            relative group flex items-center justify-center gap-3 px-6 py-2 rounded-[25px] 
                            text-sm font-semibold uppercase tracking-wider transition-all duration-300
                            w-[150px] overflow-hidden border-2
                            ${selectedServer === server.id
                                ? 'bg-[#1a1a1a] border-[#e94560] shadow-[0_0_15px_rgba(233,69,96,0.3)] scale-[1.02] text-white'
                                : 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-transparent text-white/90 hover:border-[#e94560] hover:-translate-y-0.5 hover:shadow-[0_8_25px_rgba(0,0,0,0.4)]'
                            }
                        `}
                    >
                        {/* Hover Gradient Overlay */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>

                        <FaPlay className={`text-xs transition-transform duration-300 ${selectedServer === server.id ? 'animate-bounce' : 'group-hover:scale-125 group-hover:rotate-12'}`} />
                        <span className={`transition-transform duration-300 text-xs ${selectedServer === server.id ? '' : 'group-hover:translate-x-0.5'}`}>
                            {server.name}
                        </span>
                    </button>
                ))}

                {!isAnime && (
                    <button
                        onClick={() => {
                            if (!isAuthenticated) {
                                toast.error('Please login to download');
                                return;
                            }
                            setIsDownloadPopupOpen(true)
                        }}
                        className="
                            relative group flex items-center justify-center gap-3 px-6 py-2 rounded-[25px]
                            text-sm font-semibold uppercase tracking-wider transition-all duration-300
                            min-w-[100px] overflow-hidden border-2
                            bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-transparent text-white/90
                            hover:border-[#e94560] hover:-translate-y-0.5 hover:shadow-[0_8_25px_rgba(0,0,0,0.4)]
                        "
                    >
                        {/* Hover Gradient Overlay */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>

                        <FaDownload className="text-xs transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="transition-transform duration-300 text-xs group-hover:translate-x-0.5">
                            Download
                        </span>
                    </button>
                )}

                {isAdmin && (
                    <button
                        onClick={handleAddRecommendation}
                        className="
                            relative group flex items-center justify-center gap-3 px-6 py-2 rounded-[25px] 
                            text-sm font-semibold uppercase tracking-wider transition-all duration-300
                            min-w-[100px] overflow-hidden border-2
                            bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-transparent text-white/90 
                            hover:border-[#e94560] hover:-translate-y-0.5 hover:shadow-[0_8_25px_rgba(0,0,0,0.4)]
                        "
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
                        <FaStar className="text-xs transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 text-yellow-500" />
                        <span className="transition-transform duration-300 text-xs group-hover:translate-x-0.5">
                            Add Rec
                        </span>
                    </button>
                )}
            </div>

            <DownloadPopupV2
                isOpen={isDownloadPopupOpen}
                onClose={() => setIsDownloadPopupOpen(false)}
                type={state.type}
                id={actualId}
                season={state.selectedSeason}
                episode={state.selectedEpisode}
                backdropUrl={state.data?.backdrop_path ? `https://image.tmdb.org/t/p/original${state.data.backdrop_path}` : ''}
                logoUrl={state.titleLogo}
            />
        </div>
    );
};

export default ServerButtonsSection;
