import assert from "node:assert/strict";
import { test } from "node:test";
import type { Env } from "../lib/waitlist.ts";
import worker from "../src/index.ts";

const env = { DB: {} } as Env;
const call = (path: string, init?: RequestInit, e: Env = env) => worker.fetch(new Request(`https://eucas.app${path}`, init), e);

test("unknown API paths are 404 and wrong methods are 405 with Allow", async () => {
  assert.equal((await call("/api/nope")).status, 404);
  const r = await call("/api/subscribe");
  assert.equal(r.status, 405);
  assert.equal(r.headers.get("allow"), "POST");
});

test("every Worker response carries the security headers, since _headers only covers static files", async () => {
  const r = await call("/api/confirm?t=short");
  assert.equal(r.status, 400);
  assert.match(r.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.match(r.headers.get("strict-transport-security") ?? "", /max-age=31536000/);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.equal(r.headers.get("referrer-policy"), "no-referrer");
});

test("a sign-up without a Turnstile secret is refused", async () => {
  const body = JSON.stringify({ email: "a@example.com", elapsed: 5000, turnstile: "tok" });
  const r = await call("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body });
  assert.equal(r.status, 403);
});

test("POSTs over the rate limit get 429 before any handler runs", async () => {
  const keys: string[] = [];
  const limited = { ...env, RATE_LIMITER: { limit: async ({ key }: { key: string }) => (keys.push(key), { success: false }) } } as Env;
  const r = await call("/api/subscribe", { method: "POST", headers: { "cf-connecting-ip": "203.0.113.9" } }, limited);
  assert.equal(r.status, 429);
  assert.deepEqual(keys, ["/api/subscribe:203.0.113.9"]);
});
