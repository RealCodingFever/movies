// Talks to the Cloudflare worker — status ping + main ask.

import { CHAT_CONFIG } from "../config";
import { parseAiResponse } from "../utils/json";

export async function checkAiStatus(workerUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(workerUrl, { method: "GET", signal: controller.signal });
    clearTimeout(timeout);
    return res.status !== 429 && res.status < 500;
  } catch {
    return false;
  }
}

export async function askAi({
  workerUrl,
  query,
  context,
  history,
  user,
  page,
  turnstileToken,
  signal,
}) {
  const body = {
    query,
    context,
    history: history.slice(-CHAT_CONFIG.historySentToAi),
    user,
    ...(page ? { page } : {}),
    ...(turnstileToken ? { turnstileToken } : {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHAT_CONFIG.requestTimeoutMs);
  const finalSignal = signal ? mergeSignals(signal, controller.signal) : controller.signal;

  try {
    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: finalSignal,
    });

    if (!res.ok) throw new Error(`Worker responded ${res.status}`);

    const data = await res.json().catch(() => null);
    return parseAiResponse(data);
  } finally {
    clearTimeout(timeout);
  }
}

function mergeSignals(a, b) {
  const c = new AbortController();
  const onAbort = () => c.abort();
  a.addEventListener("abort", onAbort);
  b.addEventListener("abort", onAbort);
  return c.signal;
}
