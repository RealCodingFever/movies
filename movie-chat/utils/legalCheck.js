// Local intercept for legal / copyright / DMCA-style queries.
// Returns a canned reply with policy links so we don't burn an AI call or daily credit.

const LEGAL_RE =
  /\b(legal(ity)?|illegal|copyright(ed|s)?|piracy|pirated?|dmca|takedown|infring(e|ed|ing|ement)|lawful|unlawful|licens(e|ed|ing))\b/i;

export function getLegalReply(query) {
  if (!query || !LEGAL_RE.test(query)) return null;
  return {
    response:
      "AKMovies is a free aggregator that links to third-party sources — we don't host any video files ourselves. For takedown requests, copyright concerns, or how we handle your data, please see our [DMCA policy](/dmca) and [Privacy policy](/privacy).",
    items: [],
  };
}
