import express from "express";
import type { Db } from "./db.js";
import { booksRouter } from "./routes/books.js";
import { statsRouter } from "./routes/stats.js";

export function createApp(db: Db) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/books", booksRouter(db));
  app.use("/stats", statsRouter(db));

  return app;
}
