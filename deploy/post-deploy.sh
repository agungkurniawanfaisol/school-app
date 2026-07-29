#!/usr/bin/env bash
# Post-deploy on Hostinger: preserve existing data.
# - Backs up MySQL before migrate
# - Runs ONLY `migrate --force` (never migrate:fresh / db:seed / db:wipe)
set -euo pipefail

PHP_BIN="${DEPLOY_PHP:-php}"
KEEP_BACKUPS="${KEEP_DB_BACKUPS:-10}"

if [ ! -f .env ]; then
  echo "WARNING: backend/.env missing — skip artisan. Create .env on server once."
  exit 0
fi

mkdir -p \
  storage/app/public/uploads \
  storage/framework/{cache,sessions,views} \
  storage/logs \
  storage/backups \
  bootstrap/cache

chmod -R ug+rwx storage bootstrap/cache || true
"${PHP_BIN}" artisan storage:link --force || true

if [ ! -w storage/app/public ]; then
  echo "ERROR: storage/app/public is not writable"
  exit 1
fi

echo "==> Data safety: migrate only (NO migrate:fresh / db:seed / db:wipe)"

# Read DB credentials from Laravel config (handles special chars in password)
eval "$("${PHP_BIN}" -r '
require "vendor/autoload.php";
$app = require "bootstrap/app.php";
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$c = config("database.connections.".config("database.default"));
echo "DB_DRIVER=".escapeshellarg((string)($c["driver"] ?? ""))."\n";
echo "DB_HOST=".escapeshellarg((string)($c["host"] ?? "127.0.0.1"))."\n";
echo "DB_PORT=".escapeshellarg((string)($c["port"] ?? "3306"))."\n";
echo "DB_DATABASE=".escapeshellarg((string)($c["database"] ?? ""))."\n";
echo "DB_USERNAME=".escapeshellarg((string)($c["username"] ?? ""))."\n";
echo "DB_PASSWORD=".escapeshellarg((string)($c["password"] ?? ""))."\n";
')"

if [ "${DB_DRIVER}" != "mysql" ]; then
  echo "Skip DB backup: driver is ${DB_DRIVER} (not mysql)"
elif [ -z "${DB_DATABASE}" ] || [ -z "${DB_USERNAME}" ]; then
  echo "ERROR: DB_DATABASE / DB_USERNAME empty in .env — abort migrate"
  exit 1
elif ! command -v mysqldump >/dev/null 2>&1; then
  echo "WARNING: mysqldump not found — continue without backup (use hPanel backup)"
else
  BACKUP_FILE="storage/backups/pre-migrate-$(date +%Y%m%d_%H%M%S).sql.gz"
  echo "==> Backing up MySQL to ${BACKUP_FILE}"
  if MYSQL_PWD="${DB_PASSWORD}" mysqldump \
      --single-transaction --quick --routines --triggers \
      -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USERNAME}" \
      "${DB_DATABASE}" | gzip -c > "${BACKUP_FILE}"
  then
    if [ ! -s "${BACKUP_FILE}" ]; then
      rm -f "${BACKUP_FILE}"
      echo "WARNING: backup empty — continue migrate"
    else
      echo "DB backup OK: ${BACKUP_FILE} ($(wc -c < "${BACKUP_FILE}") bytes)"
      # Keep newest N backups only
      ls -1t storage/backups/pre-migrate-*.sql.gz 2>/dev/null \
        | tail -n +"$((KEEP_BACKUPS + 1))" \
        | xargs -r rm -f || true
    fi
  else
    rm -f "${BACKUP_FILE}"
    echo "WARNING: mysqldump failed — continue migrate (consider hPanel backup)"
  fi
fi

# Schema update only — additive migrations; does NOT delete rows
"${PHP_BIN}" artisan migrate --force --no-interaction
"${PHP_BIN}" artisan config:cache
"${PHP_BIN}" artisan route:cache
"${PHP_BIN}" artisan view:cache

echo "==> Post-deploy complete (existing rows preserved)"
