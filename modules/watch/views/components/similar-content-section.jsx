"use client";

import React from 'react';
import { useWatch } from '../../provider/watch.provider';
import MovieSection from '@/components/movie-section';

import SimilarContentSkeleton from './skeleton/similar-content-skeleton';

const SimilarContentSection = () => {
    const { state } = useWatch();
    const { similarContent } = state;

    if (!similarContent) return <SimilarContentSkeleton />;

    return (
        <div className="lg:pt-3 pt-0">
            <MovieSection
                title="You May Also Like"
                items={similarContent}
                maxWidth='1500px'
            />
        </div>
    );
};

export default SimilarContentSection;
