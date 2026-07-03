#!/bin/sh
set -e
cd /app

log() { echo "[frontend] $*"; }

STAMP_FILE="node_modules/.deps_sha256"

hash_deps() {
  sha256sum package.json package-lock.json 2>/dev/null | sha256sum | awk '{print $1}'
}

LOCK_DIR="/tmp/frontend-npm-ci.lockdir"

run_npm_ci() {
  if ! mkdir "$LOCK_DIR" 2>/dev/null; then
    log "npm ci already running — skipped"
    return 1
  fi

  trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT INT TERM
  npm ci
  local status=$?
  rmdir "$LOCK_DIR" 2>/dev/null || true
  trap - EXIT INT TERM
  return $status
}

install_deps_if_needed() {
  CURRENT_HASH=$(hash_deps)
  STORED_HASH=""
  if [ -f "$STAMP_FILE" ]; then
    STORED_HASH=$(cat "$STAMP_FILE" 2>/dev/null || true)
  fi

  if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ] || [ "$CURRENT_HASH" != "$STORED_HASH" ]; then
    log "npm dependencies outdated — running npm ci..."
    if run_npm_ci; then
      echo "$CURRENT_HASH" > "$STAMP_FILE"
    fi
  fi
}

watch_deps() {
  LAST_HASH=$(hash_deps)
  while true; do
    sleep 10
    NEW_HASH=$(hash_deps)
    if [ -n "$NEW_HASH" ] && [ "$NEW_HASH" != "$LAST_HASH" ]; then
      log "package.json / package-lock.json changed — running npm ci..."
      if run_npm_ci; then
        echo "$NEW_HASH" > "$STAMP_FILE"
        LAST_HASH="$NEW_HASH"
        log "dependencies synced — Vite may hot-reload automatically"
      else
        log "npm ci skipped or failed — fix package-lock.json on host and save again"
      fi
    fi
  done
}

install_deps_if_needed
watch_deps &
WATCHER_PID=$!
trap 'kill "$WATCHER_PID" 2>/dev/null || true' EXIT INT TERM

exec npm run dev -- --host 0.0.0.0 --port 5173
