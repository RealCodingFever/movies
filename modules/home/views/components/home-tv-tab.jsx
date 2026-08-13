"use client";

import { useState } from "react";
import DataSection from "./data-section";
import {
    getTrending,
    getRecentTVShows,
    getTopTVShows,
    discoverContent
} from "@/utils/actions";
import ViewMoreButton from "./view-more-button";

const TV_GENRES_LIST = [
    {
        title: "Action & Adventure",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10759, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "action-adventure"
    },
    {
        title: "Animation",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 16, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "animation"
    },
    {
        title: "Comedy",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 35, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "comedy"
    },
    {
        title: "Crime",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 80, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "crime"
    },
    {
        title: "Documentary",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 99, sort_by: 'popularity.desc' },
        id: "documentary"
    },
    {
        title: "Drama",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 18, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "drama"
    },
    {
        title: "Family",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10751, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "family"
    },
    {
        title: "Kids",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10762, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "kids"
    },
    {
        title: "Mystery",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 9648, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "mystery"
    },
    {
        title: "Reality",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10764, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "reality"
    },
    {
        title: "Sci-Fi & Fantasy",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10765, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "scifi-fantasy"
    },
    {
        title: "Soap",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10766, sort_by: 'popularity.desc' },
        id: "soap"
    },
    {
        title: "Talk",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10767, sort_by: 'popularity.desc' },
        id: "talk"
    },
    {
        title: "War & Politics",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 10768, sort_by: 'popularity.desc' },
        id: "war-politics"
    },
    {
        title: "Western",
        fetchFunction: (params) => discoverContent('tv', params),
        fetchParams: { with_genres: 37, sort_by: 'popularity.desc' },
        id: "western"
    }
];

const HomeTvTab = ({ initialData }) => {
    const [visibleGenres, setVisibleGenres] = useState(0);

    const handleShowMore = () => {
        setVisibleGenres(prev => prev + 3);
    };

    return (
        <div className="w-full pb-20">
            <DataSection
                title="Trending TV Shows"
                fetchFunction={getTrending}
                fetchParams="tv"
                isLarge={true}
                id="trending-tv"
                initialData={initialData?.trendingTv}
            />

            <DataSection
                title="Latest TV Shows"
                fetchFunction={getRecentTVShows}
                id="latest-tv"
                initialData={initialData?.latestTv}
            />

            <DataSection
                title="Top Rated TV Shows"
                fetchFunction={getTopTVShows}
                id="top-tv"
                initialData={initialData?.topRatedTv}
            />

            {TV_GENRES_LIST.slice(0, visibleGenres).map((genre) => (
                <DataSection
                    key={genre.id}
                    title={genre.title}
                    fetchFunction={genre.fetchFunction}
                    fetchParams={genre.fetchParams}
                    id={genre.id}
                />
            ))}

            {/* Show More Button */}
            {visibleGenres < TV_GENRES_LIST.length && (
                <ViewMoreButton onClick={handleShowMore} />
            )}
        </div>
    );
};

export default HomeTvTab;
