"use client";

import { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { addBookmark, removeBookmark, isBookmarked } from "@/utils/firestore-functions";
import { toast } from "react-hot-toast";

const HeroBookmarkButton = ({ item }) => {
    const { user, isAuthenticated } = useAuth();
    const [isBookmarkedState, setIsBookmarkedState] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const checkStatus = async () => {
            if (!isAuthenticated || !user?.uid) {
                if (mounted) setIsBookmarkedState(false);
                return;
            }

            try {
                const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
                const status = await isBookmarked(user.uid, item.id, mediaType);
                if (mounted) setIsBookmarkedState(status);
            } catch (error) {
                console.error("Error checking bookmark status:", error);
            }
        };

        checkStatus();

        // Listen for global bookmark changes
        const handleBookmarkChange = () => {
            // Optional: could re-check status here if needed, 
            // but simpler to just let the button manage its own state for now 
            // or re-fetch. For now, we rely on local state optimization.
            checkStatus();
        };

        window.addEventListener('bookmarkChanged', handleBookmarkChange);
        return () => {
            mounted = false;
            window.removeEventListener('bookmarkChanged', handleBookmarkChange);
        };
    }, [isAuthenticated, user, item]);

    const handleBookmarkClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login first to bookmark content");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

        try {
            if (isBookmarkedState) {
                const success = await removeBookmark(user.uid, item.id, mediaType);
                if (success) {
                    setIsBookmarkedState(false);
                    window.dispatchEvent(new CustomEvent("bookmarkChanged"));
                    toast.success("Removed from bookmarks");
                }
            } else {
                const bookmarkData = {
                    id: item.id,
                    title: item.title || item.name,
                    overview: item.overview,
                    posterPath: item.poster_path,
                    backdropPath: item.backdrop_path,
                    mediaType: mediaType,
                    releaseDate: item.release_date || item.first_air_date,
                    voteAverage: item.vote_average,
                };

                const success = await addBookmark(user.uid, bookmarkData);
                if (success) {
                    setIsBookmarkedState(true);
                    window.dispatchEvent(new CustomEvent("bookmarkChanged"));
                    toast.success("Added to bookmarks");
                }
            }
        } catch (error) {
            console.error("Error handling bookmark:", error);
            toast.error("Failed to bookmark");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className="relative bg-[rgba(255,255,255,0.1)] text-white border-2 border-[rgba(255,255,255,0.2)] p-3 rounded-full text-[16px] transition-all duration-300 cursor-pointer flex items-center justify-center w-[45px] h-[45px] backdrop-blur-[10px] overflow-visible hover:bg-[rgba(233,69,96,0.2)] hover:border-[rgba(233,69,96,0.4)] hover:-translate-y-0.5 hover:scale-110 hover:shadow-[0_4px_15px_rgba(233,69,96,0.3)] text-[#e94560]"
            onClick={handleBookmarkClick}
            title={isBookmarkedState ? "Remove from bookmarks" : "Add to bookmarks"}
            disabled={isLoading}
        >
            {isBookmarkedState ? <FaBookmark /> : <FaRegBookmark />}
        </button>
    );
};

export default HeroBookmarkButton;
