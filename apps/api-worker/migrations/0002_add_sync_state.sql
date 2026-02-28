ALTER TABLE sources ADD COLUMN next_check_at TEXT;
ALTER TABLE sources ADD COLUMN error_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sources ADD COLUMN retry_after_seconds INTEGER;
ALTER TABLE sources ADD COLUMN last_error_type TEXT;

CREATE INDEX IF NOT EXISTS idx_sources_next_check_at ON sources(next_check_at);
