import { redirect } from "react-router";
import { match } from "ts-pattern";

import { requestAddSource, requestSync } from "./home.api";
import type { ActionIntent, IntentHandlerArgs } from "./home.types";

export const parseActionIntent = (rawIntent: FormDataEntryValue | null): ActionIntent | null =>
  match(rawIntent)
    .with("add-source", () => "add-source" as const)
    .with("sync", () => "sync" as const)
    .otherwise(() => null);

const redirectWithStatus = (status: string) => redirect(`/?status=${status}`);

const handleAddSourceIntent = async ({ formData, runtime }: IntentHandlerArgs) => {
  const url = String(formData.get("url") ?? "").trim();
  if (!url) {
    return redirectWithStatus("source-error");
  }

  try {
    await requestAddSource(runtime, url);
    return redirectWithStatus("source-added");
  } catch (_error) {
    return redirectWithStatus("source-error");
  }
};

const handleSyncIntent = async ({ runtime }: IntentHandlerArgs) => {
  try {
    await requestSync(runtime);
    return redirectWithStatus("synced");
  } catch (_error) {
    return redirectWithStatus("sync-error");
  }
};

const actionHandlers: Record<ActionIntent, (args: IntentHandlerArgs) => Promise<Response>> = {
  "add-source": handleAddSourceIntent,
  sync: handleSyncIntent
};

export const runActionIntent = async (
  intent: ActionIntent | null,
  args: IntentHandlerArgs
) => {
  if (!intent) {
    return redirect("/");
  }
  return actionHandlers[intent](args);
};
