"use client";

import { useState } from "react";
import DataSection from "./data-section";
import ViewMoreButton from "./view-more-button";
import {
    getLatestEpisodes,
    getTrendingThisWeek,
    getTopAiring,
    getAnimeByGenre,
    mapAnilistToCard,
    mapAiringScheduleToCard,
} from "@/utils/anilist-api";

// Adapters for DataSection (single fetchParams arg, returns a card array).
const fetchLatestEpisodes = async () => {
    const { results } = await getLatestEpisodes({ perPage: 50 });
    return results.map(mapAiringScheduleToCard).filter(Boolean);
};

const fetchTrendingThisWeek = async () => {
    const { results } = await getTrendingThisWeek(1, 24);
    return results.map(mapAnilistToCard).filter(Boolean);
};

const fetchTopAiring = async () => {
    const { results } = await getTopAiring(1, 24);
    return results.map(mapAnilistToCard).filter(Boolean);
};

const fetchByGenre = (genre) => async () => {
    const { results } = await getAnimeByGenre(genre, 1, 24);
    return results.map(mapAnilistToCard).filter(Boolean);
};

const ANIME_GENRES_LIST = [
    { title: "Action Anime", id: "anime-action", genre: "Action" },
    { title: "Adventure Anime", id: "anime-adventure", genre: "Adventure" },
    { title: "Romance Anime", id: "anime-romance", genre: "Romance" },
    { title: "Comedy Anime", id: "anime-comedy", genre: "Comedy" },
    { title: "Fantasy Anime", id: "anime-fantasy", genre: "Fantasy" },
    { title: "Sci-Fi Anime", id: "anime-scifi", genre: "Sci-Fi" },
    { title: "Slice of Life", id: "anime-sol", genre: "Slice of Life" },
    { title: "Mystery Anime", id: "anime-mystery", genre: "Mystery" },
    { title: "Supernatural Anime", id: "anime-supernatural", genre: "Supernatural" },
    { title: "Sports Anime", id: "anime-sports", genre: "Sports" },
    { title: "Mecha Anime", id: "anime-mecha", genre: "Mecha" },
    { title: "Psychological Anime", id: "anime-psychological", genre: "Psychological" },
    { title: "Thriller Anime", id: "anime-thriller", genre: "Thriller" },
    { title: "Music Anime", id: "anime-music", genre: "Music" },
];

const HomeAnimeTab = ({ initialData }) => {
    const [visibleGenres, setVisibleGenres] = useState(0);

    const handleShowMore = () => setVisibleGenres((n) => n + 3);

    return (
        <div className="w-full pb-20">
            <DataSection
                title="Top Trending This Week"
                fetchFunction={fetchTrendingThisWeek}
                isLarge={true}
                id="anime-trending-week"
                initialData={initialData?.trendingWeek}
            />

            {/* Live section: no SSR seed, no SWR cache — fresh every visit. */}
            <DataSection
                title="Recently Released Episodes"
                fetchFunction={fetchLatestEpisodes}
                id="anime-latest-episodes"
                cacheable={false}
            />

            <DataSection
                title="Top Airing"
                fetchFunction={fetchTopAiring}
                id="anime-top-airing"
                initialData={initialData?.topAiring}
            />

            {ANIME_GENRES_LIST.slice(0, visibleGenres).map((g) => (
                <DataSection
                    key={g.id}
                    title={g.title}
                    fetchFunction={fetchByGenre(g.genre)}
                    id={g.id}
                />
            ))}

            {visibleGenres < ANIME_GENRES_LIST.length && (
                <ViewMoreButton onClick={handleShowMore} />
            )}
        </div>
    );
};

export default HomeAnimeTab;
