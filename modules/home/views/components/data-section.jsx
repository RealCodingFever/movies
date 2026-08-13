"use client";

import useSWR from "swr";
import MovieSection from "@/components/movie-section";

const DataSection = ({
    fetchFunction,
    fetchParams = {},
    title,
    isLarge = false,
    type = "normal",
    id,
    initialData,
    // Set false for live sections (e.g. "Recently Released") so each mount
    // refetches instead of reusing the 24h SWR cache.
    cacheable = true,
}) => {

    const fetcher = async () => {
        const result = await fetchFunction(fetchParams);
        return Array.isArray(result) ? result : (result.results || []);
    };

    const { data, isLoading } = useSWR(
        // SWR key — prevents duplicate calls
        initialData ? null : [title, fetchParams],
        fetcher,
        {
            fallbackData: initialData || [],
            dedupingInterval: cacheable ? 86400000 : 0,
            revalidateOnFocus: !cacheable,
            revalidateOnReconnect: !cacheable,
        }
    );

    return (
        <div className="w-full">
            <MovieSection
                title={title}
                items={data || []}
                isLarge={isLarge}
                type={type}
                isLoading={isLoading}
                maxWidth="2000px"
            />
        </div>
    );
};

export default DataSection;
