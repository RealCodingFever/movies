export const revalidate = 86400;
export const dynamic = "force-static";

import HomeAnimeTab from "@/modules/home/views/components/home-anime-tab";
import {
  getTrendingThisWeek,
  getTopAiring,
  mapAnilistToCard,
} from "@/utils/anilist-api";

export async function generateMetadata() {
  return {
    title: "Anime - AKMovies | Watch Trending Anime Episodes Online",
    description:
      "Watch trending, top-airing, and recently released anime episodes in HD. Updated daily.",
    keywords: [
      "watch anime online",
      "anime episodes",
      "top airing anime",
      "trending anime",
      "AKMovies anime",
    ],
    alternates: {
      canonical: "https://www.akmovies.in/anime",
    },
    openGraph: {
      title: "AKMovies Anime - Watch Trending Anime Online",
      description: "Stream the latest anime episodes in HD.",
      url: "https://www.akmovies.in/anime",
      siteName: "AKMovies",
      type: "website",
    },
  };
}

const AnimePage = async () => {
  // SSR-seed the daily-cacheable feeds. "Recently Released Episodes" is
  // intentionally omitted — the client fetches it fresh on every visit.
  const [trendingWeekRes, topAiringRes] = await Promise.all([
    getTrendingThisWeek(1, 24),
    getTopAiring(1, 24),
  ]);

  const initialData = {
    trendingWeek: trendingWeekRes.results.map(mapAnilistToCard).filter(Boolean),
    topAiring: topAiringRes.results.map(mapAnilistToCard).filter(Boolean),
  };

  return (
    <main className="animate-fade-in">
      <div className="mt-4 transition-all duration-300 ease-in-out">
        <HomeAnimeTab initialData={initialData} />
      </div>
    </main>
  );
};

export default AnimePage;
