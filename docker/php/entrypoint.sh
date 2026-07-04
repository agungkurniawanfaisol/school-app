#!/bin/sh
set -e
cd /var/www/backend

log() { echo "[backend] $*"; }

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    log "No .env — copying .env.example"
    cp .env.example .env
  else
    log "ERROR: .env and .env.example missing" >&2
    exit 1
  fi
fi

sed -i 's/\r$//' .env 2>/dev/null || true

patch_env() {
  var_name="$1"
  eval var_value="\${$var_name:-}"
  if [ -n "$var_value" ]; then
    if grep -q "^${var_name}=" .env; then
      sed -i "s|^${var_name}=.*|${var_name}=${var_value}|" .env
    else
      echo "${var_name}=${var_value}" >> .env
    fi
  fi
}

for v in APP_ENV APP_DEBUG APP_URL DB_CONNECTION DB_HOST DB_PORT DB_DATABASE \
         DB_USERNAME DB_PASSWORD CACHE_STORE SESSION_DRIVER QUEUE_CONNECTION \
         BROADCAST_CONNECTION; do
  patch_env "$v"
done

# Re-install when composer.lock changes (supports dependency updates)
STAMP_FILE="vendor/.composer_deps_sha256"
CURRENT_HASH=$(sha256sum composer.lock 2>/dev/null | awk '{print $1}' || echo "")
STORED_HASH=""
if [ -f "$STAMP_FILE" ]; then
  STORED_HASH=$(cat "$STAMP_FILE" 2>/dev/null || true)
fi

if [ ! -f vendor/autoload.php ] || { [ -n "$CURRENT_HASH" ] && [ "$CURRENT_HASH" != "$STORED_HASH" ]; }; then
  log "composer dependencies outdated — running composer install..."
  composer install --no-interaction --prefer-dist
  if [ -n "$CURRENT_HASH" ]; then
    echo "$CURRENT_HASH" > "$STAMP_FILE"
  fi
fi

mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true

if ! grep -qE '^APP_KEY=base64:.+' .env; then
  log "Generating APP_KEY"
  php artisan key:generate --force --no-interaction
fi

php artisan storage:link --force 2>/dev/null || true

if [ "${DB_CONNECTION:-}" = "mysql" ]; then
  log "Waiting for MySQL (${DB_HOST:-mysql}:${DB_PORT:-3306})..."
  i=0
  while [ "$i" -lt 60 ]; do
    if php -r '
      $h = getenv("DB_HOST") ?: "mysql";
      $port = (int) (getenv("DB_PORT") ?: 3306);
      $u = getenv("DB_USERNAME") ?: "root";
      $p = getenv("DB_PASSWORD") ?: "";
      try {
        new PDO("mysql:host={$h};port={$port}", $u, $p, [PDO::ATTR_TIMEOUT => 3]);
        exit(0);
      } catch (Throwable $e) {
        exit(1);
      }
    ' 2>/dev/null; then
      log "MySQL is reachable"
      break
    fi
    i=$((i + 1))
    sleep 2
  done
  if [ "$i" -eq 60 ]; then
    log "ERROR: MySQL not reachable after 120s" >&2
    exit 1
  fi
fi

rm -f bootstrap/cache/config.php 2>/dev/null || true
php artisan optimize:clear --no-interaction 2>/dev/null || true

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  php artisan migrate --force --no-interaction
fi

if [ "${RUN_SEED_IF_EMPTY:-true}" = "true" ]; then
  USER_COUNT=$(php -r '
    require "vendor/autoload.php";
    $app = require "bootstrap/app.php";
    $app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();
    echo \App\Models\User::count();
  ' 2>/dev/null || echo "0")
  if [ "${USER_COUNT:-0}" = "0" ]; then
    log "Database kosong — menjalankan db:seed..."
    php artisan db:seed --force --no-interaction
  fi
fi

exec "$@"
