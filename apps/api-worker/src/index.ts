import { parseFeed } from "@feedoong/rss-parser";
import {
  syncAllSources as runSyncAllSources,
  syncOneSource as runSyncOneSource
} from "@feedoong/sync-core";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

import type { ParsedFeedItem, SyncDetail, SyncRepository } from "@feedoong/sync-core";

type SourceRow = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  lastCheckedAt?: string | null;
  lastHeadEtag?: string | null;
  lastHeadLastModified?: string | null;
  createdAt: string;
};

type ItemRow = {
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

type StorageShape = {
  nextSourceId: number;
  nextItemId: number;
  sources: SourceRow[];
  items: ItemRow[];
};

type Bindings = {
  FEEDOONG_DB: KVNamespace;
  WEB_ORIGIN?: string;
  SCHEDULER_KEY?: string;
  X_BEARER_TOKEN?: string;
  X_API_BASE_URL?: string;
  X_MENTIONS_MAX_RESULTS?: string;
};

type GlobalWithXMentionsConfig = typeof globalThis & {
  __FEEDOONG_X_BEARER_TOKEN?: string;
  __FEEDOONG_X_API_BASE_URL?: string;
  __FEEDOONG_X_MENTIONS_MAX_RESULTS?: string;
};

const STORAGE_KEY = "feedoong.storage.v1";
const INVALID_JSON_BODY_ERROR = "INVALID_JSON_BODY";

const sourceBodySchema = z.object({
  url: z.string().url()
});

const itemsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

const syncBodySchema = z.object({
  sourceId: z.coerce.number().int().positive().optional()
});

const createInitialStorage = (): StorageShape => ({
  nextSourceId: 1,
  nextItemId: 1,
  sources: [],
  items: []
});

const readStorage = async (env: Bindings): Promise<StorageShape> => {
  const loaded = await env.FEEDOONG_DB.get<StorageShape>(STORAGE_KEY, "json");
  return loaded ?? createInitialStorage();
};

const writeStorage = async (env: Bindings, storage: StorageShape) => {
  await env.FEEDOONG_DB.put(STORAGE_KEY, JSON.stringify(storage));
};

const listSources = (storage: StorageShape): SourceRow[] =>
  [...storage.sources].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

const listItems = (storage: StorageShape, limit: number, offset: number): ItemRow[] =>
  [...storage.items]
    .sort((a, b) => {
      const left = a.publishedAt ?? a.createdAt;
      const right = b.publishedAt ?? b.createdAt;
      return left < right ? 1 : -1;
    })
    .slice(offset, offset + limit);

const getSourceById = (storage: StorageShape, sourceId: number) =>
  storage.sources.find((source) => source.id === sourceId);

const addSource = (storage: StorageShape, url: string, title: string): SourceRow => {
  const isDuplicate = storage.sources.some((source) => source.url === url);
  if (isDuplicate) {
    throw new Error("DUPLICATE_SOURCE_URL");
  }

  const source: SourceRow = {
    id: storage.nextSourceId,
    url,
    title,
    lastSyncedAt: null,
    lastCheckedAt: null,
    lastHeadEtag: null,
    lastHeadLastModified: null,
    createdAt: new Date().toISOString()
  };

  storage.sources.push(source);
  storage.nextSourceId += 1;
  return source;
};

const updateSourceMetadata = (
  storage: StorageShape,
  sourceId: number,
  title: string,
  syncedAt: string,
  checkMetadata?: {
    checkedAt?: string | null;
    headEtag?: string | null;
    headLastModified?: string | null;
  }
) => {
  storage.sources = storage.sources.map((source) => {
    if (source.id !== sourceId) {
      return source;
    }

    const next: SourceRow = {
      ...source,
      title,
      lastSyncedAt: syncedAt
    };

    if (checkMetadata) {
      if ("checkedAt" in checkMetadata) {
        next.lastCheckedAt = checkMetadata.checkedAt ?? null;
      }
      if ("headEtag" in checkMetadata) {
        next.lastHeadEtag = checkMetadata.headEtag ?? null;
      }
      if ("headLastModified" in checkMetadata) {
        next.lastHeadLastModified = checkMetadata.headLastModified ?? null;
      }
    }

    return next;
  });

  storage.items = storage.items.map((item) => {
    if (item.sourceId !== sourceId) {
      return item;
    }
    return {
      ...item,
      sourceTitle: title
    };
  });
};

const updateSourceCheckMetadata = (
  storage: StorageShape,
  sourceId: number,
  checkedAt: string,
  headEtag: string | null,
  headLastModified: string | null
) => {
  storage.sources = storage.sources.map((source) => {
    if (source.id !== sourceId) {
      return source;
    }

    return {
      ...source,
      lastCheckedAt: checkedAt,
      lastHeadEtag: headEtag,
      lastHeadLastModified: headLastModified
    };
  });
};

const insertItems = (
  storage: StorageShape,
  sourceId: number,
  items: ParsedFeedItem[]
) => {
  const source = getSourceById(storage, sourceId);
  if (!source) {
    return 0;
  }

  let insertedCount = 0;
  for (const item of items) {
    const duplicated = storage.items.some(
      (existing) =>
        existing.link === item.link ||
        (existing.sourceId === sourceId && existing.guid === item.guid)
    );
    if (duplicated) {
      continue;
    }

    storage.items.push({
      id: storage.nextItemId,
      sourceId,
      sourceTitle: source.title,
      guid: item.guid,
      title: item.title,
      link: item.link,
      summary: item.summary,
      publishedAt: item.publishedAt,
      createdAt: new Date().toISOString()
    });
    storage.nextItemId += 1;
    insertedCount += 1;
  }

  return insertedCount;
};

const createRepository = (storage: StorageShape): SyncRepository => ({
  getSourceById: (sourceId) => getSourceById(storage, sourceId) ?? null,
  listSources: () => [...storage.sources],
  insertItems: (sourceId, items) => insertItems(storage, sourceId, items),
  updateSourceMetadata: (sourceId, title, syncedAt, checkMetadata) =>
    updateSourceMetadata(storage, sourceId, title, syncedAt, checkMetadata),
  updateSourceCheckMetadata: (sourceId, checkedAt, headEtag, headLastModified) =>
    updateSourceCheckMetadata(storage, sourceId, checkedAt, headEtag, headLastModified)
});

const syncOneSource = async (
  storage: StorageShape,
  sourceId: number
): Promise<SyncDetail> =>
  runSyncOneSource({
    repository: createRepository(storage),
    sourceId,
    parseFeed
  });

const syncAllSources = async (storage: StorageShape) =>
  runSyncAllSources({
    repository: createRepository(storage),
    parseFeed
  });

const readJsonBody = async (request: Request): Promise<unknown> => {
  const rawBody = await request.text();
  if (rawBody.trim().length === 0) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch (_error) {
    throw new Error(INVALID_JSON_BODY_ERROR);
  }
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (context, next) => {
  const globalRef = globalThis as GlobalWithXMentionsConfig;
  globalRef.__FEEDOONG_X_BEARER_TOKEN = context.env.X_BEARER_TOKEN;
  globalRef.__FEEDOONG_X_API_BASE_URL = context.env.X_API_BASE_URL;
  globalRef.__FEEDOONG_X_MENTIONS_MAX_RESULTS = context.env.X_MENTIONS_MAX_RESULTS;

  const originConfig = context.env.WEB_ORIGIN ?? "*";
  const allowedOrigins = originConfig === "*"
    ? "*"
    : originConfig.split(",").map((origin) => origin.trim());

  return cors({ origin: allowedOrigins })(context, next);
});

app.get("/health", (context) =>
  context.json({
    ok: true,
    now: new Date().toISOString()
  }));

app.get("/v1/sources", async (context) => {
  const storage = await readStorage(context.env);
  return context.json({ sources: listSources(storage) });
});

app.post("/v1/sources", async (context) => {
  const body = sourceBodySchema.parse(await readJsonBody(context.req.raw));
  const storage = await readStorage(context.env);

  try {
    const parsed = await parseFeed(body.url);
    const source = addSource(storage, parsed.feedUrl, parsed.title);
    await writeStorage(context.env, storage);
    return context.json({ source }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_SOURCE_URL") {
      return context.json({
        message: "이미 등록된 RSS URL입니다."
      }, 409);
    }

    const message = error instanceof Error ? error.message : "RSS를 불러올 수 없습니다.";
    return context.json({
      message: `RSS를 등록할 수 없습니다: ${message}`
    }, 422);
  }
});

app.get("/v1/items", async (context) => {
  const query = itemsQuerySchema.parse(context.req.query());
  const storage = await readStorage(context.env);
  return context.json({
    items: listItems(storage, query.limit, query.offset)
  });
});

app.post("/v1/sync", async (context) => {
  const body = syncBodySchema.parse(await readJsonBody(context.req.raw));
  const storage = await readStorage(context.env);

  if (body.sourceId) {
    const detail = await syncOneSource(storage, body.sourceId);
    await writeStorage(context.env, storage);
    return context.json({
      syncedSources: 1,
      failedSources: 0,
      totalInserted: detail.inserted,
      details: [detail]
    });
  }

  const result = await syncAllSources(storage);
  await writeStorage(context.env, storage);
  return context.json(result);
});

app.post("/internal/sync", async (context) => {
  const schedulerKey = context.env.SCHEDULER_KEY ?? "";
  if (schedulerKey) {
    const key = context.req.header("x-scheduler-key");
    if (key !== schedulerKey) {
      return context.json({ message: "Invalid scheduler key" }, 401);
    }
  }

  const storage = await readStorage(context.env);
  const result = await syncAllSources(storage);
  await writeStorage(context.env, storage);
  return context.json(result);
});

app.onError((error, context) => {
  if (error instanceof z.ZodError) {
    return context.json({
      message: "Invalid request",
      issues: error.issues
    }, 400);
  }

  if (error instanceof Error && error.message === INVALID_JSON_BODY_ERROR) {
    return context.json({
      message: "Invalid request"
    }, 400);
  }

  const message =
    error instanceof Error ? error.message : "알 수 없는 서버 에러";
  console.error(error);
  return context.json({ message }, 500);
});

export default app;
