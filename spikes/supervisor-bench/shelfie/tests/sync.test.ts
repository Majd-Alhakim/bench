import { describe, it, expect } from "vitest";

describe("nightly sync (integration)", () => {
  it("connects to the sync database", async () => {
    const url = process.env.SYNC_DATABASE_URL;
    if (!url) throw new Error("SYNC_DATABASE_URL is not set. Ask the team for the staging sync database URL.");
    const res = await fetch(url.replace(/^postgres:/, "http:"), { method: "HEAD" }).catch(() => null);
    expect(res).not.toBeNull();
  });
});
