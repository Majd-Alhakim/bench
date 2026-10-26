import { createApp } from "./app.js";
import { openDb } from "./db.js";
import { pendingMigrations } from "./db/migrate.js";

const db = openDb();
const pending = pendingMigrations(db);
if (pending.length) {
  console.error(`Pending migrations: ${pending.join(", ")}. Run "npm run migrate" first.`);
  process.exit(1);
}
const port = Number(process.env.PORT ?? 3000);
createApp(db).listen(port, () => console.log(`shelfie on :${port}`));
