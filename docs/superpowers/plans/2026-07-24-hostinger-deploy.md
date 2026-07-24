# Hostinger deploy — implementation plan

## Files

| File                           | Role                                         |
| ------------------------------ | -------------------------------------------- |
| `.github/workflows/deploy.yml` | Build + rsync + artisan on push to main      |
| `deploy/public_html.htaccess`  | SPA, `/api` → Laravel, block sensitive paths |
| `deploy/backend.htaccess`      | Deny listing; funnel to `public/`            |
| `deploy/README.md`             | Setup secrets & one-time server steps        |
| `frontend/.env.production`     | `VITE_API_URL=/api` for production build     |

## Tasks

1. Add htaccess templates under `deploy/`
2. Add GitHub Actions workflow (SSH key, rsync frontend/backend, post-deploy artisan)
3. Add production frontend env + deploy README
4. Document secrets for the user
