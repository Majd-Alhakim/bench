# Research: how Anthropic builds its repos (and what Bench copies)

**Date:** 2026-10-21. Method: read the files directly with `gh api` in anthropic-sdk-typescript, claude-agent-sdk-typescript/python, claude-code, claude-code-action, skills, claude-plugins-official, claude-cookbooks/quickstarts, and modelcontextprotocol/typescript-sdk; plus the Claude Code best-practices and memory docs.
**Caveat:** no Anthropic repo is an Electron app. The TypeScript conventions come from anthropic-sdk-typescript (pnpm monorepo), claude-code-action (Bun) and the MCP TS SDK (pnpm + changesets). The Electron-specific parts are our own adaptation.

## What Anthropic does, and what we adopt

| Convention | Evidence | Bench |
|---|---|---|
| Root `CLAUDE.md`, under 200 lines, **Commands first**, then What This Is / Architecture / Key Concepts / **Things That Will Bite You** / Code Conventions | claude-code-action, anthropic-sdk-ts, MCP; docs say <200 lines | ✅ adopted now |
| Detail goes in docs, path-scoped rules in `.claude/rules/` with `paths:`; personal notes in gitignored `CLAUDE.local.md` | Claude Code memory docs | ✅ now (rules folder added with code) |
| `REVIEW.md`: review principles used by the review command | MCP TS SDK | ✅ now |
| `.claude/commands/*.md` with `allowed-tools` frontmatter (`commit-push-pr`, `review-pr`, `triage-issue`) | claude-code-action, claude-code | ✅ now |
| `.claude/agents/*` reviewer subagents (security, code-quality, test-coverage…) | claude-code-action | ✅ now: this implements the founder's "check for slop" rule |
| `.claude/settings.json` permissions allowlist + **PostToolUse hook auto-formatting** after Edit/Write | claude-code-action (prettier), agent-sdk-py (ruff) | ⏳ S1-1 (needs Prettier installed) |
| `.claude/skills/verify/SKILL.md` for repo-specific verification | agent-sdk-py | ⏳ S1 (launch and smoke-test the app) |
| `scripts/` bash entry points (`bootstrap`, `build`, `lint`, `format`, `test`); package.json calls them | anthropic-sdk-ts | ⏳ S1-1 |
| **pnpm workspace**, `packageManager` pinned, `packages/*` | anthropic-sdk-ts, MCP | ⏳ S1-1 (ADR-0003) |
| Strict tsconfig: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals/Parameters`, `verbatimModuleSyntax` | anthropic-sdk-ts, claude-code-action | ⏳ S1-1 |
| ESLint 9 flat config (typescript-eslint, `unused-imports`, **`no-restricted-imports` for module boundaries**) + Prettier (110 cols, single quotes, trailing commas) | anthropic-sdk-ts, MCP | ⏳ S1-1 |
| **Vitest**, per-package config | anthropic-sdk-ts, MCP | ⏳ S1-1 |
| **lefthook** pre-push: typecheck + lint + build | MCP | ⏳ S1-1 |
| CI: `lint`/`typecheck`/`test`/`build` jobs, `concurrency` cancel-in-progress, **actions pinned to commit SHAs with `# vX` comments**, `timeout-minutes`, `workflow_dispatch` | anthropic-sdk-ts, MCP, claude-code-action | ✅ now (SHA pinning, timeouts, dispatch); jobs split in S1-1 |
| OS matrix ubuntu/macos/windows | agent-sdk-py | ✅ already |
| Dependabot (github-actions weekly) | MCP | ✅ already |
| `CODEOWNERS`, `SECURITY.md`, `CONTRIBUTING.md` | anthropic-sdk-ts, MCP, claude-code | ✅ now |
| Issue **forms** (YAML) with a preflight checklist; `blank_issues_enabled: false` | claude-code | ✅ now |
| **Conventional Commits** with scopes; squash-merge with the `(#PR)` suffix | sdk-ts, agent-sdk-py, MCP logs | ✅ already |
| **Changesets** for versions + CHANGELOG ("Version Packages" PR); tags `vX.Y.Z`; publishing in a protected `environment` | MCP `release.yml` | ⏳ S1-1 setup; release job S7 (with electron-builder) |
| `RELEASING.md` | agent-sdk-py, claude-code-action | ✅ now |
| `claude.yml` (@claude), `claude-code-review.yml` (runs `/review-pr`), issue triage via `scripts/gh.sh` wrappers | claude-code, claude-code-action, agent-sdk-py | ⏳ needs the founder to install the Claude GitHub app (`/install-github-app`), since it requires a credential only they can add |
| Workflow hardening: egress firewall runner, `workflow-hardening.yml` checker | all Anthropic SDK repos | ❌ not available for personal repos (Anthropic-only runner); we keep minimal `permissions:` + SHA pinning instead |
| No CodeQL / Renovate | — | Same (optional later) |

## Source-code patterns to follow (S1 onward)
- **Typed errors** with a base error class; never silently coerce unsupported content.
- **Exhaustive switches** with `checkNever()`; discriminated unions + type guards.
- **One retry helper** with backoff and jitter, reused everywhere.
- **Module boundaries enforced by lint** (`no-restricted-imports`): `packages/core` must not import Electron; the renderer must not import `core`.
- kebab-case file names; domain folders.
- zod at trust boundaries (IPC, files on disk, tool inputs).
- Comments: one line inline, JSDoc on public API only. Style is the tools' job, not prose in CLAUDE.md.
