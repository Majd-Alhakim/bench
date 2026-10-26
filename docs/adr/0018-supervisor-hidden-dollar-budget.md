# ADR-0018: The supervisor allowance is a hidden dollar budget per account, metered on the server

- **Status:** Proposed (2026-10-26). Requirement: [CR-011](../requirements/change-requests/CR-011.md) §4–5 (approved), the founder's answer on drafting ([2026-10-26](../requirements/interviews/2026-10-26-v1.4-open-items.md)), [CR-012](../requirements/change-requests/CR-012.md) (the budget belongs to the account). **Amends ADR-0011** (allowance) and **ADR-0012** (quota). Evidence: the running-cost study §7b–7c (`docs/business/ops-cost-study-2026-10-26.md`).
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
