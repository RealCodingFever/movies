// Floating akgenie chat widget — auth gate, usage limit, FAB, overlay, panel.
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Maximize, Minimize, X, RotateCcw, Send, LogIn, Clock } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useChat } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

const SUGGESTIONS = [
  "🍿 Feel-good movies",
  "🤯 Sci-fi like Inception",
  "🎭 Oscar winners",
  "📺 Binge-worthy K-dramas",
  "🦸‍♂️ Marvel movie marathon",
  "👻 Scary horror movies",
  "⚔️ Epic fantasy series",
  "🕵️ Murder mysteries",
  "🤣 Stand-up comedy",
  "👽 Alien invasion docs",
];

const TOOLTIP_PHRASES = [
  "Dont know what to Watch?",
  "Bored of the same shows?",
  "Need a movie recommendation?",
  "Want to find something new?",
  "Can't decide what to stream?",
  "Looking for a hidden gem?",
  "In the mood for a thriller?",
  "Want to see Oscar winners?",
  "Ready for a movie marathon?",
  "Ask me for a movie wish!",
  "Planning a movie night?",
  "Searching for anime hits?",
  "Want to laugh out loud?",
  "Craving some action?",
  "Discover cult classics!",
  "Top-rated series inside.",
  "Find your next obsession.",
  "Magical picks just for you.",
  "Movies for every mood!",
  "Your AI movie companion.",
];

const PANEL_BG =
  "radial-gradient(circle at 10% 45%, rgba(34, 197, 94, 0.08), transparent 45%), radial-gradient(circle at 65% 15%, rgba(168, 85, 247, 0.08), transparent 45%), radial-gradient(circle at 80% 90%, rgba(59, 130, 246, 0.08), transparent 45%), #0d0d12";

const DAILY_LIMIT = Number(process.env.NEXT_PUBLIC_MOVIE_CHAT_DAILY_LIMIT) || 25;

// ms until next local midnight (when daily credit resets)
const msUntilMidnight = () => {
  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next.getTime() - now.getTime();
};

const formatCountdown = (ms) => {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export function ChatWidget({ workerUrl, tmdbToken, turnstileSiteKey, initialOpen = false }) {
  const { user, login } = useAuth();

  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState("");
  const [countdown, setCountdown] = useState(msUntilMidnight());
  const [tooltipIdx, setTooltipIdx] = useState(0);
  const [isPuffing, setIsPuffing] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    isTyping,
    error,
    isOnline,
    remaining,
    limitReached,
    checkStatus,
    send,
    clear,
  } = useChat({
    user,
    workerUrl,
    tmdbToken,
    turnstileSiteKey,
    dailyLimit: DAILY_LIMIT,
  });

  const closeChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 400);
  };

  useEffect(() => {
    if (isOpen && user) checkStatus().catch(() => {});
  }, [isOpen, user, checkStatus]);

  useLayoutEffect(() => {
    if (!scrollRef.current || !isOpen) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen && user) setTimeout(() => inputRef.current?.focus(), 320);
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Tick the "resets in" countdown while the panel is visible + limit hit
  useEffect(() => {
    if (!isOpen || !limitReached) return;
    setCountdown(msUntilMidnight());
    const id = setInterval(() => setCountdown(msUntilMidnight()), 60 * 1000);
    return () => clearInterval(id);
  }, [isOpen, limitReached]);

  // Rotate tooltip phrases every 10s with a "puff" animation
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setIsPuffing(true);
      setTimeout(() => {
        setTooltipIdx((prev) => (prev + 1) % TOOLTIP_PHRASES.length);
        setIsPuffing(false);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping || limitReached) return;
    setInput("");
    await send(text);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3 pointer-events-none">
        {/* Tooltip text bubble */}
        <div 
          className="bg-black/50 backdrop-blur-xl text-white px-4 py-3 shadow-2xl pointer-events-auto bg-gradient-to-br from-black/60 to-black/30 border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden"
          style={{
            borderRadius: "calc(var(--radius-base) * var(--brm))",
            borderBottomRightRadius: "4px",
            cornerShape: "squircle",
          }}
        >
          <p className={`text-[13px] font-medium leading-snug text-gray-200 transition-all duration-500 ${isPuffing ? 'opacity-0 -translate-y-2 blur-sm scale-95' : 'opacity-100 translate-y-0 blur-0 scale-100'}`}>
            {TOOLTIP_PHRASES[tooltipIdx]} <br />
            <span className="text-[#ea4c89] font-bold tracking-wide">Ask akgenie</span>
          </p>
        </div>

        {/* Floating Action Button */}
        <button
          type="button"
          aria-label="Open akgenie"
          onClick={() => setIsOpen(true)}
          className="h-18 w-16 bg-black/60 backdrop-blur-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto relative shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/5 group"
          style={{
            borderRadius: "calc(var(--radius-base) * var(--brm))",
            cornerShape: "squircle",
          }}
        >
          {/* Subtle glow behind the genie */}
          <div 
            className="absolute inset-0 bg-[#ea4c89]/10 blur-xl group-hover:bg-[#ea4c89]/20 transition-all duration-500"
            style={{
              borderRadius: "calc(var(--radius-base) * var(--brm))",
              cornerShape: "squircle",
            }}
          ></div>
          
          <img src="/genie-white.png" className="w-[38px] relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:-translate-y-0.5" alt="Chat" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-500 ${
          isClosing ? "opacity-0" : "akg-overlay-in opacity-100"
        }`}
        onClick={closeChat}
        aria-label="Close Chat"
      />

      <div
        className={`fixed z-[9999] flex flex-col transition-all duration-500 overflow-hidden origin-bottom-right ${
          isClosing ? "akg-slide-down" : "akg-slide-up"
        } ${
          isFullscreen
            ? "bottom-0 right-0 w-[100vw] h-[100dvh]"
            : "bottom-5 right-5 w-[calc(100vw-2rem)] sm:w-[480px] h-[min(800px,calc(100vh-7rem))]"
        }`}
        style={{
          background: PANEL_BG,
          boxShadow:
            "0 20px 60px -10px rgba(0,0,0,0.8), 0 0 40px -15px rgba(234,76,137,0.3)",
          borderRadius: isFullscreen ? "0px" : "calc(var(--radius-base) * var(--brm))",
          cornerShape: isFullscreen ? "none" : "squircle",
        }}
      >
        <div className="w-full max-w-[800px] mx-auto flex flex-col flex-1 h-full overflow-hidden relative">
          {!user ? (
            <div className="flex flex-col items-center justify-center w-full h-full bg-black/10">
              <button type="button" onClick={closeChat} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 z-50">
                <X size={20} />
              </button>
              <LoginGate onLogin={login} />
            </div>
          ) : limitReached ? (
            <div className="flex flex-col items-center justify-center w-full h-full bg-black/10">
              <button type="button" onClick={closeChat} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 z-50">
                <X size={20} />
              </button>
              <LimitReached countdown={countdown} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex-shrink-0 flex flex-row items-center justify-between gap-3 px-5 py-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img src="/genie-white.png" alt="Genie icon" className="w-5 opacity-90 drop-shadow-md" />
                  <img src="/ai-logo.png" alt="akgenie" className="h-[25px] w-auto object-contain mt-0.5" />
                  <div title={isOnline ? "Online" : "Offline"} className="relative flex h-1.5 w-1.5 ml-1">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-green-400" : "bg-red-400"}`} />
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block"></div>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={clear}
                      title="Clear chat"
                      aria-label="Clear chat"
                      className="text-gray-400 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/10"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="text-gray-400 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/10 hidden lg:block"
                      aria-label="Toggle fullscreen"
                    >
                      {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={closeChat}
                      className="text-gray-400 hover:text-white transition-all p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-hidden relative"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                  maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                }}
              >
                <div
                  ref={scrollRef}
                  className="absolute inset-0 overflow-y-auto px-3 py-4 flex flex-col gap-3 akg-scrollbar pb-10 overflow-x-hidden"
                  style={{ background: "transparent" }}
                >
                  {messages.length === 0 && <EmptyState onSuggest={(q) => send(q)} />}

                  {messages.map((m, i) => (
                    <MessageBubble
                      key={m.id}
                      message={m}
                      isLatest={i === messages.length - 1}
                    />
                  ))}

                  {isTyping && <TypingIndicator />}

                  {error && (
                    <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="flex-shrink-0 px-4 pb-5 pt-3">
                <div className="relative mx-auto w-full flex items-end bg-black/20 backdrop-blur-xl rounded-[26px] pl-4 pr-1.5 py-0 justify-center shadow-lg shadow-black/20 transition-all duration-300 ease-in-out border border-white/5">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      disabled={isTyping}
                      placeholder={
                        isTyping ? "akgenie is thinking..." : "Feel free to ask anything..."
                      }
                      rows={1}
                      className="flex-1 bg-transparent resize-none py-2 text-[13px] leading-relaxed text-white placeholder:text-gray-500 outline-none max-h-28 akg-scrollbar self-center disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!input.trim() || isTyping}
                      aria-label="Send"
                      className="flex-shrink-0 h-7 w-7 ml-1 mr-1 rounded-full text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 self-center bg-[#ea4c89] pr-[2px]"
                      style={{ boxShadow: "0 4px 14px -2px rgb(234, 76, 137,0.4)" }}
                    >
                      <Send size={14} className="ml-0.5" />
                    </button>
                  </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Colored chip showing remaining daily credits. Turns amber at ≤5, red at 0.
function CreditsChip({ remaining, limit }) {
  const ratio = remaining / limit;
  const tone =
    remaining === 0
      ? "text-red-300 bg-red-500/10 border-red-500/30"
      : ratio <= 0.2
      ? "text-amber-300 bg-amber-500/10 border-amber-500/30"
      : "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";

  return (
    <div
      className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full border ${tone}`}
      title={`${remaining} of ${limit} daily credits left`}
    >
      {remaining}/{limit}
    </div>
  );
}

// Shown inside the panel body when the user isn't signed in.
function LoginGate({ onLogin }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-5">
      <img src="/genie-white.png" alt="Genie" className="w-16 h-20 opacity-90" />
      <div>
        <div className="text-base font-bold text-white">Sign in to chat with akgenie</div>
        <div className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          Your wish list is tied to your account so we can remember your taste and protect
          your daily credits.
        </div>
      </div>
      <button
        type="button"
        onClick={onLogin}
        className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#ea4c89] hover:bg-[#d93f7c] active:scale-95 transition-all shadow-lg shadow-[#ea4c89]/30"
      >
        <LogIn size={16} />
        Sign in to continue
      </button>
    </div>
  );
}

function LimitReached({ countdown }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 gap-4 pt-4 pb-2">
      <img src="/genie-white.png" alt="Genie" className="w-16 h-20 opacity-80" style={{ filter: 'grayscale(60%)' }} />
      <div>
        <div className="text-base font-bold text-white">Daily credits exhausted</div>
        <div className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          You've used all your wishes for today. Your credits will automatically reset in <span className="font-bold text-white">{formatCountdown(countdown)}</span> at midnight.
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSuggest }) {
  return (
    <div className="flex flex-col items-center gap-5 pt-4 pb-2 text-center">
      <img src="/genie-white.png" alt="Genie" className="w-15 h-20" />

      <div>
        <div className="text-sm font-bold text-white">What&apos;s your wish?</div>
        <div className="text-xs text-gray-500 mt-1">
          akgenie grants movie & series wishes — genres, moods, anything.
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 w-full mt-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSuggest(q.replace(/^[\p{Emoji}\s]+/u, "").trim())}
            className="text-xs text-center px-4 py-2 rounded-full text-gray-300 transition-all hover:text-white"
            style={{ background: "#1a1a24", border: "1px solid rgba(234,76,137,0.2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(234,76,137,0.5)";
              e.currentTarget.style.background = "#232333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(234,76,137,0.2)";
              e.currentTarget.style.background = "#1a1a24";
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
