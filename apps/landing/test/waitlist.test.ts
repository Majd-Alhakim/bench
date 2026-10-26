import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanRef, isToken, newToken, normaliseEmail, verifyTurnstile, type Env } from "../lib/waitlist.ts";

test("normaliseEmail trims, lowercases and rejects what isn't an address", () => {
  assert.equal(normaliseEmail("  Founder@Example.COM "), "founder@example.com");
  for (const bad of ["", "nope", "a@b", "a b@c.com", "<x>@y.com", 42, null, `${"a".repeat(250)}@b.com`]) {
    assert.equal(normaliseEmail(bad), null, String(bad));
  }
});

test("cleanRef keeps a short safe tag only", () => {
  assert.equal(cleanRef("X<script>"), "xscript");
  assert.equal(cleanRef("reddit"), "reddit");
  assert.equal(cleanRef("a".repeat(80)).length, 40);
  assert.equal(cleanRef(undefined), "");
});

test("tokens are 48 hex characters and checked strictly", () => {
  const t = newToken();
  assert.ok(isToken(t));
  assert.notEqual(t, newToken());
  assert.equal(isToken(t.toUpperCase()), false);
  assert.equal(isToken(t + "0"), false);
  assert.equal(isToken("' OR 1=1 --"), false);
});

test("Turnstile fails closed when a secret is set but the token or hostnames are missing", async () => {
  const env = { TURNSTILE_SECRET: "x", TURNSTILE_HOSTNAMES: "eucas.app" } as Env;
  assert.equal(await verifyTurnstile(env, "", null, "waitlist"), false);
  assert.equal(await verifyTurnstile(env, 123, null, "waitlist"), false);
  assert.equal(await verifyTurnstile(env, "x".repeat(2049), null, "waitlist"), false);
  assert.equal(await verifyTurnstile({ TURNSTILE_SECRET: "x" } as Env, "tok", null, "waitlist"), false);
});

test("Turnstile fails closed when no secret is set, so a missed deploy step can't switch it off", async () => {
  assert.equal(await verifyTurnstile({ TURNSTILE_HOSTNAMES: "eucas.app" } as Env, "tok", null, "waitlist"), false);
});
