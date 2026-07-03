# Nurul Hikmah — School Landing Page & LMS

Aplikasi landing page sekolah lengkap dengan fitur LMS, PMB, dan panel admin.

## Tech Stack

| Layer    | Stack                                                                        |
| -------- | ---------------------------------------------------------------------------- |
| Backend  | Laravel 13, PHP 8.3, MySQL 8, Sanctum, File Cache                            |
| Frontend | React 18+, TypeScript, Vite, Tailwind v4, Radix UI, TanStack Query, Zod, PWA |
| Infra    | Docker Compose, Nginx (production)                                           |

## Quick Start (Development)

```bash
# 1. Copy environment files
cp .env.example .env
cp backend/.env.docker backend/.env

# 2. Start backend + MySQL (auto-migrate + seed jika DB kosong)
make dev

# 3. Start frontend (hot reload) — terminal terpisah
cd frontend && npm ci && npm run dev
```

**Akses development:**

| URL | Keterangan |
|-----|------------|
| http://localhost:5173 | Frontend (Vite HMR) — buka ini saja untuk UI |
| http://localhost:8000/api | API langsung (Postman/curl) |
| http://localhost:5173/admin/login | Panel admin |

**Kredensial admin (seeder):**

- Email: `admin@nurulhikmah.sch.id`
- Password: `password`

Frontend mem-proxy `/api` → `localhost:8000` — tidak perlu konfigurasi CORS untuk development.

## Production

```bash
make prod-build   # build frontend/dist
make prod         # nginx + php-fpm + mysql
```

## Project Structure

```
├── backend/          # Laravel API
├── frontend/         # React SPA (npm run dev di host)
└── docker/           # Nginx, PHP, MySQL configs
```

## API Routes

### Public (`/api/v1/`)

- `GET /schools/{slug}` — Info sekolah
- `GET /news`, `/teachers`, `/curriculums`, `/facilities`, `/courses`, dll.
- `POST /pmb/registrations` — Pendaftaran PMB
- `GET /pmb/track/{token}` — Cek status PMB

### Admin (`/api/admin/`) — Bearer token required

- `POST /login`, `POST /logout`, `GET /me`
- CRUD untuk semua modul

## Catatan

- **NO REDIS** — file cache (`CACHE_STORE=file`)
- **MySQL** di `localhost:3307` (3306 sering sudah dipakai di WSL)
- PWA aktif hanya di production build (`npm run build`)
