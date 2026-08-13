"use client";

import { useEffect, useState } from 'react';
import { useWatch } from '../../provider/watch.provider';

const ImdbRating = ({ type, id }) => {
    const { state } = useWatch();
    const { imdbId } = state;
    const [imdbRating, setImdbRating] = useState(null);

    useEffect(() => {
        const fetchRating = async () => {
            if (!imdbId) return;
            try {
                const response = await fetch(`https://api.imdbapi.dev/titles/${imdbId}`);
                const data = await response.json();
                const rating = data?.rating?.aggregateRating || data?.rating;
                if (rating) {
                    setImdbRating(rating);
                }
            } catch (error) {
                console.error('Failed to fetch IMDB rating:', error);
            }
        };
        fetchRating();
    }, [imdbId]);

    if (!imdbRating) return null;

    return (
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r  shadow-md hover:scale-105 transition-all duration-200">
            <span className="bg-[#f5c518] text-black font-bold text-[11px] px-2 py-[2px] rounded tracking-tight">
                IMDb
            </span>
            <span className="text-white font-semibold text-xs">
                {Number(imdbRating).toFixed(1)}
            </span>
        </div>
    );
};

export default ImdbRating;
