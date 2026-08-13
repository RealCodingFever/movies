export const revalidate = 86400;

import { getTrending } from "@/utils/actions";

export default async function sitemap() {
  const baseUrl = "https://www.akmovies.in";

  const staticRoutes = ["", "/movies", "/tv"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  let dynamicRoutes = [];

  try {
    const trending = (await getTrending("all", "week")).slice(0, 100);

    dynamicRoutes = trending.map((item) => {
      const rawTitle = item.title || item.name || "content";
      const slug = rawTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const mediaType =
        item.media_type || (item.title ? "movie" : "tv");

      return {
        url: `${baseUrl}/watch/${mediaType}/${item.id}-${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      };
    });
  } catch (err) {
    console.error("Error generating sitemap:", err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}