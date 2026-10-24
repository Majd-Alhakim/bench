# CLAUDE.md

Bench (codename): a cross-platform desktop app for a glass-box team of Claude agents. Keep this file under 200 lines; details belong in `docs/`. Personal notes go in `CLAUDE.local.md` (gitignored).

## Commands

> No app code yet (Sprint 0). These are the target commands, introduced in S1-1 (ADR-0003). Until then, only docs and CI exist.

```bash
pnpm bootstrap          # install deps, set up git hooks (lefthook)
pnpm dev                # run the Electron app in dev mode (uses a separate BENCH_HOME)
pnpm lint               # prettier --check + eslint
pnpm typecheck
pnpm test               # vitest, all packages
pnpm test -- path/to/file.test.ts   # one test file
pnpm test:e2e           # Playwright against the built Electron app
pnpm build
pnpm check:all          # lint + typecheck + test: run before every PR
pnpm changeset          # add a changeset for user-visible changes
```

## What This Is

You talk to **one main agent** and create your own agents, each like a Claude Project: name, description, role, model, knowledge files, **private memory**, plus a **global memory** every agent reads. Connectors, plugins and skills come from the user's own Claude Code inventory, and **each agent gets only the subset chosen for it**. Groups let agents talk and hand off work, and the user sees every step, prompt and token.
Read first: [PRODUCT-MODEL](docs/PRODUCT-MODEL.md) · [ARCHITECTURE](docs/ARCHITECTURE.md) · [BACKLOG](docs/BACKLOG.md) · [research](docs/research/).

## Architecture

- `apps/desktop/`: Electron. `src/main` (Node: runs agents), `src/preload` (minimal typed bridge), `src/renderer` (React, no Node). OS-specific code only in `src/main/platform/`.
- `packages/core/`: orchestrator, router, agent runner, memory, ledger. Pure TypeScript, **no Electron imports**.
- `packages/shared/`: zod schemas, IPC contracts, typed errors.
- `packages/bench-mcp/`: in-process MCP server (handoff, ask_agent, memory tools).
- Agents and memory are **files** in the Bench home folder; SQLite holds messages, runs, tasks and the ledger only.

## Key Concepts

- **Agent run** = one Agent SDK `query()` with per-agent options: `model`, `systemPrompt`, `mcpServers` + `strictMcpConfig: true`, `tools`/`disallowedTools`, `skills`, `plugins`, `settingSources: []`, `cwd`, `resume`.
- **Router**: rules first (@mention, task owner), then a Haiku call over agent cards + thread digest. One responder by default.
- **Handoff**: a structured brief (task, summary, artifact refs, acceptance criteria). The receiver never gets the sender's transcript.
- **Model tiers** (`config/models.yaml`): fast = claude-haiku-5-5, balanced = claude-sonnet-5-5, deep = claude-opus-5-5.

## Things That Will Bite You

- **Auth (ADR-0002):** Bench runs the official, unmodified Claude Code binary and inherits the user's `claude login`. Never build a login, never read or store `~/.claude/.credentials.json` or OAuth tokens, never share one plan between people, never name the product "Claude Code".
- An `ANTHROPIC_API_KEY` in the environment silently overrides the subscription (billing!). Strip it from the agent `env` unless API mode is on.
- Without `strictMcpConfig: true`, the user's claude.ai connectors load into **every** agent.
- `allowedTools` only auto-approves; it does **not** restrict. Restrict with `tools` / `disallowedTools`.
- Without `settingSources: []`, agents load the user's global CLAUDE.md, skills and agents.
- Memory tools must derive the agent id from the runner context, never from a model-supplied argument (isolation).
- Renderer: `contextIsolation: true`, `sandbox: true`, no `nodeIntegration`; every IPC payload is zod-validated in main.
- Cross-platform: `path`/`os` APIs only; never hard-code `\` or `C:\`.

## Code Conventions

- TypeScript strict (see ADR-0003 flags). kebab-case files. Domain folders.
- Typed errors from a shared base class; exhaustive `switch` with `checkNever()`.
- zod at every trust boundary: IPC, files read from disk, tool inputs.
- One retry/backoff helper; no ad-hoc retry loops.
- Module boundaries are enforced by ESLint `no-restricted-imports` (core ↛ electron, renderer ↛ core).
- Comments: one line inline, JSDoc on public API only. Formatting is Prettier's job.
- Every feature emits a trace event so it's visible in the UI.
- Engineering rulebook: the `engineering-craft` skill (gates, system-design method, review checklist) applies to all code and design work.

## Testing

- Vitest next to the code (`*.test.ts`). A bug fix starts with a failing test.
- Isolation tests are mandatory for memory/connector features (agent A can't reach agent B's data).
- Playwright e2e for critical flows (onboarding, chat, approval gate).

## Git & PRs

Full workflow: [CONTRIBUTING.md](CONTRIBUTING.md). Review standard: [REVIEW.md](REVIEW.md). Founder standing order (2026-10-21):
- Never push to `main`, `staging` or `dev` (founder order 2026-10-24). One branch per change (`feat/ fix/ chore/ docs/ spike/`) from `dev`; PR into `dev`; promote `dev` → `staging` → `main` with merge-commit PRs. Flow: [CONTRIBUTING.md](CONTRIBUTING.md#branches).
- Before a PR, review the diff for bugs and slop and clean the structure (`/review-pr` or the reviewer agents in `.claude/agents/`).
- `pnpm check:all` green locally; CI green (PRs: windows + ubuntu + gitleaks; pushes to `dev`, `staging`, `main` also run macOS); then squash-merge into `dev` with a Conventional Commit title.
- Security: [docs/security-baseline.md](docs/security-baseline.md). Releases: [RELEASING.md](RELEASING.md).

**Definition of Done:** branch + PR · self-reviewed (no slop) · tests pass · CI green on PR checks · secret scan clean · visible in trace · docs/backlog updated · founder demoed it.

## Delivery Process

The project follows a full lifecycle with client gates: [docs/process/LIFECYCLE.md](docs/process/LIFECYCLE.md). The team and RACI are in [TEAM.md](docs/process/TEAM.md), and the live phase and gate log are in [STATUS.md](docs/process/STATUS.md).
- The main session is the **Product Manager**. Role agents: `business-analyst`, `reverse-engineer`, `product-manager`, `ux-designer`, `ui-designer`, `tech-lead`, `developer`, `qa-engineer`. The founder is the **client** and the only one who approves gates.
- Phase commands: `/discovery` → `/brd` → `/teardown` → `/prd` → `/specs` → `/design-ux` → `/design-ui` → `/plan-sprint` → (`/standup`, `/qa`, `/bug`, `/sprint-review`) → `/release`. Plus `/gate` and `/change-request`.
- UI/UX work (Phases 4–5, and UI reviews) follows the `ui-ux-guide` skill (`.claude/skills/ui-ux-guide/`).
- **No implementation before Gate 6.** Templates are in `docs/templates/`.
- **Sessions:** at ~80% context or when ending a session, run `/save-checkpoint`; start a new session with `/resume-checkpoint` (checkpoints in `docs/process/checkpoints/`).
- **Lean mode:** documents cover only the MVP use cases, and the UX prototype is shown early, then the documents are corrected from it. Sprints are **3 days**, goal-boxed. The founder is the only user (a personal project for now).

## Project Status & Open Decisions

- **G1 and G2 approved; Phase 3 (SRS) next**, spikes first (see STATUS.md). Repo: github.com/Majd-Alhakim/bench (private).
- Founder answers: personal first, maybe share later · Windows first, then macOS/Linux · first connectors Gmail + GitHub · open-source at v0.1.
- **Product name: Euca** ("you-ka"); the agents are **Eucas**. "Bench" stays the codename in code and docs until the rename task after G5 ([decision](docs/requirements/interviews/2026-10-24-product-name.md)). Never name it "Claude Code".
- Agents save drafts and never send or post; they never delete on the computer (CR-008).
- Roles: the founder is product owner and human in the loop; Claude acts as PM + CTO and asks before irreversible or outward-facing actions.
