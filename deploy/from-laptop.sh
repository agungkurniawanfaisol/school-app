#!/usr/bin/env bash
# Deploy to Hostinger from your laptop when GitHub Actions cannot reach SSH
# (Connection timed out from GHA runners).
#
# Usage:
#   export DEPLOY_HOST=103.x.x.x          # IP from hPanel → SSH Access
#   export DEPLOY_USER=u123456789
#   export DEPLOY_PATH=/home/u…/domains/nurulhikmahsda.sch.id/public_html
#   export DEPLOY_PORT=65002              # optional
#   export DEPLOY_SSH_KEY=~/.ssh/hostinger_deploy   # optional private key path
#   bash deploy/from-laptop.sh
#
# Requires: ssh, rsync, node/npm, php/composer (or use --skip-build with prebuilt dirs)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${DEPLOY_PORT:-65002}"
HOST="$(echo -n "${DEPLOY_HOST:-}" | tr -d '[:space:]')"
HOST="${HOST#ssh://}"
HOST="${HOST##*@}"
HOST="${HOST%%/*}"
HOST="${HOST%%:*}"
USER_NAME="${DEPLOY_USER:-}"
REMOTE_PATH="${DEPLOY_PATH:-}"
KEY_FILE="${DEPLOY_SSH_KEY:-}"
SKIP_BUILD="${SKIP_BUILD:-0}"

die() { echo "ERROR: $*" >&2; exit 1; }

[ -n "$HOST" ] || die "Set DEPLOY_HOST (SSH IP from hPanel, not the marketing domain alone)"
[ -n "$USER_NAME" ] || die "Set DEPLOY_USER"
[ -n "$REMOTE_PATH" ] || die "Set DEPLOY_PATH (…/public_html)"

if [ "${#HOST}" -lt 7 ]; then
  die "DEPLOY_HOST looks too short (${#HOST} chars). Use the IP from hPanel → SSH Access."
fi
if [ "$HOST" = "hostinger.com" ] || [ "$HOST" = "www.hostinger.com" ]; then
  die "DEPLOY_HOST must be your server IP/hostname from hPanel, not hostinger.com"
fi

SSH_OPTS=(-p "$PORT" -o ConnectTimeout=20 -o StrictHostKeyChecking=accept-new)
if [ -n "$KEY_FILE" ]; then
  [ -f "$KEY_FILE" ] || die "DEPLOY_SSH_KEY file not found: $KEY_FILE"
  SSH_OPTS+=(-i "$KEY_FILE" -o IdentitiesOnly=yes)
fi

echo "==> Preflight SSH ${USER_NAME}@${HOST}:${PORT}"
ssh "${SSH_OPTS[@]}" "${USER_NAME}@${HOST}" "echo ok && test -d '${REMOTE_PATH}' && echo path-ok" \
  || die "SSH failed. Enable SSH in hPanel and verify host/user/port/key."

if [ "$SKIP_BUILD" != "1" ]; then
  echo "==> Build frontend"
  (cd frontend && npm ci && VITE_API_URL=/api VITE_SCHOOL_SLUG=nurul-hikmah npm run build)

  echo "==> Build backend (composer)"
  (cd backend && composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader)
fi

echo "==> Stage frontend"
rm -rf /tmp/nh-frontend-deploy
mkdir -p /tmp/nh-frontend-deploy
cp -a frontend/dist/. /tmp/nh-frontend-deploy/
cp deploy/public_html.htaccess /tmp/nh-frontend-deploy/.htaccess

echo "==> Stage backend"
rm -rf /tmp/nh-backend-deploy
mkdir -p /tmp/nh-backend-deploy
rsync -a \
  --exclude='storage/' \
  --exclude='.env' \
  --exclude='.env.*' \
  --exclude='tests/' \
  --exclude='.phpunit.result.cache' \
  --exclude='.phpunit.cache' \
  backend/ /tmp/nh-backend-deploy/
cp deploy/backend.htaccess /tmp/nh-backend-deploy/.htaccess
cp deploy/post-deploy.sh /tmp/nh-backend-deploy/post-deploy.sh
chmod +x /tmp/nh-backend-deploy/post-deploy.sh
mkdir -p \
  /tmp/nh-backend-deploy/storage/app/public \
  /tmp/nh-backend-deploy/storage/framework/{cache,sessions,views} \
  /tmp/nh-backend-deploy/storage/logs

SSH_E="ssh ${SSH_OPTS[*]}"

echo "==> Rsync frontend → ${REMOTE_PATH}/"
rsync -az --delete --exclude='backend/' \
  -e "$SSH_E" \
  /tmp/nh-frontend-deploy/ \
  "${USER_NAME}@${HOST}:${REMOTE_PATH}/"

echo "==> Rsync backend → ${REMOTE_PATH}/backend/"
rsync -az --delete \
  --filter='P storage/' \
  --filter='P storage/***' \
  --filter='P .env' \
  --exclude='storage/' \
  --exclude='.env' \
  --exclude='.env.*' \
  -e "$SSH_E" \
  /tmp/nh-backend-deploy/ \
  "${USER_NAME}@${HOST}:${REMOTE_PATH}/backend/"

echo "==> Post-deploy on server"
PHP_BIN="${DEPLOY_PHP:-php}"
ssh "${SSH_OPTS[@]}" "${USER_NAME}@${HOST}" \
  "cd '${REMOTE_PATH}/backend' && DEPLOY_PHP='${PHP_BIN}' bash ./post-deploy.sh"

echo "==> Done."
