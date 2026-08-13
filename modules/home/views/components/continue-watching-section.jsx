"use client";

import useSWR from "swr";
import { useAuth } from "@/context/auth-context";
import {
    getUserHistory,
    removeFromHistory,
} from "@/utils/firestore-functions";
import MovieSection from "@/components/movie-section";
import { toast } from "react-hot-toast";

const ContinueWatchingSection = () => {
    const { user, isAuthenticated } = useAuth();
    const fetcher = async () => {
        return await getUserHistory(user.uid);
    };
    
    const { data: continueWatching = [], mutate, isLoading } = useSWR(
        isAuthenticated && user?.uid ? ["history", user.uid] : null,
        fetcher,
        {
            dedupingInterval: 600000, // 10 min cache
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );
    
    if (!user) return null;
    const handleRemoveFromHistory = async (item) => {
        if (!isAuthenticated || !user?.uid) return;

        try {
            await removeFromHistory(user.uid, item.id, item.mediaType);

            // Update UI instantly without refetch
            mutate(
                continueWatching.filter(i => i.id !== item.id),
                false
            );

            toast.success("Removed from history");
        } catch (error) {
            console.error("Error removing from history:", error);
            toast.error("Failed to remove");
        }
    };

    if (isLoading) return null;

    return (
        <div className="w-full">
            {continueWatching.length > 0 && (
                <MovieSection
                    title="Continue Watching"
                    items={continueWatching}
                    type="continue"
                    onRemove={handleRemoveFromHistory}
                    maxWidth="2000px"
                />
            )}
        </div>
    );
};

export default ContinueWatchingSection;
