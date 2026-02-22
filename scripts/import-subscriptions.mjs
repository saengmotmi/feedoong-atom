#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_CSV_PATH = path.join(
  process.env.HOME ?? "",
  "Downloads",
  "feedoong_subscriptions_ohjtack@gmail.com.csv"
);

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";
const MAX_CONCURRENCY = Number(process.env.IMPORT_CONCURRENCY ?? "4");
const REQUEST_TIMEOUT_MS = Number(process.env.IMPORT_REQUEST_TIMEOUT_MS ?? "12000");
const RETRY_ATTEMPTS = Number(process.env.IMPORT_RETRY_ATTEMPTS ?? "2");
const RETRY_CONCURRENCY = Number(process.env.IMPORT_RETRY_CONCURRENCY ?? "1");
const RETRY_DELAY_MS = Number(process.env.IMPORT_RETRY_DELAY_MS ?? "1500");
const RETRY_MAX_DELAY_MS = Number(process.env.IMPORT_RETRY_MAX_DELAY_MS ?? "8000");

const csvPathArg = process.argv[2];
const csvPath = path.resolve(csvPathArg ?? DEFAULT_CSV_PATH);

const printUsage = () => {
  console.log("Usage: node scripts/import-subscriptions.mjs [csv-path]");
  console.log(`Default csv-path: ${DEFAULT_CSV_PATH}`);
  console.log(`API base URL: ${API_BASE_URL}`);
};

const parseCsv = (content) => {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(value);
      value = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(value);
      const isOnlyEmpty =
        row.length === 1 && row[0].trim().length === 0;
      if (!isOnlyEmpty) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
};

const normalizeHeader = (value) =>
  value.replace(/^\uFEFF/, "").trim().replace(/\s+/g, " ");

const extractFirstUrl = (value) => {
  const text = value.trim();
  if (text.length === 0) {
    return null;
  }

  const match = text.match(/https?:\/\/[^\s",]+/i);
  if (!match) {
    return null;
  }

  const candidate = match[0].replace(/[),.;]+$/, "");

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch (_error) {
    return null;
  }
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });

const parseHttpStatus = (reason) => {
  const match = reason.match(/^HTTP\s+(\d{3})\b/);
  return match ? Number(match[1]) : null;
};

const isRetryableFailure = (reason) => {
  if (!reason || reason.length === 0) {
    return false;
  }

  if (reason.startsWith("NETWORK ")) {
    return true;
  }

  const status = parseHttpStatus(reason);
  if (status === 408 || status === 425 || status === 429) {
    return true;
  }
  if (status && status >= 500 && status <= 599) {
    return true;
  }

  if (
    reason.includes("Worker exceeded resource limits") ||
    reason.includes("Error 1102")
  ) {
    return true;
  }

  return false;
};

const discoverFeedUrl = async (blogUrl) => {
  try {
    const response = await fetch(blogUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const regex =
      /<link[^>]*type=["']application\/(?:rss|atom)\+xml["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    const hrefMatch = regex.exec(html);

    if (!hrefMatch || !hrefMatch[1]) {
      return null;
    }

    const feedUrl = new URL(hrefMatch[1], response.url).toString();
    if (!/^https?:\/\//i.test(feedUrl)) {
      return null;
    }

    return feedUrl;
  } catch (_error) {
    return null;
  }
};

const pickHeaderIndexes = (headers) => {
  const normalized = headers.map(normalizeHeader);
  const numberIndex = normalized.findIndex((value) => value === "번호");
  const channelIndex = normalized.findIndex((value) => value === "채널명");
  const blogUrlIndex = normalized.findIndex((value) => value.includes("블로그 URL"));
  const rssUrlIndex = normalized.findIndex((value) => value.includes("RSS 피드 URL"));

  return {
    numberIndex,
    channelIndex,
    blogUrlIndex,
    rssUrlIndex
  };
};

const toCandidates = (rows) => {
  if (rows.length === 0) {
    return {
      candidates: [],
      stats: {
        totalRows: 0,
        skippedNoRss: 0,
        skippedDuplicateInCsv: 0
      }
    };
  }

  const [headerRow, ...bodyRows] = rows;
  const indexes = pickHeaderIndexes(headerRow);

  if (indexes.rssUrlIndex === -1) {
    throw new Error("CSV 헤더에서 `RSS 피드 URL` 컬럼을 찾을 수 없습니다.");
  }

  const seen = new Set();
  const candidates = [];
  let skippedNoRss = 0;
  let skippedDuplicateInCsv = 0;

  for (const row of bodyRows) {
    const number = indexes.numberIndex >= 0 ? row[indexes.numberIndex]?.trim() ?? "" : "";
    const channel = indexes.channelIndex >= 0 ? row[indexes.channelIndex]?.trim() ?? "" : "";
    const blogUrl = indexes.blogUrlIndex >= 0 ? extractFirstUrl(row[indexes.blogUrlIndex] ?? "") : null;
    const rssUrl = extractFirstUrl(row[indexes.rssUrlIndex] ?? "");

    if (!rssUrl) {
      skippedNoRss += 1;
      continue;
    }

    if (seen.has(rssUrl)) {
      skippedDuplicateInCsv += 1;
      continue;
    }
    seen.add(rssUrl);

    candidates.push({
      number,
      channel,
      blogUrl,
      rssUrl
    });
  }

  return {
    candidates,
    stats: {
      totalRows: bodyRows.length,
      skippedNoRss,
      skippedDuplicateInCsv
    }
  };
};

const postSource = async (rssUrl) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/sources`, {
      method: "POST",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ url: rssUrl })
    });

    if (response.status === 201) {
      return { status: "added" };
    }

    if (response.status === 409) {
      return { status: "duplicate" };
    }

    const text = await response.text();
    return {
      status: "failed",
      reason: `HTTP ${response.status} ${text}`.trim()
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: "failed",
      reason: `NETWORK ${message}`
    };
  }
};

const runWithConcurrency = async (items, worker, concurrency) => {
  const queue = [...items];
  const results = [];

  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) {
        continue;
      }
      const result = await worker(item);
      results.push(result);
    }
  });

  await Promise.all(workers);
  return results;
};

const importCandidate = async (candidate) => {
  const primary = await postSource(candidate.rssUrl);
  if (primary.status !== "failed") {
    return {
      ...candidate,
      ...primary,
      importedUrl: candidate.rssUrl,
      usedFallback: false
    };
  }

  if (!candidate.blogUrl || candidate.blogUrl === candidate.rssUrl) {
    return {
      ...candidate,
      ...primary,
      importedUrl: candidate.rssUrl,
      usedFallback: false
    };
  }

  const discoveredFeedUrl = await discoverFeedUrl(candidate.blogUrl);
  if (!discoveredFeedUrl || discoveredFeedUrl === candidate.rssUrl) {
    return {
      ...candidate,
      ...primary,
      importedUrl: candidate.rssUrl,
      usedFallback: false
    };
  }

  const fallback = await postSource(discoveredFeedUrl);
  if (fallback.status === "added" || fallback.status === "duplicate") {
    return {
      ...candidate,
      ...fallback,
      importedUrl: discoveredFeedUrl,
      usedFallback: true
    };
  }

  return {
    ...candidate,
    ...primary,
    importedUrl: candidate.rssUrl,
    usedFallback: false
  };
};

const retryFailedCandidates = async (failedResults) => {
  const maxAttempts = Math.max(0, RETRY_ATTEMPTS);
  const retryableSeed = failedResults.filter((entry) =>
    isRetryableFailure(entry.reason)
  );

  if (maxAttempts === 0 || retryableSeed.length === 0) {
    return {
      retriedCount: 0,
      retryableCount: retryableSeed.length,
      recoveredCount: 0,
      finalResults: []
    };
  }

  const retryableUrls = new Set(retryableSeed.map((entry) => entry.rssUrl));
  const latestByUrl = new Map();
  let queue = [...retryableSeed];
  let retriedCount = 0;

  for (let attempt = 1; attempt <= maxAttempts && queue.length > 0; attempt += 1) {
    console.log(
      `[retry] attempt ${attempt}/${maxAttempts} pending: ${queue.length}`
    );

    const delayMs = Math.min(RETRY_MAX_DELAY_MS, RETRY_DELAY_MS * 2 ** (attempt - 1));
    const current = queue;
    queue = [];

    const retried = await runWithConcurrency(
      current,
      async (entry) => {
        const jitter = Math.floor(Math.random() * 250);
        await sleep(delayMs + jitter);
        return importCandidate(entry);
      },
      RETRY_CONCURRENCY
    );

    retriedCount += retried.length;

    let succeeded = 0;
    for (const entry of retried) {
      latestByUrl.set(entry.rssUrl, entry);
      if (entry.status === "failed") {
        if (isRetryableFailure(entry.reason) && attempt < maxAttempts) {
          queue.push(entry);
        }
      } else {
        succeeded += 1;
      }
    }

    console.log(
      `[retry] attempt ${attempt} succeeded: ${succeeded}, failed: ${retried.length - succeeded}`
    );
  }

  const finalResults = Array.from(latestByUrl.values());
  const recoveredCount = finalResults.filter((entry) => entry.status !== "failed").length;

  return {
    retriedCount,
    retryableCount: retryableUrls.size,
    recoveredCount,
    finalResults
  };
};

const ensureApiReady = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(Math.min(5000, REQUEST_TIMEOUT_MS))
    });
    return response.ok;
  } catch (_error) {
    return false;
  }
};

const main = async () => {
  if (!fs.existsSync(csvPath)) {
    console.error(`[import] CSV 파일을 찾을 수 없습니다: ${csvPath}`);
    printUsage();
    process.exit(1);
  }

  const ready = await ensureApiReady();
  if (!ready) {
    console.error(`[import] API가 준비되지 않았습니다: ${API_BASE_URL}`);
    console.error("[import] 먼저 `yarn dev:api` 또는 `yarn dev:local`을 실행하세요.");
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(raw);
  const { candidates, stats } = toCandidates(rows);

  const startedAt = Date.now();
  const initialResults = await runWithConcurrency(
    candidates,
    async (candidate) => importCandidate(candidate),
    MAX_CONCURRENCY
  );
  const initialFailed = initialResults.filter((value) => value.status === "failed");
  const retryResult = await retryFailedCandidates(initialFailed);
  const resultByRssUrl = new Map(
    initialResults.map((entry) => [entry.rssUrl, entry])
  );
  retryResult.finalResults.forEach((entry) => {
    resultByRssUrl.set(entry.rssUrl, entry);
  });
  const results = Array.from(resultByRssUrl.values());
  const elapsedMs = Date.now() - startedAt;

  const added = results.filter((value) => value.status === "added");
  const duplicate = results.filter((value) => value.status === "duplicate");
  const failed = results.filter((value) => value.status === "failed");
  const fallbackRecovered = results.filter((value) => value.usedFallback);

  console.log("[import] done");
  console.log(`[import] csv: ${csvPath}`);
  console.log(`[import] total rows: ${stats.totalRows}`);
  console.log(`[import] candidates: ${candidates.length}`);
  console.log(`[import] skipped (no rss): ${stats.skippedNoRss}`);
  console.log(`[import] skipped (duplicate in csv): ${stats.skippedDuplicateInCsv}`);
  console.log(`[import] added: ${added.length}`);
  console.log(`[import] duplicate in db: ${duplicate.length}`);
  console.log(`[import] failed: ${failed.length}`);
  console.log(`[import] recovered by blog fallback: ${fallbackRecovered.length}`);
  console.log(`[import] retryable failed candidates: ${retryResult.retryableCount}`);
  console.log(`[import] retried requests: ${retryResult.retriedCount}`);
  console.log(`[import] recovered by retry: ${retryResult.recoveredCount}`);
  console.log(`[import] elapsed: ${elapsedMs}ms`);

  if (failed.length > 0) {
    console.log("[import] failed samples:");
    failed.slice(0, 15).forEach((entry) => {
      console.log(
        `- #${entry.number || "?"} ${entry.channel || "(채널명 없음)"} :: ${entry.rssUrl} :: ${entry.reason}`
      );
    });
    process.exitCode = 2;
  }
};

main().catch((error) => {
  console.error("[import] unexpected error");
  console.error(error);
  process.exit(1);
});
