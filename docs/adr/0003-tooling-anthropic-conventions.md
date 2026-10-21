# ADR-0003: Tooling and repo conventions, following Anthropic's TypeScript repos

- **Status:** Accepted (2026-10-21). Founder asked to copy Anthropic's framework. Evidence: [docs/research/anthropic-repo-conventions.md](../research/anthropic-repo-conventions.md).
- **Date:** 2026-10-21

## Decision
Follow the conventions of anthropic-sdk-typescript, claude-code-action and the MCP TypeScript SDK, adapted for an Electron app:

| Area | Choice |
|---|---|
| Package manager | **pnpm** workspace (`apps/*`, `packages/*`), `packageManager` pinned at the root |
| TypeScript | `tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `moduleResolution: bundler` |
| Lint / format | ESLint 9 flat config (typescript-eslint, `unused-imports`, `no-restricted-imports` for module boundaries) + Prettier (`printWidth: 110`, `singleQuote`, `trailingComma: all`) |
| Tests | Vitest (unit/integration); Playwright `_electron` (e2e, our addition) |
| Git hooks | lefthook pre-push: typecheck + lint |
| Scripts | `scripts/{bootstrap,build,lint,format,test}` bash entry points; package.json scripts call them |
| Claude Code in repo | `CLAUDE.md` (<200 lines, Commands first), `REVIEW.md`, `.claude/commands`, `.claude/agents` reviewers, `.claude/settings.json` with PostToolUse format hook (S1-1), `.claude/skills/verify` (S1) |
| CI | Actions pinned to commit SHAs with `# vX` comments, minimal `permissions:`, `timeout-minutes`, concurrency cancel, OS matrix, gitleaks |
| Versioning | changesets → "Version Packages" PR → tag `vX.Y.Z` → electron-builder release (RELEASING.md) |
| Commits | Conventional Commits with scope; squash-merge |

## Not adopted (and why)
- Anthropic's egress-firewall runner and workflow-hardening checker: their runner image isn't available to personal repos. We compensate with SHA pinning and minimal permissions.
- Claude GitHub workflows (`@claude`, auto PR review, issue triage): wanted, but they need a credential that only the founder can install (`/install-github-app` in Claude Code). Added once the founder does that.
- Bun (claude-code-action): pnpm + Node matches Electron's runtime and the other two repos.

## Consequences
Supersedes the `npm` commands in earlier docs. S1-1 implements the toolchain; CI already runs pnpm once `package.json` exists.
