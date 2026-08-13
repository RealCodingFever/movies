// Parse + sanitize AI JSON responses. Falls back to a safe default if shape is wrong.

const FALLBACK = {
  response: "Sorry, I couldn't think of anything right now. Try rephrasing?",
  items: [],
  responseSmallContext: "",
};

export function parseAiResponse(raw) {
  if (raw && typeof raw === "object" && isAiShape(raw)) return sanitize(raw);

  if (typeof raw === "string") {
    const extracted = extractJson(raw);
    if (extracted && isAiShape(extracted)) return sanitize(extracted);
  }

  return FALLBACK;
}

function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return null;
  }
}

function isAiShape(o) {
  return (
    typeof o.response === "string" &&
    Array.isArray(o.items) &&
    typeof o.responseSmallContext === "string"
  );
}

function sanitize(o) {
  const items = o.items
    .map((e) => {
      if (!e || typeof e !== "object") return null;
      const type = e.type === "tv" ? "tv" : e.type === "movie" ? "movie" : null;
      const title = typeof e.title === "string" ? e.title.trim() : null;
      if (!type || !title) return null;
      const year = typeof e.year === "string" ? e.year.slice(0, 4) : undefined;
      return year ? { type, title, year } : { type, title };
    })
    .filter(Boolean)
    .slice(0, 5);

  return {
    response: String(o.response).slice(0, 700),
    items,
    responseSmallContext: String(o.responseSmallContext).slice(0, 800),
  };
}
