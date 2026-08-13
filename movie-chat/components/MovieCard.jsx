// Poster card for a single TMDB movie/TV item. Links to /watch/:type/:id-:slug.
"use client";

import { useState } from "react";

const slugify = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function MovieCard({ media }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const href = `/watch/${media.type}/${media.id}-${slugify(media.title)}`;

  return (
    <a
      href={href}
      rel="noopener noreferrer"
      className="relative flex-shrink-0 w-[130px] h-[200px] rounded-xl overflow-hidden cursor-pointer group block"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative w-full h-full rounded-xl bg-[#1a1a1a] overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 z-10 rounded-xl overflow-hidden bg-neutral-800">
            <div
              className="absolute inset-0 akg-shimmer"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,rgba(20,20,20,0.8) 25%,rgba(45,45,45,0.8) 50%,rgba(20,20,20,0.8) 75%)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        )}

        {media.posterUrl && !imageError && (
          <img
            src={media.posterUrl}
            alt={media.title}
            loading="lazy"
            className={`w-full h-full object-cover rounded-xl transition-all duration-700 ease-in-out group-hover:scale-110 ${
              imageLoading ? "opacity-0 scale-105 blur-xl" : "opacity-100 scale-100 blur-0"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        )}

        {(!media.posterUrl || imageError) && !imageLoading && (
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-white text-3xl font-black uppercase">
            {media.title.charAt(0)}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {media.rating > 0 && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-yellow-400 border border-yellow-400/20">
            ★ {media.rating.toFixed(1)}
          </div>
        )}

        <div className="absolute inset-0 p-2.5 flex flex-col justify-end transition-transform duration-300 group-hover:-translate-y-1.5">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[9px] font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {media.type}
            </span>
            {media.year && <span className="text-[9px] text-gray-400">{media.year}</span>}
          </div>
          <p className="text-[11px] font-semibold text-white leading-tight line-clamp-2">
            {media.title}
          </p>
        </div>
      </div>
    </a>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[118px] h-[176px] rounded-xl overflow-hidden bg-neutral-800">
      <div
        className="w-full h-full akg-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg,rgba(20,20,20,0.8) 25%,rgba(45,45,45,0.8) 50%,rgba(20,20,20,0.8) 75%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
