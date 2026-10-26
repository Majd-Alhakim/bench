import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { openDb, type Db } from "../db.js";

const DIR = join(import.meta.dirname, "..", "..", "migrations");

function ensureTable(db: Db) {
  db.exec("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");
}

export function allMigrations(): string[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

export function pendingMigrations(db: Db): string[] {
  ensureTable(db);
  const done = new Set((db.prepare("SELECT name FROM schema_migrations").all() as { name: string }[]).map((r) => r.name));
  return allMigrations().filter((m) => !done.has(m));
}

export function migrate(db: Db): string[] {
  const todo = pendingMigrations(db);
  for (const name of todo) {
    db.exec(readFileSync(join(DIR, name), "utf8"));
    db.prepare("INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)").run(name, new Date().toISOString());
  }
  return todo;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const applied = migrate(openDb());
  console.log(applied.length ? `applied: ${applied.join(", ")}` : "nothing to apply");
}
