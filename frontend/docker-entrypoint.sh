#!/bin/sh
set -e
cd /app

log() { echo "[frontend] $*"; }

STAMP_FILE="node_modules/.package_lock_sha256"
CURRENT_HASH=$(sha256sum package-lock.json 2>/dev/null | awk '{print $1}' || echo "")
STORED_HASH=""
if [ -f "$STAMP_FILE" ]; then
  STORED_HASH=$(cat "$STAMP_FILE" 2>/dev/null || true)
fi

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ] || { [ -n "$CURRENT_HASH" ] && [ "$CURRENT_HASH" != "$STORED_HASH" ]; }; then
  log "npm dependencies outdated — running npm ci..."
  npm ci
  if [ -n "$CURRENT_HASH" ]; then
    echo "$CURRENT_HASH" > "$STAMP_FILE"
  fi
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
