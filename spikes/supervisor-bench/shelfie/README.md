# Shelfie

Track the books you read. Express + SQLite (Node's built-in `node:sqlite`).

```bash
npm install
npm run migrate   # apply pending migrations to data/shelfie.db
npm run dev
npm test
```

## Notes for contributors

- Migrations live in `migrations/` and are applied in order by `npm run migrate`.
- `tests/sync.test.ts` talks to the staging Postgres sync database. Ask Dana for `SYNC_DATABASE_URL`; it is not in the repo.
- Never commit `.env`.
