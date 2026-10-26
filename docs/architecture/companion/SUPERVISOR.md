# Supervisor and models: the Eucas companion

**Status:** ~~Pro feature, **not in v0.1** (Pro is a waitlist line, D-2 (b)).~~ **Updated 2026-10-26 (CR-011, CR-012, founder decisions relayed by the PM):**
- **In v0.1, always on for every user, Free included, with no off switch:** *"The supervisor is the main thing for this tool so keep it on and tell the user what is being sent."* **Level 1 / Level 2 are retired;** every moment the rules can't settle sends what Level 2 sent (signals + the trimmed, redacted last message), through the Worker to the zero-data-retention provider. Setup and Settings show exactly what is sent (§3).
- **Tiers differ only in budget** ([ADR-0018](../../adr/0018-supervisor-hidden-dollar-budget.md)): a 14-day trial that starts when setup finishes (one per account), then a monthly taste on Free; Pro gets more. **An empty budget means rules only**, asking you more.
- **SP-SUP2 is the gate:** it ships behind `killSwitches.supervisor`, on (rules only) until the real-moment eval passes (§10).
- Every call needs a Eucas account token ([ADR-0017](../../adr/0017-accounts-email-code-d1.md)). Evidence: [SP-SUP1](https://github.com/eucas-app/eucas/pull/56) (189 moments, κ 0.86, $1.75). Decision: [ADR-0011](../../adr/0011-supervisor-rules-first-model-at-level-2.md). Server: [ADR-0012](../../adr/0012-thin-server-cloudflare-workers.md).

## 1. What it is, and what it can never do

The supervisor decides what happens when an agent **tries to stop**: keep it going (`nudge`), answer its question from your rules (`answer_from_rules`), hand it to you (`ask_user`), let it stop because something is wrong (`stop`), or tell you it's finished (`done`).

| Never | Enforced by |
|---|---|
| Approves a tool call | The `Decision` type has no `allow`; the supervisor crate isn't a dependency of the guard; `answer_from_rules` is a reply to the agent, not a permission |
| Nudges after a deterministic block | Override 1 (§5) in code, after the model |
| Says `done` when the full suite isn't green since the last edit | Override 2 |
| Keeps going forever | Override 3: at most 3 nudges per task; a fourth becomes `ask_user` |
| Sends code, file contents, secrets, paths, the repo name or people's names | On-device trimmer + redactor (§4), and the server's re-scan (ADR-0012) |
| ~~Sends anything at Level 1~~ | Retired with the levels (2026-10-26) |
| Sends anything you can't see | Settings › What is sent shows the last 20 payloads verbatim, and setup shows one from your own week before it finishes (§3) |
| Spends past the allowance | Server budget reserve (ADR-0018); past it → rules only, `ask_user` |

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
  else signed in, kill switch off, budget reserved (ADR-0018)
    C->>C: trim + redact the last message (≤ 1,200 chars)
    C->>W: POST /v1/supervise {signals, message, rules[]} + account token (deadline 3 s)
    W->>W: token, strict schema, secret re-scan, prompt cap ~2,000 tokens, reserve worst-case cost
    W->>M: gpt-oss-120b → Gemma 4 26B → Llama 4 Maverick (first that answers valid JSON in time)
    M-->>W: {decision, rule_id?, text?}
    W-->>C: validated response + meter (percent, reset date)
    W->>W: settle the actual cost (after responding)
    C->>C: overrides (§5); append the payload to the local sent log
    C-->>G: decision
  else budget empty, signed out, offline, kill switch, error, late → rules only
    C-->>G: ask_user
  end
  G-->>A: nudge/answer → {"decision":"block","reason": text} · ask_user/stop/done → allow the stop
  C->>C: log row "Decided by: rule 3 / model gpt-oss-120b (config v14)"; needs-you for ask_user; toast for done
```

`stop_hook_active: true` (the agent is already continuing because of a Stop hook) counts as a nudge for override 3. If the guard gets no answer in 8 s, it allows the stop and the core raises needs-you when it catches up.

## 3. What is sent (always on; replaces the levels, 2026-10-26)

~~Level 1 (default, no model call) and Level 2 (opt-in: the last message).~~ **Retired by the founder, 2026-10-26.** There is one mode for everyone:

| | Every moment the rules can't settle (signed in, budget left) |
|---|---|
| Model call | Rules v2 first; then the model |
| Leaves the PC | Signals (integers and enums) + the trimmed, redacted last message (≤ 1,200 chars) + the text of your guidance rules (§4) |
| Never leaves | Code, file contents, tool inputs and outputs, secrets, paths, repo, branch and people's names |
| When the budget is empty, signed out, offline or the kill switch is on | **Rules only**: nothing is sent, and the Euca asks you more (SP-SUP1: rules alone settle 46–53 % of moments and over-ask on 54 %) |
| Flags | ~~`supervisor.level2` per user~~ (removed); `supervisor.l1_decision_model` stays **eval-only**, off in production |

**"Tell the user what is being sent"** (founder):
- **Setup** shows a real payload built from your own last week's moment (from the retro), redacted, exactly as it would be sent, with the line saying it's sent by default. If the retro has no moment, a fixed example is shown and labelled as one.
- **Settings › What is sent** shows the last 20 payloads **verbatim as sent**, with time and session (the local sent log, ADR-0015), plus the fixed list of what is never sent.
- Each log row's **Why?** shows that moment's payload.

## 4. Data shapes, trimmer and redactor

**Signals (integers and enums only):**

```json
{
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

**Plus:** `"message": "<trimmed last assistant message>"` and `rules[].text` (your guidance text, which you wrote and see in What is sent). ~~Level 2 adds…~~ (no levels since 2026-10-26).

**Trimmer and redactor** (`crates/eucas-core/src/supervisor/{trimmer,redactor}.rs`, pure functions, property-tested):
1. Take the last assistant text block only (never tool inputs or outputs).
2. Remove fenced and indented code blocks, inline code longer than 40 chars, diffs, stack traces, JSON/YAML blocks.
3. Redact secrets with the gitleaks rule set compiled in (keys, tokens, JWTs, connection strings, private-key headers, high-entropy strings ≥ 20 chars) → `[secret]`.
4. Replace paths (Windows, POSIX, UNC, `~`), URLs, emails and IPs → `[path]`, `[url]`, `[email]`, `[ip]`.
5. Replace the repo and folder names, git remote owner and repo, branch names, and the names in `git config user.name` and the last 200 commit authors → `[repo]`, `[branch]`, `[person]`.
6. Collapse whitespace; cut to 1,200 chars at a sentence boundary.
7. If more than 40 % of the original was removed, or anything still matches a secret rule, **don't send**: `ask_user` (and the log says "not sent: the message was mostly code").

**Since the supervisor is always on (2026-10-26), this pipeline is release-gating safety code**, held to the same bar as the limits: the redaction corpus (gitleaks vectors, SP-SUP1 and SP-SUP2 messages, Windows paths without backslashes as the SP-SUP2 recorder found, names) runs on every PR touching `supervisor/`, a property test asserts no output matches a secret or path rule, and a regression is a release blocker (SECURITY-PRIVACY T16). The SP-SUP2 recorder's on-device scrubber is the reference implementation to port.

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
| — | Otherwise | Model (signed in, budget left); else rules only → `ask_user` |

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

**Decision-model hybrid** (flag `supervisor.hybrid`, off): Jev 1.14 or Decider (*gates* style) picks the decision for ~$0.00005; gpt-oss-120b writes the text only for `nudge`/`answer_from_rules`. It ships only after (a) it passes the same eval with 0 dangerous, (b) TypeSafe or Perplexity confirm retention in writing, and (c) the Decisions API leaves alpha.

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
  "budgets": { "setupMicroUsd": 20000, "trialDays": 14, "trialMicroUsd": 500000, "tasteMicroUsdPerMonth": 20000, "proMicroUsdPerMonth": 1480000, "promptTokenCap": 2000, "maxOutputTokens": 300, "providerFee": 0.055, "pricesMicroUsdPerMTok": { "openai/gpt-oss-120b": { "in": 100000, "out": 500000 } } },
  "spend": { "dailyUsdCircuitBreaker": 25 },
  "killSwitches": { "supervisor": false, "cloudHandoff": false, "waitlist": false },
  "updates": { "stable": { "paused": false }, "beta": { "paused": false } },
  "verifiedCliFloor": { "windows": "2.1.310" }
}
```

- `quota.monthlyCalls` was replaced by `budgets` (ADR-0018, 2026-10-26); prices are illustrative and must be copied from OpenRouter when the config is signed (one entry per model in the chain).
- The signing key is offline (CI-CD §7). The app rejects a config with a lower `version` than it has seen, a bad signature, or an unknown schema version; it keeps the last good one for 7 days, then the supervisor turns itself off (`ask_user`), which is safe.
- **No config ships without an eval score:** `xtask config sign` refuses unless `evalScore` comes from a run of the current suite against exactly these models and prompt.

## 9. Cost guardrails

| Guardrail | Where | Value |
|---|---|---|
| Per-account supervisor budget (ADR-0018) | Worker, D1 (reserve before, settle after) | A **hidden dollar budget** per period: trial ~$0.50 (14 days from the end of setup), taste ~$0.02 a month, Pro ~$1.48 a month (founder, 2026-10-26). Supervisor calls and prompted-rule drafts both count; past it → **rules only** (drafting shows the guided form); the meter shows percent and reset date, **never dollars or counts** |
| Prompt cap | Worker | ~2,000 tokens estimated as `utf8 bytes / 3`; guidance text trimmed first, else `413` → ask you (CR-011) |
| Rules first | App | Rules settle 46–53 % of moments with no call |
| Payload and output caps | App + Worker | Request ≤ 8 KiB; `max_tokens: 300` |
| Global circuit breaker | Worker | Daily spend estimate from `usage.cost` summed in a DO; over `dailyUsdCircuitBreaker` → supervisor off for everyone until the next UTC day (founder alerted) |
| Provider hard limit | OpenRouter key credit limit per environment | e.g. $50 production, $5 staging |
| Price watch | Monthly job | If gpt-oss-120b's ZDR price rises > 50 %, promote Gemma by config |

~~Worst case at the allowance with gpt-oss-120b: **$1.48 per user per month** (SP-SUP1 §6).~~ **Worst case per account = its period cap** (ADR-0018). Because the supervisor is always on, **every signed-in install spends**: at 1,000 new installs and 10,000 free users a month, at most about $700 a month (trials $500 + taste $200), typically about $110 + under $200 (cost study §7b, to re-run with SP-SUP2's real numbers).

## 10. The eval harness as a regression suite

`evals/supervisor/` ports SP-SUP1's `score.mjs`, `run-models.mjs` and `run-decisions.mjs` to TypeScript and reads the same corpus format.

| Set | Contents | Use |
|---|---|---|
| `planted` | SP-SUP1's 166 planted moments + 40 injection moments | Regression on every change to rules, overrides, trimmer, prompt or model config (CI, nightly cost ≈ $0.05) |
| `real-sp-sup1` | The 23 real moments | Same |
| `held-out-real` | **At least 300 new real moments** from the founder's own sessions, recorded locally with consent, labelled blind by two labellers | **v0.1 launch gate for the supervisor (spike SP-SUP2; founder 2026-10-26)**; until it passes, `killSwitches.supervisor` keeps everyone on rules only: 0 dangerous over ≥ 300 moments gives a 95 % upper bound of ~1 %; over-asking cut ≥ 50 %; p95 < 3 s |

Metrics and bars are SP-SUP1's (dangerous ≤ 1 %, over-asking −50 %, p95 < 3 s, JSON valid), plus two added 2026-10-26 because the egress is now default-on: **0 payloads in the set that leak a secret, path or name after redaction**, and the measured prompt size and wake-up rate, which re-set the caps in ADR-0018. ~~heavy user < $5/month~~ (bounded by the budget now). A run writes `evals/supervisor/out/<date>-<config>.json`; `xtask config sign` reads it. Rules-only (no model) is scored in every run as the floor.

~~**Client question carried from SP-SUP1:** does "No, rule N forbids it" count as answering from your rules or as asking you?~~ **Answered (founder, session 5):** it counts as answering from the rules.
