export const filterValidContent = (items) => {
    if (!items?.length) return [];

    return items.filter((item) => {
        // Check for essential text content (Title/Name + decent Overview)
        const hasText = (item.title || item.name) && (item.overview?.trim().length > 20);

        // Check for essential imagery
        const hasImages = item.poster_path && item.backdrop_path;

        // Check for quality metrics
        const hasStats = (item.vote_count >= 2) && (item.vote_average >= 4.0) && (item.popularity > 0);

        // Check for release info
        const hasDate = item.release_date || item.first_air_date;

        return hasText && hasImages && hasStats && hasDate;
    });
};

// Generate proper ID for Firebase documents
export const generateFirebaseId = (mediaType, tmdbId) => `${mediaType}_${tmdbId}`;

// Ensure unique keys for lists
export const ensureUniqueKeys = (items, prefix = '') => {
    return items.map(item => ({
        ...item,
        uniqueKey: `${prefix}${item.mediaType || item.media_type || (item.title ? 'movie' : 'tv')}_${item.id}`
    }));
};

// Format time until next episode
export function formatTimeUntilNext(seconds) {
    if (!seconds) return '';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

// Format duration
export function formatDuration(minutes) {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}


export const formatReviewContent = (content) => {
    if (!content) return '';
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
        .replace(/^[\s]*[-*][\s]+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, (match) => match.includes('<ul>') ? match : `<ul>${match}</ul>`)
        .replace(/\n/g, '<br>')
        .replace(/(<br>\s*){2,}/g, '</p><p>');

    if (formatted.includes('<br>') || formatted.includes('<li>')) {
        formatted = `<p>${formatted}</p>`;
    }
    return formatted.replace(/<p>\s*<\/p>/g, '').replace(/<p><\/p>/g, '');
};

export const sanitizeHtml = (html) => {
    if (!html) return '';
    const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'b', 'i'];
    let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    return sanitized.replace(tagRegex, (match, tagName) => allowedTags.includes(tagName.toLowerCase()) ? match : '');
};

export const processReviewContent = (content) => sanitizeHtml(formatReviewContent(content));

export const studios = [
    { id: 'netflix', name: 'Netflix', imagePath: '/studio/netflix.png', isStreaming: true },
    { id: 'prime', name: 'Prime Video', imagePath: '/studio/prime.png', isStreaming: true },
    { id: 420, name: 'Marvel Studios', imagePath: '/studio/marvel.png' },
    { id: 2, name: 'Walt Disney Pictures', imagePath: '/studio/disney.png' },
    { id: 7505, name: 'Lionsgate', imagePath: '/studio/lionsgate.png' },
    { id: 521, name: 'DreamWorks Animation', imagePath: '/studio/dreamworks.png' },
    { id: 9993, name: 'DC Studios', imagePath: '/studio/dc.png' },
    { id: 25, name: '20th Century Studios', imagePath: '/studio/20th-century.png' },
    { id: 4, name: 'Paramount', imagePath: '/studio/paramount.png' },
    { id: 3, name: 'Pixar', imagePath: '/studio/pixar.png' },
    { id: 5, name: 'Columbia Pictures', imagePath: '/studio/columbia.png' },
    { id: 33, name: 'Universal Pictures', imagePath: '/studio/universal.png' },
    { id: 174, name: 'Warner Bros. Pictures', imagePath: '/studio/warner-bros.png' },
    { id: 34, name: 'Sony Pictures', imagePath: '/studio/sony.png' },
];