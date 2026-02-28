#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-}"
API_WRITE_KEY="${API_WRITE_KEY:-}"
SCHEDULER_KEY="${SCHEDULER_KEY:-}"

if [[ -z "$API_BASE_URL" ]]; then
  echo "[smoke-remote] API_BASE_URL is required"
  exit 1
fi

if [[ -z "$API_WRITE_KEY" ]]; then
  echo "[smoke-remote] API_WRITE_KEY is required"
  exit 1
fi

if [[ -z "$SCHEDULER_KEY" ]]; then
  echo "[smoke-remote] SCHEDULER_KEY is required"
  exit 1
fi

health_status="$(
  curl -s -o /tmp/feedoong-remote-health.txt -w '%{http_code}' \
    "$API_BASE_URL/health"
)"
if [[ "$health_status" != "200" ]]; then
  echo "[smoke-remote] /health expected 200, got $health_status"
  cat /tmp/feedoong-remote-health.txt || true
  exit 1
fi

if ! grep -q '"ok":true' /tmp/feedoong-remote-health.txt; then
  echo "[smoke-remote] /health payload missing ok=true"
  cat /tmp/feedoong-remote-health.txt || true
  exit 1
fi

unauthorized_status="$(
  curl -s -o /tmp/feedoong-remote-unauthorized-sync.txt -w '%{http_code}' \
    -X POST "$API_BASE_URL/v1/sync" \
    -H 'content-type: application/json' \
    -d '{}'
)"
if [[ "$unauthorized_status" != "401" ]]; then
  echo "[smoke-remote] /v1/sync without key expected 401, got $unauthorized_status"
  cat /tmp/feedoong-remote-unauthorized-sync.txt || true
  exit 1
fi

authorized_status="$(
  curl -s -o /tmp/feedoong-remote-authorized-sync.txt -w '%{http_code}' \
    -X POST "$API_BASE_URL/v1/sync" \
    -H 'content-type: application/json' \
    -H "x-api-key: $API_WRITE_KEY" \
    -d '{}'
)"
if [[ "$authorized_status" != "200" ]]; then
  echo "[smoke-remote] /v1/sync with key expected 200, got $authorized_status"
  cat /tmp/feedoong-remote-authorized-sync.txt || true
  exit 1
fi

internal_status="$(
  curl -s -o /tmp/feedoong-remote-internal-sync.txt -w '%{http_code}' \
    -X POST "$API_BASE_URL/internal/sync" \
    -H 'content-type: application/json' \
    -H "x-scheduler-key: $SCHEDULER_KEY" \
    -d '{}'
)"
if [[ "$internal_status" != "200" ]]; then
  echo "[smoke-remote] /internal/sync with scheduler key expected 200, got $internal_status"
  cat /tmp/feedoong-remote-internal-sync.txt || true
  exit 1
fi

echo "[smoke-remote] PASS"
