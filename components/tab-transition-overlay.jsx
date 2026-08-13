"use client";

import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

// One theme per tab. Same structure as the anime overlay (rings + glyph +
// petals + caption); only the palette and wordmark change.
const THEMES = {
    anime: {
        glyph: "アニメ",
        caption: "Switching to Anime",
        bg: "radial-gradient(circle at 50% 45%, #2a1c47 0%, #170f2b 55%, #0c0818 100%)",
        text: "linear-gradient(180deg, #ff79b0 0%, #d758e8 45%, #a855f7 100%)",
        ring: "rgba(168,85,247,.22)",
        shadow: "drop-shadow(0 0 22px rgba(192,72,224,.55)) drop-shadow(0 0 48px rgba(168,85,247,.35))",
        petal: "linear-gradient(135deg, #ff9ec7, #ff6fae)",
        petalShadow: "drop-shadow(0 0 5px rgba(255,120,180,.7))",
        captionColor: "#b8a6dd",
    },
    movie: {
        glyph: "CINEMA",
        caption: "Switching to Movies",
        bg: "radial-gradient(circle at 50% 45%, #3a1116 0%, #1a0709 55%, #100507 100%)",
        text: "linear-gradient(180deg, #ffd57e 0%, #ff7a45 45%, #e94560 100%)",
        ring: "rgba(233,69,96,.25)",
        shadow: "drop-shadow(0 0 22px rgba(233,69,96,.55)) drop-shadow(0 0 48px rgba(255,122,69,.35))",
        petal: "linear-gradient(135deg, #ffd57e, #ff7a45)",
        petalShadow: "drop-shadow(0 0 5px rgba(255,180,90,.7))",
        captionColor: "#e0a89a",
    },
    tv: {
        glyph: "TV SHOWS",
        caption: "Switching to TV",
        bg: "radial-gradient(circle at 50% 45%, #0c2a3a 0%, #061821 55%, #030d12 100%)",
        text: "linear-gradient(180deg, #6fe3ff 0%, #38bdf8 45%, #0ea5e9 100%)",
        ring: "rgba(14,165,233,.25)",
        shadow: "drop-shadow(0 0 22px rgba(14,165,233,.55)) drop-shadow(0 0 48px rgba(56,189,248,.35))",
        petal: "linear-gradient(135deg, #a5f3fc, #38bdf8)",
        petalShadow: "drop-shadow(0 0 5px rgba(56,189,248,.7))",
        captionColor: "#7dd3fc",
    },
    editor: {
        glyph: "EDITOR",
        caption: "Opening Editor",
        bg: "radial-gradient(circle at 50% 45%, #1c3a1f 0%, #0a1d0c 55%, #050f06 100%)",
        text: "linear-gradient(180deg, #d9f99d 0%, #84cc16 45%, #22c55e 100%)",
        ring: "rgba(34,197,94,.22)",
        shadow: "drop-shadow(0 0 22px rgba(34,197,94,.55)) drop-shadow(0 0 48px rgba(132,204,22,.35))",
        petal: "linear-gradient(135deg, #d9f99d, #84cc16)",
        petalShadow: "drop-shadow(0 0 5px rgba(163,230,53,.7))",
        captionColor: "#a3e635",
    },
};

const DURATION_MS = 2000;
const EVENT = "tab-transition";

// Public helper: dispatch from anywhere on the client to play the overlay.
export const playTabTransition = (theme) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { theme } }));
};

const TabTransitionOverlay = () => {
    const [active, setActive] = useState(null); // theme key while playing
    const [nonce, setNonce] = useState(0);       // forces re-mount per play

    useEffect(() => {
        const handler = (e) => {
            const themeKey = e.detail?.theme;
            if (!THEMES[themeKey]) return;
            // flushSync commits the state immediately so the overlay paints
            // before any router.push transition deferral can swallow it.
            flushSync(() => {
                setActive(themeKey);
                setNonce((n) => n + 1);
            });
        };
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, []);

    useEffect(() => {
        if (!active) return;
        const t = setTimeout(() => setActive(null), DURATION_MS);
        return () => clearTimeout(t);
    }, [active, nonce]);

    // Petal positions are random per play so each transition looks fresh.
    const petals = useMemo(
        () =>
            Array.from({ length: 16 }).map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 0.5,
                scale: 0.6 + Math.random() * 0.8,
            })),
        [nonce]
    );

    const theme = active ? THEMES[active] : null;

    if (!theme) return <TabTransitionStyles />;

    return (
        <>
            <TabTransitionStyles />
            <div
                key={nonce}
                className="tt-overlay tt-show"
                style={{ background: theme.bg }}
                aria-hidden="true"
            >
                <span className="tt-ring tt-ring-1" style={{ borderColor: theme.ring }} />
                <span className="tt-ring tt-ring-2" style={{ borderColor: theme.ring }} />

                <div className="tt-stage">
                    <div
                        className="tt-word"
                        style={{
                            backgroundImage: theme.text,
                            filter: theme.shadow,
                        }}
                    >
                        {theme.glyph}
                        <div className="tt-petals">
                            {petals.map((p, i) => (
                                <span
                                    key={i}
                                    className="tt-petal"
                                    style={{
                                        left: `${p.left}%`,
                                        top: `${p.top}%`,
                                        animationDelay: `${p.delay}s`,
                                        transform: `scale(${p.scale})`,
                                        background: theme.petal,
                                        filter: theme.petalShadow,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="tt-caption" style={{ color: theme.captionColor }}>
                        {theme.caption}
                    </div>
                </div>
            </div>
        </>
    );
};

// Global stylesheet — kept once so the `.tt-*` classes always resolve, even
// when the overlay element is conditionally rendered.
const TabTransitionStyles = () => (
    <style jsx global>{`
        .tt-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
        }
        .tt-overlay.tt-show {
            animation: tt-curtain 2000ms ease forwards;
            pointer-events: auto;
        }
        @keyframes tt-curtain {
            0%   { opacity: 0; }
            18%  { opacity: 1; }
            78%  { opacity: 1; }
            100% { opacity: 0; }
        }

        .tt-stage {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: scale(0.9);
            opacity: 0;
        }
        .tt-overlay.tt-show .tt-stage {
            animation: tt-rise 2000ms cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes tt-rise {
            0%   { opacity: 0; transform: scale(.86); }
            22%  { opacity: 1; transform: scale(1); }
            80%  { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.04); }
        }

        .tt-ring {
            position: absolute;
            top: 50%; left: 50%;
            width: 240px; height: 240px;
            border: 1px solid transparent;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        .tt-overlay.tt-show .tt-ring { animation: tt-pulse 2200ms ease-out infinite; }
        .tt-ring-2 { animation-delay: .6s !important; }
        @keyframes tt-pulse {
            0%   { transform: translate(-50%, -50%) scale(.55); opacity: .55; }
            100% { transform: translate(-50%, -50%) scale(1.7); opacity: 0; }
        }

        .tt-word {
            position: relative;
            font-size: clamp(64px, 12vw, 120px);
            font-weight: 800;
            line-height: 1;
            letter-spacing: .04em;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .tt-petals {
            position: absolute;
            inset: -10% -6%;
            pointer-events: none;
        }
        .tt-petal {
            position: absolute;
            width: 9px; height: 9px;
            border-radius: 60% 0 60% 0;
            opacity: 0;
        }
        .tt-overlay.tt-show .tt-petal {
            animation: tt-drift 2000ms ease-in-out forwards;
        }
        @keyframes tt-drift {
            0%   { opacity: 0; transform: translateY(8px) rotate(0deg) scale(.6); }
            25%  { opacity: 1; }
            75%  { opacity: 1; }
            100% { opacity: 0; transform: translateY(-22px) rotate(160deg) scale(1); }
        }

        .tt-caption {
            margin-top: 22px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: .42em;
            text-indent: .42em;
            text-transform: uppercase;
            opacity: .85;
        }
    `}</style>
);

export default TabTransitionOverlay;
