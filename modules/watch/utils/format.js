/**
 * Format description to a max number of words
 */
export const formatDescription = (text, wordLimit = 50) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
};

/**
 * Format runtime (seconds) to "Xhr Ymin"
 */
export const formatRuntime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds <= 0) {
        return '';
    }

    const totalSecondsInt = Math.floor(totalSeconds);
    const hours = Math.floor(totalSecondsInt / 3600);
    const minutes = Math.floor((totalSecondsInt % 3600) / 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}hr`);
    if (minutes > 0) parts.push(`${minutes}min`);

    return parts.join(' ');
};

/**
 * Get content rating based on type and details
 */
export const getContentRating = (type, details) => {
    if (!details) return '';

    if (type === 'movie') {
        return details?.release_dates?.results?.find(r => r.iso_3166_1 === 'US')?.release_dates?.[0]?.certification || 'PG-13';
    } else {
        return details?.content_ratings?.results?.find(r => r.iso_3166_1 === 'US')?.rating || 'TV-14';
    }
};
