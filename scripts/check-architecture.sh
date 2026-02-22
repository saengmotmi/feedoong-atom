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

assert_has_match() {
  local pattern="$1"
  local target_path="$2"
  local message="$3"
  local output_file
  output_file="$(mktemp)"

  if rg -n --glob "*.ts" --glob "*.tsx" "${pattern}" "${target_path}" >"${output_file}"; then
    echo "[OK] ${message}"
  else
    echo "[FAIL] ${message}"
    FAILED=1
  fi

  rm -f "${output_file}"
}

assert_max_lines() {
  local file_path="$1"
  local max_lines="$2"
  local message="$3"
  local line_count
  line_count="$(wc -l < "${file_path}")"

  if [[ "${line_count}" -le "${max_lines}" ]]; then
    echo "[OK] ${message} (${line_count}/${max_lines})"
  else
    echo "[FAIL] ${message} (${line_count}/${max_lines})"
    FAILED=1
  fi
}

assert_no_match \
  "process\\.env|globalThis" \
  "${ROOT_DIR}/backend/packages/rss-parser/src" \
  "rss-parser는 전역 상태 대신 런타임 주입 config를 사용해야 함"

assert_no_match \
  "process\\.env|globalThis|from \\\"hono|from 'hono|node:" \
  "${ROOT_DIR}/backend/packages/sync-core/src" \
  "sync-core는 런타임 비종속 순수 도메인 모듈이어야 함"

assert_no_match \
  "switch\\s*\\(" \
  "${ROOT_DIR}/backend/packages/sync-core/src" \
  "sync-core는 switch 대신 룰 매칭(ts-pattern) 우선"

assert_has_match \
  "from \\\"remeda\\\"|from 'remeda'" \
  "${ROOT_DIR}/backend/packages/sync-core/src" \
  "sync-core는 일반 연산 조합(remeda)을 사용해야 함"

assert_has_match \
  "from \\\"ts-pattern\\\"|from 'ts-pattern'" \
  "${ROOT_DIR}/backend/packages/sync-core/src" \
  "sync-core는 선언형 분기(ts-pattern)를 사용해야 함"

assert_has_match \
  "from \\\"neverthrow\\\"|from 'neverthrow'" \
  "${ROOT_DIR}/backend/packages/sync-core/src" \
  "sync-core는 Result 조합(neverthrow)을 사용해야 함"

assert_has_match \
  "from \\\"neverthrow\\\"|from 'neverthrow'" \
  "${ROOT_DIR}/backend/packages/rss-parser/src" \
  "rss-parser는 Result 조합(neverthrow)을 사용해야 함"

assert_max_lines \
  "${ROOT_DIR}/apps/api-worker/src/index.ts" \
  220 \
  "api-worker 엔트리 파일은 220라인 이하여야 함"

assert_max_lines \
  "${ROOT_DIR}/apps/web/app/routes/home.tsx" \
  220 \
  "web home 엔트리 파일은 220라인 이하여야 함"

assert_max_lines \
  "${ROOT_DIR}/backend/packages/sync-core/src/index.ts" \
  220 \
  "sync-core 엔트리 파일은 220라인 이하여야 함"

if [[ "${FAILED}" -ne 0 ]]; then
  echo "Architecture checks failed."
  exit 1
fi

echo "Architecture checks passed."
