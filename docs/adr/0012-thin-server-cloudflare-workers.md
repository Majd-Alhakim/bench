# ADR-0012: A thin, stateless server on Cloudflare Workers (licence, quota, model routing, config)

- **Status:** Proposed (2026-10-26). Pro traffic only when Pro opens; v0.1 uses only the config, update-manifest, waitlist-count, opt-in telemetry and prompted-rule (`/v1/draft-rule`) routes (CR-010, founder 2026-10-26).
- **Date:** 2026-10-26

## Context
The supervisor's model calls can't go straight from the app to OpenRouter: that would ship our provider key to every PC, and we couldn't enforce the per-user supervisor budget, swap models without a release, or kill a bad config. The business constraint is **infrastructure under $100/month** and a solo maintainer. Security-baseline §1 says Eucas has no server; this ADR adds one, so its surface must stay minimal: **no user content stored, no accounts, no logs of payloads.**

## Options
| | Ops load | Cost at 1k Pro users | Fit |
|---|---|---|---|
| **Cloudflare Workers + one Durable Object class + KV** | Near zero (no servers, deploy with wrangler) | Workers Paid $5/month base; requests and DO usage at this volume cost cents to a few dollars | Edge latency, secrets store, staging/production environments built in |
| Vercel Functions | Low | Similar | Fine, but counters need an external store |
| A small VPS | Patching, TLS, uptime are ours | ~$5–20 | Worst ops load for a solo founder |

## Decision
**Cloudflare Workers**, one Worker `eucas-api` (TypeScript, Hono, zod), environments `staging` and `production` (separate secrets, KV namespaces and DO namespaces).

| Route | v0.1 | What it does | Stores |
|---|---|---|---|
| `GET /v1/config/{channel}` | ✅ | Signed runtime config: supervisor models and params, prompt version, feature flags, kill switches, minimum verified CLI | KV (config only) |
| `POST /v1/waitlist` | ✅ | Increments a counter per moment (`{ installHash, moment }`; `installHash` is a pseudonymous per-release id used only to dedupe) | Analytics Engine counter; no email, no IP kept |
| `POST /v1/telemetry` | ✅ (opt-in) | Daily counts and enums only, schema-allowlisted ([OPERATIONS §1](../architecture/companion/OPERATIONS.md)) | Analytics Engine rows; no IP |
| `GET /v1/updates/{channel}/{target}/{version}` | ✅ | Tauri updater manifest, proxied from GitHub Releases | Nothing |
| `POST /v1/licence/activate`, `/validate` | Pro | Checks a Lemon Squeezy licence key; returns a short-lived signed token (Ed25519, 24 h) | DO: `{ licenceHash, instanceHash, validatedAt }` |
| `POST /v1/supervise` | Pro | Strict schema check, quota decrement, provider routing, output schema check | DO counter `{ licenceHash, month, count }` only |
| `POST /v1/draft-rule` | ✅ (CR-010, founder 2026-10-26) | Prompted rules (BUILD-PLAN R-2): strict schema check, budget decrement, sends **only the sentence the user typed plus the rulebook schema** to `gpt-oss-120b` with zero data retention, output schema check; returns a draft the app validates again before showing it | The same budget counter as `/v1/supervise`; the sentence and the draft are never stored or logged |

- **Strict request allowlist:** every body is parsed with a `.strict()` zod schema (unknown keys → 400), size ≤ 8 KiB, only `level: 2` is accepted (Level 1 makes no server call; the eval-only Level 1 decision-model flag runs from the eval harness against staging, never production), the text field ≤ 1,200 chars and **re-scanned** for secret patterns and code fences (match → 422; the app then asks the user). No free-form passthrough to the provider: the server builds the prompt from the template named in config.
- **`/v1/draft-rule` (CR-010, founder 2026-10-26):** the body is `{ text }` (the user's sentence, `.strict()`, same size cap and secret re-scan as above); the server adds the rulebook schema (`contracts/rulebook.schema.json`) and the drafting template from config, calls `gpt-oss-120b` through the same ZDR provider block, and returns the model's answer only if it parses as a rule under that schema. Each draft counts toward the user's **supervisor budget**. The app never trusts the draft: it re-validates, compiles, runs the limit-overlap and bypass checks (ADR-0010) and shows `RulePreview`; nothing is enabled until the user confirms. **Open:** what the budget counter is keyed on for a Free install, which has no licence (not decided in CR-010); until it is, the per-IP rate limit and the daily spend circuit breaker bound it.
- **No storage of content:** request and response bodies are never logged (`console.log` banned in the Worker by lint; Workers Logs sampling off for this route; errors log the route, status and a request id only).
- **Provider:** OpenRouter with the ZDR provider block from ADR-0011, one API key per environment with a **hard credit limit** on OpenRouter's side, plus a server-wide daily spend circuit breaker in config.
- **Payments: Lemon Squeezy** (merchant of record, available to sellers outside the USA, licence keys built in). Paddle is the fallback (no native licence keys, so we would mint our own). **Pro can charge once it is built**, because the supervisor doesn't use the user's Claude plan; only the **cloud beta** (cloud hand-off) waits for Anthropic's written OK (CR-010, founder 2026-10-26; this replaces the earlier "no payment route before Anthropic's written OK").
- **Config signing:** the config is signed offline with a minisign/Ed25519 key that never lives on Cloudflare; the app pins the public key and rejects unsigned or older configs (anti-rollback via `version`).

## Consequences
- Security-baseline §1 gains a "server" row (SECURITY-PRIVACY.md §2): the only user-derived data at rest is two hashed identifiers and integer counters.
- If the Worker is down, Pro degrades to rules-only and "ask you"; nothing in the guard or the free features depends on it, except drafting a prompted rule, which then fails with a plain reason while suggestions and templates keep working (CR-010, founder 2026-10-26). The app caches the last good config for 7 days.
- Cost estimate at 1,000 Pro users at the full allowance: model ≤ $1.48 per user (SP-SUP1 §6), Workers + DO a few dollars; well under the $100 ceiling before model spend, which Pro revenue covers.
