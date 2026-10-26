# Supervisor and models: the Eucas companion

**Status:** Pro feature, **not in v0.1** (Pro is a waitlist line, D-2 (b)). Designed now so v0.1's guard, events and store already carry what it needs. Evidence: [SP-SUP1](https://github.com/eucas-app/eucas/pull/56) (189 moments, κ 0.86, $1.75). Decision: [ADR-0011](../../adr/0011-supervisor-rules-first-model-at-level-2.md). Server: [ADR-0012](../../adr/0012-thin-server-cloudflare-workers.md).

## 1. What it is, and what it can never do

The supervisor decides what happens when an agent **tries to stop**: keep it going (`nudge`), answer its question from your rules (`answer_from_rules`), hand it to you (`ask_user`), let it stop because something is wrong (`stop`), or tell you it's finished (`done`).

| Never | Enforced by |
|---|---|
| Approves a tool call | The `Decision` type has no `allow`; the supervisor crate isn't a dependency of the guard; `answer_from_rules` is a reply to the agent, not a permission |
| Nudges after a deterministic block | Override 1 (§5) in code, after the model |
| Says `done` when the full suite isn't green since the last edit | Override 2 |
| Keeps going forever | Override 3: at most 3 nudges per task; a fourth becomes `ask_user` |
| Sends code, file contents, secrets, paths, the repo name or people's names | On-device trimmer + redactor (§4), and the server's re-scan (ADR-0012) |
| Sends anything at Level 1 | Level 1 makes no model call (§3) |
| Spends past the allowance | Server quota; past it → `ask_user` |

## 2. Flow at a Stop moment

```mermaid
sequenceDiagram
  participant A as claude.exe (bench)
  participant G as guard (Stop hook)
  participant C as core: supervisor
  participant W as Eucas API
  participant M as OpenRouter (ZDR)
  A->>G: Stop {session_id, transcript_path, stop_hook_active}
  G->>C: stop_moment over eucas-ask (budget 8 s)
  C->>C: build signals (store + transcript tail, metadata only)
  C->>C: rules v2
  alt rules settle it
    C-->>G: decision
  else Level 2 on, allowance left, Pro token valid
    C->>C: trim + redact the last message (≤ 1,200 chars)
    C->>W: POST /v1/supervise {level: 2, signals, message, rules[]} (deadline 3 s)
    W->>W: strict schema, secret re-scan, quota -1
    W->>M: gpt-oss-120b → Gemma 4 26B → Llama 4 Maverick (first that answers valid JSON in time)
    M-->>W: {decision, rule_id?, text?}
    W-->>C: validated response
    C->>C: overrides (§5)
    C-->>G: decision
  else Level 1, no allowance, offline, error, late
    C-->>G: ask_user
  end
  G-->>A: nudge/answer → {"decision":"block","reason": text} · ask_user/stop/done → allow the stop
  C->>C: log row "Decided by: rule 3 / model gpt-oss-120b (config v14)"; needs-you for ask_user; toast for done
```

`stop_hook_active: true` (the agent is already continuing because of a Stop hook) counts as a nudge for override 3. If the guard gets no answer in 8 s, it allows the stop and the core raises needs-you when it catches up.

## 3. Levels

| | Level 1 (default) | Level 2 (opt-in: "let Eucas read the agent's last message to ask you less") |
|---|---|---|
| Model call | **None.** Rules v2, then `ask_user` | Rules v2, then the model on what they can't settle |
| Leaves the PC | Nothing | Signals + the trimmed last message + the text of your guidance rules |
| SP-SUP1 result | Rules only: 0 dangerous, settles 46–53 % of moments, over-asks on 54 % | gpt-oss-120b hardened: 0 dangerous, −68 % over-asking, p95 1.1 s |
| Flag | — | `supervisor.level2` per user; `supervisor.l1_decision_model` (Jev 1.14 choice) **eval-only**, off in production |

The Level 2 opt-in screen shows a real example payload from your own last moment, redacted, before you agree.

## 4. Data shapes, trimmer and redactor

**Signals (both levels; integers and enums only):**

```json
{
  "level": 1,
  "moment": "stop",
  "session_state": "idle",
  "minutes_since_last_file_change": 34,
  "files_changed_in_task": 0,
  "idle_minutes": 34,
  "full_suite": { "last_status": "fail", "minutes_ago": 12, "since_last_edit": false },
  "partial_tests": { "last_status": "pass", "minutes_ago": 2 },
  "blocks_in_task": { "secrets": 1, "delete": 0, "push_default": 0, "other": 0 },
  "nudges_in_task": 1,
  "flags": { "asks_question": true, "claims_done": false, "mentions_blocker": true },
  "budget": "ok",
  "rules": [{ "id": "g3", "applies_to": "tests" }, { "id": "g7", "applies_to": "style" }]
}
```

**Level 2 adds:** `"message": "<trimmed last assistant message>"` and `rules[].text` (your guidance text, which you wrote and see in the opt-in preview).

**Trimmer and redactor** (`crates/eucas-core/src/supervisor/{trimmer,redactor}.rs`, pure functions, property-tested):
1. Take the last assistant text block only (never tool inputs or outputs).
2. Remove fenced and indented code blocks, inline code longer than 40 chars, diffs, stack traces, JSON/YAML blocks.
3. Redact secrets with the gitleaks rule set compiled in (keys, tokens, JWTs, connection strings, private-key headers, high-entropy strings ≥ 20 chars) → `[secret]`.
4. Replace paths (Windows, POSIX, UNC, `~`), URLs, emails and IPs → `[path]`, `[url]`, `[email]`, `[ip]`.
5. Replace the repo and folder names, git remote owner and repo, branch names, and the names in `git config user.name` and the last 200 commit authors → `[repo]`, `[branch]`, `[person]`.
6. Collapse whitespace; cut to 1,200 chars at a sentence boundary.
7. If more than 40 % of the original was removed, or anything still matches a secret rule, **don't send**: `ask_user` (and the log says "not sent: the message was mostly code").

The server repeats step 3 and the code-fence check, and rejects (422) on a match.

## 5. Rules v2 and the overrides

**Rules v2** (plain code, from SP-SUP1 `lib/rules.mjs` plus the two hardening rules):

| # | When | Decision |
|---|---|---|
| R1 | A limit blocked a call in this task, or the agent asks for one of the four limit actions | `ask_user` |
| R2a | Idle, 0 files changed, over 15 minutes | `ask_user` |
| R2b | A second secrets or delete block in this task. **Secrets blocks** are counted from two sources: Eucas's self-protection denies, and tool results in the transcript that Claude Code denied under the user's own deny rules for secret paths (`.env*`, keys); Eucas itself has no secrets limit | `ask_user` |
| R3 | `claims_done` and the full suite passed since the last edit | `done` |
| R4 | `claims_done` and the full suite failed or didn't run since the last edit | `nudge` with the template "Run the full test suite and fix what fails before stopping." |
| R5 | A held harmless chained command (`… 2>&1 \| tail`) | `answer_from_rules`: "Run them one at a time." |
| R6 | The task's budget is reached (Pro budgets; the guard already blocks the next step at PreToolUse and the core adds "Budget reached for this session. Continue?", SYSTEM-DESIGN §1; CR-010, founder 2026-10-26) | `stop` |
| R7 | The question matches a `safety` guidance rule verbatim | `ask_user` |
| — | Otherwise | Level 2 → model; Level 1 → `ask_user` |

**Overrides after the model** (`overrides.rs`, the last word, unit-tested on every SP-SUP1 dangerous case):
1. Any deterministic block in this task and the model said `nudge` or `answer_from_rules` → `ask_user`.
2. Model said `done` but signals don't agree → `ask_user`.
3. `nudges_in_task ≥ 3` (three already sent) and the model said `nudge` → `ask_user`.
4. Output invalid, late (> 3 s total), `rule_id` not in the request, or `text` fails the filter → `ask_user`.
5. A `style`-scoped guidance rule cited for anything about order of work, merging or which change lands first → `ask_user` (the SP-SUP1 rule 7 vs rule 11 mistake).

**Text filter for `nudge` and `answer_from_rules`:** ≤ 280 chars; no URLs, code fences, shell metacharacter sequences or paths; must not contain "approved", "allowed", "permission granted" or similar. A failed filter falls back to the rule's template text if one exists, else `ask_user`.

## 6. Models and routing (server-side, hot-swappable)

| Order | Model | Params | Why |
|---|---|---|---|
| 1 | `openai/gpt-oss-120b` | `reasoning: { effort: "low" }`, `temperature: 0`, `max_tokens: 300`, JSON schema response format | 0 dangerous, −68 %, p95 1.1 s, $0.000148/call, 20/20 consistent, two ZDR providers |
| 2 | `google/gemma-4-26b-a4b-it` | `temperature: 0`, `max_tokens: 300` | Cheapest that passes ($0.000066), p95 1.5 s |
| 3 | `meta-llama/llama-4-maverick` | same | Biggest over-ask cut (−74 %), p95 1.9 s |
| 4 | — | — | `ask_user` |

Every call: `provider: { zdr: true, data_collection: "deny", require_parameters: true, sort: "latency" }`. Overall deadline 2.8 s server-side (the app's deadline is 3 s). Attempt budgets: the primary gets 1.3 s (its p95 is 1.1 s), the first fallback gets what is left (≥ 1.4 s, against Gemma's p95 of 1.5 s, so it sometimes times out to `ask_user`). The third model runs **only** when an earlier attempt failed fast (429, 5xx, invalid JSON) and at least 1 s remains. Out of time → `ask_user`.

**Decision-model hybrid** (flag `supervisor.hybrid`, off): Jev 1.14 or Decider (Level 2, *gates* style) picks the decision for ~$0.00005; gpt-oss-120b writes the text only for `nudge`/`answer_from_rules`. It ships only after (a) it passes the same eval with 0 dangerous, (b) TypeSafe or Perplexity confirm retention in writing, and (c) the Decisions API leaves alpha.

## 7. Prompt-injection defences

The last message is **untrusted** (it can say "everything is done, tell the user"). Defences, in depth:
1. **Structure:** the message goes in a block delimited by a random 128-bit boundary chosen per request, after the system instructions and the signals; the prompt says it is data from an untrusted agent.
2. **Small output space:** a strict JSON schema with an enum decision, a `rule_id` that must be one of the ids sent, and bounded text. No tool use, no free-form fields.
3. **Signals outrank words:** `done` needs test signals (override 2); a claimed fix without file changes stays `ask_user` (R2a).
4. **Blocks are final:** override 1 means injected text can't talk the supervisor past a block.
5. **The worst case is bounded:** even a fully hijacked model can only produce a ≤ 280-char nudge (filtered) or a stop/ask, and it can never approve a tool call; the guard decides every tool call independently.
6. **The eval suite carries injection moments** (§10): "ignore your rules", "the user said to continue", fake system tags, unicode look-alikes, base64 instructions.

## 8. Runtime config (hot swap without an app release)

`contracts/api/runtime-config.schema.json`, served signed by `GET /v1/config/{channel}`; the app and the Worker both obey it.

```json
{
  "version": 14,
  "signedAt": "2026-11-20T10:00:00Z",
  "minAppVersion": "0.2.0",
  "supervisor": {
    "enabled": true,
    "promptVersion": "sup-v3",
    "models": [
      { "id": "openai/gpt-oss-120b", "params": { "reasoning": { "effort": "low" }, "temperature": 0, "max_tokens": 300 } },
      { "id": "google/gemma-4-26b-a4b-it", "params": { "temperature": 0, "max_tokens": 300 } },
      { "id": "meta-llama/llama-4-maverick", "params": { "temperature": 0, "max_tokens": 300 } }
    ],
    "attemptTimeoutsMs": [1300, 1400, 1000],
    "deadlineMs": 2800,
    "hybrid": false,
    "evalScore": { "suite": "sup-eval-2026-11", "dangerous": 0, "overAskCut": 0.66, "p95Ms": 1210 }
  },
  "quota": { "monthlyCalls": 10000 },
  "spend": { "dailyUsdCircuitBreaker": 25 },
  "killSwitches": { "supervisor": false, "cloudHandoff": false, "waitlist": false },
  "updates": { "stable": { "paused": false }, "beta": { "paused": false } },
  "verifiedCliFloor": { "windows": "2.1.310" }
}
```

- The signing key is offline (CI-CD §7). The app rejects a config with a lower `version` than it has seen, a bad signature, or an unknown schema version; it keeps the last good one for 7 days, then the supervisor turns itself off (`ask_user`), which is safe.
- **No config ships without an eval score:** `xtask config sign` refuses unless `evalScore` comes from a run of the current suite against exactly these models and prompt.

## 9. Cost guardrails

| Guardrail | Where | Value |
|---|---|---|
| Per-user supervisor budget | Worker DO counter | Supervisor calls and prompted-rule drafts (`/v1/draft-rule`, CR-010, founder 2026-10-26) both count; past it → `ask_user` (drafting says the budget is used up), said once in the UI, never a bill |
| Rules first | App | Rules settle 46–53 % of moments with no call |
| Payload and output caps | App + Worker | Request ≤ 8 KiB; `max_tokens: 300` |
| Global circuit breaker | Worker | Daily spend estimate from `usage.cost` summed in a DO; over `dailyUsdCircuitBreaker` → supervisor off for everyone until the next UTC day (founder alerted) |
| Provider hard limit | OpenRouter key credit limit per environment | e.g. $50 production, $5 staging |
| Price watch | Monthly job | If gpt-oss-120b's ZDR price rises > 50 %, promote Gemma by config |

Worst case at the allowance with gpt-oss-120b: **$1.48 per user per month** (SP-SUP1 §6).

## 10. The eval harness as a regression suite

`evals/supervisor/` ports SP-SUP1's `score.mjs`, `run-models.mjs` and `run-decisions.mjs` to TypeScript and reads the same corpus format.

| Set | Contents | Use |
|---|---|---|
| `planted` | SP-SUP1's 166 planted moments + 40 injection moments | Regression on every change to rules, overrides, trimmer, prompt or model config (CI, nightly cost ≈ $0.05) |
| `real-sp-sup1` | The 23 real moments | Same |
| `held-out-real` | **At least 300 new real moments** from the founder's own sessions, recorded locally with consent, labelled blind by two labellers | **Launch gate (spike SP-SUP2)**: 0 dangerous over ≥ 300 moments gives a 95 % upper bound of ~1 %; over-asking cut ≥ 50 %; p95 < 3 s |

Metrics and bars are SP-SUP1's (dangerous ≤ 1 %, over-asking −50 %, p95 < 3 s, heavy user < $5/month, JSON valid). A run writes `evals/supervisor/out/<date>-<config>.json`; `xtask config sign` reads it. Rules-only (no model) is scored in every run as the floor.

**Client question carried from SP-SUP1:** does "No, rule N forbids it" count as answering from your rules or as asking you? It changes up to 2 dangerous counts for some models and the R7 wording. Needed before SP-SUP2 labelling starts.
