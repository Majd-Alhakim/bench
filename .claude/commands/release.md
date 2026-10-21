---
description: Phase 9. Prepare a release through development → testing → production with a go/no-go gate
argument-hint: "<version>"
---

Version: $ARGUMENTS

1. Check that the release is ready:
   - every story in scope is Done and accepted by the client
   - there are no open S1 or S2 bugs
   - CI is green on `main`, including macOS
2. Have the `product-manager` draft the release notes. Then run `docs/deploy-checklist.md` §B: prerelease build, smoke test, secret scan of the package, legal re-check.
3. Ask the client for go/no-go (`/gate G9`). On go, promote the release to stable and update `docs/production-readiness-report.md`.
