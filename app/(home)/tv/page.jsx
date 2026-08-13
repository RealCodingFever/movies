import { getTrending, getRecentTVShows, getTopTVShows } from "@/utils/actions";
import HomeTvTab from "@/modules/home/views/components/home-tv-tab";

export const revalidate = 86400;
export const dynamic = "force-static";

export async function generateMetadata() {
    return {
        title: "Watch Free TV Shows Online | AKMovies",
        description: "Stream the latest and trending TV series in HD on AKMovies. Watch your favorite shows online for free without registration.",
        keywords: [
            "watch tv shows online",
            "free tv series",
            "hd tv shows",
            "stream tv series",
            "AKMovies tv",
            "online series"
        ],
        alternates: {
            canonical: "https://www.akmovies.in/tv"
        },
        openGraph: {
            title: "Watch Free TV Shows Online - AKMovies",
            description: "Stream top-rated and trending TV series in HD. No registration required.",
            url: "https://www.akmovies.in/tv",
            siteName: "AKMovies",
            type: "website",
            images: [
                {
                    url: "https://www.akmovies.in/screenshot.png",
                    width: 1200,
                    height: 630,
                    alt: "AKMovies TV Shows"
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: "Watch Free TV Shows Online - AKMovies",
            description: "Stream your favorite TV series in HD for free.",
            images: ["https://www.akmovies.in/screenshot.png"]
        }
    };
}

export default async function HomePage() {
    const [trendingTv, latestTv, topRatedTv] = await Promise.all([
        getTrending("tv", "week"),
        getRecentTVShows(),
        getTopTVShows()
    ]);

    return (
        <main className="animate-fade-in">
            <div className="mt-4 transition-all duration-300 ease-in-out">
                <HomeTvTab
                    initialData={{
                        trendingTv,
                        latestTv,
                        topRatedTv
                    }}
                />
            </div>
        </main>
    );
}
