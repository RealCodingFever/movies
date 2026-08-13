export const getPlayerUrl = ({
    type,
    id,
    imdbId,
    season,
    episode,
    server = '1',
    progress = 0
}) => {
    const actualId = id; // Assuming id passed is already cleaned
    let serverId = server?.toString() || '1';

    // Anime uses its own embed host with a sub/dub track selector.
    if (type === 'anime') {
        const audio = serverId === 'dub' ? 'dub' : 'sub';
        return `https://megaplay.buzz/stream/ani/${actualId}/${episode || 1}/${audio}`;
    }

    // Fallback to server '1' if an old or invalid server id is present
    if (serverId !== '1' && serverId !== '2') {
        serverId = '1';
    }

    if (serverId === '2') {
        if (type === 'movie') {
            return `https://vidnest.fun/movie/${actualId}`;
        } else {
            return `https://vidnest.fun/tv/${actualId}/${season}/${episode}`;
        }
    }

    // Default Server 1 (vidfast)
    const theme = 'e64460';
    if (type === 'movie') {
        return `https://vidfast.pro/movie/${actualId}?theme=${theme}&sub=en&autoplay=true&startat=${progress}`;
    } else {
        return `https://vidfast.pro/tv/${actualId}/${season}/${episode}?nextButton=false&theme=${theme}&sub=en&autoplay=true&startat=${progress}`;
    }
};
