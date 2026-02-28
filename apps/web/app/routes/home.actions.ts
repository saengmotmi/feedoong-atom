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

const runActionWithRedirect = async (
  action: () => Promise<unknown>,
  successStatus: string,
  failStatus: string
) => {
  try {
    await action();
    return redirectWithStatus(successStatus);
  } catch (_error) {
    return redirectWithStatus(failStatus);
  }
};

const handleAddSourceIntent = async ({ formData, runtime }: IntentHandlerArgs) => {
  const url = String(formData.get("url") ?? "").trim();
  if (!url) {
    return redirectWithStatus("source-error");
  }

  return runActionWithRedirect(
    () => requestAddSource(runtime, url),
    "source-added",
    "source-error"
  );
};

const handleSyncIntent = async ({ runtime }: IntentHandlerArgs) => {
  return runActionWithRedirect(
    () => requestSync(runtime),
    "synced",
    "sync-error"
  );
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
