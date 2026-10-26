# ADR-0018: The supervisor allowance is a hidden dollar budget per account, metered on the server

- **Status:** Proposed (2026-10-26). Requirement: [CR-011](../requirements/change-requests/CR-011.md) §4–5 (approved), the founder's answer on drafting ([2026-10-26](../requirements/interviews/2026-10-26-v1.4-open-items.md)), [CR-012](../requirements/change-requests/CR-012.md) (the budget belongs to the account). **Amends ADR-0011** (allowance) and **ADR-0012** (quota). Evidence: the running-cost study §7b–7c (`docs/business/ops-cost-study-2026-10-26.md`). **Amended 2026-10-26** for the no-account taste (per install; amendment at the end).
- **Date:** 2026-10-26

## Context
ADR-0011 and SUPERVISOR §9 counted **calls** (10,000 a month). The cost study's sensitivity check showed why that is the wrong unit: bigger prompts or more frequent stops can triple a heavy user's cost while the call count stays the same. CR-011 decided:
- the allowance is a **hidden model-cost budget per user**, never shown as dollars; the user sees a meter (a bar or percentage, plus the reset date);
- each prompt is capped at about **2,000 tokens**;
- Free gets a **14-day full trial** (hidden cap about **$0.50**), then a **monthly taste** (about **$0.02**, roughly 80 decisions);
- prompted-rule drafts count against the same budget;
- **(founder, 2026-10-26, relayed by the PM)** the supervisor is **always on for every user**, Free included, with no off switch (Level 1/2 retired); **the tiers differ only in budget**; the trial **starts when setup finishes**, one per account; **when the budget is empty the supervisor falls back to rules only** and asks the user more;
- when the meter is empty, the Euca asks you instead ("…until 1 Dec").

**Numbers** (gpt-oss-120b via OpenRouter, measured in SP-SUP1: 935 tokens in, 103 out, $0.000148 a call): at the cap (2,000 in, 300 out) a call costs at most about **$0.00035**, ~$0.0005 on the third fallback model. The taste ($0.02) covers ~57 calls at the cap and ~135 at the measured average; the trial ($0.50) covers ~1,400–3,400. Volume at 10,000 free users plus 1,000 trials a month: about 1.6 M model calls a month.

## Options
| | Overspend bound | Parallel calls | Work |
|---|---|---|---|
| Count calls (today's design) | None on cost (prompt size varies) | Simple counter | Done |
| Debit the actual cost after each call | Can overshoot by the calls in flight | Racy | Small |
| **Reserve the worst-case cost before the call, settle the actual after** | **Never above the cap** | Safe (one conditional `UPDATE`) | Small |
| Prepaid tokens on the PC | Client-side, forgeable | — | Wrong trust boundary |

## Decision
**Reserve, then settle, in D1, per account and period.**
1. **Periods** (one row per account, ADR-0017): `pending` (signed in, setup not finished; drafts made during setup draw on a small `setupMicroUsd` allowance, so Draft works in setup) → `trial` (14 days from `POST /v1/trial/start` at the end of setup, cap `trialMicroUsd`; `trial_used` makes it once per account) → `taste` (calendar months, 00:00 UTC on the 1st, cap `tasteMicroUsdPerMonth`) → or `pro` (the paid period, cap `proMicroUsdPerMonth`). Rollover is lazy: the first call after `period_end` moves the row to the next period and zeroes `used`/`reserved`. A trial whose cap is spent early stays empty (rules only) until day 14, then the taste starts. ~~Pro and trial need Level 2 to supervise (CR-011 §5).~~ Levels are retired (founder, 2026-10-26): every period supervises, and only the cap differs.
2. **Prompt cap:** the Worker builds the prompt from the config template, estimates tokens conservatively as `ceil(utf8 bytes / 3)`, and if it's over `promptTokenCap` (2,000) first drops guidance-rule text (lowest priority first, keeping ids), then refuses with `413 prompt_too_large` (the app asks you). Output is capped by `max_tokens: 300`.
3. **Reserve:** `maxCallMicroUsd` = (`promptTokenCap` × input price + `max_tokens` × output price) of the **dearest** model in the configured chain × (1 + provider fee), all from signed config. One statement: `UPDATE account SET reserved = reserved + :max WHERE id = :id AND used + reserved + :max <= :cap RETURNING …`. No row → `402 budget_empty` → the app shows the empty meter, and the supervisor runs **rules only** and asks you more until the reset. The same transaction checks the server-wide daily circuit breaker (`spend_day`).
4. **Call** the model chain (SUPERVISOR §6).
5. **Settle** after the response is sent (`ctx.waitUntil`): `reserved -= :max, used += :actual`, where `actual` is OpenRouter's `usage.cost` × (1 + fee), or `:max` if the cost is missing; and add `actual` to `spend_day`. A Worker that dies between reserve and settle leaks at most one reservation (≤ $0.0005), cleared at the next period rollover.
6. **The meter:** `GET /v1/meter` (also embedded in `/v1/account` and every model response) returns `{ period: "trial" | "taste" | "pro", percentLeft: 0–100 (integer, rounded down), resetsAt }`. **The schema has no money and no counts** (CR-011: "no dollars, no counts of budget"); a contract test fails if a money field appears in any response the app receives.
7. **Drafting** (`/v1/draft-rule`) uses the same reserve and settle. **Pressing Draft is the opt-in** for that one sentence (founder, 2026-10-26); only the sentence (and the server's trimmed rule schema) is sent.
8. **Caps live in signed runtime config** (`budgets` block, SUPERVISOR §8), so the founder can re-set them after SP-SUP2 measures real prompt sizes, with no release.

| Config key | Starting value | Source |
|---|---|---|
| `setupMicroUsd` | 20,000 ($0.02) | this ADR (drafts made during setup) |
| `trialDays`, `trialMicroUsd` | 14, 500,000 ($0.50) | CR-011 §5; starts when setup finishes (founder, 2026-10-26) |
| `tasteMicroUsdPerMonth` | 20,000 ($0.02) | CR-011 §5 |
| `proMicroUsdPerMonth` | 1,480,000 ($1.48) | founder, 2026-10-26 (BRD §10 #56, "Approve all"); was ~$2 in the cost study §7c |
| `promptTokenCap`, `maxOutputTokens` | 2,000, 300 | CR-011 §4, SUPERVISOR §6 |

## Consequences
- No account can cost more than its period cap, whatever the prompt size or concurrency; the daily circuit breaker and OpenRouter's credit limit stay as the outer bounds.
- **The server tracks budget, not calls.** `quota.monthlyCalls` leaves the runtime config; the cost study's "10,000-call allowance" and PRD 25.3's "10,000 model calls a month" are superseded (flagged to the PM).
- The user never sees a dollar figure or a call count anywhere; the log's meta line shows tokens ("0.6k tokens (supervisor)", DESIGN), which is usage, not budget.
- D1 cost: three writes per model call (reserve, settle, `spend_day`), about 4.8 M writes a month at the volume above, inside Workers Paid's included 50 M. The reserve is the only write on the critical path (≤ 150 ms from far regions), inside the supervisor's 3 s deadline.
- **Every install now makes model calls** (always on, founder 2026-10-26). Exposure per account stays bounded by the caps: a Free user costs at most ~$0.52 in the first 14 days and $0.02 a month after. At 1,000 new installs a month and 10,000 free users, the worst case is about $500 + $200 a month; the typical case is about $110 + under $200. The cost study's §7b "everyone uses the full taste" is now the **expected** case, not the worst. Re-run the study with SP-SUP2's real prompt sizes and wake-up rate before launch.
- The 1-hour access token plus the account read on every call means sign-out and delete stop spending at once.

## Amendment 2026-10-26: the no-account taste (per install)

Founder, 2026-10-26: *"we make people have a small taste without sign up and then they have to create account or buy pro"*, then *"Let the no account also have to try the supervisor also but like small number of usage"*. Setup can finish without an account (ADR-0017); such an install gets a **fixed number of supervised decisions in total, not monthly**. The trial start point moves too: ~~the trial **starts when setup finishes**~~ **open**, recommended at sign-up (ADR-0017); the no-account taste never counts against it.

**Mechanism: the same reserve-and-settle, keyed by install instead of account.**
- **Identity:** a random install ID made by the server at `POST /v1/install/register` (ADR-0012), held on the PC as a signed install token (DPAPI, like the account tokens). **No hardware fingerprint, no machine data** (the founder rejected fingerprints). A reinstall or a wiped profile gets a new taste; accepted, it costs cents.
- **Period `install_taste`:** one row in D1 `install` (`id`, `decisions_used`, `used_micro_usd`, `reserved_micro_usd`, `created_at`); it never rolls over.
- **Two caps, both checked in the one conditional `UPDATE`:** `decisions_used < anonTasteDecisions` **and** `used + reserved + :max <= anonTasteMicroUsd`. The decision count is what you see; the dollar cap is the hidden backstop, so a decision can never cost more than planned even if prompts grow (the reason this ADR rejected counting calls). Only a model call that returns a valid decision counts as one; a timeout, a `413` or a provider error settles its cost but not a decision.
- **Anonymous daily cap:** every install-token reserve also checks `spend_day_anon` against `anonDailyMicroUsd`, inside the server-wide breaker. When it trips, no-account installs get `402 budget_empty` for the rest of the UTC day (rules only, the Euca asks you), and accounts are unaffected.
- **Taste used up:** `402 budget_empty` with `taste: 0`; the app stores "used up", **stops calling the server**, the Euca asks you (the normal needs-you), and the panel shows one calm line, once: "Sign up for 14 more days of the supervisor". No reminders.
- **What the app sees:** `{ period: "install_taste", tasteLeft }` (an integer of decisions). **Conflict to resolve:** decision 6 above and CR-011 say the app shows no counts; the approved addendum shows "7 of 10 supervisor answers left". Recommendation: allow a count **for the no-account taste only** (it counts answers, not budget; no money is ever sent), and scope the "no count field" contract test to the account meter. Needs the founder's OK; the fallback is a percentage like the account meter.

| Config key | Starting value | Why |
|---|---|---|
| `anonTasteDecisions` | **10** (open: 5 / 10 / 25) | Founder brief recommendation |
| `anonTasteMicroUsd` | 5,000 ($0.005) | 10 × the worst-case reservation (~$0.0005 at the cap on the dearest fallback model) |
| `anonDailyMicroUsd` | 5,000,000 ($5) | Bounds farming to $150 a month; at the measured average that is ~33,000 anonymous decisions a day |
| `installRegisterPerIp` | 3 an hour, 10 a day | Farming friction; in-memory rate limiting, no IP stored |

**The size, checked.** The brief's "~$0.002 per decision" is **4 – 13 times too high**: SP-SUP1 measured **$0.000148** a call, and the cap (2,000 in, 300 out) is **~$0.00035**, **~$0.0005** on the dearest fallback (Numbers, above). So 10 decisions cost **~$0.0015 typical, $0.005 worst**, not $0.02. Ten is about one working session's worth of unclear stops (the trial's ~750 calls over 14 days is ~50 a day), enough to see Pip decide something, small enough to leave a reason to sign up. **Recommendation: keep 10, keep the hidden dollar backstop, add the anonymous daily cap.** 25 would still cost only ~$0.0125 worst per install; 5 risks the taste ending before the user has seen one useful answer. SP-SUP2's real wake-up rate should re-check it before launch (config, no release).

**Worst-case cost (one-off per install, not monthly):**

| Installs that use the whole taste | At the brief's $0.002 | At the cap $0.0005 (worst) | At the measured $0.00015 |
|---|---|---|---|
| 1,000 | $20 | $5 | $1.50 |
| 10,000 | $200 | $50 | $15 |
| 100,000 | $2,000 | $500 | $150 |

**Farming case:** a script that re-registers installs to mint tastes gets 10 per IP a day; 1,000 rotating IPs → 10,000 installs a day × $0.005 = $50 a day, cut to **$5 a day ($150 a month at most)** by `anonDailyMicroUsd`, with OpenRouter's credit limit as the outer bound and the founder's kill switch for the anonymous path. Every farmed decision still needs a real redacted moment of the right shape to be useful, so the gain to an abuser is small.

**D1 load:** one register write + three writes per decision ≈ 31 writes per install; 100,000 installs ≈ 3.1 M writes, inside the included 50 M. Each `install` row is ~60 bytes (100,000 ≈ 6 MB); rows idle for 90 days are deleted.
