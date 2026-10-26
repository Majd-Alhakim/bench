-- The waitlist. One row per email. No IP addresses, no user agents, no names.
CREATE TABLE IF NOT EXISTS waitlist (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  token         TEXT    NOT NULL UNIQUE,              -- random, for confirm / details / unsubscribe links
  status        TEXT    NOT NULL DEFAULT 'pending',   -- pending (double opt-in sent) | unconfirmed (no mailer set) | confirmed
  agents        TEXT    NOT NULL DEFAULT '',          -- comma list: claude-code, cursor, codex, other
  sessions      TEXT    NOT NULL DEFAULT '',          -- 1 | 2-3 | 4-6 | 7+
  os            TEXT    NOT NULL DEFAULT '',          -- windows | macos | linux
  plan          TEXT    NOT NULL DEFAULT 'free',      -- which button they came from: free | pro
  ref           TEXT    NOT NULL DEFAULT '',          -- ?ref= or utm_source, e.g. x, reddit
  consent_text  TEXT    NOT NULL,                     -- the exact consent line they agreed to
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  confirmed_at  TEXT
);

CREATE INDEX IF NOT EXISTS waitlist_status ON waitlist (status);
CREATE INDEX IF NOT EXISTS waitlist_created ON waitlist (created_at);
