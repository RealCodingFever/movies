// LocalStorage helpers for persisting chat messages + small context per user.

import { CHAT_CONFIG } from "../config";

const isBrowser = () => typeof window !== "undefined";

const messagesKey = (userId) => `${CHAT_CONFIG.storageKeyPrefix}:${userId}`;
const contextKey = (userId) => `${CHAT_CONFIG.contextStorageKeyPrefix}:${userId}`;

export function loadMessages(userId) {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(messagesKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMessages(userId, messages) {
  if (!isBrowser()) return;
  const trimmed = messages.slice(-CHAT_CONFIG.maxHistory);
  try {
    window.localStorage.setItem(messagesKey(userId), JSON.stringify(trimmed));
  } catch {
    // quota or privacy mode — ignore
  }
}

export function loadContext(userId) {
  if (!isBrowser()) return "";
  try {
    return window.localStorage.getItem(contextKey(userId)) ?? "";
  } catch {
    return "";
  }
}

export function saveContext(userId, context) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(contextKey(userId), context.slice(0, 800));
  } catch {
    // ignore
  }
}

export function clearChat(userId) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(messagesKey(userId));
  window.localStorage.removeItem(contextKey(userId));
}
