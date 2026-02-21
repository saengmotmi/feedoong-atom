import "dotenv/config";

import { serve } from "@hono/node-server";
import { parseFeed } from "@feedoong/rss-parser";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

import { FeedoongDb } from "./db.js";
import { syncAllSources, syncOneSource } from "./sync.js";

const PORT = Number(process.env.PORT ?? 4000);
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:5173";
const DB_PATH = process.env.DB_PATH ?? "./data/feedoong.json";
const SCHEDULER_KEY = process.env.SCHEDULER_KEY ?? "";
const INVALID_JSON_BODY_ERROR = "INVALID_JSON_BODY";

const db = new FeedoongDb(DB_PATH);
const app = new Hono();

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

const allowedOrigins = WEB_ORIGIN === "*"
  ? "*"
  : WEB_ORIGIN.split(",").map((origin) => origin.trim());

app.use("*", cors({ origin: allowedOrigins }));

app.get("/health", (context) =>
  context.json({
    ok: true,
    now: new Date().toISOString()
  }));

app.get("/v1/sources", (context) => context.json({ sources: db.listSources() }));

app.post("/v1/sources", async (context) => {
  const body = sourceBodySchema.parse(await readJsonBody(context.req.raw));

  try {
    const parsed = await parseFeed(body.url);
    const source = db.addSource(parsed.feedUrl, parsed.title);
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

app.get("/v1/items", (context) => {
  const query = itemsQuerySchema.parse(context.req.query());

  const items = db.listItems(query.limit, query.offset);
  return context.json({ items });
});

app.post("/v1/sync", async (context) => {
  const body = syncBodySchema.parse(await readJsonBody(context.req.raw));

  if (body.sourceId) {
    const detail = await syncOneSource(db, body.sourceId);
    return context.json({
      syncedSources: 1,
      totalInserted: detail.inserted,
      details: [detail]
    });
  }

  const result = await syncAllSources(db);
  return context.json(result);
});

app.post("/internal/sync", async (context) => {
  if (SCHEDULER_KEY) {
    const key = context.req.header("x-scheduler-key");
    if (key !== SCHEDULER_KEY) {
      return context.json({ message: "Invalid scheduler key" }, 401);
    }
  }

  const result = await syncAllSources(db);
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

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`[api] listening on http://localhost:${info.port}`);
});
