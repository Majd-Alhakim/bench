// Shared helpers for the waitlist Pages Functions: validation, Turnstile, mail, small HTML pages.

export interface Env {
  DB: D1Database;
  /** Turnstile secret. Unset = no challenge (local runs only). */
  TURNSTILE_SECRET?: string;
  /** Comma list of hostnames the Turnstile token must come from, e.g. "eucas.app,www.eucas.app". */
  TURNSTILE_HOSTNAMES?: string;
  /** Resend API key. Unset = no confirm email; rows are stored as "unconfirmed". */
  RESEND_API_KEY?: string;
  /** Sender, e.g. "Eucas <hello@eucas.app>". */
  MAIL_FROM?: string;
  /** Public origin for links in emails, e.g. "https://eucas.app". */
  SITE_URL?: string;
}

// Minimal D1 types so the functions typecheck without @cloudflare/workers-types.
export interface D1Result<T = unknown> { results: T[]; success: boolean; meta: { changes?: number } }
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
}
export interface D1Database { prepare(query: string): D1PreparedStatement }

export interface Ctx { request: Request; env: Env }

export const CONSENT =
  "We'll email you about Eucas only: a link to confirm, the first build, and Pro when it opens. Every email has a one-click unsubscribe.";

export const AGENTS = new Set(["claude-code", "cursor", "codex", "other"]);
export const SESSIONS = new Set(["", "1", "2-3", "4-6", "7+"]);
export const OSES = new Set(["", "windows", "macos", "linux"]);
export const PLANS = new Set(["free", "pro"]);

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export function normaliseEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return null;
  return email;
}

export function cleanRef(raw: unknown): string {
  return typeof raw === "string" ? raw.toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 40) : "";
}

export function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

export function isToken(raw: unknown): raw is string {
  return typeof raw === "string" && /^[0-9a-f]{48}$/.test(raw);
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Reads a JSON body of at most 4 KB. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  if (!(request.headers.get("content-type") || "").includes("application/json")) return null;
  const text = await request.text();
  if (text.length > 4096) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

/** Canonical Turnstile siteverify: success, the expected action and an approved hostname. Fails closed. */
export async function verifyTurnstile(env: Env, token: unknown, ip: string | null, action: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true;
  const hostnames = new Set((env.TURNSTILE_HOSTNAMES ?? "").split(",").map(h => h.trim()).filter(Boolean));
  if (typeof token !== "string" || token.length === 0 || token.length > 2048 || hostnames.size === 0) return false;
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
    if (ip) body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) return false;
    const result = (await r.json()) as { success?: boolean; action?: string; hostname?: string; metadata?: { result_with_testing_key?: boolean } };
    // Cloudflare's always-pass test secret returns no action; that secret only ever lives in a local .dev.vars.
    const actionOk = result.action === action || (result.action === undefined && result.metadata?.result_with_testing_key === true);
    return result.success === true && actionOk && hostnames.has(result.hostname ?? "");
  } catch {
    return false;
  }
}

/** Sends the double opt-in email through Resend. Returns false when no mailer is set or the send fails. */
export async function sendConfirm(env: Env, email: string, token: string): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM || !env.SITE_URL) return false;
  const confirm = `${env.SITE_URL}/api/confirm?t=${token}`;
  const leave = `${env.SITE_URL}/api/unsubscribe?t=${token}`;
  const text = [
    "Confirm you want the first Eucas build:",
    "",
    confirm,
    "",
    "If you didn't ask for this, ignore this email and nothing else will arrive.",
    "",
    `Leave the list and delete your email: ${leave}`,
  ].join("\n");
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [email],
        subject: "Confirm your place on the Eucas waitlist",
        text,
        headers: { "List-Unsubscribe": `<${leave}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return r.ok;
  } catch {
    return false;
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A small page in the site's look for confirm and unsubscribe. `body` is trusted HTML. */
export function page(title: string, body: string, status = 200): Response {
  const html = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)} · Eucas</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"></head><body><main class="wrap note-page"><a class="brand" href="/"><span>eucas</span></a><h1>${esc(title)}</h1>${body}</main></body></html>`;
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
