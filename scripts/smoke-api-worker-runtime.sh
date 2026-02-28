#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

WORKER_DIR="$ROOT_DIR/apps/api-worker"
WORKER_PORT="${WORKER_PORT:-8797}"
WORKER_BASE_URL="${WORKER_BASE_URL:-http://127.0.0.1:$WORKER_PORT}"
WORKER_CONFIG_FILE="${WORKER_CONFIG_FILE:-wrangler.jsonc}"
WORKER_DB_NAME="${WORKER_DB_NAME:-feedoong-atom-db}"
API_WRITE_KEY="${API_WRITE_KEY:-REPLACE_WITH_API_WRITE_KEY}"
SCHEDULER_KEY="${SCHEDULER_KEY:-REPLACE_WITH_SCHEDULER_KEY}"

TMP_DIR="$(mktemp -d)"
WORKER_LOG="$TMP_DIR/api-worker.log"

cleanup() {
  local exit_code=$?
  if [[ -n "${WORKER_PID:-}" ]]; then
    kill "$WORKER_PID" >/dev/null 2>&1 || true
    wait "$WORKER_PID" >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP_DIR"
  exit "$exit_code"
}

wait_for_url() {
  local url="$1"
  local retries="${2:-80}"
  local sleep_seconds="${3:-0.5}"

  for ((i = 1; i <= retries; i++)); do
    if curl -sf "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$sleep_seconds"
  done

  return 1
}

trap cleanup EXIT INT TERM

(
  cd "$WORKER_DIR"
  corepack yarn wrangler d1 migrations apply "$WORKER_DB_NAME" --local --config "$WORKER_CONFIG_FILE"
) >/dev/null

(
  cd "$WORKER_DIR"
  corepack yarn wrangler dev --config "$WORKER_CONFIG_FILE" --port "$WORKER_PORT"
) >"$WORKER_LOG" 2>&1 &
WORKER_PID=$!

wait_for_url "$WORKER_BASE_URL/health" || {
  echo "[smoke-worker] worker did not become ready"
  tail -n 80 "$WORKER_LOG" || true
  exit 1
}

HEALTH_BODY="$(curl -sf "$WORKER_BASE_URL/health")"
if ! grep -q '"ok":true' <<<"$HEALTH_BODY"; then
  echo "[smoke-worker] invalid health body: $HEALTH_BODY"
  exit 1
fi

UNAUTHORIZED_SYNC_STATUS="$(
  curl -s -o /tmp/feedoong-worker-unauthorized-sync.txt -w '%{http_code}' \
    -X POST "$WORKER_BASE_URL/v1/sync" \
    -H 'content-type: application/json' \
    -d '{}'
)"
if [[ "$UNAUTHORIZED_SYNC_STATUS" != "401" ]]; then
  echo "[smoke-worker] expected /v1/sync without key => 401, got $UNAUTHORIZED_SYNC_STATUS"
  cat /tmp/feedoong-worker-unauthorized-sync.txt || true
  exit 1
fi

AUTHORIZED_SYNC_STATUS="$(
  curl -s -o /tmp/feedoong-worker-authorized-sync.txt -w '%{http_code}' \
    -X POST "$WORKER_BASE_URL/v1/sync" \
    -H 'content-type: application/json' \
    -H "x-api-key: $API_WRITE_KEY" \
    -d '{}'
)"
if [[ "$AUTHORIZED_SYNC_STATUS" != "200" ]]; then
  echo "[smoke-worker] expected /v1/sync with key => 200, got $AUTHORIZED_SYNC_STATUS"
  cat /tmp/feedoong-worker-authorized-sync.txt || true
  tail -n 80 "$WORKER_LOG" || true
  exit 1
fi

UNAUTHORIZED_INTERNAL_STATUS="$(
  curl -s -o /tmp/feedoong-worker-unauthorized-internal.txt -w '%{http_code}' \
    -X POST "$WORKER_BASE_URL/internal/sync" \
    -H 'content-type: application/json' \
    -H 'x-scheduler-key: wrong-key' \
    -d '{}'
)"
if [[ "$UNAUTHORIZED_INTERNAL_STATUS" != "401" ]]; then
  echo "[smoke-worker] expected /internal/sync wrong key => 401, got $UNAUTHORIZED_INTERNAL_STATUS"
  cat /tmp/feedoong-worker-unauthorized-internal.txt || true
  exit 1
fi

AUTHORIZED_INTERNAL_STATUS="$(
  curl -s -o /tmp/feedoong-worker-authorized-internal.txt -w '%{http_code}' \
    -X POST "$WORKER_BASE_URL/internal/sync" \
    -H 'content-type: application/json' \
    -H "x-scheduler-key: $SCHEDULER_KEY" \
    -d '{}'
)"
if [[ "$AUTHORIZED_INTERNAL_STATUS" != "200" ]]; then
  echo "[smoke-worker] expected /internal/sync with key => 200, got $AUTHORIZED_INTERNAL_STATUS"
  cat /tmp/feedoong-worker-authorized-internal.txt || true
  tail -n 80 "$WORKER_LOG" || true
  exit 1
fi

echo "[smoke-worker] PASS"
