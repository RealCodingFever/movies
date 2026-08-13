"use client"

import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/actions';
import { useWatch } from '../../provider/watch.provider';
import TopBannerSkeleton from './skeleton/top-banner-skeleton';


const TopBannerSection = () => {
    const { state } = useWatch();
    const initialData = state.data;

    if (!initialData) return <TopBannerSkeleton />;

    return (
        <div className="w-full h-[35vh] relative">
            {/* Overlay */}
            <div className="absolute bottom-[-10px] left-0 w-full h-100 bg-gradient-to-t from-black to-transparent z-20"></div>

            {/* Backdrop */}
            <Image
                src={getImageUrl(initialData?.backdrop_path, 'original')}
                alt={initialData?.title || initialData?.name || 'Backdrop'}
                fill
                className="object-cover object-center z-10"
                priority
                unoptimized
            />
        </div>
    );
};

export default TopBannerSection;
