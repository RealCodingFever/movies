"use client";

import MovieSection from "@/components/movie-section";

const HomeTabSkeleton = () => {
    return (
        <div className="w-full pb-20">
            {/* Trending Skeleton (Large) */}
            <MovieSection
                title="Trending Movies"
                isLoading={true}
                isLarge={true}
            />

            {/* Normal Skeletons */}
            <MovieSection
                title="Latest"
                isLoading={true}
            />

            <MovieSection
                title="Top Rated"
                isLoading={true}
            />

            <MovieSection
                title="Popular"
                isLoading={true}
            />
        </div>
    );
};

export default HomeTabSkeleton;
