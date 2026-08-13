// Shows a rotating "Genie is thinking..." while awaiting AI response.
"use client";

import { useEffect, useState } from "react";

const THINKING_MESSAGES = [
  "Genie is thinking...",
  "Consulting the design vault...",
  "Granting your wish...",
  "Gathering the best matches...",
  "Polishing the lamp...",
  "Scanning the cinematic universe...",
  "Pulling reels from the archive...",
  "Reading between the credits...",
  "Tuning into your taste...",
  "Summoning the perfect pick...",
];

const pickNext = (current) => {
  if (THINKING_MESSAGES.length < 2) return 0;
  let next = Math.floor(Math.random() * THINKING_MESSAGES.length);
  if (next === current) next = (next + 1) % THINKING_MESSAGES.length;
  return next;
};

export function TypingIndicator() {
  const [msgIndex, setMsgIndex] = useState(() =>
    Math.floor(Math.random() * THINKING_MESSAGES.length)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => pickNext(prev));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex w-full akg-fade-in justify-start mb-2 items-center">
      <div className="mr-3 flex-shrink-0">
        <div className="relative h-8 w-8 flex items-center justify-center rounded-full bg-white/5 shadow-sm p-1.5">
          <div className="absolute inset-0 rounded-full border-[2px] border-white/10 border-t-[#ea4c89] border-r-[#c2346e] animate-spin" />
          <img src="/genie-white.png" className="h-full w-full object-contain" alt="Genie" />
        </div>
      </div>
      <div className="flex flex-1 items-center">
        <span
          key={msgIndex}
          className="text-[14px] text-gray-400 font-medium akg-fade-in transition-all tracking-wide"
        >
          {THINKING_MESSAGES[msgIndex]}
        </span>
      </div>
    </div>
  );
}
