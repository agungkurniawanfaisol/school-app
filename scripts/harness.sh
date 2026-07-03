#!/usr/bin/env bash
# Project harness — verify agent docs, rules, and optionally run tests.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RUN_TESTS=false
SKIP_DOCKER_CHECK=false

for arg in "$@"; do
  case "$arg" in
    --test) RUN_TESTS=true ;;
    --no-docker) SKIP_DOCKER_CHECK=true ;;
    -h|--help)
      echo "Usage: $0 [--test] [--no-docker]"
      echo "  --test       Run make test after checks"
      echo "  --no-docker  Skip Docker service checks"
      exit 0
      ;;
  esac
done

log() { printf '[harness] %s\n' "$*"; }
fail() { log "FAIL: $*"; exit 1; }

log "Nurul Hikmah — project harness"
log "Root: $ROOT"
echo

# --- Agent / docs ---
REQUIRED_FILES=(
  AGENTS.md
  HARNESS.md
  skills.md
  memory.md
  Makefile
  docker-compose.yml
  .cursor/rules/core-stack.mdc
  .cursor/rules/tests-required.mdc
  backend/tests/TestCase.php
  frontend/package.json
)

log "Checking agent docs & key paths..."
for f in "${REQUIRED_FILES[@]}"; do
  [[ -f "$f" ]] || fail "Missing: $f"
done
log "  ${#REQUIRED_FILES[@]} required files present"

RULE_COUNT=$(find .cursor/rules -name '*.mdc' 2>/dev/null | wc -l)
log "  Cursor rules: $RULE_COUNT .mdc files"

if [[ -d .agents/skills ]]; then
  SKILL_COUNT=$(find .agents/skills -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
  log "  External skills: $SKILL_COUNT installed"
else
  log "  External skills: not installed (run commands in skills.md)"
fi

echo

# --- Docker (optional) ---
if [[ "$SKIP_DOCKER_CHECK" == false ]] && command -v docker >/dev/null 2>&1; then
  log "Checking Docker Compose services..."
  if docker compose ps --status running 2>/dev/null | grep -qE 'backend|mysql'; then
    docker compose ps --status running 2>/dev/null | tail -n +2 | while read -r line; do
      log "  $line"
    done
  else
    log "  No backend/mysql running — start with: make dev"
  fi
  echo
fi

# --- Tests (optional) ---
if [[ "$RUN_TESTS" == true ]]; then
  log "Running test suite..."
  if docker compose ps --status running 2>/dev/null | grep -q backend; then
    make test
  else
    log "Docker backend not running — running frontend tests only"
    (cd frontend && npm test)
  fi
  echo
fi

log "Harness OK"
log "Next: read HARNESS.md → AGENTS.md → memory.md"
