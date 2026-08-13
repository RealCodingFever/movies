"use client";

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { processReviewContent } from '@/utils/reviewFormatter';

const MAX_PREVIEW = 100;

const ReviewCard = ({ review, onReadMore }) => {
    const { author, content, created_at, author_details } = review;
    const avatar = (author_details?.avatar_path?.startsWith('http') ? author_details.avatar_path.replace(/^\//, '') : (author_details?.avatar_path ? `https://image.tmdb.org/t/p/w185${author_details.avatar_path}` : '/avatar_review.png'));
    const rating = author_details?.rating ?? null;
    const date = created_at ? new Date(created_at).toLocaleDateString() : '';
    const isLong = content && content.length > MAX_PREVIEW;
    const preview = isLong ? content.slice(0, MAX_PREVIEW) + '…' : content;

    return (
        <div className="bg-gradient-to-b from-[#121212]/90 to-[#0a0a0a]/90 border border-white/5 rounded-2xl p-4 text-white h-full flex flex-col gap-3 shadow-[0_6px_24px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-1">
                <div className="flex gap-1.5 text-white filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" aria-label={`Rating ${rating ?? 0}/10`}>
                    {Array.from({ length: 5 }).map((_, i) => {
                        const value = (rating ?? 0) / 2;
                        const filled = value >= i + 1;
                        const half = !filled && value > i && value < i + 1;
                        if (filled) return <FaStar key={i} />;
                        if (half) return <FaStarHalfAlt key={i} />;
                        return <FaRegStar key={i} />;
                    })}
                </div>
            </div>
            <div className="text-[#e1e0e0]/90 leading-relaxed text-[0.9rem] [&_strong]:text-white [&_strong]:font-semibold [&_em]:text-white/80 [&_em]:italic [&_ul]:my-2 [&_ul]:pl-4 [&_li]:my-1 [&_li]:list-disc [&_p]:my-2">
                <div dangerouslySetInnerHTML={{ __html: processReviewContent(preview) }} />
                {isLong && (
                    <button className="bg-none border-none text-[#e94560]/70 ml-1.5 cursor-pointer font-bold hover:underline" onClick={() => onReadMore(review)}>Read more</button>
                )}
            </div>
            <div className="flex items-center gap-2.5 mt-auto">
                <img className="w-9 h-9 rounded-full object-cover" src={avatar} alt={author} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/avatar_review.png' }} />
                <div className="flex flex-col">
                    <div className="font-semibold text-base text-white">{author || 'Anonymous'}</div>
                    <div className="text-xs text-white/70">{date}</div>
                </div>
            </div>
        </div>
    );
};

const ReviewSection = ({ reviews }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps', slidesToScroll: 2 });
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [activeReview, setActiveReview] = useState(null);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanPrev(emblaApi.canScrollPrev());
        setCanNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="my-8 mb-3 pt-5">
            <div className="relative w-full max-w-[1300px] mx-auto px-4">
                <div className="overflow-hidden w-full" ref={emblaRef}>
                    <div className="flex gap-6 py-1">
                        {reviews.map((r) => (
                            <div className="flex-[0_0_300px] md:flex-[0_0_320px]" key={r.id}>
                                <ReviewCard review={r} onReadMore={setActiveReview} />
                            </div>
                        ))}
                    </div>
                </div>
                {canPrev && (
                    <button
                        className="absolute top-1/2 -translate-y-1/2 left-[-10px] lg:left-[-20px] bg-black/80 border border-white/10 text-white w-10 h-10 rounded-full text-xl cursor-pointer z-10 transition-all duration-200 backdrop-blur-md hover:-translate-y-1/2 hover:scale-105 hover:bg-[#e94560]/25 hover:border-[#e94560]/50 flex items-center justify-center pb-1"
                        onClick={() => emblaApi && emblaApi.scrollPrev()}
                        aria-label="Previous review"
                    >
                        ‹
                    </button>
                )}
                {canNext && (
                    <button
                        className="absolute top-1/2 -translate-y-1/2 right-[-10px] lg:right-[-20px] bg-black/80 border border-white/10 text-white w-10 h-10 rounded-full text-xl cursor-pointer z-10 transition-all duration-200 backdrop-blur-md hover:-translate-y-1/2 hover:scale-105 hover:bg-[#e94560]/25 hover:border-[#e94560]/50 flex items-center justify-center pb-1"
                        onClick={() => emblaApi && emblaApi.scrollNext()}
                        aria-label="Next review"
                    >
                        ›
                    </button>
                )}
            </div>

            {activeReview && (
                <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-[1000] animate-[fadeIn_0.2s_ease]" onClick={() => setActiveReview(null)}>
                    <style jsx>{`
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes popIn { from { transform: translateY(8px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                    `}</style>
                    <div className="bg-gradient-to-b from-[#101010]/98 to-[#0a0a0a]/98 border border-white/10 rounded-[18px] max-w-[800px] w-[92%] max-h-[80vh] overflow-auto text-white shadow-[0_10px_34px_rgba(0,0,0,0.6)] animate-[popIn_0.22s_ease]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-white/10">
                            <div className="text-white flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const value = (activeReview.author_details?.rating ?? 0) / 2;
                                    const filled = value >= i + 1;
                                    const half = !filled && value > i && value < i + 1;
                                    if (filled) return <FaStar key={i} />;
                                    if (half) return <FaStarHalfAlt key={i} />;
                                    return <FaRegStar key={i} />;
                                })}
                            </div>
                            <button className="bg-none border-none text-white text-2xl cursor-pointer hover:text-[#e94560] transition-colors" onClick={() => setActiveReview(null)}>×</button>
                        </div>
                        <div className="p-4 leading-[1.6] text-[#c5c5c5] [&_strong]:text-white [&_strong]:font-semibold [&_em]:text-white/80 [&_em]:italic [&_ul]:my-3 [&_ul]:pl-5 [&_li]:my-1.5 [&_li]:list-disc [&_p]:my-3">
                            <div dangerouslySetInnerHTML={{ __html: processReviewContent(activeReview.content) }} />
                        </div>
                        <div className="flex items-center gap-2.5 p-4 border-t border-white/10">
                            <img className="w-9 h-9 rounded-full object-cover" src={(activeReview.author_details?.avatar_path?.startsWith('http') ? activeReview.author_details.avatar_path.replace(/^\//, '') : (activeReview.author_details?.avatar_path ? `https://image.tmdb.org/t/p/w185${activeReview.author_details.avatar_path}` : '/avatar_review.png'))} alt={activeReview.author} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/avatar_review.png' }} />
                            <div className="flex flex-col">
                                <div className="font-semibold text-base text-white">{activeReview.author || 'Anonymous'}</div>
                                <div className="text-xs text-white/70">{activeReview.created_at ? new Date(activeReview.created_at).toLocaleDateString() : ''}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ReviewSection;
