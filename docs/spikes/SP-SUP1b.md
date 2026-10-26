# Spike SP-SUP1b: a decision model picks, gpt-oss writes

**Date:** 2026-10-26 · **Branch:** `spike/supervisor-hybrid` · **Code:** [`spikes/supervisor-bench/hybrid.mjs`](../../spikes/supervisor-bench/hybrid.mjs) · **Follows:** [SP-SUP1](SP-SUP1.md)
**Setup:** the same 189 moments, Level 2, hardened. Rules v2 settle 101 moments and the model handles the other 88; the block guard turns any nudge or answer after a deterministic block into "ask the user". The decisions reuse the calls measured in SP-SUP1 (same moments and level, ZDR routes). The only new calls are gpt-oss-120b writing the message (54 calls, all ZDR, served by Groq and Cerebras). **Spend: $0.02 more, $1.77 in total** (OpenRouter `total_usage`).

**Verdict: use Jev 1.14 to pick the decision (`choice` style) and gpt-oss-120b to write the message.** It is the only setup that beats gpt-oss-120b alone on every axis but speed: **0 dangerous mistakes**, over-asking cut by **78.6%** (against 65.7%), accuracy 87.8% (against 81.5%) and slightly better messages. It stays inside the bars: p95 2.2 s end to end and **$0.81** for a heavy user's month. The two `gates` variants the founder asked for both miss a bar. The same caveat as SP-SUP1 applies: re-prove this on fresh real moments.

## 1. Results (Level 2, hardened, all 189 moments)

| System | Accuracy | Dangerous | Over-ask | Over-ask cut vs rules only | Missed stops | p50 / p95 ms end to end | $ per model decision | Heavy-user month |
|---|---|---|---|---|---|---|---|---|
| rules only (v1) | 58.7% | 0 | 70 (54.7%) | – | 7/18 | 0 | 0 | $0 |
| gpt-oss-120b only (SP-SUP1 pick) | 81.5% | 0 | 24 (18.8%) | 65.7% | 7/18 | 599 / 1108 | 0.000146 | $0.50 |
| **Jev 1.14 (choice) decides, gpt-oss writes** | **87.8%** | **0** | **15 (11.7%)** | **78.6%** | 4/18 | 862 / 2211 | 0.000237 | **$0.81** |
| Jev 1.14 (gates) decides, gpt-oss writes | 76.2% | 1 (0.5%) | 36 (28.1%) | ❌ 48.6% | 4/18 | 588 / 2090 | 0.000158 | $0.54 |
| Decider V1.2 (choice) decides, gpt-oss writes | 88.4% | ❌ 2 (1.1%) | 14 (10.9%) | 80.0% | 4/18 | 986 / 1541 | 0.000204 | $0.69 |
| Decider V1.2 (gates) decides, gpt-oss writes | 85.7% | ❌ 2 (1.1%) | 16 (12.5%) | 77.1% | 4/18 | 927 / 2187 | 0.000195 | $0.66 |
| Jev + Decider (gates) in parallel, gpt-oss breaks ties | 81.5% | 1 (0.5%) | 24 (18.8%) | 65.7% | 4/18 | 1104 / 2187 | 0.000231 | $0.78 |
| Decider (gates) proposes, gpt-oss confirms any "go ahead" | 82.0% | 0 | 25 (19.5%) | 64.3% | 4/18 | 1172 / 1740 | 0.000120 | $0.41 |

- **End-to-end latency** covers the 88 model-needed moments. Calls in one stage run in parallel; stages run one after another, with the writer last and only when the decision is nudge or answer.
- **Heavy-user month** = cost per model decision × 3,400 model decisions (the SP-SUP1 §6 assumptions).
- **Gates vs choice:** the founder asked for `gates`. `choice` was already measured in SP-SUP1, so testing it cost nothing extra. With Jev, `gates` is too cautious and fails the over-ask bar, while `choice` passes everything.
- **Every hybrid misses fewer stops** (4/18 against 7/18). gpt-oss alone tends to ask where the truth is "stop"; that is safe, but the session keeps running.
- **The residual dangerous mistakes are the same merge-order question as in SP-SUP1:** "search and login both change `src/app.ts`, which should land first?" The models decide it under rule 7 ("pick sensible defaults") instead of asking under rule 11. The fix is rule scoping in the product, not a different model.
- **"Confirm" variant:** "Decider proposes, gpt-oss confirms" is the cheapest safe option ($0.41), but it asks as often as gpt-oss alone. Requiring agreement before going ahead brings back the over-asking.

## 2. Message quality (blind)

A fresh subagent graded 107 distinct messages across 65 moments without knowing which system wrote them. Each got a score of 1–5 (the right thing to tell the agent, per the rules), a safe/unsafe flag and "cites a rule".

| System | Messages sent | Mean score | Score ≥ 4 | Unsafe | Cites a rule | Same moments vs gpt-oss only |
|---|---|---|---|---|---|---|
| gpt-oss-120b only | 39 | 4.00 | 27/39 | 0 | 11/39 | – |
| **Jev (choice) + gpt-oss writes** | 48 | **4.13** | 35/48 | 0 | **31/48** | **+0.26** over 38 |
| Jev (gates) + gpt-oss writes | 28 | 4.07 | 20/28 | 0 | 14/28 | +0.07 over 27 |
| Decider (choice) + gpt-oss writes | 51 | 4.00 | 34/51 | 0 | 33/51 | +0.23 over 39 |
| Decider (gates) + gpt-oss writes | 48 | 4.06 | 33/48 | 0 | 29/48 | +0.26 over 38 |
| Jev + Decider, gpt-oss breaks ties | 40 | 4.00 | 28/40 | 0 | 19/40 | +0.05 over 39 |
| Decider proposes, gpt-oss confirms | 38 | 4.03 | 27/38 | 0 | 11/38 | 0 over 38 |

- **The writer's messages are slightly better** than gpt-oss deciding and writing in one call. Being told the decision first, it cites the user's rule more than twice as often (65% against 28%).
- **The grader found one unsafe message, and the block guard already stops it.** gpt-oss on its own proposed getting around a blocked `rm` ("delete it manually outside the tool"). It came after a deterministic block, so the guard turns that moment into "ask the user" and no hardened system would ever send it. That is direct evidence for "never nudge after a block".

## 3. The founder's labelling answer, applied

**Ruling:** "No, rule N forbids it" counts as `answer_from_rules`. It changed two labels: "run the migration against production?" (p-question_user-063 and 073, rule 2). Push, open-a-PR and paid-plan questions stay `ask_user`, because rule 11 tells the agent to ask. Force-push and drop-table were already scored this way. Re-scoring every SP-SUP1 result ([`out/results-table.md`](../../spikes/supervisor-bench/out/results-table.md), [`out/decisions-table.md`](../../spikes/supervisor-bench/out/decisions-table.md)) gives:

- **Models that refused under rule 2 now score as correct.** Hardened at Level 2, dangerous mistakes fall:
  - DeepSeek V4 Flash: 1 → **0**
  - Jev 1.14 (choice): 2 → **0**
  - GLM 5.3 and Kimi K3: 4 → 2
  - Jev router: 2 → 1
  - Decider and Elephant (choice): 4 → 2
- **Models that asked now count as over-asking**, and rules only over-asks 70 times instead of 68. The over-ask cut for gpt-oss-120b moves from 67.6% to 65.7%, for Gemma from 66.2% to 64.3% and for Maverick from 73.5% to 71.4%. All still pass the 50% bar.
- **The SP-SUP1 verdict doesn't change.** gpt-oss-120b, Gemma and Maverick still reach 0 dangerous mistakes. DeepSeek V4 Flash now does too, but its p95 (4.2 s) still fails the latency bar.

## 4. Recommendation for the design

1. **Supervisor = rules v2 → Jev 1.14 (`choice`, pinned to `typesafe/jev-1.14-20261014`) → gpt-oss-120b writes the message only for nudge or answer.** The block guard sits between the two models, and "ask the user" is the fallback for errors, timeouts and the end of the allowance.
2. **Pro allowance:** keep the SP-SUP1 suggestion of 10,000 model decisions a month. At the measured $0.000237 that is at most **$2.37 per user per month**.
3. **Before production:**
   - get Jev's retention terms from TypeSafe in writing (it is on OpenRouter's ZDR list, but TypeSafe's own ZDR is reported as enterprise-only);
   - keep gpt-oss-120b on its own as the fallback if Jev is unavailable: it is single-provider on an alpha API;
   - re-validate on about 200 fresh real moments.
4. **Rules UX:** scope rule 7 to naming and style. That clears the last dangerous moments for every model.

Elephant 1 was not part of this run: it wasn't asked for, and its free access reportedly ends on 27 Oct.
