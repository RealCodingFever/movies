// Horizontal scroll rail of MovieCards with fade-in left/right arrow buttons.
"use client";

import { useEffect, useRef, useState } from "react";
import { MovieCard } from "./MovieCard";

export function MovieSlider({ items }) {
  const railRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = () => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 30);
    setCanRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 20);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const id = setTimeout(checkScroll, 80);
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(id);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

  const scroll = (dir) => {
    railRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className="relative w-full mt-2.5 group/slider">
      <div
        ref={railRef}
        className="flex gap-2.5 overflow-x-auto akg-scrollbar-hide rounded-xl"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="w-px flex-shrink-0" />
        {items.map((m) => (
          <MovieCard key={`${m.type}-${m.id}`} media={m} />
        ))}
        <div className="w-px flex-shrink-0" />
      </div>

      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-[#ea4c89] hover:border-[#ea4c89] shadow-lg shadow-black/40 ${
          canLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Chevron dir="left" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-[#ea4c89] hover:border-[#ea4c89] shadow-lg shadow-black/40 ${
          canRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Chevron dir="right" />
      </button>
    </div>
  );
}

function Chevron({ dir }) {
  const points = dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6";
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={points} />
    </svg>
  );
}
