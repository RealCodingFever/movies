'use client';

import { useMemo } from 'react';

export default function AnimeTransitionOverlay({ active }) {
  // generate the drifting petal specks once
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
        scale: 0.6 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div
      aria-hidden={!active}
      className={[
        'fixed inset-0 z-[9999] flex items-center justify-center',
        'transition-opacity duration-500 ease-out',
        active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, #2a1c47 0%, #170f2b 55%, #0c0818 100%)',
      }}
    >
      {/* concentric rings */}
      <span
        className={`absolute h-60 w-60 rounded-full border border-purple-500/20 ${
          active ? 'anime-pulse' : ''
        }`}
      />
      <span
        className={`absolute h-60 w-60 rounded-full border border-purple-500/20 ${
          active ? 'anime-pulse' : ''
        }`}
        style={{ animationDelay: '0.6s' }}
      />

      {/* center stage */}
      <div className={`relative flex flex-col items-center ${active ? 'anime-rise' : 'opacity-0'}`}>
        <div className="relative">
          <span
            className="select-none font-extrabold leading-none"
            style={{
              fontSize: 'clamp(64px, 12vw, 120px)',
              letterSpacing: '0.04em',
              backgroundImage:
                'linear-gradient(180deg, #ff79b0 0%, #d758e8 45%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter:
                'drop-shadow(0 0 22px rgba(192,72,224,.55)) drop-shadow(0 0 48px rgba(168,85,247,.35))',
            }}
          >
            アニメ
          </span>

          {/* petal specks over the glyphs */}
          <div className="pointer-events-none absolute -inset-x-2 -inset-y-3">
            {petals.map((p, i) => (
              <span
                key={i}
                className={active ? 'anime-petal' : ''}
                style={{
                  position: 'absolute',
                  left: p.left,
                  top: p.top,
                  width: 9,
                  height: 9,
                  borderRadius: '60% 0 60% 0',
                  background: 'linear-gradient(135deg, #ff9ec7, #ff6fae)',
                  filter: 'drop-shadow(0 0 5px rgba(255,120,180,.7))',
                  opacity: 0,
                  animationDelay: p.delay,
                  ['--s']: p.scale,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="mt-6 text-[13px] font-semibold uppercase text-purple-200/85"
          style={{ letterSpacing: '0.42em', textIndent: '0.42em' }}
        >
          Switching to Anime
        </div>
      </div>
    </div>
  );
}
