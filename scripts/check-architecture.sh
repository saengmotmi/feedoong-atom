#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FAILED=0

assert_no_match() {
  local pattern="$1"
  local target_path="$2"
  local message="$3"
  local output_file
  output_file="$(mktemp)"

  if rg -n --glob "*.ts" --glob "*.tsx" "${pattern}" "${target_path}" >"${output_file}"; then
    echo "[FAIL] ${message}"
    cat "${output_file}"
    FAILED=1
  else
    echo "[OK] ${message}"
  fi

  rm -f "${output_file}"
}

assert_no_match \
  "process\\.env|globalThis" \
  "${ROOT_DIR}/backend/packages/rss-parser/src" \
  "rss-parser는 전역 상태 대신 런타임 주입 config를 사용해야 함"

assert_no_match \
  "process\\.env|globalThis|from \\\"hono|from 'hono|node:" \
  "${ROOT_DIR}/backend/packages/sync-core/src" \
  "sync-core는 런타임 비종속 순수 도메인 모듈이어야 함"

if [[ "${FAILED}" -ne 0 ]]; then
  echo "Architecture checks failed."
  exit 1
fi

echo "Architecture checks passed."
