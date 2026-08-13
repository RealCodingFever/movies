// Derive a compact page-context payload from the current URL.
// Sent to the AI alongside the query so it knows where the user is.
"use client";

const titleFromSlug = (slug) =>
  slug
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function getPageContext() {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname || "/";

  const watch = path.match(/^\/watch\/(movie|tv)\/(\d+)(?:-([^/?#]+))?/);
  if (watch) {
    const [, mediaType, , slug] = watch;
    const title = slug ? titleFromSlug(slug) : null;
    return title ? { name: "watch", mediaType, title } : { name: "watch", mediaType };
  }

  if (path === "/" || path === "") return { name: "home" };
  if (/^\/tv(\/|$)/.test(path)) return { name: "tv" };
  if (/^\/editor(\/|$)/.test(path)) return { name: "editor" };
  if (/^\/search(\/|$)/.test(path)) return { name: "search" };
  if (/^\/bookmark(\/|$)/.test(path)) return { name: "bookmark" };
  if (/^\/dmca(\/|$)/.test(path)) return { name: "dmca" };
  if (/^\/privacy(\/|$)/.test(path)) return { name: "privacy" };
  if (/^\/terms(\/|$)/.test(path)) return { name: "terms" };

  return { name: "other" };
}
