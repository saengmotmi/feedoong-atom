import { z } from "zod";

export const INVALID_JSON_BODY_ERROR = "INVALID_JSON_BODY";

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
  } catch (_error) {
    throw new Error(INVALID_JSON_BODY_ERROR);
  }
};
