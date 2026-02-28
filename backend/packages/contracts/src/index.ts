import { z } from "zod";

export const INVALID_JSON_BODY_ERROR = "INVALID_JSON_BODY";
export const DUPLICATE_SOURCE_URL_ERROR = "DUPLICATE_SOURCE_URL";

export const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message.trim().length > 0
    ? error.message
    : fallback;

export class InvalidJsonBodyError extends Error {
  constructor(options?: { cause?: unknown }) {
    super(INVALID_JSON_BODY_ERROR, options);
    this.name = "InvalidJsonBodyError";
  }
}

export class DuplicateSourceUrlError extends Error {
  readonly url: string;

  constructor(url: string, options?: { cause?: unknown }) {
    super(DUPLICATE_SOURCE_URL_ERROR, options);
    this.name = "DuplicateSourceUrlError";
    this.url = url;
  }
}

export class SourceRegistrationError extends Error {
  constructor(cause: unknown, fallbackMessage = "RSS를 불러올 수 없습니다.") {
    super(`RSS를 등록할 수 없습니다: ${toErrorMessage(cause, fallbackMessage)}`, {
      cause
    });
    this.name = "SourceRegistrationError";
  }
}

export const sourceBodySchema = z.object({
  url: z.string().url()
});

export const itemsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

export const syncBodySchema = z.object({
  sourceId: z.coerce.number().int().positive().optional()
});

export type SourceBody = z.infer<typeof sourceBodySchema>;
export type ItemsQuery = z.infer<typeof itemsQuerySchema>;
export type SyncBody = z.infer<typeof syncBodySchema>;

export const readJsonBody = async (request: Request): Promise<unknown> => {
  const rawBody = await request.text();
  if (rawBody.trim().length === 0) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch (error) {
    throw new InvalidJsonBodyError({
      cause: error
    });
  }
};
