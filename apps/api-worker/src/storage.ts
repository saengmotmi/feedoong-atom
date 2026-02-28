import { DuplicateSourceUrlError } from "@feedoong/contracts";

import type { ParsedFeedItem, SyncRepository } from "@feedoong/sync-core";

import type { Bindings, ItemRow, SourceRow } from "./types";

type SourceSqlRow = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  lastCheckedAt: string | null;
  lastHeadEtag: string | null;
  lastHeadLastModified: string | null;
  nextCheckAt: string | null;
  errorCount: number;
  retryAfterSeconds: number | null;
  lastErrorType: string | null;
  createdAt: string;
};

type ItemSqlRow = {
  id: number;
  sourceId: number;
  sourceTitle: string;
  guid: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
};

const schemaReadyByDb = new WeakMap<D1Database, Promise<void>>();

const resolveDb = (env: Bindings) => env.FEEDOONG_DB;

const DEFAULT_RETRY_AFTER_SECONDS = 300;
const MAX_RETRY_AFTER_SECONDS = 21600;

const resolveRetryAfterSeconds = (
  errorCount: number,
  retryAfterSeconds?: number | null
) => {
  if (typeof retryAfterSeconds === "number" && retryAfterSeconds > 0) {
    return Math.min(Math.floor(retryAfterSeconds), MAX_RETRY_AFTER_SECONDS);
  }
  return Math.min(
    DEFAULT_RETRY_AFTER_SECONDS * 2 ** Math.max(0, errorCount - 1),
    MAX_RETRY_AFTER_SECONDS
  );
};

const toNextCheckAt = (failedAt: string, retryAfterSeconds: number) =>
  new Date(new Date(failedAt).getTime() + retryAfterSeconds * 1000).toISOString();

const isSourceUrlUniqueConstraintError = (error: unknown) =>
  error instanceof Error &&
  error.message.toLowerCase().includes("unique") &&
  error.message.includes("sources.url");

const ensureDbSchema = async (env: Bindings): Promise<void> => {
  const db = resolveDb(env);
  const cached = schemaReadyByDb.get(db);
  if (cached) {
    await cached;
    return;
  }

  const next = db
    .prepare("SELECT 1 FROM sources LIMIT 1")
    .first()
    .then(() => undefined)
    .catch((error) => {
      schemaReadyByDb.delete(db);
      throw new Error(
        "D1 schema is not initialized. Apply migrations before serving traffic.",
        { cause: error }
      );
    });
  schemaReadyByDb.set(db, next);
  await next;
};

const mapSourceRow = (row: SourceSqlRow): SourceRow => ({
  id: row.id,
  url: row.url,
  title: row.title,
  lastSyncedAt: row.lastSyncedAt,
  lastCheckedAt: row.lastCheckedAt,
  lastHeadEtag: row.lastHeadEtag,
  lastHeadLastModified: row.lastHeadLastModified,
  nextCheckAt: row.nextCheckAt,
  errorCount: row.errorCount,
  retryAfterSeconds: row.retryAfterSeconds,
  lastErrorType: row.lastErrorType,
  createdAt: row.createdAt
});

const mapItemRow = (row: ItemSqlRow): ItemRow => ({
  id: row.id,
  sourceId: row.sourceId,
  sourceTitle: row.sourceTitle,
  guid: row.guid,
  title: row.title,
  link: row.link,
  summary: row.summary,
  publishedAt: row.publishedAt,
  createdAt: row.createdAt
});

export const listSources = async (env: Bindings): Promise<SourceRow[]> => {
  await ensureDbSchema(env);
  const result = await resolveDb(env)
    .prepare(`
      SELECT
        id,
        url,
        title,
        last_synced_at AS lastSyncedAt,
        last_checked_at AS lastCheckedAt,
        last_head_etag AS lastHeadEtag,
        last_head_last_modified AS lastHeadLastModified,
        next_check_at AS nextCheckAt,
        error_count AS errorCount,
        retry_after_seconds AS retryAfterSeconds,
        last_error_type AS lastErrorType,
        created_at AS createdAt
      FROM sources
      ORDER BY created_at DESC
    `)
    .all<SourceSqlRow>();

  return (result.results ?? []).map(mapSourceRow);
};

export const getSourceById = async (
  env: Bindings,
  sourceId: number
): Promise<SourceRow | null> => {
  await ensureDbSchema(env);

  const row = await resolveDb(env)
    .prepare(`
      SELECT
        id,
        url,
        title,
        last_synced_at AS lastSyncedAt,
        last_checked_at AS lastCheckedAt,
        last_head_etag AS lastHeadEtag,
        last_head_last_modified AS lastHeadLastModified,
        next_check_at AS nextCheckAt,
        error_count AS errorCount,
        retry_after_seconds AS retryAfterSeconds,
        last_error_type AS lastErrorType,
        created_at AS createdAt
      FROM sources
      WHERE id = ?
      LIMIT 1
    `)
    .bind(sourceId)
    .first<SourceSqlRow>();

  return row ? mapSourceRow(row) : null;
};

export const addSource = async (
  env: Bindings,
  url: string,
  title: string,
  now: () => string = () => new Date().toISOString()
): Promise<SourceRow> => {
  await ensureDbSchema(env);
  const db = resolveDb(env);

  const duplicate = await db
    .prepare("SELECT id FROM sources WHERE url = ? LIMIT 1")
    .bind(url)
    .first<{ id: number }>();
  if (duplicate) {
    throw new DuplicateSourceUrlError(url);
  }

  const createdAt = now();
  const inserted = await db
    .prepare(`
      INSERT INTO sources (
        url,
        title,
        last_synced_at,
        last_checked_at,
        last_head_etag,
        last_head_last_modified,
        next_check_at,
        error_count,
        retry_after_seconds,
        last_error_type,
        created_at
      )
      VALUES (?, ?, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, ?)
    `)
    .bind(url, title, createdAt)
    .run()
    .catch((error: unknown) => {
      if (isSourceUrlUniqueConstraintError(error)) {
        throw new DuplicateSourceUrlError(url, { cause: error });
      }
      throw error;
    });

  const sourceId = Number((inserted as { meta?: { last_row_id?: number } }).meta?.last_row_id ?? 0);
  if (!Number.isFinite(sourceId) || sourceId <= 0) {
    throw new Error("failed to resolve inserted source id");
  }

  const source = await getSourceById(env, sourceId);
  if (!source) {
    throw new Error("failed to load inserted source");
  }
  return source;
};

export const listItems = async (
  env: Bindings,
  limit: number,
  offset: number
): Promise<ItemRow[]> => {
  await ensureDbSchema(env);
  const result = await resolveDb(env)
    .prepare(`
      SELECT
        id,
        source_id AS sourceId,
        source_title AS sourceTitle,
        guid,
        title,
        link,
        summary,
        published_at AS publishedAt,
        created_at AS createdAt
      FROM items
      ORDER BY COALESCE(published_at, created_at) DESC
      LIMIT ?
      OFFSET ?
    `)
    .bind(limit, offset)
    .all<ItemSqlRow>();

  return (result.results ?? []).map(mapItemRow);
};

export const insertItems = async (
  env: Bindings,
  sourceId: number,
  items: ParsedFeedItem[],
  now: () => string = () => new Date().toISOString()
): Promise<number> => {
  if (items.length === 0) {
    return 0;
  }

  await ensureDbSchema(env);
  const source = await getSourceById(env, sourceId);
  if (!source) {
    return 0;
  }

  const db = resolveDb(env);
  const statements = items.map((item) => {
    const createdAt = now();
    return db
      .prepare(`
        INSERT OR IGNORE INTO items (
          source_id,
          source_title,
          guid,
          title,
          link,
          summary,
          published_at,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        sourceId,
        source.title,
        item.guid,
        item.title,
        item.link,
        item.summary,
        item.publishedAt,
        createdAt
      );
  });

  const results = await db.batch(statements);
  return results.reduce((acc, result) => {
    const changes = Number(
      (result as { meta?: { changes?: number } }).meta?.changes ?? 0
    );
    return acc + (changes > 0 ? 1 : 0);
  }, 0);
};

export const updateSourceMetadata = async (
  env: Bindings,
  sourceId: number,
  title: string,
  syncedAt: string,
  checkMetadata?: {
    checkedAt?: string | null;
    headEtag?: string | null;
    headLastModified?: string | null;
  }
) => {
  await ensureDbSchema(env);
  const db = resolveDb(env);

  const updates: string[] = [
    "title = ?",
    "last_synced_at = ?",
    "next_check_at = ?",
    "error_count = ?",
    "retry_after_seconds = ?",
    "last_error_type = ?"
  ];
  const values: Array<string | number | null> = [title, syncedAt, null, 0, null, null];

  if (checkMetadata && Object.hasOwn(checkMetadata, "checkedAt")) {
    updates.push("last_checked_at = ?");
    values.push(checkMetadata.checkedAt ?? null);
  }
  if (checkMetadata && Object.hasOwn(checkMetadata, "headEtag")) {
    updates.push("last_head_etag = ?");
    values.push(checkMetadata.headEtag ?? null);
  }
  if (checkMetadata && Object.hasOwn(checkMetadata, "headLastModified")) {
    updates.push("last_head_last_modified = ?");
    values.push(checkMetadata.headLastModified ?? null);
  }

  values.push(sourceId);
  await db
    .prepare(`UPDATE sources SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  await db
    .prepare("UPDATE items SET source_title = ? WHERE source_id = ?")
    .bind(title, sourceId)
    .run();
};

export const updateSourceCheckMetadata = async (
  env: Bindings,
  sourceId: number,
  checkedAt: string,
  headEtag: string | null,
  headLastModified: string | null
) => {
  await ensureDbSchema(env);
  await resolveDb(env)
    .prepare(`
      UPDATE sources
      SET
        last_checked_at = ?,
        last_head_etag = ?,
        last_head_last_modified = ?
      WHERE id = ?
    `)
    .bind(checkedAt, headEtag, headLastModified, sourceId)
    .run();
};

export const updateSourceFailureState = async (
  env: Bindings,
  sourceId: number,
  failedAt: string,
  errorType: string,
  retryAfterSeconds?: number | null
) => {
  await ensureDbSchema(env);
  const db = resolveDb(env);

  const current = await getSourceById(env, sourceId);
  if (!current) {
    return;
  }

  const nextErrorCount = (current.errorCount ?? 0) + 1;
  const resolvedRetryAfterSeconds = resolveRetryAfterSeconds(
    nextErrorCount,
    retryAfterSeconds
  );
  const nextCheckAt = toNextCheckAt(failedAt, resolvedRetryAfterSeconds);

  await db
    .prepare(`
      UPDATE sources
      SET
        last_checked_at = ?,
        error_count = ?,
        retry_after_seconds = ?,
        next_check_at = ?,
        last_error_type = ?
      WHERE id = ?
    `)
    .bind(
      failedAt,
      nextErrorCount,
      resolvedRetryAfterSeconds,
      nextCheckAt,
      errorType,
      sourceId
    )
    .run();
};

export const createRepository = (env: Bindings): SyncRepository => ({
  getSourceById: (sourceId) => getSourceById(env, sourceId),
  listSources: () => listSources(env),
  insertItems: (sourceId, items) => insertItems(env, sourceId, items),
  updateSourceMetadata: (sourceId, title, syncedAt, checkMetadata) =>
    updateSourceMetadata(env, sourceId, title, syncedAt, checkMetadata),
  updateSourceCheckMetadata: (sourceId, checkedAt, headEtag, headLastModified) =>
    updateSourceCheckMetadata(env, sourceId, checkedAt, headEtag, headLastModified),
  updateSourceFailureState: (
    sourceId,
    failedAt,
    errorType,
    retryAfterSeconds
  ) =>
    updateSourceFailureState(
      env,
      sourceId,
      failedAt,
      errorType,
      retryAfterSeconds
    )
});
