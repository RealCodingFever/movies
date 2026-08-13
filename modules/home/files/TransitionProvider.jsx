'use client';

import { createContext, useContext, useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimeTransitionOverlay from './AnimeTransitionOverlay';

const TransitionContext = createContext(null);

// Tweak these two if you want the curtain faster/slower
const COVER_MS = 650;   // time before the page actually swaps (curtain must be opaque by now)
const TOTAL_MS = 1700;  // time the overlay stays before fading out to reveal the new page

export function AnimeTransitionProvider({ children }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const navigateWithAnime = useCallback(
    (href) => {
      clearTimers();
      setActive(true);
      // swap the route once the curtain is fully covering the screen
      timers.current.push(setTimeout(() => router.push(href), COVER_MS));
      // fade the curtain back out to reveal the new page
      timers.current.push(setTimeout(() => setActive(false), TOTAL_MS));
    },
    [router]
  );

  const value = useMemo(() => ({ navigateWithAnime }), [navigateWithAnime]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <AnimeTransitionOverlay active={active} />
    </TransitionContext.Provider>
  );
}

export function useAnimeTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error('useAnimeTransition must be used inside <AnimeTransitionProvider>');
  }
  return ctx;
}
