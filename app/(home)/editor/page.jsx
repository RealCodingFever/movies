import { getRecommendations } from "@/utils/firestore-functions";
import HomeEditorTab from "@/modules/home/views/components/home-editor-tab";

export const revalidate = 1209600;
export const dynamic = "force-static";

export async function generateMetadata() {
    return {
        title: "Editor's Picks - Watch Recommended Movies & TV Shows | AKMovies",
        description: "Discover hand-picked movies and TV shows recommended by AKMovies editors. Watch the best content selected just for you.",
        keywords: [
            "editor picks",
            "recommended movies",
            "best tv shows",
            "what to watch",
            "AKMovies recommendations",
            "curated movies"
        ],
        alternates: {
            canonical: "https://www.akmovies.in/editor"
        },
        openGraph: {
            title: "Editor's Picks - AKMovies",
            description: "Discover hand-picked movies and TV shows recommended by our editors.",
            url: "https://www.akmovies.in/editor",
            siteName: "AKMovies",
            type: "website",
            images: [
                {
                    url: "https://www.akmovies.in/screenshot.png",
                    width: 1200,
                    height: 630,
                    alt: "AKMovies Editor's Picks"
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: "Editor's Picks - AKMovies",
            description: "Discover hand-picked movies and TV shows recommended by our editors.",
            images: ["https://www.akmovies.in/screenshot.png"]
        }
    };
}

export default async function EditorPage() {
    const recommendations = await getRecommendations();
    return (
        <main className="animate-fade-in">
            <h1 className="sr-only">Editor's Picks - Watch Free Movies & TV Shows</h1>
            <div className="mt-4 transition-all duration-300 ease-in-out">
                <HomeEditorTab initialData={recommendations} />
            </div>
        </main>
    );
}
