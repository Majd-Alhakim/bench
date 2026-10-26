// On-device scrubbing for SP-SUP2 moments, the SP-SUP1 Level 2 rules plus a few more: code removed, secrets,
// emails, URLs, paths, the repo name and the user's own names replaced, at most 500 characters. Nothing here touches
// the network.

const SECRET_PATTERNS = [
  /\b(sk|pk|rk)[-_](live|test|ant|proj)?[-_]?[A-Za-z0-9_-]{8,}\b/g,
  /\b(ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{10,}\b/g,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bAIza[0-9A-Za-z_-]{30,}\b/g,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}\b/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----|$)/g,
  /\b(postgres(ql)?|mysql|mongodb(\+srv)?|redis|amqp):\/\/\S+/gi,
  /\b([A-Z][A-Z0-9_]{2,}(SECRET|TOKEN|KEY|PASSWORD|PASS|PWD|URL|DSN))\s*[=:]\s*\S+/g,
  /\b[A-Fa-f0-9]{32,}\b/g,
];

/** Level 2 payload: code removed, secrets and names scrubbed, at most `max` characters. */
export function scrub(text = "", { repo = "", names = [], max = 500 } = {}) {
  let t = String(text)
    .replace(/```[\s\S]*?(```|$)/g, "[code removed]")
    .replace(/`[^`\n]{40,}`/g, "[code removed]")
    .replace(/^( {4}|\t).+$/gm, "[code removed]");
  for (const p of SECRET_PATTERNS) t = t.replace(p, (m, name) => (/[=:]/.test(m) && name && /^[A-Z]/.test(name) ? `${name}=[redacted]` : "[redacted]"));
  t = t
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[email]")
    .replace(/\bhttps?:\/\/\S+/g, "[url]")
    .replace(/[A-Za-z]:[\\/][^\s"'`)\]]+/g, "[path]")
    // A Windows path that lost its backslashes on the way (a bad escape upstream): "C:Usersnamerepo...".
    .replace(/\b[A-Za-z]:(?=[A-Za-z0-9_.-]{4,})[^\s"'`)\],;]+/g, "[path]")
    .replace(/(^|[\s"'(])\/(Users|home|tmp|var|etc|opt|mnt|c)\/[^\s"'`)\]]+/g, "$1[path]")
    .replace(/(^|\s)~[\\/][^\s"'`)\]]+/g, "$1[path]");
  for (const n of [repo, ...names].filter((x) => x && x.length >= 3)) t = t.replace(new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), n === repo ? "[repo]" : "[person]");
  t = t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  // Keep the opening (the verdict) and the ending (the ask); drop the middle.
  if (t.length > max) t = t.slice(0, 200).trimEnd() + " … " + t.slice(t.length - (max - 203)).trimStart();
  return t;
}

/** Flags computed on the device from the last message (SP-SUP1 Level 1). */
export function messageFlags(text = "") {
  const t = text.toLowerCase();
  return {
    asks_question: /\?\s*$|\?\s*\n|should i\b|do you want|would you like|can you (provide|add|give|share|confirm)|let me know/.test(t),
    claims_done: /\b(done|complete[d]?|finished|all (tests )?(pass|green)|ready for review|implemented)\b/.test(t),
    mentions_blocker: /\b(blocked|can't|cannot|unable|missing|not set|permission|denied|stuck|need (you|your))\b/.test(t),
  };
}
