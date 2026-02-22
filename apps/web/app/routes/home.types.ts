export type Source = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  createdAt: string;
};

export type FeedItem = {
  id: number;
  sourceId: number;
  sourceTitle: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type ApiServiceBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

export type RouteContextWithApiService = {
  apiService?: ApiServiceBinding;
};

export type GlobalWithApiService = typeof globalThis & {
  __FEEDOONG_API_SERVICE?: ApiServiceBinding;
};

export type ApiRuntime = {
  apiBaseUrl: string;
  apiFetch: typeof fetch;
  ttlSeconds: number;
};

export type DashboardPayload = {
  sources: Source[];
  items: FeedItem[];
};

export type ActionIntent = "add-source" | "sync";

export type IntentHandlerArgs = {
  formData: FormData;
  runtime: ApiRuntime;
};
