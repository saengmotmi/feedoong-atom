import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApiApp } from "./app.js";

const PORT = Number(process.env.PORT ?? 4000);
const app = createApiApp();

serve(
  {
    fetch: app.fetch,
    port: PORT
  },
  (info) => {
    console.log(`[api] listening on http://localhost:${info.port}`);
  }
);
