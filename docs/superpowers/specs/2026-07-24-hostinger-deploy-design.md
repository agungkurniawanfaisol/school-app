# Hostinger Shared Hosting — Auto Deploy (SSH + GitHub Actions)

**Date:** 2026-07-24  
**Status:** Approved

## Goal

On every push to `main`, update production on Hostinger shared hosting via SSH/`rsync`:

- Frontend `dist/` → `public_html/` (document root)
- Laravel `backend/` → `public_html/backend/`
- Never overwrite/delete `backend/storage/` or `backend/.env`
- Never delete `public_html/backend/` when syncing frontend
- Ship `public_html/.htaccess` for SPA + `/api` rewrite + path protection

## Server layout

```
public_html/
  .htaccess
  index.html, assets/…     # from frontend/dist
  backend/                 # Laravel app
    .env                   # server-only
    storage/               # server-only (uploads, logs, cache)
    public/
    app/, vendor/, …
```

## API URL

Frontend production: `VITE_API_URL=/api`  
Apache rewrites `/api/*` → `backend/public/index.php` so existing PWA cache patterns keep working.

## Secrets (GitHub)

| Secret           | Example                                            |
| ---------------- | -------------------------------------------------- |
| `DEPLOY_HOST`    | `ssh.hostinger.com`                                |
| `DEPLOY_USER`    | `u123456789`                                       |
| `DEPLOY_SSH_KEY` | private key PEM                                    |
| `DEPLOY_PATH`    | `/home/u123456789/domains/example.com/public_html` |

## One-time server setup

1. Create `backend/.env` (production DB, `APP_URL`, Sanctum domains)
2. Ensure `storage/` writable; `php artisan storage:link`
3. Add deploy SSH public key to Hostinger
4. Push to `main` to trigger first deploy
