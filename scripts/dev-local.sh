#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NODE_VERSION="${NODE_VERSION:-$(cat .node-version)}"
FNM_PREFIX=(fnm exec --using "$NODE_VERSION" -- corepack yarn)

cleanup() {
  local exit_code=$?
  if [[ -n "${API_PID:-}" ]]; then
    kill "$API_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "${WEB_PID:-}" ]]; then
    kill "$WEB_PID" >/dev/null 2>&1 || true
  fi
  wait >/dev/null 2>&1 || true
  exit "$exit_code"
}

trap cleanup EXIT INT TERM

("${FNM_PREFIX[@]}" dev:api) &
API_PID=$!

("${FNM_PREFIX[@]}" dev:web) &
WEB_PID=$!

while true; do
  if ! kill -0 "$API_PID" >/dev/null 2>&1; then
    wait "$API_PID"
    exit $?
  fi

  if ! kill -0 "$WEB_PID" >/dev/null 2>&1; then
    wait "$WEB_PID"
    exit $?
  fi

  sleep 1
done
