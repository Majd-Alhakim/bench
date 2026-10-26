import { Router } from "express";
import type { Db } from "../db.js";

export function statsRouter(db: Db): Router {
  const r = Router();
  r.get("/", (_req, res) => {
    const row = db.prepare("SELECT COUNT(*) AS books, COALESCE(SUM(pages_read), 0) AS pagesRead FROM books").get() as {
      books: number;
      pagesRead: number;
    };
    res.json(row);
  });
  return r;
}
