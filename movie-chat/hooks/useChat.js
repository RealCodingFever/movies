// Core chat hook — manages messages, AI call, TMDB enrichment, usage limit + persistence.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  CHAT_CONFIG,
  resolveTmdbToken,
  resolveTurnstileSiteKey,
  resolveWorkerUrl,
} from "../config";
import { askAi, checkAiStatus } from "../services/aiClient";
import { fetchMedia } from "../services/tmdbClient";
import { getTurnstileToken, preloadTurnstile } from "../services/turnstile";
import { createId } from "../utils/id";
import { getLegalReply } from "../utils/legalCheck";
import { getPageContext } from "../utils/pageContext";
import {
  clearChat as clearStorage,
  loadContext,
  loadMessages,
  saveContext,
  saveMessages,
} from "../utils/storage";
import { getAiUsageByUser, updateAiUsage } from "@/utils/firestore-functions";

export function useChat({ user, workerUrl, tmdbToken, turnstileSiteKey, dailyLimit }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [usage, setUsage] = useState({ dailyCount: 0, totalCount: 0 });

  const contextRef = useRef("");
  const abortRef = useRef(null);
  const siteKey = resolveTurnstileSiteKey(turnstileSiteKey);

  const userId = user?.uid || null;
  const name = user?.displayName || user?.email?.split("@")[0] || "Guest";

  // Hydrate local messages + context + remote usage whenever the user changes
  useEffect(() => {
    if (!userId) {
      setMessages([]);
      contextRef.current = "";
      setUsage({ dailyCount: 0, totalCount: 0 });
      return;
    }
    setMessages(loadMessages(userId));
    contextRef.current = loadContext(userId);
    getAiUsageByUser(userId).then((u) => {
      if (u) setUsage({ dailyCount: u.dailyCount || 0, totalCount: u.totalCount || 0 });
    });
    return () => abortRef.current?.abort();
  }, [userId]);

  useEffect(() => {
    if (siteKey) preloadTurnstile().catch(() => {});
  }, [siteKey]);

  const checkStatus = useCallback(async () => {
    const status = await checkAiStatus(resolveWorkerUrl(workerUrl));
    setIsOnline(status);
  }, [workerUrl]);

  const persist = useCallback(
    (next) => {
      setMessages(next);
      if (userId) saveMessages(userId, next);
    },
    [userId]
  );

  const remaining = Math.max(0, dailyLimit - usage.dailyCount);
  const limitReached = remaining <= 0;

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || !userId) return;
      if (limitReached) {
        setError(`Daily limit reached. Resets at midnight.`);
        return;
      }

      setError(null);

      const userMsg = {
        id: createId(),
        role: "user",
        text: trimmed,
        createdAt: Date.now(),
      };
      const nextMessages = [...messages, userMsg].slice(-CHAT_CONFIG.maxHistory);

      // Local intercept: legal / copyright / DMCA queries → canned reply with policy links.
      // Skips the AI call entirely so it doesn't burn a daily credit.
      const local = getLegalReply(trimmed);
      if (local) {
        const aiMsg = {
          id: createId(),
          role: "assistant",
          text: local.response,
          items: [],
          createdAt: Date.now(),
        };
        persist([...nextMessages, aiMsg].slice(-CHAT_CONFIG.maxHistory));
        return;
      }

      persist(nextMessages);
      setIsTyping(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const turnstileToken = siteKey
          ? await getTurnstileToken(siteKey).catch(() => undefined)
          : undefined;

        const ai = await askAi({
          workerUrl: resolveWorkerUrl(workerUrl),
          query: trimmed,
          context: contextRef.current,
          history: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          user: { id: userId, name },
          page: getPageContext(),
          turnstileToken,
          signal: controller.signal,
        });

        let media = [];
        if (ai.items.length > 0) {
          media = await fetchMedia(ai.items, resolveTmdbToken(tmdbToken));
        }

        const aiMsg = {
          id: createId(),
          role: "assistant",
          text: ai.response,
          items: media,
          createdAt: Date.now(),
        };

        const updated = [...nextMessages, aiMsg].slice(-CHAT_CONFIG.maxHistory);
        persist(updated);

        if (ai.responseSmallContext) {
          contextRef.current = ai.responseSmallContext;
          saveContext(userId, ai.responseSmallContext);
        }

        // Bump usage counter in Firestore only after a successful reply
        const next = await updateAiUsage(user);
        if (next) setUsage({ dailyCount: next.dailyCount, totalCount: next.totalCount });
      } catch (err) {
        if (err?.name === "AbortError") return;
        const msg = err?.message || "";
        if (msg.includes("429") || msg.includes("500") || msg.includes("Failed to fetch")) {
          setIsOnline(false);
        }
        setError(msg || "Something went wrong.");
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, limitReached, messages, name, persist, siteKey, tmdbToken, user, userId, workerUrl]
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    contextRef.current = "";
    if (userId) clearStorage(userId);
    setMessages([]);
    setError(null);
  }, [userId]);

  return {
    messages,
    isTyping,
    error,
    isOnline,
    usage,
    remaining,
    limitReached,
    checkStatus,
    send,
    clear,
  };
}
