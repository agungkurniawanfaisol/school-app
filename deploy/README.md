# Deploy to Hostinger (SSH + rsync)

Push ke branch `main` → GitHub Actions build frontend + sync ke `public_html`.

## Yang di-deploy

| Sumber                          | Tujuan                          | Catatan                                        |
| ------------------------------- | ------------------------------- | ---------------------------------------------- |
| `frontend/dist/*` + `.htaccess` | `public_html/`                  | `--delete` tapi **exclude** `backend/`         |
| `backend/*`                     | `public_html/backend/`          | `--delete` tapi **exclude** `storage/`, `.env` |
| `deploy/backend.htaccess`       | `public_html/backend/.htaccess` | redirect ke `public/`                          |

## Secret GitHub (Settings → Secrets and variables → Actions)

| Name             | Isi                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------- |
| `DEPLOY_HOST`    | Hostname SSH Hostinger (lihat hPanel → SSH Access)                                  |
| `DEPLOY_USER`    | Username SSH                                                                        |
| `DEPLOY_SSH_KEY` | Private key (isi penuh, termasuk `BEGIN`/`END`)                                     |
| `DEPLOY_PATH`    | Path absolut `public_html`, contoh: `/home/u123/domains/namadomain.com/public_html` |

Opsional:

| Name         | Default | Isi                                                          |
| ------------ | ------- | ------------------------------------------------------------ |
| `DEPLOY_PHP` | `php`   | Path binary PHP jika beda, mis. `/opt/alt/php83/usr/bin/php` |

## Setup sekali di server (SSH)

```bash
cd ~/domains/namadomain.com/public_html

# Setelah deploy pertama ada folder backend:
cd backend
cp .env.example .env   # atau buat manual
nano .env              # isi DB Hostinger, APP_URL, APP_KEY, Sanctum

# Generate key jika belum:
php artisan key:generate

# Permission storage
chmod -R ug+rwx storage bootstrap/cache

php artisan storage:link
php artisan migrate --force
```

Contoh variabel penting di `.env` production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://namadomain.com

FRONTEND_URL=https://namadomain.com
SANCTUM_STATEFUL_DOMAINS=namadomain.com,www.namadomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=database
```

## SSH key

Di komputer lokal:

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/hostinger_deploy -N ""
```

- Public key (`hostinger_deploy.pub`) → tempel di Hostinger SSH keys / `~/.ssh/authorized_keys`
- Private key (`hostinger_deploy`) → GitHub secret `DEPLOY_SSH_KEY`

## Uji manual

```bash
ssh USER@HOST "ls -la DEPLOY_PATH"
curl -I https://namadomain.com/
curl -I https://namadomain.com/api/v1/settings
```

## Catatan

- Folder `storage/` dan file `.env` **tidak** di-upload ulang — aman untuk upload & secret.
- Frontend production memakai `VITE_API_URL=/api` (lihat `frontend/.env.production`).
- Rewrite `/api` → Laravel ada di `deploy/public_html.htaccess`.
