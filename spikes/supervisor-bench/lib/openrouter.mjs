// OpenRouter key lookup and the retry/backoff helper for the hybrid run.
import { execFileSync } from "node:child_process";

export function apiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  // Set with setx, so read it from the user's registry environment. Never logged.
  const out = execFileSync("reg", ["query", "HKCU\\Environment", "/v", "OPENROUTER_API_KEY"], { encoding: "utf8" });
  const m = out.match(/OPENROUTER_API_KEY\s+REG_\w+\s+(\S+)/);
  if (!m) throw new Error("OPENROUTER_API_KEY not found");
  return m[1];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 3 retries on errors marked retryable (429, 5xx, network), exponential backoff from 4 s. */
export async function withRetry(fn) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= 3 || !err.retryable) throw err;
      await sleep(4000 * 2 ** attempt);
    }
  }
}
