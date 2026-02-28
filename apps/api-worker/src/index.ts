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
  requireConfiguredSecret,
  readJsonBody,
  sourceBodySchema,
  syncBodySchema
} from "@feedoong/contracts";
import { SourceNotFoundError } from "@feedoong/sync-core";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

import {
  addSource,
  listItems,
  listSources
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

const requireWriteAuthorization = (
  context: { env: Bindings; req: { header: (key: string) => string | undefined } }
) => {
  const expectedKey = requireConfiguredSecret({
    value: context.env.API_WRITE_KEY,
    secretName: "API_WRITE_KEY"
  });

  return ensureAuthorizedByKey({
    expectedKey,
    providedKey: context.req.header(API_WRITE_KEY_HEADER),
    unauthorizedMessage: "유효하지 않은 API 키입니다."
  });
};

const requireSchedulerAuthorization = (
  context: { env: Bindings; req: { header: (key: string) => string | undefined } }
) => {
  const expectedKey = requireConfiguredSecret({
    value: context.env.SCHEDULER_KEY,
    secretName: "SCHEDULER_KEY"
  });

  return ensureAuthorizedByKey({
    expectedKey,
    providedKey: context.req.header(SCHEDULER_KEY_HEADER),
    unauthorizedMessage: "유효하지 않은 스케줄러 키입니다."
  });
};

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
  const sources = await listSources(context.env);
  return context.json({ sources });
});

app.post("/v1/sources", async (context) => {
  requireWriteAuthorization(context);
  const body = sourceBodySchema.parse(await readJsonBody(context.req.raw));
  assertPublicSourceUrl(body.url);
  const parseFeedPort = createParseFeedPort(context.env);

  const parsed = await parseFeedPort(body.url).catch((error: unknown) => {
    throw new SourceRegistrationError(error);
  });
  const source = await addSource(context.env, parsed.feedUrl, parsed.title);
  return context.json({ source }, 201);
});

app.get("/v1/items", async (context) => {
  const query = itemsQuerySchema.parse(context.req.query());
  const items = await listItems(context.env, query.limit, query.offset);
  return context.json({
    items
  });
});

app.post("/v1/sync", async (context) => {
  requireWriteAuthorization(context);
  const body = syncBodySchema.parse(await readJsonBody(context.req.raw));
  const command = parseSyncCommand(body.sourceId);
  const result = await executeSyncCommand(
    context.env,
    createParseFeedPort(context.env),
    command
  );
  return context.json(result);
});

app.post("/internal/sync", async (context) => {
  requireSchedulerAuthorization(context);

  const result = await syncAllSources(context.env, createParseFeedPort(context.env));
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

  console.error(`[api-worker][${requestId}]`, error);
  return toErrorResponse(
    context,
    requestId,
    500,
    API_ERROR_CODES.INTERNAL_SERVER_ERROR,
    "알 수 없는 서버 에러"
  );
});

export default app;
