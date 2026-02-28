CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  last_synced_at TEXT,
  last_checked_at TEXT,
  last_head_etag TEXT,
  last_head_last_modified TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sources_created_at
ON sources(created_at DESC);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL,
  source_title TEXT NOT NULL,
  guid TEXT NOT NULL,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  summary TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(source_id, guid),
  UNIQUE(link),
  FOREIGN KEY(source_id) REFERENCES sources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_items_source_id
ON items(source_id);

CREATE INDEX IF NOT EXISTS idx_items_order
ON items(published_at DESC, created_at DESC);
