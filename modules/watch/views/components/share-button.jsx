"use client";

import React from 'react';
import { FaShare } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ShareButton = ({ details }) => {
    const handleShare = async () => {
        const currentUrl = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: details?.title || details?.name || 'Check out this content',
                    text: `Watch ${details?.title || details?.name} on akmovies`,
                    url: currentUrl
                });
            } else {
                await navigator.clipboard.writeText(currentUrl);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            try {
                await navigator.clipboard.writeText(currentUrl);
                toast.success('Link copied to clipboard!');
            } catch (e) {
                toast.error('Failed to share');
            }
        }
    };

    return (
        <button
            className="group relative flex items-center gap-2 px-4 py-2 rounded-[20px] text-[12px] font-bold uppercase tracking-[0.5px] transition-all duration-300 bg-[rgba(255,255,255,0.1)] text-white backdrop-blur-[10px] border border-transparent hover:bg-[rgba(255,255,255,0.2)] hover:-translate-y-0.5"
            onClick={handleShare}
        >
            <FaShare /> Share
        </button>
    );
};

export default ShareButton;
