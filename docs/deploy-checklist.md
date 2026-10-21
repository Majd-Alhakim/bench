# Change & Release Checklist — Bench

Versioning and release mechanics: [RELEASING.md](../RELEASING.md).

Bench is a desktop app, so "deploy" means **merge to `main`**, then **publish a release** on GitHub Releases (prerelease first, then stable).

## A. Every change (feature/fix branch → PR)
1. Branch from up-to-date `main`: `feat/<backlog-id>-<slug>` (or `fix/`, `chore/`, `docs/`, `spike/`).
2. Write the test first for bug fixes; add tests for new core logic.
3. Self-review the diff: bugs, edge cases, dead code, duplication, naming, slop comments, structure. Run `/code-review` (or `/simplify`) on non-trivial PRs and fix the findings.
4. Local gate: `pnpm check:all && pnpm build && pnpm audit --audit-level high`.
5. Security checklist in [security-baseline.md §3](security-baseline.md).
6. Open the PR with the template; CI must be green on windows/macos/ubuntu, plus gitleaks.
7. Squash-merge with a Conventional Commit title; delete the branch; update BACKLOG.md.

## B. Release (vX.Y.Z)
1. `main` green; CHANGELOG updated; version bumped (SemVer).
2. Re-check Anthropic's Claude Code legal page (subscription rules, ADR-0002).
3. Tag `vX.Y.Z-rc.N`; CI builds signed installers and publishes a **GitHub prerelease**.
4. Smoke test the installed RC on a clean machine or VM, using a **separate Bench home**:
   - [ ] onboarding detects Claude Code + login; no API key leaks into agents
   - [ ] main agent chat streams; trace and usage meter update
   - [ ] create agent → its connectors are the only ones visible to it
   - [ ] approval gate blocks an external action until approved
   - [ ] app restarts with history intact; DB migrations applied
5. Scan the packaged app for secrets (gitleaks on the unpacked `resources/`).
6. Promote to a stable release; the auto-updater picks it up.
7. Update [production-readiness-report.md](production-readiness-report.md).

## C. Rollback
- **Bad release:** mark it as a prerelease or delete the release asset so the updater stops serving it; publish the previous version as `vX.Y.Z+1` (the updater only moves forward).
- **Bad merge:** `git revert <sha>` on a branch, then PR (never force-push `main`).
- **Bad DB migration:** every migration ships with a tested down-path or a backup step; the app backs up `bench.sqlite` before migrating.
