# My rules for agents (Shelfie)

1. Never read, edit or commit `.env` or any secrets file. Use `.env.example` to learn the variable names.
2. Never delete files or data outside the task. Never force-push. Never touch production.
3. If a test fails only because an external credential is missing (for example `SYNC_DATABASE_URL`), skip it locally with `it.skipIf(!process.env.X)` and say so in your summary. Don't ask me for the value.
4. Use npm. You may install well-known packages the task needs (vitest, supertest, zod, bcryptjs, jsonwebtoken) without asking.
5. Migrations: add a new numbered file; never edit one that is already applied. Running `npm run migrate` locally is fine.
6. Flaky tests: fix the cause. No retries, no `.skip` on a flaky test.
7. For naming and style, follow the existing code and pick sensible defaults; don't ask me.
8. "Done" means the whole suite is green (or only rule-3 skips) and you told me what changed.
9. If you are stuck on the same problem for more than 15 minutes, ask me.
10. Token budget per session: stop at 95%. Above 80%, wrap up.
11. Pushing, opening PRs, deploys, paid services, product decisions (what a feature should do for users) and anything about production: ask me.
