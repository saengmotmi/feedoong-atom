import { parseFeed } from "@feedoong/rss-parser";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

type SourceRow = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
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

type SyncDetail = {
  sourceId: number;
  sourceUrl: string;
  sourceTitle: string;
  inserted: number;
  totalFetched: number;
  status: "ok" | "failed";
  error: string | null;
};

type Bindings = {
  FEEDOONG_DB: KVNamespace;
  WEB_ORIGIN?: string;
  SCHEDULER_KEY?: string;
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
  syncedAt: string
) => {
  storage.sources = storage.sources.map((source) => {
    if (source.id !== sourceId) {
      return source;
    }

    return {
      ...source,
      title,
      lastSyncedAt: syncedAt
    };
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

const insertItems = (
  storage: StorageShape,
  sourceId: number,
  sourceTitle: string,
  items: Array<{
    guid: string;
    title: string;
    link: string;
    summary: string | null;
    publishedAt: string | null;
  }>
) => {
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
      sourceTitle,
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

const syncOneSource = async (
  storage: StorageShape,
  sourceId: number
): Promise<SyncDetail> => {
  const source = getSourceById(storage, sourceId);
  if (!source) {
    throw new Error(`Source not found: ${sourceId}`);
  }

  const parsed = await parseFeed(source.url);
  const inserted = insertItems(
    storage,
    source.id,
    parsed.title,
    parsed.items
      .filter((item) => item.link.length > 0)
      .map((item) => ({
        guid: item.guid,
        title: item.title,
        link: item.link,
        summary: item.summary,
        publishedAt: item.publishedAt
      }))
  );

  updateSourceMetadata(storage, source.id, parsed.title, new Date().toISOString());

  return {
    sourceId: source.id,
    sourceUrl: source.url,
    sourceTitle: parsed.title,
    inserted,
    totalFetched: parsed.items.length,
    status: "ok",
    error: null
  };
};

const syncAllSources = async (storage: StorageShape) => {
  const sources = [...storage.sources];
  const details: SyncDetail[] = [];
  let totalInserted = 0;
  let failedSources = 0;

  for (const source of sources) {
    try {
      const detail = await syncOneSource(storage, source.id);
      details.push(detail);
      totalInserted += detail.inserted;
    } catch (error) {
      failedSources += 1;
      details.push({
        sourceId: source.id,
        sourceUrl: source.url,
        sourceTitle: source.title,
        inserted: 0,
        totalFetched: 0,
        status: "failed",
        error: error instanceof Error ? error.message : "알 수 없는 동기화 에러"
      });
    }
  }

  return {
    syncedSources: sources.length,
    failedSources,
    totalInserted,
    details
  };
};

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
