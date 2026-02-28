import {
  DuplicateSourceUrlError,
  INVALID_JSON_BODY_ERROR,
  InvalidJsonBodyError,
  itemsQuerySchema,
  readJsonBody,
  SourceRegistrationError,
  sourceBodySchema,
  syncBodySchema
} from "@feedoong/contracts";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

import {
  addSource,
  createStorageRef,
  listItems,
  listSources,
  readStorage,
  writeStorage
} from "./storage";
import {
  createParseFeedPort,
  executeSyncCommand,
  parseSyncCommand,
  syncAllSources
} from "./sync-usecase";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

const resolveAllowedOrigins = (originConfig: string) =>
  originConfig === "*"
    ? "*"
    : originConfig.split(",").map((origin) => origin.trim());

app.use("*", async (context, next) => {
  const originConfig = context.env.WEB_ORIGIN ?? "*";
  return cors({ origin: resolveAllowedOrigins(originConfig) })(context, next);
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
  const storageRef = createStorageRef(await readStorage(context.env));
  const parseFeedPort = createParseFeedPort(context.env);

  const parsed = await parseFeedPort(body.url).catch((error: unknown) => {
    throw new SourceRegistrationError(error);
  });
  const next = addSource(storageRef.current, parsed.feedUrl, parsed.title);
  storageRef.current = next.storage;
  await writeStorage(context.env, storageRef.current);
  return context.json({ source: next.source }, 201);
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
  const storageRef = createStorageRef(await readStorage(context.env));
  const command = parseSyncCommand(body.sourceId);
  const result = await executeSyncCommand(
    storageRef,
    createParseFeedPort(context.env),
    command
  );
  await writeStorage(context.env, storageRef.current);
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

  const storageRef = createStorageRef(await readStorage(context.env));
  const result = await syncAllSources(storageRef, createParseFeedPort(context.env));
  await writeStorage(context.env, storageRef.current);
  return context.json(result);
});

app.onError((error, context) => {
  if (error instanceof z.ZodError) {
    return context.json({
      message: "Invalid request",
      issues: error.issues
    }, 400);
  }

  if (error instanceof InvalidJsonBodyError) {
    return context.json({
      message: "Invalid request"
    }, 400);
  }

  if (error instanceof Error && error.message === INVALID_JSON_BODY_ERROR) {
    return context.json({
      message: "Invalid request"
    }, 400);
  }

  if (error instanceof DuplicateSourceUrlError) {
    return context.json({
      message: "이미 등록된 RSS URL입니다."
    }, 409);
  }

  if (error instanceof SourceRegistrationError) {
    return context.json({
      message: error.message
    }, 422);
  }

  const message = error instanceof Error ? error.message : "알 수 없는 서버 에러";
  console.error(error);
  return context.json({ message }, 500);
});

export default app;
