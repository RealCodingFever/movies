'use client';

import { useState, useEffect } from 'react';

// --- SVG Icons ---

const CloseIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SpinnerIcon = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin text-[#e64460] text-[2.5rem]"
    >
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
);

const ErrorIcon = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export default function DownloadPopupV2({
    isOpen,
    onClose,
    type,
    id,
    season,
    episode,
    backdropUrl,
    logoUrl
}) {
    const [activeSource, setActiveSource] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [source3Data, setSource3Data] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setActiveSource(1);
            setIsLoading(false);
            setError(null);
            setSource3Data(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            if (activeSource === 1 || activeSource === 2) {
                setIsLoading(false);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            setSource3Data(null);

            try {
                let url = '';
                if (activeSource === 3) {
                    url = `https://movie-site-scrapers.boom10052006.workers.dev/api/tmdb/${type}?id=${id}&scrapers=movies4u&token=22be7e61-277f-4a06-836b-09507a89d7a5`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch download links.');
                }
                const data = await response.json();
                const scrapers = data.scrapers || {};

                if (activeSource === 3) {
                    const movies4u = scrapers.movies4u;
                    const links =
                        movies4u &&
                            movies4u.status === 'found' &&
                            Array.isArray(movies4u.data) &&
                            movies4u.data.length > 0 &&
                            Array.isArray(movies4u.data[0].downloadLinks)
                            ? movies4u.data[0].downloadLinks
                            : [];

                    if (links.length > 0) {
                        setSource3Data({ downloadLink: null, subtitleLink: null, links });
                    } else {
                        setError('No download links found.');
                    }
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'An error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeSource, id, type, season, episode, isOpen]);

    const getIframeUrl = () => {
        if (type === 'tv') {
            return `https://dl.vidsrc.vip/${type}/${id}/${season}/${episode}`;
        }
        return `https://dl.vidsrc.vip/${type}/${id}`;
    };

    const getSource2IframeUrl = () => {
        if (type === 'tv') {
            return `https://02moviedownloader.site/api/download/tv/${id}/${season}/${episode}`;
        }
        return `https://02moviedownloader.site/api/download/movie/${id}`;
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center grow min-h-[200px] text-[#aaa]">
                    <SpinnerIcon />
                    <p className="mt-2">Loading, please wait...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center grow min-h-[200px] text-[#aaa]">
                    <div className="text-[2.5rem] text-[#e64460] mb-2">
                        <ErrorIcon />
                    </div>
                    <p>{error}</p>
                </div>
            );
        }

        switch (activeSource) {
            case 1:
                return (
                    <div className="grow w-full min-h-[250px] rounded-lg overflow-hidden relative">
                        <iframe
                            src={getIframeUrl()}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            title="Download Source 1"
                        ></iframe>
                    </div>
                );
            case 2:
                return (
                    <div className="grow w-full min-h-[250px] rounded-lg overflow-hidden relative">
                        <iframe
                            src={getSource2IframeUrl()}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            title="Download Source 2"
                        ></iframe>
                    </div>
                );
            case 3:
                if (!source3Data || !Array.isArray(source3Data.links)) return null;
                return (
                    <div className="w-full max-h-[250px] overflow-y-auto flex flex-col gap-2 pr-1.5 custom-scrollbar">
                        {source3Data.links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-[#2a2a2a] text-[#eee] no-underline px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-[#444] hover:bg-[#e64460] hover:text-white hover:border-[#e64460] hover:translate-x-[5px]"
                            >
                                {link.label || `Download Link ${index + 1}`}
                            </a>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <style jsx>{`
                @keyframes popup-fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popup-slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #222;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e64460;
                }
            `}</style>

            <div
                className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] backdrop-blur-[5px] animate-[popup-fadeIn_0.3s_ease]"
                onClick={onClose}
            >
                <div
                    className="bg-[#1a1a1a] text-white rounded-xl w-[90%] max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden border border-[#333] animate-[popup-slideUp_0.4s_ease_forwards]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-3 right-3 bg-black/60 border-0 text-white w-[30px] h-[30px] rounded-full cursor-pointer flex items-center justify-center z-10 transition-colors duration-200 hover:bg-[#e64460]"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>

                    <div className="relative w-full h-[150px] flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{ backgroundImage: `url(${backdropUrl})` }}
                        ></div>
                        <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                        {logoUrl && (
                            <img src={logoUrl} alt="Logo" className="max-w-[250px] max-h-[100px] w-auto h-auto z-[5] object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
                        )}
                    </div>

                    <div className="flex p-4 gap-2.5 justify-center">
                        <button
                            className={`bg-[#333] border-0 text-[#eee] px-[15px] py-[10px] rounded-lg cursor-pointer font-semibold text-[0.9rem] transition-all duration-200 hover:bg-[#444] ${activeSource === 1 ? 'bg-[#e64460] text-white shadow-[0_0_15px_rgba(230,68,96,0.5)] hover:bg-[#e64460]' : ''}`}
                            onClick={() => setActiveSource(1)}
                        >
                            Source 1
                        </button>
                        <button
                            className={`bg-[#333] border-0 text-[#eee] px-[15px] py-[10px] rounded-lg cursor-pointer font-semibold text-[0.9rem] transition-all duration-200 hover:bg-[#444] ${activeSource === 2 ? 'bg-[#e64460] text-white shadow-[0_0_15px_rgba(230,68,96,0.5)] hover:bg-[#e64460]' : ''}`}
                            onClick={() => setActiveSource(2)}
                        >
                            Source 2
                        </button>
                        <button
                            className={`bg-[#333] border-0 text-[#eee] px-[15px] py-[10px] rounded-lg cursor-pointer font-semibold text-[0.9rem] transition-all duration-200 hover:bg-[#444] ${activeSource === 3 ? 'bg-[#e64460] text-white shadow-[0_0_15px_rgba(230,68,96,0.5)] hover:bg-[#e64460]' : ''}`}
                            onClick={() => setActiveSource(3)}
                        >
                            Source 3
                        </button>
                    </div>

                    <div className="p-4 min-h-[250px] flex flex-col">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}
