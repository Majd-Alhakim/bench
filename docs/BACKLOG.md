# Product Backlog — Eucas

> **Provisional.** Written before requirements gathering. It will be rebuilt from the approved BRD, PRD and SRS in Phase 6 ([LIFECYCLE](process/LIFECYCLE.md)). The Sprint 0 spikes still count as Phase 0 feasibility validation.

Format: `ID · Story · Acceptance criteria (short) · Size`. Ordered by priority, top = next. Product model: [PRODUCT-MODEL.md](PRODUCT-MODEL.md).

## Now: the Eucas companion v0.1 (CR-010)

[CR-010](requirements/change-requests/CR-010.md) (approved 2026-10-26) puts the **companion first**. It guards and supervises the Claude Code sessions you already run. Requirements: BRD v1.4 (UC-54 – UC-64, BR-98 – BR-119). Plan: PRD v0.5 §9 and Appendix A (epics **E17 – E26**), built from [BUILD-PLAN](architecture/companion/BUILD-PLAN.md). Everything below this section is the **team app, after the companion**: deferred, not deleted.

- **Before G6, spikes only (E17, about 5 days):** SP-H1, SP-ST1, S-1, SP-TW1, S-4, S-6, S-2 (optional); SP-SUP2 is Pro, after v0.1.
- **Alongside:** landing page and waitlist on eucas.app (26.1, the demand test; published only after the client's review).
- **After G6 (about 28 build days, six 3-day sprints over two lanes):** E18 foundation, server and release (unsigned v0.1, SHA-256 published) · E19 guard and limits · E20 proof (heartbeat, canary, tripwire) · E21 rules · E22 usage · E23 sessions (needs-you, same-file) · E24 first run and diagnostic.
- **Placed but not estimated** (outside the 28 days; BRD §10 #45, #46, PRD §11.1 #1): 19.7 choose and lock your rules (D-4), 21.2 prompted rules, 23.3 guided merge.
- **After v0.1:** E25 Pro ($20/month; the first 200 payers keep $15/month for life: budgets, supervisor, unlimited details, cloud beta) · E26 launch (the Anthropic email after build and testing; signing once revenue covers it).

## Sprint 0: Inception

- ✅ **S0-4** ADR-0002 accepted for personal use (research: [anthropic-repos-and-auth](research/anthropic-repos-and-auth.md)). ADR-0001 awaiting founder confirmation.
- ✅ **S0-5** Competitor teardown: [competitive-brief](research/competitive-brief.md)
- ✅ **S0-6** Multi-agent efficiency research: [multi-agent-efficiency](research/multi-agent-efficiency.md)
- ✅ GitHub repo: github.com/eucas-app/eucas (was Majd-Alhakim/bench; public since 2026-10-24)
- ✅ **S0-1 · Spike: SDK on subscription, per-agent isolation** (M): GO, [report](spikes/S0-1.md). Also done: ✅ **SP-B1** browser agent ([report](spikes/SP-B1.md)) and ✅ **M8** shell containment ([report](spikes/M8.md))
  - AC: a script runs `query()` with no API key, inheriting `claude login`, once with Haiku and once with Opus.
  - AC: with `strictMcpConfig` + `settingSources: []`, the agent sees ONLY the MCP servers and skills we pass (shown via its init message).
  - AC: 3 parallel queries; record `/usage` rate-limit percent and `modelUsage`.
  - Output: `docs/spikes/S0-1.md`.
- **S0-2 · Spike: group-chat economics** (M)
  - AC: 4 agents × 20 turns, naive broadcast vs rules + router + digest. Token table in `docs/spikes/S0-2.md`.
- **S0-3 · Spike: in-process Eucas MCP** (M)
  - AC: agent A calls `handoff` / `ask_agent`, and agent B answers in its own session with its own memory. `memory_global_read` works from both.

## Sprint 1: Walking skeleton (main agent only)

- **S1-1** Scaffold per ADR-0003: pnpm workspace, strict tsconfig.base, ESLint 9 + Prettier, Vitest, lefthook, changesets, `scripts/*`, `.claude/settings.json` format hook, electron-vite + React + Tailwind + shadcn, CI (PRs: windows + ubuntu; macOS on main + on PRs touching packaging), `main/platform/`; add npm to Dependabot
- **S1-2** Onboarding: detect Claude Code and login status; strip `ANTHROPIC_API_KEY`; choose the Eucas home folder
- **S1-3** Main agent from `main-agent/agent.md`; Agent Runner wraps `query()`; stream to UI
- **S1-4** Chat UI (streaming, markdown, stop)
- **S1-5** Trace panel + per-message tokens/cost + plan-usage meter
- **S1-6** SQLite persistence; session resume

## Sprint 2: Agents you create

- Agent editor (name, avatar, description, role, model, knowledge files); main agent can draft an agent from chat
- **Inventory service:** list the user's MCP servers, plugins and skills; per-agent picker → SDK options
- Private memory + global memory (Eucas MCP tools); memory viewer/editor
- Duplicate an agent (without memory)

## Later (groomed per sprint)
**E3** Groups & router · **E4** Handoffs & task board · **E5** Approvals, budgets, ledger · **E6** Curator (digests, extraction, dedupe) · **E7** Routines + Gmail/GitHub · **E8** Packaging, security, release (licence FSL per CR-010)
- **E16 Atlas notch & voice** ([CR-009](requirements/change-requests/CR-009.md), approved 2026-10-25; [design](design/ux/2026-10-25-atlas-notch-design.md)): stories N0–N10 in PRD v0.4, Sprints 3–5. Before G6: a one-day `spike/notch` (hold-vs-tap keys, drop onto the notch, call detection) and ADR-0004/5/6. The voice story below is **N0**.
- **N0 · Voice input with local Whisper** (M, client 2026-10-25). Talk instead of typing in any composer; the speech never leaves the computer. Proven in the prototype ([effects/](design/ui/prototype/effects/)), running in a worker via transformers.js. Engine by language: English uses Moonshine base on the CPU (~0.5–1 s a pass, words keep up with you); other languages, Arabic included, use Whisper base fp16 on WebGPU (~2–3 s a pass). Whisper costs a full 30 s window per pass, so it can't stream on a laptop GPU.
  - Why not the browser's speech API: in Electron it has no Google key, so it fails with a `network` error.
  - AC: the model and ONNX runtime files ship in the app or download into the Eucas home on first use (no CDN at runtime); dictation works offline afterwards; Arabic and English are recognised; sending while dictating doesn't leave late words in the box; a trace event marks the take (duration, model, device).
