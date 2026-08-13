"use client";

import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';
import { isBookmarked, addBookmark, removeBookmark } from '@/utils/firestore-functions';

const BookmarkButton = ({ details, type, actualId }) => {
    const { user, isAuthenticated } = useAuth();
    const [bookmarked, setBookmarked] = useState(false);

    // Check bookmark status
    useEffect(() => {
        const checkBookmark = async () => {
            if (isAuthenticated && user?.uid && actualId) {
                const status = await isBookmarked(user.uid, parseInt(actualId), type);
                setBookmarked(status);
            }
        };
        checkBookmark();
    }, [isAuthenticated, user, actualId, type]);

    const handleBookmarkClick = async () => {
        if (!isAuthenticated) {
            toast.error('Please login first to bookmark content');
            return;
        }
        if (!details) return;

        try {
            if (bookmarked) {
                const success = await removeBookmark(user.uid, parseInt(actualId), type);
                if (success) {
                    setBookmarked(false);
                    window.dispatchEvent(new CustomEvent('bookmarkChanged'));
                    toast.success("Removed from bookmarks");
                }
            } else {
                const bookmarkData = {
                    id: parseInt(actualId),
                    title: details.title || details.name,
                    overview: details.overview,
                    posterPath: details.poster_path,
                    backdropPath: details.backdrop_path,
                    mediaType: type,
                    releaseDate: details.release_date || details.first_air_date,
                    voteAverage: details.vote_average
                };
                const success = await addBookmark(user.uid, bookmarkData);
                if (success) {
                    setBookmarked(true);
                    window.dispatchEvent(new CustomEvent('bookmarkChanged'));
                    toast.success('Added to bookmarks');
                }
            }
        } catch (error) {
            console.error('Error handling bookmark:', error);
            toast.error('Failed to bookmark');
        }
    };

    return (
        <button
            className="group relative flex items-center gap-2 px-4 py-2 rounded-[20px] text-[12px] font-bold uppercase tracking-[0.5px] transition-all duration-300 bg-[rgba(255,255,255,0.1)] text-white backdrop-blur-[10px] border border-[rgba(233,69,96,0.4)] hover:bg-[rgba(233,69,96,0.2)] hover:-translate-y-0.5 hover:border-[rgba(233,69,96,0.4)]"
            onClick={handleBookmarkClick}
        >
            {bookmarked ? <FaBookmark className="text-[#e94560]" /> : <FaRegBookmark className="text-[#e94560]" />}
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
    );
};

export default BookmarkButton;