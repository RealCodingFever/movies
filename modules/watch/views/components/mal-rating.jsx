"use client";

import { useEffect, useState } from 'react';
import { useWatch } from '../../provider/watch.provider';

const MalRating = ({ type }) => {
    const { state } = useWatch();
    const { data } = state;
    const malId = data?._animeMappings?.mal_id;
    const [malRating, setMalRating] = useState(null);

    useEffect(() => {
        const fetchRating = async () => {
            if (type !== 'anime' || !malId) return;
            try {
                // Using Jikan API (free, no auth required) instead of official MAL API which requires X-MAL-CLIENT-ID
                const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
                const resData = await response.json();
                const rating = resData?.data?.score;
                if (rating) {
                    setMalRating(rating);
                }
            } catch (error) {
                console.error('Failed to fetch MAL rating:', error);
            }
        };
        fetchRating();
    }, [malId, type]);

    if (!malRating) return null;

    return (
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r shadow-md hover:scale-105 transition-all duration-200">
            <span className="bg-[#2e51a2] text-white font-bold text-[11px] px-2 py-[2px] rounded tracking-tight">
                MAL
            </span>
            <span className="text-white font-semibold text-xs">
                {Number(malRating).toFixed(2)}
            </span>
        </div>
    );
};

export default MalRating;
