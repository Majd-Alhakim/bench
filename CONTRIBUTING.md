# Contributing to Bench

Applies to humans and AI agents alike.

## Branches
Never push to `main`, `staging` or `dev` directly. Every change goes branch → PR → merge.

| Branch | What it is | Gets changes from |
|---|---|---|
| `feat/` `fix/` `chore/` `docs/` `spike/` | One branch per change | Branched from up-to-date `dev` |
| `dev` | Active development; everything lives together here | Squash-merged PRs from work branches |
| `staging` | The dress rehearsal: it matches production, so you catch problems before release | A promotion PR from `dev` (merge commit) |
| `main` | Production, what users get. Sacred | A release PR from `staging` (merge commit), then a tag |

- **Promotion PRs** (`dev` → `staging`, `staging` → `main`) use a merge commit, not squash, so the branches keep one shared history. Title: `chore(release): promote dev to staging` / `chore(release): vX.Y.Z`.
- **Hotfix:** branch `fix/…` from `main`, PR into `main`, then merge `main` back into `staging` and `dev` with PRs.
- **Rollback:** revert the merge commit on `main` with a PR (`git revert -m 1 <sha>`), one click in the GitHub UI.
- **GitHub enforces this** with the ruleset "Protect main, staging and dev": no direct pushes, no force-pushes, no deletion, a PR with green gitleaks + Windows + Ubuntu checks to merge. Required reviews are off, because the maintainer can't approve their own PRs.
- The local guard `.githooks/pre-push` also refuses pushes to the three long-lived branches. Turn it on once per clone with `git config core.hooksPath .githooks` (lefthook takes over at S1-1).

## Workflow
1. Pick a backlog item ([docs/BACKLOG.md](docs/BACKLOG.md)). Branch from up-to-date `dev`: `feat/<id>-<slug>`, `fix/…`, `chore/…`, `docs/…`, `spike/…`.
2. Write tests with the code. A bug fix starts with a test that fails.
3. Run `pnpm check:all` (lint, typecheck, test). Run `pnpm build` for anything touching packaging.
4. **Review your own diff before opening the PR**, against [REVIEW.md](REVIEW.md). On non-trivial changes, run `/review-pr` (or the reviewer agents in `.claude/agents/`) and fix what they find.
5. Add a changeset (`pnpm changeset`) when users will notice the change.
6. Open the PR **into `dev`** with the template. CI must be green on Windows and Ubuntu plus the gitleaks secret scan. macOS runs after merge to `dev`, `staging` and `main` (and on demand via "Run workflow"); a red macOS run gets a fix PR right away.
7. **Squash-merge** into `dev` with a Conventional Commit title, then delete the branch.

## Commit messages
[Conventional Commits](https://www.conventionalcommits.org/) with a scope: `feat(router): …`, `fix(memory): …`, `chore(ci): …`, `docs: …`. Breaking change: `feat(ipc)!: …`. The squash title gets the `(#PR)` suffix automatically.

## Security
Read [docs/security-baseline.md](docs/security-baseline.md). Never commit secrets. Never handle Claude OAuth credentials (ADR-0002). Report vulnerabilities as described in [SECURITY.md](SECURITY.md).
