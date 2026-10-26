# ADR-0011: Supervisor: rules first, a provider-hosted open model only at Level 2, never approves

- **Status:** Proposed (2026-10-26). Evidence: [SP-SUP1](https://github.com/eucas-app/eucas/pull/56). Pro feature; **not in v0.1** (Pro is a waitlist), designed now so v0.1 doesn't paint it into a corner.
- **Date:** 2026-10-26

## Context
SP-SUP1 tested 11 open chat models and 3 decision models on 189 labelled moments. Only one shape passed every bar: deterministic rules first, the model only on what they can't settle, **Level 2 data** (signals plus the trimmed last message), a guard that turns any model nudge after a deterministic block into "ask the user", and "ask the user" as the fallback. Level 1 (signals only) failed for every chat model. The two hardening rules were written after seeing the results, so the bar must be re-proven on at least 300 real, blind-labelled moments before launch.

The only lever on an interactive session is the `Stop` hook (pre-mortem execution F42): block the stop with a reason (continue the conversation) or let it stop. `onFailure: "block"` has no effect on `Stop`, so a broken supervisor must fail to "let it stop and ask the user", which is safe.

## Decision
1. **Decisions:** `nudge | answer_from_rules | ask_user | stop | done`. The type has **no `allow` variant** and the supervisor module has no path to PreToolUse or PermissionRequest. It never approves a tool call; `answer_from_rules` replies to the agent's question and is not a permission.
2. **Order:** rules v2 (plain code, in `crates/eucas-core/src/supervisor/`) → if settled, done. Else, if the user chose Level 2 and has allowance → one model call through our server. Else → `ask_user`.
3. **Hard overrides after the model**, in code: any deterministic block in this task (limit or second secrets/delete block) → `ask_user`; `done` requires the signals to agree (full test suite green since the last edit, not a single file); at most 3 nudges per task (a fourth becomes `ask_user`); invalid or late output (> 3 s) → `ask_user`.
4. **Level 1 (default) calls no model.** Question-type moments go to the user; the UI offers Level 2 in plain words ("let Eucas read the agent's last message to ask you less"). Jev 1.14 at Level 1 is behind a flag for evaluation only.
5. **Models, server-side and hot-swappable** (ADR-0012): primary `openai/gpt-oss-120b` (reasoning low), then `google/gemma-4-26b-a4b-it`, then `meta-llama/llama-4-maverick`, then `ask_user`. OpenRouter with `provider: { zdr: true, data_collection: "deny", require_parameters: true, sort: "latency" }`. The optional **decision-model hybrid** (Jev 1.14 or Decider picks the decision, gpt-oss-120b writes text only for `nudge`/`answer_from_rules`) sits behind the `supervisor.hybrid` flag until it passes the same eval and its providers confirm retention in writing.
6. **Data leaves the machine only at Level 2 and only after the on-device trimmer and redactor** (SUPERVISOR.md §4). The exact payload is viewable before opt-in and in each log row.
7. **The eval harness is a regression suite** (`evals/supervisor/`), run on every change to rules, prompts or model config, and the launch gate is a fresh real held-out set of **at least 300** moments (SP-SUP1 §9: 1 % at 95 % confidence needs about 300 clean moments).

## Consequences
- The worst case of every supervisor failure is the rules-only experience: more questions, never an unasked action.
- The model never sees code, file contents, secrets, repo names or people's names, and never sees anything at Level 1.
- Prompt and model changes ship as signed server config, not app releases; each config version carries the eval score it passed.
- Pro's value depends on Level 2 opt-in; that is a product risk to track, not an engineering one.
