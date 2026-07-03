# AGENTS.md — Nurul Hikmah School App

**Read this file first** when working in this repo with any AI assistant (Cursor, Codex, Claude Code, etc.).

School website & admin portal: **Laravel 12 API** + **React PWA** (public content, PMB registration, courses, admin CRUD).

| Layer | Path | Stack |
|-------|------|-------|
| Backend | `backend/` | PHP 8.3+, Laravel 12, Sanctum, MySQL 8.0, **file cache (NO Redis)** |
| Frontend | `frontend/` | React 19, TypeScript, Vite, Radix/shadcn, TanStack Query v5, Zod, Tailwind v4, Workbox PWA |
| Cursor rules | `.cursor/rules/` | Always-on / glob-scoped constraints |
| Project skills | `.cursor/skills/` | End-to-end workflows |
| External skills | `.agents/skills/` | Installed from [skills.sh](https://skills.sh) |
| Skills index | [`skills.md`](skills.md) | What to load per task |
| Session handoff | [`memory.md`](memory.md) | Recent work & follow-ups — read when resuming |

---

## 1. Start here (60 seconds)

1. **Architecture & commands** → this file §2–§5
2. **In-flight work** → [`memory.md`](memory.md)
3. **Skills by task** → [`skills.md`](skills.md)
4. **Stack overview** → `.cursor/rules/core-stack.mdc` (always applied)
5. **Feature workflow** → `.cursor/skills/nurul-hikmah-stack/SKILL.md`
6. **New features** → `brainstorming` skill before coding (see `superpowers-workflow`)

**Precedence:** explicit user prompt > `memory.md` (session) > `.cursor/rules/` > this file > generic Laravel/React knowledge.

---

## 2. Repository map

```
nurul-hikmah-app/
├── AGENTS.md              ← you are here
├── skills.md              ← skill index & install commands
├── memory.md              ← AI session handoff
├── skills-lock.json       ← pinned skills.sh packages
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/     # Public read API
│   │   ├── Http/Controllers/Admin/      # Admin CRUD (Sanctum)
│   │   ├── Http/Requests/{Domain}/      # Form validation
│   │   ├── Http/Resources/V1/           # API responses
│   │   ├── Repositories/                # HasCache + queries
│   │   ├── Models/                      # Eloquent + scopes
│   │   └── Traits/HasCache.php
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/
│   └── src/
│       ├── components/ui/   # shadcn/Radix (to scaffold)
│       ├── hooks/           # TanStack Query
│       ├── schemas/         # Zod
│       └── lib/api.ts       # HTTP client
└── .cursor/
    ├── rules/*.mdc
    └── skills/nurul-hikmah-stack/
```

---

## 3. Non-negotiable conventions

| Topic | Rule | Reference |
|-------|------|-----------|
| **Cache** | File driver only — never Redis | `CACHE_STORE=file`, `.cursor/rules/backend-cache-performance.mdc` |
| **Backend reads** | `Cache::remember()` via `HasCache` in repositories | `BaseRepository` |
| **Backend writes** | `clearCache()` after every CUD | `HasCache` trait |
| **Queries** | `select()` + `with()`, no N+1, paginate max 50 | `.cursor/rules/database-indexing-queries.mdc` |
| **Indexes** | FK indexed; composite indexes match filter/sort | migrations + `database-indexing-queries.mdc` |
| **Forms** | Zod in `src/schemas/`, errors in Bahasa Indonesia | `.cursor/rules/zod-input-validation.mdc` |
| **API calls** | TanStack Query in `src/hooks/` only | `.cursor/rules/react-query-api.mdc` |
| **UI** | Radix via shadcn, mobile-first, UI text Bahasa Indonesia | `.cursor/rules/frontend-patterns.mdc` |
| **PWA** | Offline-first, Workbox for static + public GET | `.cursor/rules/pwa-offline-first.mdc` |
| **Security** | OWASP always on; Form Request + Zod; no raw SQL | `.cursor/rules/owasp-security.mdc` |
| **Tests** | PHPUnit + Vitest required on behavior changes | `.cursor/rules/tests-required.mdc` |
| **Workflow** | Brainstorm → plan → TDD → verify | `.cursor/rules/superpowers-workflow.mdc` |
| **URLs** | Detail routes use UUID, never numeric `id` | `.cursor/rules/uuid-urls.mdc` |
| **Tables** | `id`, `timestamps()`, `softDeletes()` on every table | `.cursorrules` |

---

## 4. Backend architecture

```
Request → FormRequest → Controller → Repository (HasCache) → Model
                              ↓
                        API Resource
```

- **Public API:** `routes/api.php` prefix `v1` — cached reads, no auth.
- **Admin API:** prefix `admin` — Sanctum + `EnsureUserIsAdmin`.
- **Repositories:** extend `BaseRepository`; override `defaultSelect()`, `defaultWith()`, `searchableColumns()`.
- **Validation:** backend Form Requests; frontend Zod (duplicate validation at boundary).

### Domains

`schools`, `hero-sliders`, `curriculums`, `teachers`, `student-activities`, `facilities`, `news`, `testimonials`, `courses` (+ modules/lessons/enrollments/progress), `pmb`, `media`, `settings`.

---

## 5. Frontend architecture (target state)

```
Page → useXxx() hook → api.ts → Laravel /api/v1
  ↓
Zod schema (forms) + shadcn components
```

- Query keys: hierarchical factory in `src/hooks/query-keys.ts`.
- `staleTime`: 5 min public content, 30 s admin, 0 auth.
- Paginated lists: `keepPreviousData`.
- PWA: `StaleWhileRevalidate` for public GET; `NetworkOnly` for auth/mutations.

> **Note:** Frontend dependencies (TanStack Query, Zod, shadcn, vite-plugin-pwa) still need scaffolding — see `memory.md`.

---

## 6. Commands (Docker-first)

```bash
cp .env.example .env
cp backend/.env.docker backend/.env

make dev                      # MySQL + backend API (:8000)
cd frontend && npm run dev    # Vite HMR (:5173)

make logs                     # follow all logs
make rebuild                  # rebuild images after Dockerfile changes
make migrate                  # run migrations
make test                     # backend + frontend
make down                     # stop stack

# URLs (development)
# Frontend (UI):  http://localhost:5173
# Backend (API):  http://localhost:8000/api
# MySQL:          localhost:3307
```

**Hot reload:** Frontend via Vite HMR on host (`npm run dev`). PHP changes apply on refresh (`opcache.revalidate_freq=0` in dev).

**Production build:**

```bash
make prod-build               # build frontend/dist
make prod                     # nginx static + php-fpm + mysql
```

See `docker-compose.yml` and `Makefile` for full options.

---

## 7. Workflow for AI agents

### New feature checklist

- [ ] Migration with indexes aligned to `applyFilters()`
- [ ] Model + `HasCommonScopes`
- [ ] Repository extending `BaseRepository`
- [ ] Form Request + API Resource + Controller + route
- [ ] Zod schema + TanStack Query hook + UI page
- [ ] PWA cache rule if public GET endpoint
- [ ] Security: Form Request, throttle on auth/POST, no mass assignment (`security-audit`)
- [ ] Update `memory.md` before ending a large session

### Skills to load by task

| Task | Skill / rule |
|------|----------------|
| Full feature | `superpowers-workflow` → `nurul-hikmah-stack` + `laravel-development` |
| Brainstorm / design | `brainstorming`, `writing-plans` |
| TDD / tests | `test-driven-development`, `laravel-testing`, `vitest` |
| Before done | `verification-before-completion` |
| Laravel backend | `laravel-specialist`, `laravel-11-12-app-guidelines`, `laravel-patterns` |
| Backend tests | `pest-testing` |
| API security | `laravel-security`, `owasp-security-check`, `security-audit` |
| shadcn / Radix | `shadcn`, `radix-ui-design-system` |
| Form + validation | `zod`, `react-hook-form-zod-shadcn` |
| API hooks | `tanstack-query-best-practices` |
| React / Vite | `vercel-react-best-practices`, `react-vite-best-practices` |
| UI design | `frontend-design`, `web-design-guidelines` |
| Tailwind layout | `tailwind-css-patterns`, `tailwindcss-mobile-first` |
| MySQL / indexes | `mysql`, `database-indexing-strategy` |
| PWA / offline | `pwa-development` |

Full list: [`skills.md`](skills.md).

---

## 8. Known pitfalls

- **No Redis** — do not add `predis`, Redis cache driver, or Horizon.
- **File cache + tags** — `HasCache` uses `Cache::tags()`; requires file or database cache store that supports tagging.
- **Frontend is minimal** — only base Vite React scaffold exists; follow rules when adding libraries.
- **Duplicate `.cursorrules`** — legacy root file still applies; prefer `.cursor/rules/` for new patterns.
- **UI language** — Bahasa Indonesia for user-facing strings; English for code and agent docs.

---

*When in doubt: read the domain's Repository + migration, follow `.cursor/rules/`, check `memory.md` for recent context.*
