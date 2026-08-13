"use client";

import { useState } from "react";
import DataSection from "./data-section";
import {
    getTrending,
    getRecentMovies,
    getTopMovies,
    getTopHorror,
    getTopComedy,
    discoverContent
} from "@/utils/actions";
import ViewMoreButton from "./view-more-button";

const GENRES_LIST = [
    { title: "Horror Movies", fetchFunction: getTopHorror, id: "horror" },
    { title: "Comedy Movies", fetchFunction: getTopComedy, id: "comedy" },
    {
        title: "Fantasy Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 14, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "fantasy"
    },
    {
        title: "Action Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 28, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "action"
    },
    {
        title: "Adventure Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 12, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "adventure"
    },
    {
        title: "Sci-Fi Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 878, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "scifi"
    },
    {
        title: "Crime Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 80, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "crime"
    },
    {
        title: "Drama Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 18, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "drama"
    },
    {
        title: "Thriller Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 53, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "thriller"
    },
    {
        title: "War Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 10752, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "war"
    },
    {
        title: "Animation Movies",
        fetchFunction: (params) => discoverContent('movie', params),
        fetchParams: { with_genres: 16, sort_by: 'popularity.desc', 'vote_count.gte': 100 },
        id: "animation"
    }
];

const HomeMovieTab = ({ initialData }) => {
    const [visibleGenres, setVisibleGenres] = useState(0);

    const handleShowMore = () => {
        setVisibleGenres(prev => prev + 3);
    };

    return (
        <div className="w-full pb-20">
            {/* Trending Movies (Large) */}
            <DataSection
                title="Trending Movies"
                fetchFunction={getTrending}
                fetchParams="movie"
                isLarge={true}
                id="trending-movies"
                initialData={initialData?.trending}
            />

            {/* Latest Movies */}
            <DataSection
                title="Latest Movies"
                fetchFunction={getRecentMovies}
                id="latest-movies"
                initialData={initialData?.latestMovies}
            />

            {/* Top Rated Movies */}
            <DataSection
                title="Top Rated Movies"
                fetchFunction={getTopMovies}
                id="top-movies"
                initialData={initialData?.topRatedMovies}
            />

            {/* Genre Sections */}
            {GENRES_LIST.slice(0, visibleGenres).map((genre) => (
                <DataSection
                    key={genre.id}
                    title={genre.title}
                    fetchFunction={genre.fetchFunction}
                    fetchParams={genre.fetchParams}
                    id={genre.id}
                />
            ))}

            {/* Show More Button */}
            {visibleGenres < GENRES_LIST.length && (
                <ViewMoreButton onClick={handleShowMore} />
            )}
        </div>
    );
};

export default HomeMovieTab;
