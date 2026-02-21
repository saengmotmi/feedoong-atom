#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NODE_VERSION="${NODE_VERSION:-$(cat .node-version)}"
FNM_PREFIX=(fnm exec --using "$NODE_VERSION" -- corepack yarn)
TMP_DIR="$(mktemp -d)"
API_LOG="$TMP_DIR/api.log"
WEB_LOG="$TMP_DIR/web.log"

cleanup() {
  local exit_code=$?
  if [[ -n "${API_PID:-}" ]]; then
    kill "$API_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "${WEB_PID:-}" ]]; then
    kill "$WEB_PID" >/dev/null 2>&1 || true
  fi
  wait >/dev/null 2>&1 || true
  rm -rf "$TMP_DIR"
  exit "$exit_code"
}

wait_for_url() {
  local url="$1"
  local retries="${2:-60}"
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

("${FNM_PREFIX[@]}" dev:api >"$API_LOG" 2>&1) &
API_PID=$!

("${FNM_PREFIX[@]}" dev:web >"$WEB_LOG" 2>&1) &
WEB_PID=$!

wait_for_url "http://localhost:4000/health" || {
  echo "[smoke] API did not become ready"
  tail -n 40 "$API_LOG" || true
  exit 1
}

wait_for_url "http://localhost:5173/" || {
  echo "[smoke] Web did not become ready"
  tail -n 40 "$WEB_LOG" || true
  exit 1
}

API_HEALTH="$(curl -sf http://localhost:4000/health)"
WEB_HTML="$(curl -sf http://localhost:5173/)"

if ! grep -q '"ok":true' <<<"$API_HEALTH"; then
  echo "[smoke] API health payload is unexpected: $API_HEALTH"
  exit 1
fi

if grep -Eq 'fetch failed|Network connection lost' <<<"$WEB_HTML"; then
  echo "[smoke] Web rendered an API error state"
  exit 1
fi

if ! grep -q 'Feedoong Atom' <<<"$WEB_HTML"; then
  echo "[smoke] Web page marker was not found"
  exit 1
fi

echo "[smoke] PASS"
echo "[smoke] API: $API_HEALTH"
echo "[smoke] Web: http://localhost:5173/ returned non-error state"
