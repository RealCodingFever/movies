// Renders one chat message — user bubble or AI reply with animated reveal + movie slider.
"use client";

import Link from "next/link";
import { MovieSlider } from "./MovieSlider";

const CHAR_DELAY_MS = 10;
const MAX_TOTAL_MS = 1400;
const MD_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

const getDelay = (index, total) => index * Math.min(CHAR_DELAY_MS, MAX_TOTAL_MS / total);

function parseLinks(text) {
  const parts = [];
  let last = 0;
  let m;
  MD_LINK_RE.lastIndex = 0;
  while ((m = MD_LINK_RE.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind: "text", value: text.slice(last, m.index) });
    parts.push({ kind: "link", label: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}

function LinkedText({ text }) {
  const parts = parseLinks(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind !== "link") return <span key={i}>{p.value}</span>;
        const external = /^https?:\/\//i.test(p.href);
        const className = "text-[#ea4c89] hover:underline font-semibold";
        return external ? (
          <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={className}>
            {p.label}
          </a>
        ) : (
          <Link key={i} href={p.href} className={className}>
            {p.label}
          </Link>
        );
      })}
    </>
  );
}

function RevealText({ text, animate }) {
  if (!animate) return <>{text}</>;

  const total = text.length;
  const parts = text.split(/(\s+)/); // Group words and spaces
  let charIndex = 0;

  return (
    <>
      {parts.map((part, pIdx) => {
        if (!part) return null;
        const isSpace = /^\s+$/.test(part);

        if (isSpace) {
          return part.split("").map((s, sIdx) => {
            const idx = charIndex++;
            return (
              <span
                key={`${pIdx}-${sIdx}`}
                className="inline"
                style={{
                  opacity: 0,
                  animation: "akg-reveal-char 0.25s ease-out forwards",
                  animationDelay: `${getDelay(idx, total)}ms`,
                  display: s === "\n" ? "block" : "inline",
                }}
              >
                {s === "\n" ? "" : s}
              </span>
            );
          });
        }

        return (
          <span key={pIdx} className="whitespace-nowrap inline">
            {part.split("").map((char, cIdx) => {
              const idx = charIndex++;
              return (
                <span
                  key={cIdx}
                  className="inline"
                  style={{
                    opacity: 0,
                    animation: "akg-reveal-char 0.25s ease-out forwards",
                    animationDelay: `${getDelay(idx, total)}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

export function MessageBubble({ message, isLatest = false }) {
  const isUser = message.role === "user";
  const hasLinks = !isUser && MD_LINK_RE.test(message.text);
  MD_LINK_RE.lastIndex = 0;
  // Only animate fresh AI messages (within 8s) to avoid replaying on re-mount.
  // Skip the per-char animation for messages with markdown links so anchors render intact.
  const shouldAnimate = isLatest && !isUser && !hasLinks && Date.now() - message.createdAt < 8000;

  return (
    <div className={`flex w-full akg-fade-in ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="pt-2 mr-3 flex-shrink-0">
          <div className="relative h-8 w-8 flex items-center justify-center rounded-full">
            <img src="/genie-white.png" className="h-full w-full object-contain" alt="Genie" />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col ${
          isUser ? "items-end max-w-[82%]" : "items-start flex-1 min-w-0"
        }`}
      >
        <div
          className={
            isUser
              ? "px-5 py-2.5 rounded-3xl rounded-br-sm bg-[#1e1e24] border border-white/5 text-white text-[13px] leading-relaxed shadow-xl shadow-black/20 whitespace-pre-wrap break-words"
              : "py-1.5 text-gray-200 text-[13px] leading-relaxed tracking-wide whitespace-pre-wrap break-words w-full"
          }
        >
          {hasLinks ? (
            <LinkedText text={message.text} />
          ) : (
            <RevealText text={message.text} animate={shouldAnimate} />
          )}
        </div>

        {message.items && message.items.length > 0 && (
          <div className="w-full">
            <MovieSlider items={message.items} />
          </div>
        )}
      </div>
    </div>
  );
}
