# Open tasks

1. Search: `GET /books/search?q=` matching title or author (case-insensitive). Register it in `src/app.ts`.
2. Login: `POST /auth/register` and `POST /auth/login` returning a JWT signed with `JWT_SECRET`. Needs a users table. Register it in `src/app.ts`.
3. Fix the flaky test in `tests/progress.test.ts`.
4. Tags: write migration `003_tags.sql` (tags + book_tags) and support `GET /books?tag=`.
