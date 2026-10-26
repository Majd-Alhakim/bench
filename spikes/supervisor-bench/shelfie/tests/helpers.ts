import { openDb } from "../src/db.js";
import { migrate } from "../src/db/migrate.js";

export function testDb() {
  const db = openDb(":memory:");
  migrate(db);
  return db;
}
