"use client"

import { useState } from "react";
import { deleteRecommendation } from "@/utils/firestore-functions";
import MovieSection from "@/components/movie-section";
import { useAuth } from "@/context/auth-context";
import { toast } from "react-hot-toast";

const HomeEditorTab = ({ initialData = [] }) => {
    const [recommendations, setRecommendations] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const { user, isAuthenticated, isAdmin } = useAuth();

    const handleRemoveFromRecommendations = async (item) => {
        if (!isAuthenticated || !user?.uid) return;
        if (!isAdmin) {
            toast.error('Only admin can remove recommendations');
            return;
        }
        try {
            await deleteRecommendation(item.id, item.mediaType);
            setRecommendations(prev => prev.filter(rec => rec.id !== item.id));
            toast.success('Removed from recommendations');
        } catch (error) {
            console.error('Error removing from recommendations:', error);
            toast.error('Failed to remove from recommendations');
        }
    };

    const movies = recommendations.filter(item => item.mediaType === 'movie');
    const shows = recommendations.filter(item => item.mediaType === 'tv');

    if (isLoading) {
        return (
            <div className="w-full pb-20">
                <MovieSection title="Editor's Pick - Movies" isLoading={true} />
                <MovieSection title="Editor's Pick - Shows" isLoading={true} />
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="w-full h-full text-white flex justify-center items-center min-h-[200px]">
                <h2 className="text-2xl font-bold opacity-50">No recommendations found</h2>
            </div>
        );
    }

    return (
        <div className="">
            {movies.length > 0 && (
                <MovieSection
                    title="Editor's Pick - Movies"
                    items={movies}
                    type="recommendations"
                    onRemove={isAdmin ? handleRemoveFromRecommendations : undefined}
                    maxWidth="2000px"
                />
            )}

            {shows.length > 0 && (
                <MovieSection
                    title="Editor's Pick - Shows"
                    items={shows}
                    type="recommendations"
                    onRemove={isAdmin ? handleRemoveFromRecommendations : undefined}
                    maxWidth="2000px"
                />
            )}
        </div>
    );
};

export default HomeEditorTab;
