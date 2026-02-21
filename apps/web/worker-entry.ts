import serverBuild from "./build/server/index.js";

type ApiServiceBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

type WorkerEnv = {
  API_SERVICE?: ApiServiceBinding;
};

declare global {
  // eslint-disable-next-line no-var
  var __FEEDOONG_API_SERVICE: ApiServiceBinding | undefined;
}

export default {
  async fetch(request: Request, env: WorkerEnv) {
    globalThis.__FEEDOONG_API_SERVICE = env.API_SERVICE;
    return serverBuild.fetch(request);
  }
};
