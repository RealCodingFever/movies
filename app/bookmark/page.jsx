'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/topbar';
import VerticalResults from '@/components/vertical-results';
import { useAuth } from '@/context/auth-context';
import { getUserBookmarks, removeBookmark } from '@/utils/firestore-functions';

export default function BookmarkPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (user) {
                setLoading(true);
                try {
                    const data = await getUserBookmarks(user.uid);
                    setBookmarks(data);
                } catch (error) {
                    console.error("Failed to fetch bookmarks", error);
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading) {
                // If auth loaded and no user, stop loading bookmarks
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchBookmarks();
        }
    }, [user, authLoading]);

    const handleRemove = async (item) => {
        if (!user) return;
        const success = await removeBookmark(user.uid, item.id, item.mediaType);
        if (success) {
            setBookmarks((prev) => prev.filter((i) => i.id !== item.id));
            toast.success("Removed from bookmarks");
        }
    };

    if (authLoading) return null; // Or a loading spinner

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Topbar name="My Bookmarks" />
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <h2 className="text-2xl font-bold mb-4">Please log in to view your bookmarks</h2>
                    <p className="text-gray-400">Sign in to access your saved movies and TV shows.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white mb-20">
            <Topbar name="My Bookmarks" />
            <div className="pb-8 main-container">
                <VerticalResults
                    items={bookmarks}
                    loading={loading}
                    emptyMessage="You haven't bookmarked any movies or TV shows yet."
                    gridCols={6}
                    showLoadMore={false}
                    type="bookmarks"
                    onRemove={handleRemove}
                />
            </div>
        </div>
    );
}
