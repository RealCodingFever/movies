import { getCachedDetails, getImageUrl } from '@/utils/actions';

export async function generateMetadata(props) {
    try {
        const params = await props.params;
        const { type, id } = params;
        const actualId = id.split('-')[0];

        const details = await getCachedDetails(type, actualId);

        const title = details.title || details.name || 'Unknown Title';
        const year =
            details.release_date?.split('-')[0] ||
            details.first_air_date?.split('-')[0] ||
            '';

        const posterPath = details.poster_path;
        const backdropPath = details.backdrop_path;
        const posterUrl = posterPath
            ? getImageUrl(posterPath, 'w780')
            : '/placeholder-movie.jpg';

        const backdropUrl = backdropPath
            ? getImageUrl(backdropPath, 'w1280')
            : posterUrl;

        const typeDisplay = type === 'movie' ? 'Movie' : type === 'anime' ? 'Anime' : 'TV Show';
        const stringTitle = year
            ? `Watch ${title} (${year}) Full ${typeDisplay} Online in HD | AKMovies`
            : `Watch ${title} Full ${typeDisplay} Online in HD | AKMovies`;

        const description = details.overview
            ? details.overview.slice(0, 155).replace(/\s+\S*$/, '') + '...'
            : `Watch ${title} Full ${typeDisplay} Online in HD on AKMovies. Stream ${typeDisplay} for free.`;

        const genreKeywords =
            details.genres?.map((g) => g.name).join(', ') || '';

        return {
            metadataBase: new URL('https://www.akmovies.in'),

            title: stringTitle,
            description: description,

            keywords: [
                title,
                `${title} watch online`,
                `${title} streaming`,
                `${title} full movie`,
                `${title} free streaming`,
                genreKeywords,
            ],

            alternates: {
                canonical: `https://www.akmovies.in/watch/${type}/${id}`,
            },

            robots: {
                index: true,
                follow: true,
            },

            openGraph: {
                title: stringTitle,
                description: description,
                url: `https://www.akmovies.in/watch/${type}/${id}`,
                siteName: 'AKMovies',
                images: [
                    {
                        url: backdropUrl,
                        width: 1280,
                        height: 720,
                        alt: title,
                    },
                    {
                        url: posterUrl,
                        width: 780,
                        height: 1170,
                        alt: title,
                    },
                ],
                type: type === 'movie' ? 'video.movie' : 'video.tv_show',
                locale: 'en_US',
            },

            twitter: {
                card: 'summary_large_image',
                title: stringTitle,
                description: description,
                images: [backdropUrl],
            },

            category: 'entertainment',
        };
    } catch (error) {
        console.error('Error generating metadata:', error);

        return {
            title: 'Content Not Found | AKMovies',
            description: 'The requested content could not be found.',
            robots: {
                index: false,
                follow: false,
            },
        };
    }
}

export default function WatchLayout({ children }) {
    return children;
}
