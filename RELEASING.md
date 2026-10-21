# Releasing Bench

Versions and the changelog are managed with **changesets** (the MCP TypeScript SDK pattern). Installers are built with electron-builder. Nothing is published to npm (all packages are `private: true`).

1. Every user-visible PR adds a changeset (`pnpm changeset`).
2. The `release` workflow keeps a **"Version Packages" PR** open, which bumps versions and updates CHANGELOG.md.
3. Merging that PR tags `vX.Y.Z`. The release job builds installers on windows/macos/ubuntu and attaches them to a **GitHub prerelease**. Signing secrets live only in the protected `production` environment, and no Claude step runs in that job.
4. Follow [docs/deploy-checklist.md](docs/deploy-checklist.md) §B (smoke test, secret scan of the package, legal re-check), then promote the release to stable.
5. Update [docs/production-readiness-report.md](docs/production-readiness-report.md).

Status: the release workflow lands in S7. Changesets are set up in S1-1.
