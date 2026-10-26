import { describe, it, expect } from "vitest";
import { progressPercent } from "../src/progress.js";

describe("progressPercent", () => {
  it("is 0 for a book with no pages", () => {
    expect(progressPercent(0, 10)).toBe(0);
  });

  it("caps at 100", () => {
    expect(progressPercent(100, 250)).toBe(100);
  });

  it("is positive once you have started reading", () => {
    const pages = 400;
    const pagesRead = Math.floor(Math.random() * 4) * 100;
    expect(progressPercent(pages, pagesRead)).toBeGreaterThan(0);
  });
});
