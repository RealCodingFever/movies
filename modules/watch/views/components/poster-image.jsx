"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getExternalIds, getImageUrl } from '@/utils/actions';

const PosterImage = ({ type, id, details }) => {
    const [imdbPoster, setImdbPoster] = useState(null);
    const [loading, setLoading] = useState(true);

    const title = details.title || details.name;

    useEffect(() => {
        const fetchPoster = async () => {
            if (!id || !type) {
                setLoading(false);
                return;
            }
            // Anime has no imdb_id and the IMDB API would 404 — render
            // straight from the AniList cover that the adapter already supplied.
            if (type === 'anime') {
                setLoading(false);
                return;
            }
            // Start loading
            setLoading(true);
            try {
                const externalIds = await getExternalIds(type, id);
                const imdbId = externalIds?.imdb_id;

                if (imdbId) {
                    const response = await fetch(`https://api.imdbapi.dev/titles/${imdbId}`);
                    const data = await response.json();
                    if (data?.primaryImage?.url) {
                        setImdbPoster(data.primaryImage.url);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch IMDB poster:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPoster();
    }, [id, type]);

    if (loading) {
        return <div className="w-[17rem] h-[25.5rem] bg-[#1a1a1a] animate-pulse rounded-[10px]" />;
    }

    return (
        <Image
            src={imdbPoster || getImageUrl(details.poster_path, 'w500')}
            alt={title}
            width={272}
            height={408}
            className="w-[17rem] h-[25.5rem] object-cover rounded-[10px]"
            unoptimized
        />
    );
};

export default PosterImage;
