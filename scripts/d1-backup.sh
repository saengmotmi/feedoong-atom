#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

D1_DATABASE_NAME="${D1_DATABASE_NAME:-}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups/d1}"

if [[ -z "$D1_DATABASE_NAME" ]]; then
  echo "[d1-backup] D1_DATABASE_NAME is required"
  exit 1
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  echo "[d1-backup] CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUTPUT_PATH="$BACKUP_DIR/d1-${D1_DATABASE_NAME}-${TIMESTAMP}.sql"

(
  cd "$ROOT_DIR/apps/api-worker"
  corepack yarn wrangler d1 export "$D1_DATABASE_NAME" \
    --remote \
    --config wrangler.jsonc \
    --output "$OUTPUT_PATH"
)

echo "[d1-backup] exported: $OUTPUT_PATH"
