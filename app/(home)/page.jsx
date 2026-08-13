export const revalidate = 86400;
export const dynamic = "force-static";

import { getTrending, getRecentMovies, getTopMovies } from "@/utils/actions";
import HeroSlider from "@/components/hero-slider/HeroSlider.server";
import HomeTabs from "@/modules/home/views/components/home-tabs";
import HomeMovieTab from "@/modules/home/views/components/home-movie-tab";
import ContinueWatchingSection from "@/modules/home/views/components/continue-watching-section";

export async function generateMetadata() {
  return {
    title: "AKMovies - Watch Free Movies & TV Shows Online | HD Streaming",
    description: "Watch free movies, TV shows and international content on AKMovies. HD streaming, fast updates, no registration required.",
    keywords: [
      "free movies online",
      "watch movies online",
      "HD streaming",
      "TV series online",
      "AKMovies"
    ],
    alternates: {
      canonical: "https://www.akmovies.in"
    },
    openGraph: {
      title: "AKMovies - Watch Free Movies Online",
      description: "Stream movies & TV in HD. No registration required.",
      url: "https://www.akmovies.in",
      siteName: "AKMovies",
      type: "website",
      images: [
        {
          url: "https://www.akmovies.in/screenshot.png",
          width: 1200,
          height: 630,
          alt: "AKMovies Streaming"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "AKMovies - Free HD Movie Streaming",
      images: ["https://www.akmovies.in/screenshot.png"]
    }
  };
}

const Home = async () => {
  const [trending, latestMovies, topRatedMovies] = await Promise.all([
    getTrending("movie", "week"),
    getRecentMovies(),
    getTopMovies(),
  ]);

  return (
    <main className="animate-fade-in">
      <div className="mt-4 transition-all duration-300 ease-in-out">
        <HomeMovieTab
          initialData={{
            trending,
            latestMovies,
            topRatedMovies
          }}
        />
      </div>
    </main>
  );
};

export default Home;
