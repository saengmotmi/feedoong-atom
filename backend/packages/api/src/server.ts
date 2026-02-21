import "dotenv/config";

import cors from "cors";
import express from "express";
import { parseFeed } from "@feedoong/rss-parser";
import { z } from "zod";

import { FeedoongDb } from "./db.js";
import { syncAllSources, syncOneSource } from "./sync.js";

const PORT = Number(process.env.PORT ?? 4000);
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:5173";
const DB_PATH = process.env.DB_PATH ?? "./data/feedoong.json";
const SCHEDULER_KEY = process.env.SCHEDULER_KEY ?? "";

const db = new FeedoongDb(DB_PATH);
const app = express();

const allowedOrigins = WEB_ORIGIN === "*"
  ? true
  : WEB_ORIGIN.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    now: new Date().toISOString()
  });
});

app.get("/v1/sources", (_request, response) => {
  response.json({ sources: db.listSources() });
});

app.post("/v1/sources", async (request, response) => {
  const body = z
    .object({
      url: z.string().url()
    })
    .parse(request.body);

  try {
    const parsed = await parseFeed(body.url);
    const source = db.addSource(body.url, parsed.title);
    response.status(201).json({ source });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_SOURCE_URL") {
      response.status(409).json({
        message: "이미 등록된 RSS URL입니다."
      });
      return;
    }
    throw error;
  }
});

app.get("/v1/items", (request, response) => {
  const query = z
    .object({
      limit: z.coerce.number().int().min(1).max(200).default(50),
      offset: z.coerce.number().int().min(0).default(0)
    })
    .parse(request.query);

  const items = db.listItems(query.limit, query.offset);
  response.json({ items });
});

app.post("/v1/sync", async (request, response) => {
  const body = z
    .object({
      sourceId: z.coerce.number().int().positive().optional()
    })
    .parse(request.body ?? {});

  if (body.sourceId) {
    const detail = await syncOneSource(db, body.sourceId);
    response.json({
      syncedSources: 1,
      totalInserted: detail.inserted,
      details: [detail]
    });
    return;
  }

  const result = await syncAllSources(db);
  response.json(result);
});

app.post("/internal/sync", async (request, response) => {
  if (SCHEDULER_KEY) {
    const key = request.header("x-scheduler-key");
    if (key !== SCHEDULER_KEY) {
      response.status(401).json({ message: "Invalid scheduler key" });
      return;
    }
  }

  const result = await syncAllSources(db);
  response.json(result);
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    if (error instanceof z.ZodError) {
      response.status(400).json({
        message: "Invalid request",
        issues: error.issues
      });
      return;
    }

    const message =
      error instanceof Error ? error.message : "알 수 없는 서버 에러";
    console.error(error);
    response.status(500).json({ message });
  }
);

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
