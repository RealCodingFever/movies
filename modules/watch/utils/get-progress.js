export const handleProgressMessage = (event, { actualId, type, selectedSeason, selectedEpisode }, onProgress) => {
    const allowedOrigins = [
        'https://vidfast.pro',
        'https://vidnest.fun',
        'https://megaplay.buzz'
    ];

    if (!allowedOrigins.includes(event.origin)) return;

    try {
        // Handle vidfast
        if (event.origin === 'https://vidfast.pro') {
            const data = event.data;
            if (data && data.type === 'MEDIA_DATA' && data.data) {
                const keyPrefix = type === 'movie' ? 'm' : 't';
                const dynamicKey = `${keyPrefix}${actualId}`;
                const contentData = data.data[dynamicKey];

                if (contentData && contentData.progress) {
                    const { progress, last_season_watched, last_episode_watched } = contentData;

                    if (typeof progress.watched === 'number' && typeof progress.duration === 'number') {
                        const season = last_season_watched ? parseInt(last_season_watched) : selectedSeason;
                        const episode = last_episode_watched ? parseInt(last_episode_watched) : selectedEpisode;

                        onProgress({
                            progress: Math.round(progress.watched),
                            duration: Math.round(progress.duration),
                            season,
                            episode,
                            itemType: type,
                            itemId: actualId
                        });
                    }
                }
            }
        }

        // Handle vidnest
        else if (event.origin === 'https://vidnest.fun') {
            if (event.data?.type === 'PLAYER_EVENT') {
                const { currentTime, duration } = event.data.data;
                if (typeof currentTime === 'number' && typeof duration === 'number') {
                    onProgress({
                        progress: Math.round(currentTime),
                        duration: Math.round(duration),
                        season: selectedSeason,
                        episode: selectedEpisode,
                        itemType: type,
                        itemId: actualId
                    });
                }
            }
        }

        // Handle megaplay (anime)
        else if (event.origin === 'https://megaplay.buzz') {
            let data = event.data;
            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch (e) { return; }
            }
            if (!data) return;

            let watched = null;
            let total = null;

            if (data.event === 'time' && typeof data.time === 'number' && typeof data.duration === 'number') {
                watched = data.time;
                total = data.duration;
            } else if (data.type === 'watching-log' && typeof data.currentTime === 'number' && typeof data.duration === 'number') {
                watched = data.currentTime;
                total = data.duration;
            } else if (data.event === 'complete' && typeof data.duration === 'number') {
                // Mark as fully watched so resume picks the next episode cleanly.
                watched = data.duration;
                total = data.duration;
            }

            if (watched != null && total != null) {
                onProgress({
                    progress: Math.round(watched),
                    duration: Math.round(total),
                    season: selectedSeason || 1,
                    episode: selectedEpisode || 1,
                    itemType: type,
                    itemId: actualId
                });
            }
        }

    } catch (error) {
        console.error('Error handling progress message:', error);
    }
};