import {
  API_ERROR_CODES,
  API_WRITE_KEY_HEADER,
  ApiDomainError,
  createApiErrorResponse,
  DuplicateSourceUrlError,
  InvalidJsonBodyError,
  SCHEDULER_KEY_HEADER,
  SourceRegistrationError,
  assertPublicSourceUrl,
  ensureAuthorizedByKey,
  itemsQuerySchema,
  readJsonBody,
  sourceBodySchema,
  syncBodySchema
} from "@feedoong/contracts";
import { parseFeed } from "@feedoong/rss-parser";
import { SourceNotFoundError } from "@feedoong/sync-core";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

import { FeedoongDb } from "./db.js";
import { syncAllSources, syncOneSource } from "./sync.js";

import type { ParsedFeedResult } from "@feedoong/rss-parser";

export type ParseFeedPort = (url: string) => Promise<ParsedFeedResult>;

export type CreateApiAppOptions = {
  db?: FeedoongDb;
  parseFeedPort?: ParseFeedPort;
  webOrigin?: string;
  schedulerKey?: string;
  apiWriteKey?: string;
};

const createDefaultParseFeedPort = (): ParseFeedPort => (url: string) =>
  parseFeed(url, {
    xMentions: {
      token: process.env.X_BEARER_TOKEN ?? "",
      apiBaseUrl: process.env.X_API_BASE_URL,
      maxResults: process.env.X_MENTIONS_MAX_RESULTS
    }
  });

const resolveAllowedOrigins = (originConfig: string) =>
  originConfig === "*"
    ? "*"
    : originConfig.split(",").map((origin) => origin.trim());

const resolveRequestId = (context: { req: { header: (key: string) => string | undefined } }) =>
  context.req.header("x-request-id") ??
  context.req.header("cf-ray") ??
  crypto.randomUUID();

const toApiDomainMessage = (error: ApiDomainError) => {
  if (error instanceof InvalidJsonBodyError) {
    return "Invalid request";
  }
  if (error instanceof DuplicateSourceUrlError) {
    return "이미 등록된 RSS URL입니다.";
  }
  if (error instanceof SourceRegistrationError) {
    return "RSS를 등록할 수 없습니다.";
  }
  return error.message;
};

const toErrorResponse = (
  context: { json: (body: unknown, status?: number) => Response },
  requestId: string,
  status: number,
  code: (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES],
  message: string,
  issues?: z.ZodIssue[]
) =>
  context.json(
    createApiErrorResponse({
      code,
      message,
      requestId,
      issues
    }),
    status
  );

export const createApiApp = (options: CreateApiAppOptions = {}) => {
  const webOrigin = options.webOrigin ?? process.env.WEB_ORIGIN ?? "http://localhost:5173";
  const schedulerKey = options.schedulerKey ?? process.env.SCHEDULER_KEY ?? "";
  const apiWriteKey = options.apiWriteKey ?? process.env.API_WRITE_KEY ?? "";
  const db =
    options.db ?? new FeedoongDb(process.env.DB_PATH ?? "./data/feedoong.json");
  const parseFeedPort = options.parseFeedPort ?? createDefaultParseFeedPort();

  const app = new Hono();
  app.use("*", cors({ origin: resolveAllowedOrigins(webOrigin) }));

  const requireWriteAuthorization = (context: {
    req: { header: (key: string) => string | undefined };
  }) =>
    ensureAuthorizedByKey({
      expectedKey: apiWriteKey,
      providedKey: context.req.header(API_WRITE_KEY_HEADER),
      unauthorizedMessage: "유효하지 않은 API 키입니다."
    });

  app.get("/health", (context) =>
    context.json({
      ok: true,
      now: new Date().toISOString()
    })
  );

  app.get("/v1/sources", (context) => context.json({ sources: db.listSources() }));

  app.post("/v1/sources", async (context) => {
    requireWriteAuthorization(context);
    const body = sourceBodySchema.parse(await readJsonBody(context.req.raw));
    assertPublicSourceUrl(body.url);

    const parsed = await parseFeedPort(body.url).catch((error: unknown) => {
      throw new SourceRegistrationError(error);
    });

    const source = db.addSource(parsed.feedUrl, parsed.title);
    return context.json({ source }, 201);
  });

  app.get("/v1/items", (context) => {
    const query = itemsQuerySchema.parse(context.req.query());

    const items = db.listItems(query.limit, query.offset);
    return context.json({ items });
  });

  app.post("/v1/sync", async (context) => {
    requireWriteAuthorization(context);
    const body = syncBodySchema.parse(await readJsonBody(context.req.raw));

    if (body.sourceId) {
      const detail = await syncOneSource(db, body.sourceId, {
        parseFeedPort
      });
      return context.json({
        syncedSources: 1,
        failedSources: 0,
        totalInserted: detail.inserted,
        details: [detail]
      });
    }

    const result = await syncAllSources(db, {
      parseFeedPort
    });
    return context.json(result);
  });

  app.post("/internal/sync", async (context) => {
    ensureAuthorizedByKey({
      expectedKey: schedulerKey,
      providedKey: context.req.header(SCHEDULER_KEY_HEADER),
      unauthorizedMessage: "유효하지 않은 스케줄러 키입니다."
    });

    const result = await syncAllSources(db, {
      parseFeedPort
    });
    return context.json(result);
  });

  app.onError((error, context) => {
    const requestId = resolveRequestId(context);

    if (error instanceof z.ZodError) {
      return toErrorResponse(
        context,
        requestId,
        400,
        API_ERROR_CODES.INVALID_REQUEST,
        "Invalid request",
        error.issues
      );
    }

    if (error instanceof SourceNotFoundError) {
      return toErrorResponse(
        context,
        requestId,
        404,
        API_ERROR_CODES.SOURCE_NOT_FOUND,
        "요청한 소스를 찾을 수 없습니다."
      );
    }

    if (error instanceof ApiDomainError) {
      return toErrorResponse(
        context,
        requestId,
        error.status,
        error.code,
        toApiDomainMessage(error)
      );
    }

    console.error(`[api][${requestId}]`, error);
    return toErrorResponse(
      context,
      requestId,
      500,
      API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      "알 수 없는 서버 에러"
    );
  });

  return app;
};
