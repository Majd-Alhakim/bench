import { describe, it, expect } from "vitest";
import { openDb } from "../src/db.js";
import { pendingMigrations } from "../src/db/migrate.js";

describe("local database", () => {
  it("has no pending migrations", () => {
    const db = openDb(process.env.DATABASE_PATH ?? "data/shelfie.db");
    expect(pendingMigrations(db)).toEqual([]);
  });
});
