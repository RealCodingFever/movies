// Cloudflare Turnstile loader. Returns a one-shot invisible token on demand.

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let scriptPromise = null;

export function preloadTurnstile() {
  if (typeof window === "undefined") return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();

    const existing = document.querySelector(`script[src^="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile load failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile load failed"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function getTurnstileToken(sitekey) {
  await preloadTurnstile();
  await waitFor(() => !!window.turnstile, 5000);

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.visibility = "hidden";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  return new Promise((resolve, reject) => {
    let widgetId = null;
    const cleanup = () => {
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      container.remove();
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("turnstile timeout"));
    }, 15_000);

    widgetId = window.turnstile.render(container, {
      sitekey,
      size: "invisible",
      callback: (token) => {
        clearTimeout(timer);
        resolve(token);
        setTimeout(cleanup, 0);
      },
      "error-callback": () => {
        clearTimeout(timer);
        cleanup();
        reject(new Error("turnstile error"));
      },
    });
  });
}

async function waitFor(cond, timeoutMs) {
  const start = Date.now();
  while (!cond()) {
    if (Date.now() - start > timeoutMs) throw new Error("turnstile not ready");
    await new Promise((r) => setTimeout(r, 50));
  }
}
