# ADR-0011: Supervisor: rules first, then a provider-hosted open model, never approves (always on since 2026-10-26; was "only at Level 2")

- **Status:** Accepted (2026-10-26, Gate 6 decision 4a); proposed 2026-10-26. Evidence: [SP-SUP1](https://github.com/eucas-app/eucas/pull/56). Pro feature; **not in v0.1** (Pro is a waitlist), designed now so v0.1 doesn't paint it into a corner.
- **Date:** 2026-10-26
- **Amended 2026-10-26 (CR-011, CR-012, founder answers):** the allowance is a **hidden dollar budget per account**, never shown as dollars, with prompts capped at about 2,000 tokens ([ADR-0018](0018-supervisor-hidden-dollar-budget.md)). **Free gets the supervisor too:** a 14-day trial (about $0.50) at sign-up, then a monthly taste (about $0.02). Every call needs a Eucas account token ([ADR-0017](0017-accounts-email-code-d1.md)). Pressing **Draft** is the opt-in for that one sentence.
- **Amended again 2026-10-26 (founder decisions, relayed by the PM):**
  1. The trial and taste **ship in v0.1**, with **SP-SUP2 as the gate**.
  2. **Level 1 / Level 2 are retired.** The supervisor is **always on for every user, Free included, with no off switch**: *"The supervisor is the main thing for this tool so keep it on and tell the user what is being sent."* What is sent equals the old Level 2 (signals + the trimmed, redacted last message), through the Worker to the zero-data-retention provider. Setup and Settings show exactly what is sent.
  3. The tiers differ only in budget. The 14-day trial starts when setup finishes, one per account.
  4. When the budget is empty, the supervisor falls back to rules only and asks the user more.

  Decisions 2, 4 and 6 below are rewritten to match; struck text is kept for history.

## Context
SP-SUP1 tested 11 open chat models and 3 decision models on 189 labelled moments. Only one shape passed every bar: deterministic rules first, the model only on what they can't settle, **Level 2 data** (signals plus the trimmed last message), a guard that turns any model nudge after a deterministic block into "ask the user", and "ask the user" as the fallback. Level 1 (signals only) failed for every chat model. The two hardening rules were written after seeing the results, so the bar must be re-proven on at least 300 real, blind-labelled moments before launch.

The only lever on an interactive session is the `Stop` hook (pre-mortem execution F42): block the stop with a reason (continue the conversation) or let it stop. `onFailure: "block"` has no effect on `Stop`, so a broken supervisor must fail to "let it stop and ask the user", which is safe.

## Decision
1. **Decisions:** `nudge | answer_from_rules | ask_user | stop | done`. The type has **no `allow` variant** and the supervisor module has no path to PreToolUse or PermissionRequest. It never approves a tool call; `answer_from_rules` replies to the agent's question and is not a permission.
2. **Order:** rules v2 (plain code, in `crates/eucas-core/src/supervisor/`) → if settled, done. Else, if the install is signed in and the server reserves budget for the call (ADR-0018) → one model call through our server. Else (no budget, signed out, offline, kill switch) → **rules only**, so `ask_user`.
3. **Hard overrides after the model**, in code: any deterministic block in this task (limit or second secrets/delete block) → `ask_user`; `done` requires the signals to agree (full test suite green since the last edit, not a single file); at most 3 nudges per task (a fourth becomes `ask_user`); invalid or late output (> 3 s) → `ask_user`.
4. **Retired 2026-10-26 (founder): there are no levels; the supervisor is always on.** In their place: setup's "What is sent" step and Settings › What is sent show a real payload from your own last moment exactly as sent, plus the last 20 payloads verbatim. Old text: ~~**Level 1 (default) calls no model.** Question-type moments go to the user; the UI offers Level 2 in plain words ("let Eucas read the agent's last message to ask you less"). Jev 1.14 at Level 1 is behind a flag for evaluation only.~~
5. **Models, server-side and hot-swappable** (ADR-0012): primary `openai/gpt-oss-120b` (reasoning low), then `google/gemma-4-26b-a4b-it`, then `meta-llama/llama-4-maverick`, then `ask_user`. OpenRouter with `provider: { zdr: true, data_collection: "deny", require_parameters: true, sort: "latency" }`. The optional **decision-model hybrid** (Jev 1.14 or Decider picks the decision, gpt-oss-120b writes text only for `nudge`/`answer_from_rules`) sits behind the `supervisor.hybrid` flag until it passes the same eval and its providers confirm retention in writing.
6. **Data leaves the machine ~~only at Level 2 and~~ by default (always on, 2026-10-26), only after the on-device trimmer and redactor** (SUPERVISOR.md §4), which are therefore **release-gating safety code** (SECURITY-PRIVACY T16). The exact payload is shown in setup ("What is sent"), in Settings and in each log row.
7. **The eval harness is a regression suite** (`evals/supervisor/`), run on every change to rules, prompts or model config, and the launch gate is a fresh real held-out set of **at least 300** moments (SP-SUP1 §9: 1 % at 95 % confidence needs about 300 clean moments).

## Consequences
- The worst case of every supervisor failure is the rules-only experience: more questions, never an unasked action.
- The model never sees code, file contents, secrets, repo names or people's names. ~~…and never sees anything at Level 1.~~ Since 2026-10-26 it sees the redacted last message of every moment the rules can't settle, for every signed-in user with budget left.
- Prompt and model changes ship as signed server config, not app releases; each config version carries the eval score it passed.
- ~~Pro's value depends on Level 2 opt-in.~~ With always-on, the product risk moves to trust: a user who won't accept the egress can only uninstall, because there is no off switch. Track it (BUILD-PLAN §6).
- **SP-SUP2 is the v0.1 gate (founder, 2026-10-26):** the supervisor ships behind `killSwitches.supervisor`, which stays on (rules only for everyone) until the ≥ 300 real-moment eval passes.
