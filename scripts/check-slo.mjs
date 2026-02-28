const API_BASE_URL = process.env.API_BASE_URL?.trim() ?? "";
const REQUEST_COUNT = Number(process.env.SLO_REQUEST_COUNT ?? "8");
const MIN_AVAILABILITY = Number(process.env.SLO_MIN_AVAILABILITY ?? "0.99");
const MAX_P95_MS = Number(process.env.SLO_MAX_P95_MS ?? "1200");
const REQUEST_TIMEOUT_MS = Number(process.env.SLO_REQUEST_TIMEOUT_MS ?? "8000");

if (!API_BASE_URL) {
  console.log("[slo] skip: API_BASE_URL is empty");
  process.exit(0);
}

const toMs = (startNs, endNs) => Number(endNs - startNs) / 1_000_000;

const fetchWithTimeout = async (url, init = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
};

const readHealthSample = async () => {
  const started = process.hrtime.bigint();
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/health`);
    const ended = process.hrtime.bigint();
    const latencyMs = toMs(started, ended);
    if (!response.ok) {
      return { ok: false, latencyMs, reason: `status=${response.status}` };
    }

    const body = await response.json();
    if (!body?.ok) {
      return { ok: false, latencyMs, reason: "invalid-body" };
    }

    return { ok: true, latencyMs, reason: "ok" };
  } catch (error) {
    const ended = process.hrtime.bigint();
    const latencyMs = toMs(started, ended);
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, latencyMs, reason: message };
  }
};

const percentile = (values, ratio) => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil(sorted.length * ratio) - 1)
  );
  return sorted[index];
};

const samples = [];
for (let i = 0; i < REQUEST_COUNT; i += 1) {
  samples.push(await readHealthSample());
}

const successCount = samples.filter((sample) => sample.ok).length;
const availability = successCount / REQUEST_COUNT;
const latencyValues = samples.map((sample) => sample.latencyMs);
const p95LatencyMs = percentile(latencyValues, 0.95);

const unauthorizedSyncResponse = await fetchWithTimeout(`${API_BASE_URL}/v1/sync`, {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: "{}"
});

const unauthorizedProtectionOk = unauthorizedSyncResponse.status === 401;

console.log(
  JSON.stringify(
    {
      requestCount: REQUEST_COUNT,
      successCount,
      availability,
      p95LatencyMs,
      unauthorizedStatus: unauthorizedSyncResponse.status,
      samples
    },
    null,
    2
  )
);

if (availability < MIN_AVAILABILITY) {
  throw new Error(
    `[slo] availability ${availability.toFixed(4)} is below threshold ${MIN_AVAILABILITY.toFixed(4)}`
  );
}

if (p95LatencyMs > MAX_P95_MS) {
  throw new Error(
    `[slo] p95 latency ${p95LatencyMs.toFixed(2)}ms is above threshold ${MAX_P95_MS.toFixed(2)}ms`
  );
}

if (!unauthorizedProtectionOk) {
  throw new Error(
    `[slo] unauthorized protection failed: expected 401, got ${unauthorizedSyncResponse.status}`
  );
}

console.log("[slo] PASS");
