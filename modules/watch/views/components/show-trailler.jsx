"use client"

import React, { useState } from 'react';
import { FaYoutube } from 'react-icons/fa';

const ShowTrailer = ({ trailerKey }) => {
    const [showTrailer, setShowTrailer] = useState(false);

    return (
        <>
            <button
                className="group relative flex items-center gap-2 px-4 py-2 rounded-[20px] text-[12px] font-bold uppercase tracking-[0.5px] transition-all duration-300 bg-[#e94560] text-white border-none backdrop-blur-[10px] hover:bg-[#cc0000] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(255,0,0,0.3)] disabled:bg-[#666] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setShowTrailer(true)}
                disabled={!trailerKey}
            >
                <FaYoutube className="text-[1rem]" /> {trailerKey ? 'Watch Trailer' : 'No Trailer'}
            </button>

            {showTrailer && trailerKey && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]" onClick={() => setShowTrailer(false)}>
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        <button
                            className="absolute top-4 right-4 text-white hover:text-[#e94560] z-10 p-2 bg-black/50 rounded-full transition-colors"
                            onClick={() => setShowTrailer(false)}
                        >
                            ✕
                        </button>
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            title="Trailer"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShowTrailer;