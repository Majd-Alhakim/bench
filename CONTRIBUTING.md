# Contributing to Bench

Applies to humans and AI agents alike.

## Workflow
1. Pick a backlog item ([docs/BACKLOG.md](docs/BACKLOG.md)). Branch from up-to-date `main`: `feat/<id>-<slug>`, `fix/…`, `chore/…`, `docs/…`, `spike/…`.
2. Write tests with the code. A bug fix starts with a test that fails.
3. Run `pnpm check:all` (lint, typecheck, test). Run `pnpm build` for anything touching packaging.
4. **Review your own diff before opening the PR**, against [REVIEW.md](REVIEW.md). On non-trivial changes, run `/review-pr` (or the reviewer agents in `.claude/agents/`) and fix what they find.
5. Add a changeset (`pnpm changeset`) when users will notice the change.
6. Open the PR with the template. CI must be green on Windows and Ubuntu plus the gitleaks secret scan. macOS runs after merge on `main` (and on demand via "Run workflow"); a red macOS run on `main` gets a fix PR right away.
7. **Squash-merge** with a Conventional Commit title, then delete the branch.

## Commit messages
[Conventional Commits](https://www.conventionalcommits.org/) with a scope: `feat(router): …`, `fix(memory): …`, `chore(ci): …`, `docs: …`. Breaking change: `feat(ipc)!: …`. The squash title gets the `(#PR)` suffix automatically.

## Security
Read [docs/security-baseline.md](docs/security-baseline.md). Never commit secrets. Never handle Claude OAuth credentials (ADR-0002). Report vulnerabilities as described in [SECURITY.md](SECURITY.md).
