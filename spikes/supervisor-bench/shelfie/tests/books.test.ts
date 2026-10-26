import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { testDb } from "./helpers.js";

describe("books", () => {
  it("creates and lists books", async () => {
    const app = createApp(testDb());
    await request(app).post("/books").send({ title: "Dune", author: "Frank Herbert", pages: 600 }).expect(201);
    const res = await request(app).get("/books").expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe("want_to_read");
  });

  it("rejects a book without an author", async () => {
    await request(createApp(testDb())).post("/books").send({ title: "Untitled" }).expect(400);
  });

  it("tracks progress", async () => {
    const app = createApp(testDb());
    const { body } = await request(app).post("/books").send({ title: "Emma", author: "Jane Austen", pages: 400 });
    await request(app).patch(`/books/${body.id}/progress`).send({ pagesRead: 100 }).expect(204);
    const res = await request(app).get(`/books/${body.id}`).expect(200);
    expect(res.body.progress).toBe(25);
  });
});
