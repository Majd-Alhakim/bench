// Shared helpers: seeded RNG, local message flags, trimming and scrubbing. Nothing here calls the network.

export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (xs) => xs[Math.floor(next() * xs.length)],
  };
}

/** Flags computed on the device from the last message. Only these booleans leave the machine at Level 1. */
export function messageFlags(text = "") {
  const t = text.toLowerCase();
  return {
    asks_question: /\?\s*$|\?\s*\n|should i\b|do you want|would you like|can you (provide|add|give|share|confirm)|let me know/.test(t),
    claims_done: /\b(done|complete[d]?|finished|all (tests )?(pass|green)|ready for review|implemented)\b/.test(t),
    mentions_blocker: /\b(blocked|can't|cannot|unable|missing|not set|permission|denied|stuck|need (you|your))\b/.test(t),
  };
}

const SECRET_PATTERNS = [
  /\b(sk|pk|rk)[-_](live|test)?[-_]?[A-Za-z0-9]{8,}\b/g,
  /\b(ghp|gho|github_pat)_[A-Za-z0-9_]{10,}\b/g,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}\b/g, // JWTs
  /\b(postgres(ql)?|mysql|mongodb(\+srv)?|redis):\/\/\S+/gi,
  /\b([A-Z][A-Z0-9_]{2,}(SECRET|TOKEN|KEY|PASSWORD|PASS|URL))\s*=\s*\S+/g,
  /\bFAKE[-_A-Za-z0-9]+/g,
];

/** Level 2 payload: code removed, secrets and names scrubbed, at most `max` characters. */
export function trimMessage(text = "", max = 500) {
  let t = text.replace(/```[\s\S]*?```/g, "[code removed]");
  for (const p of SECRET_PATTERNS) t = t.replace(p, (m, name) => (/=/.test(m) && name ? `${name}=[redacted]` : "[redacted]"));
  t = t
    .replace(/[A-Za-z]:\\[^\s"')]+|\/(Users|home|tmp)\/[^\s"')]+/g, "[path]")
    .replace(/\bshelfie\b/gi, "[repo]")
    .replace(/\b(Dana|Majd)\b/g, "[person]")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  // Keep the opening (the verdict) and the ending (the ask); drop the middle.
  if (t.length > max) t = t.slice(0, 200).trimEnd() + " … " + t.slice(t.length - (max - 203)).trimStart();
  return t;
}
