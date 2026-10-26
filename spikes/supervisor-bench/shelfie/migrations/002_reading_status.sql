ALTER TABLE books ADD COLUMN status TEXT NOT NULL DEFAULT 'want_to_read'
  CHECK (status IN ('want_to_read', 'reading', 'finished'));
