import HeroSlider from "@/components/hero-slider/HeroSlider.server";
import HomeTabs from "@/modules/home/views/components/home-tabs";
import { getTrending } from "@/utils/actions";
import ContinueWatchingSection from "@/modules/home/views/components/continue-watching-section";
import TabTransitionOverlay from "@/components/tab-transition-overlay";

export const revalidate = 86400;

export default async function HomeLayout({ children }) {
  const trending = await getTrending("all", "week");

  return (
    <main className="animate-fade-in">
      <h1 className="sr-only">Watch Free Movies & TV Shows Online</h1>

      <HeroSlider initialData={trending} />
      <HomeTabs />
      <ContinueWatchingSection />

      <div className="mt-4">
        {children}
      </div>

      <TabTransitionOverlay />
    </main>
  );
}
