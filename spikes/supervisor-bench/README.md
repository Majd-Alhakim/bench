# supervisor-bench (spike SP-SUP1, throwaway)

Benchmarks cheap provider-hosted models as the Eucas supervisor. Report: [`docs/spikes/SP-SUP1.md`](../../docs/spikes/SP-SUP1.md).

| Step | Command | Output |
|---|---|---|
| Dummy project (local only, in `%TEMP%`) | `node setup-shelfie.mjs` | `eucas-supervisor-bench/` with one worktree per task |
| Record real sessions (your Claude login, Sonnet) | `node record.mjs`, then `node record.mjs --round2` | `out/raw/*.jsonl` (gitignored: contains code) |
| Real moments | `node extract.mjs` | `data/real.json` |
| Planted moments | `node planted.mjs` | `data/planted.json` |
| Corpus + blind file for labeller B | `node build-corpus.mjs` | `data/corpus.json`, `data/blind.json` |
| Chat models (pilot first) | `node run-models.mjs --pilot`, then `node run-models.mjs` | `out/pilot.jsonl`, `out/results.jsonl` |
| Decision models | `node run-decisions.mjs --pilot`, then `node run-decisions.mjs` | `out/decisions*.jsonl` |
| Consistency (rerun the pilot) | add `--repeat` to a pilot run, then `node consistency.mjs pilot.jsonl decisions-pilot.jsonl` | `out/consistency.json` |
| Score | `node score.mjs results.jsonl` / `node score.mjs decisions.jsonl` | `out/*-table.md`, `out/*-summary.json` |
| Hybrid (SP-SUP1b): decision model + gpt-oss writer | `node hybrid.mjs` | `out/writer.jsonl`, `out/hybrid-*` |
| Blind message grading → per system | grader fills `data/text-grades.json`, then `node grade-texts.mjs` | `out/text-quality*` |

- The OpenRouter key comes from `OPENROUTER_API_KEY` or `HKCU\Environment`. It is never printed or written.
- Spend is cumulative in `out/spend.json` (chat) and `out/spend-decisions.json` (decisions). Each runner stops at $8 for the two combined (`HARD_STOP_USD` in `config.mjs`).
- Every call asks for zero data retention (`provider.zdr`, `data_collection: "deny"`). The serving provider is recorded per call.
- `ANTHROPIC_API_KEY` is stripped from the recorded sessions, so they bill to the subscription, never the API.
- Shelfie's `env.fake` holds deliberately fake, low-entropy values. Setup renames it to `.env` in the local copy.
