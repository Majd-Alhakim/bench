# Supervisor model comparison (from SP-SUP1, 2026-10-26)

**Source:** [SP-SUP1](https://github.com/eucas-app/eucas/pull/56) (`docs/spikes/SP-SUP1.md`).
- **Corpus:** 189 labelled moments from the dummy project "Shelfie": 23 real, 166 planted.
- **Labelling:** two labellers, κ 0.86.
- **Routing:** OpenRouter with zero data retention.
- **Spend:** $1.75.

**How to read it.** The supervisor is a **system**: plain-code rules first (they settle 46–53% of moments), the model only on the rest, and "ask you" whenever the model is unsure, out of allowance, or a deterministic rule has already blocked something.

| Score | What it means | Pass bar |
|---|---|---|
| **Dangerous** | The model said "keep going" or "answer it" when it should have asked you or stopped | ≤ 1% |
| **Over-ask cut** | How many fewer questions you get than with rules alone | ≥ 50% |
| **p95** | 95% of decisions come back within this time | < 3 s |
| **Heavy user / month** | Model cost for 6 agents, 8 h/day, 22 days | < $5 |

All results are at **Level 2** (signals plus the trimmed last message), hardened (rules v2 plus "never nudge after a block"). **Level 1 (signals only) failed for every chat model**; see the bottom section.

## 1. Comparison table

| Model | Type | Dangerous | Over-ask cut | Accuracy (raw) | p95 | Heavy user / month | Same answer twice | Passes all bars? | Production ready? |
|---|---|---|---|---|---|---|---|---|---|
| **openai/gpt-oss-120b** | Open chat model, 117B MoE | **0%** | **−68%** | 79.9% | **1.1 s** | **$0.51** | **20/20** | ✅ **Yes** | ✅ Two no-retention providers (Groq, BaseTen) |
| meta-llama/llama-4-maverick | Open chat model, 400B MoE | 0% | **−74%** | 82.0% | 1.9 s | $0.69 | — | ✅ Yes | ✅ Parasail, DigitalOcean |
| google/gemma-4-26b-a4b-it | Open chat model, 25B MoE | 0% | −66% | 85.2% | 1.5 s | **$0.23** | 18/20 | ✅ Yes | ✅ Makora, CoreWeave |
| mistralai/mistral-small-2603 | Open chat model | 0% | passes | 76.7% | ❌ 5.7 s | $0.32 | — | ❌ Too slow | ⚠️ One provider, rate-limited |
| nvidia/nemotron-3.5-lightning | Open chat model, 30B MoE | 0% | passes | 80.4% | ❌ 5.2 s | $0.92 | — | ❌ Too slow; 26% broken JSON | ⚠️ |
| deepseek/deepseek-v4-pro | Open chat model, 1.6T MoE | 0% | passes | 89.4% | ❌ 17 s | ❌ $3.79 (stress $11) | — | ❌ Too slow, too costly | ✅ |
| deepseek/deepseek-v4-flash | Open chat model, 284B MoE | 0.5% | passes | **91.0%** | ❌ 4.2 s | $0.60 | 15–19/20 | ❌ Too slow | ⚠️ One provider |
| openai/gpt-oss-20b | Open chat model, 21B MoE | 0.5% | passes | 77.8% | 1.5 s | $0.12 | — | ⚠️ Borderline | ✅ CoreWeave |
| z-ai/glm-5.3 | Open chat model | ❌ 2.1% (4) | −96% | 88.9% | 2.4 s | $1.03 | — | ❌ Dangerous | ⚠️ |
| moonshotai/kimi-k3 | Open chat model, 2.8T MoE | ❌ 2.1% (4) | −97% | 87.8% | 2.7 s | ❌ $6.07 | — | ❌ | ⚠️ Rate-limited |
| qwen/qwen3.6-35b | Open chat model | ❌ (raw 9.5%) | — | 81.5% | ❌ 4.0 s | $1.04 | — | ❌ | ⚠️ |
| **typesafe/jev-1.14** | Decision model | 1.1% (choice) / **0.5% (gates)** | −78% / −50% | **88.9%** | **0.63 s** | $0.23 | 19–20/20 | ⚠️ Gates passes dangerous but barely misses over-ask; choice misses dangerous | ⚠️ One provider, alpha API; written no-retention confirmation needed |
| **perplexity/pplx-decider-v1.2** | Decision model | 2.1% (choice) / 1.1% (gates) | −79% | **88.9%** | 0.86 s | **$0.09** | **20/20** | ❌ Dangerous just over the bar | ⚠️ One provider, alpha API; written confirmation needed |
| baseten/elephant-1:free | Decision model, 9B | 2.1% / 1.1% | −74 to −81% | 83.6% | **0.40 s** | $0 | 20/20 | ❌ | ❌ Free tier only; may end 27 Oct; weights reportedly open |
| typesafe/jev-router | Router (not open-weight) | ❌ 1.1% (2) | −96% | 87.3% | ❌ 6.7 s | $3.21 | ❌ 14/20 | ❌ | ❌ Routes to closed models we don't control |

Per-call cost at Level 2:

| Model | Cost per call |
|---|---|
| Decider | $0.000025 |
| Gemma | $0.000066 |
| Jev 1.14 | $0.000068 |
| gpt-oss-120b | $0.000148 |
| Maverick | $0.000201 |
| DeepSeek V4 Pro | $0.0011 |
| Kimi K3 | $0.0018 |

The heavy-user figure assumes about 3,400 model calls a month (stated assumption, not measured).

## 2. Verdict

- **Choose `openai/gpt-oss-120b` (Level 2, reasoning low).**
  - It meets every bar with margin: 0 dangerous mistakes and a 68% cut in questions to you.
  - It's fast (p95 1.1 s), costs $0.51 a month for a heavy user, and gives the same answer every time.
  - Two no-retention providers serve it.
- **Backups:** Gemma 4 26B (cheapest that passes) and Llama 4 Maverick (biggest cut in questions). Keep two configured; if both fail, ask you.
- **Decision models:** the fastest and cheapest, but they still make 1–4 dangerous mistakes, can't write the nudge text, and run on a single provider through an alpha API. They're worth one more test as a **hybrid**: a decider picks the decision, and gpt-oss-120b writes the text only when needed.
- **Pro at $20/month:** an allowance of **10,000 model calls a month** (about 3× a heavy user) costs at most **$1.48 per user**. Past it, Eucas falls back to asking you; there's never a surprise bill.

## 3. Product implications

- **Level 1 (signals only) isn't enough.** No chat model passed on signals alone.
  - Default behaviour: on question-type moments without Level 2, Eucas asks you instead of calling a model.
  - Level 2 is offered in plain words: "let Eucas read the agent's last message to ask you less".
- **Two new plain-code rules made it safe:**
  - stuck with no file changes for over 15 minutes → ask you;
  - a second blocked secrets or delete attempt → ask you.

  Also, **never nudge after a block**.
- **Track the last full test run,** not just the last test file, before calling something "done".
- **The rules editor needs scopes** (for example "style only"), because contradictory user rules caused the remaining mistakes.

## 4. Before launch

- These results were tuned on a mostly synthetic set. **Re-run on about 200–300 real moments** from your own sessions, labelled blind, to prove the 1% bar properly.
- **Client question from the spike:** should "No, rule N forbids it" count as *answering from your rules* or *asking you*? The 15 labelling disagreements are listed in SP-SUP1 §8.
