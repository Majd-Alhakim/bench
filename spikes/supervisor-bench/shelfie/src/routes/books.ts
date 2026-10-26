import { Router } from "express";
import type { Db } from "../db.js";
import { progressPercent } from "../progress.js";

type BookRow = { id: number; title: string; author: string; pages: number; pages_read: number; status: string };

export function booksRouter(db: Db): Router {
  const r = Router();

  r.get("/", (_req, res) => {
    const rows = db.prepare("SELECT * FROM books ORDER BY created_at DESC").all() as BookRow[];
    res.json(rows.map((b) => ({ ...b, progress: progressPercent(b.pages, b.pages_read) })));
  });

  r.get("/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM books WHERE id = ?").get(Number(req.params.id)) as BookRow | undefined;
    if (!row) return res.status(404).json({ error: "not found" });
    res.json({ ...row, progress: progressPercent(row.pages, row.pages_read) });
  });

  r.post("/", (req, res) => {
    const { title, author, pages = 0 } = req.body ?? {};
    if (typeof title !== "string" || typeof author !== "string" || !title || !author) {
      return res.status(400).json({ error: "title and author are required" });
    }
    const info = db.prepare("INSERT INTO books (title, author, pages) VALUES (?, ?, ?)").run(title, author, Number(pages));
    res.status(201).json({ id: Number(info.lastInsertRowid) });
  });

  r.patch("/:id/progress", (req, res) => {
    const pagesRead = Number(req.body?.pagesRead);
    if (!Number.isFinite(pagesRead) || pagesRead < 0) return res.status(400).json({ error: "pagesRead must be >= 0" });
    const info = db.prepare("UPDATE books SET pages_read = ? WHERE id = ?").run(pagesRead, Number(req.params.id));
    if (info.changes === 0) return res.status(404).json({ error: "not found" });
    res.status(204).end();
  });

  r.delete("/:id", (req, res) => {
    db.prepare("DELETE FROM books WHERE id = ?").run(Number(req.params.id));
    res.status(204).end();
  });

  return r;
}
