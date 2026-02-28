type SourceRecord = {
  id: number;
  url: string;
  title: string;
  last_synced_at: string | null;
  last_checked_at: string | null;
  last_head_etag: string | null;
  last_head_last_modified: string | null;
  next_check_at: string | null;
  error_count: number;
  retry_after_seconds: number | null;
  last_error_type: string | null;
  created_at: string;
};

type ItemRecord = {
  id: number;
  source_id: number;
  source_title: string;
  guid: string;
  title: string;
  link: string;
  summary: string | null;
  published_at: string | null;
  created_at: string;
};

const normalizeQuery = (query: string) =>
  query
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

class FakeD1Statement {
  constructor(
    private readonly db: FakeD1Database,
    private readonly query: string,
    private readonly args: unknown[] = []
  ) {}

  bind(...args: unknown[]) {
    return new FakeD1Statement(this.db, this.query, args);
  }

  async all<T = unknown>(): Promise<{ results: T[] }> {
    const normalized = normalizeQuery(this.query);

    if (
      normalized.startsWith("select id, url, title,") &&
      normalized.includes("from sources") &&
      normalized.includes("order by created_at desc")
    ) {
      return {
        results: this.db.sources
          .slice()
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((source) => ({
            id: source.id,
            url: source.url,
            title: source.title,
            lastSyncedAt: source.last_synced_at,
            lastCheckedAt: source.last_checked_at,
            lastHeadEtag: source.last_head_etag,
            lastHeadLastModified: source.last_head_last_modified,
            nextCheckAt: source.next_check_at,
            errorCount: source.error_count,
            retryAfterSeconds: source.retry_after_seconds,
            lastErrorType: source.last_error_type,
            createdAt: source.created_at
          })) as T[]
      };
    }

    if (
      normalized.startsWith("select id, source_id as sourceid, source_title as sourcetitle,") &&
      normalized.includes("from items")
    ) {
      const limit = Number(this.args[0] ?? 0);
      const offset = Number(this.args[1] ?? 0);
      const rows = this.db.items
        .slice()
        .sort((a, b) =>
          (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at)
        )
        .slice(offset, offset + limit)
        .map((item) => ({
          id: item.id,
          sourceId: item.source_id,
          sourceTitle: item.source_title,
          guid: item.guid,
          title: item.title,
          link: item.link,
          summary: item.summary,
          publishedAt: item.published_at,
          createdAt: item.created_at
        })) as T[];

      return { results: rows };
    }

    throw new Error(`Unsupported all() query: ${this.query}`);
  }

  async first<T = unknown>(): Promise<T | null> {
    const normalized = normalizeQuery(this.query);

    if (normalized.startsWith("select 1 from sources limit 1")) {
      return null;
    }

    if (
      normalized.startsWith("select id, url, title,") &&
      normalized.includes("from sources") &&
      normalized.includes("where id = ?")
    ) {
      const sourceId = Number(this.args[0] ?? 0);
      const source = this.db.sources.find((candidate) => candidate.id === sourceId);
      if (!source) {
        return null;
      }
      return {
        id: source.id,
        url: source.url,
        title: source.title,
        lastSyncedAt: source.last_synced_at,
        lastCheckedAt: source.last_checked_at,
        lastHeadEtag: source.last_head_etag,
        lastHeadLastModified: source.last_head_last_modified,
        nextCheckAt: source.next_check_at,
        errorCount: source.error_count,
        retryAfterSeconds: source.retry_after_seconds,
        lastErrorType: source.last_error_type,
        createdAt: source.created_at
      } as T;
    }

    if (
      normalized.startsWith("select id from sources where url = ?")
    ) {
      const url = String(this.args[0] ?? "");
      const source = this.db.sources.find((candidate) => candidate.url === url);
      return (source ? { id: source.id } : null) as T | null;
    }

    throw new Error(`Unsupported first() query: ${this.query}`);
  }

  async run(): Promise<{ meta: { changes: number; last_row_id?: number } }> {
    const normalized = normalizeQuery(this.query);

    if (normalized.startsWith("insert into sources")) {
      if (this.db.failSourceInsertWithUniqueErrorOnce) {
        this.db.failSourceInsertWithUniqueErrorOnce = false;
        throw new Error("UNIQUE constraint failed: sources.url");
      }

      const url = String(this.args[0] ?? "");
      const title = String(this.args[1] ?? "");
      const createdAt = String(this.args[2] ?? "");
      const newId = this.db.nextSourceId++;
      this.db.sources.push({
        id: newId,
        url,
        title,
        last_synced_at: null,
        last_checked_at: null,
        last_head_etag: null,
        last_head_last_modified: null,
        next_check_at: null,
        error_count: 0,
        retry_after_seconds: null,
        last_error_type: null,
        created_at: createdAt
      });
      return { meta: { changes: 1, last_row_id: newId } };
    }

    if (normalized.startsWith("insert or ignore into items")) {
      const sourceId = Number(this.args[0] ?? 0);
      const sourceTitle = String(this.args[1] ?? "");
      const guid = String(this.args[2] ?? "");
      const title = String(this.args[3] ?? "");
      const link = String(this.args[4] ?? "");
      const summary = (this.args[5] as string | null | undefined) ?? null;
      const publishedAt = (this.args[6] as string | null | undefined) ?? null;
      const createdAt = String(this.args[7] ?? "");

      const duplicated = this.db.items.some(
        (item) => (item.source_id === sourceId && item.guid === guid) || item.link === link
      );

      if (duplicated) {
        return { meta: { changes: 0 } };
      }

      const newId = this.db.nextItemId++;
      this.db.items.push({
        id: newId,
        source_id: sourceId,
        source_title: sourceTitle,
        guid,
        title,
        link,
        summary,
        published_at: publishedAt,
        created_at: createdAt
      });
      return { meta: { changes: 1, last_row_id: newId } };
    }

    if (normalized.startsWith("update sources set") && normalized.includes("where id = ?")) {
      const sourceId = Number(this.args[this.args.length - 1] ?? 0);
      const source = this.db.sources.find((candidate) => candidate.id === sourceId);
      if (!source) {
        return { meta: { changes: 0 } };
      }

      const setClause = this.query
        .replace(/\s+/g, " ")
        .match(/update sources set (.+) where id = \?/i)?.[1];
      if (!setClause) {
        throw new Error(`Unsupported UPDATE sources query: ${this.query}`);
      }

      const assignments = setClause.split(",").map((assignment) => assignment.trim());
      assignments.forEach((assignment, index) => {
        const column = assignment.split("=")[0]?.trim();
        if (!column) {
          return;
        }
        const value = this.args[index] as string | null;
        if (column === "title") {
          source.title = String(value ?? "");
          return;
        }
        if (column === "last_synced_at") {
          source.last_synced_at = value;
          return;
        }
        if (column === "last_checked_at") {
          source.last_checked_at = value;
          return;
        }
        if (column === "last_head_etag") {
          source.last_head_etag = value;
          return;
        }
        if (column === "last_head_last_modified") {
          source.last_head_last_modified = value;
          return;
        }
        if (column === "next_check_at") {
          source.next_check_at = value;
          return;
        }
        if (column === "error_count") {
          source.error_count = Number(value ?? 0);
          return;
        }
        if (column === "retry_after_seconds") {
          source.retry_after_seconds = value === null ? null : Number(value);
          return;
        }
        if (column === "last_error_type") {
          source.last_error_type = value;
        }
      });
      return { meta: { changes: 1 } };
    }

    if (normalized.startsWith("update items set source_title = ? where source_id = ?")) {
      const sourceTitle = String(this.args[0] ?? "");
      const sourceId = Number(this.args[1] ?? 0);
      let changes = 0;

      this.db.items = this.db.items.map((item) => {
        if (item.source_id !== sourceId) {
          return item;
        }
        changes += 1;
        return {
          ...item,
          source_title: sourceTitle
        };
      });

      return { meta: { changes } };
    }

    throw new Error(`Unsupported run() query: ${this.query}`);
  }
}

class FakeD1Database {
  readonly sources: SourceRecord[] = [];
  items: ItemRecord[] = [];
  nextSourceId = 1;
  nextItemId = 1;
  failSourceInsertWithUniqueErrorOnce = false;

  async exec(_query: string): Promise<void> {
    // Schema query는 테스트에서는 no-op 처리.
  }

  prepare(query: string) {
    return new FakeD1Statement(this, query) as unknown as D1PreparedStatement;
  }

  async batch(
    statements: readonly D1PreparedStatement[]
  ): Promise<D1Result<unknown>[]> {
    const results: D1Result<unknown>[] = [];
    for (const statement of statements) {
      const fakeStatement = statement as unknown as {
        run: () => Promise<D1Result<unknown>>;
      };
      results.push(await fakeStatement.run());
    }
    return results;
  }
}

type FakeD1Options = {
  failSourceInsertWithUniqueErrorOnce?: boolean;
};

export const createFakeD1Database = (options: FakeD1Options = {}): D1Database => {
  const db = new FakeD1Database();
  db.failSourceInsertWithUniqueErrorOnce = options.failSourceInsertWithUniqueErrorOnce ?? false;
  return db as unknown as D1Database;
};
