# memory.md — AI Session Handoff

> **Read after [`AGENTS.md`](AGENTS.md)** when starting a new session or switching AI/model.  
> This file tracks recent work and follow-ups — not a substitute for rules or skills.

**Last updated:** 2026-07-29 (PMB analytics dashboard)

---

## 1. Quick start

| Priority                | Source                                       |
| ----------------------- | -------------------------------------------- |
| Architecture & commands | [`AGENTS.md`](AGENTS.md)                     |
| Skills index            | [`skills.md`](skills.md)                     |
| Feature workflow        | `.cursor/skills/nurul-hikmah-stack/SKILL.md` |
| Cursor rules            | `.cursor/rules/`                             |

---

## 2. Always apply

1. **No Redis** — `CACHE_STORE=file`; file cache + PWA client cache for performance.
2. **Repository pattern** — all reads via `HasCache::remember()`, CUD clears cache tag.
3. **Indexes** — composite indexes must match `BaseRepository::applyFilters()` + scopes.
4. **Frontend** — Zod (`src/schemas/`), TanStack Query (`src/hooks/`), shadcn/Radix (`src/components/ui/`).
5. **UI text** — Bahasa Indonesia; code/comments in English.
6. **Update this file** before ending a large session with what changed and what's next.

---

## 3. Completed (recent sessions)

### 2026-08-05 — PMB status-change emails

- Admin ubah status PMB → email otomatis ke `parent_email` (semua status)
- Catatan admin di update yang sama ikut di isi email
- `accepted` tetap template khusus; status lain → `PmbRegistrationStatusChangedMail`
- Spec/plan: `docs/superpowers/specs/2026-08-05-pmb-status-change-email-design.md`
- **Ops:** pastikan Gmail OAuth + `queue:work` di live
- **Bonus:** Settings → Gmail → form **Kirim Gmail (uji)** ke alamat bebas (`POST /api/admin/gmail/send-test`)

### 2026-07-29 — PMB Registrations Analytics Dashboard

- Admin `/admin/pmb-registrations`: KPI + Recharts (status/jenjang/tren/sekolah asal), filter bersama, sort, Cetak, Unduh CSV
- Backend: `GET .../stats`, `GET .../export` (UTF-8 BOM, cap `config/pmb.php`), allowlisted sort di `PmbRegistrationRepository`
- Tests: `PmbRegistrationAnalyticsTest`, `PmbStatsKpis.test.tsx`; phpunit `force=true` untuk sqlite
- **Next:** opsional gender chart di mobile; Excel `.xlsx` jika diminta

### 2026-07-28 — Tahun Ajaran (Academic Year)

- Master `academic_years` (label `YYYY/YYYY`, satu `is_active` per sekolah)
- Kolom `academic_year` di `pmb_registrations` + filter admin
- Admin: `/admin/academic-years` (Sistem → Tahun Ajaran)
- Admin PMB: filter tahun di daftar pendaftaran; API index tahun ajaran read-only
- Portal PMB: pakai tahun aktif dari API (`/api/v1/academic-years/active`)
- **Next:** opsional — tutup PMB otomatis jika tidak ada tahun aktif

### 2026-07-28 — PMB Pendaftar Portal

- Spec: `docs/superpowers/specs/2026-07-28-pmb-pendaftar-portal-design.md`
- Roles: `admin_pmb`, `pendaftar`; Google OAuth `intent=pmb` auto-creates pendaftar
- Portal API: draft/submit/upload/messages/timeline; Admin PMB verify payment + LoA shell
- Frontend: wizard `/pmb/daftar`, OAuth callback, portal detail UUID, Admin PMB nav isolation
- Status pipeline: `draft` → `awaiting_payment_review` → `submitted` → `review` → `accepted`|`rejected`
- **Next:** LoA PDF template when sample provided; optional document upload types in wizard

### 2026-07-24 — Hostinger auto-deploy

- GitHub Actions: `.github/workflows/deploy.yml` (SSH + rsync on push `main`)
- `deploy/public_html.htaccess` → SPA + `/api` → Laravel + block `storage`/`.env`/vendor
- `deploy/backend.htaccess` → funnel ke `public/`
- Frontend prod: `frontend/.env.production` (`VITE_API_URL=/api`)
- Docs: `deploy/README.md`, spec `docs/superpowers/specs/2026-07-24-hostinger-deploy-design.md`
- **Next for user:** isi GitHub secrets (`DEPLOY_HOST/USER/SSH_KEY/PATH`), buat `.env` di server sekali

### 2026-07-03 — Superpowers + testing

- Rules: `superpowers-workflow.mdc`, `laravel-development.mdc`, `tests-required.mdc` (always on)
- Project skills: `superpowers-workflow`, `laravel-development`
- skills.sh: obra superpowers (brainstorming, TDD, plans, verify), `laravel-testing`, `vitest`, `frontend-testing`
- Frontend: Vitest + Testing Library scaffold (`npm test`, `make test-frontend`)
- Global `laravel-superpowers` at `~/.agents/skills/` complements project `laravel-development`

### 2026-07-03 — OWASP security rules & skills

- Rules: `owasp-security.mdc` (always on), `injection-prevention.mdc`
- Project skill: `.cursor/skills/security-audit/`
- skills.sh: `owasp-security-check`, `laravel-security-audit` (+ existing `laravel-security`)

### 2026-07-03 — Docker Compose (hot reload)

- `docker-compose.yml` — dev: nginx → Vite HMR + Laravel API, MySQL, named volumes for `node_modules`/`vendor`
- `docker-compose.prod.yml` — static `frontend/dist` + production nginx
- Entrypoints auto-run `composer install` / `npm ci` when lockfiles change
- `Makefile` — `make up`, `rebuild`, `update`, `prod`
- Default MySQL host port **3307** (avoids conflict with host MySQL on 3306)

### 2026-07-03 — Skills expansion (skills.sh)

Added 10 skills (total **20** in `.agents/skills/`):

- `laravel-11-12-app-guidelines`, `laravel-patterns`, `laravel-security`, `pest-testing`
- `tailwind-css-patterns`, `tailwindcss-mobile-first`, `react-vite-best-practices`
- `radix-ui-design-system`, `web-design-guidelines`, `frontend-design`

Updated `skills.md`, `AGENTS.md`, `nurul-hikmah-stack` skill.

### 2026-07-03 — Agent infrastructure & conventions

**Cursor rules created** (`.cursor/rules/`):

- `core-stack.mdc` — always-on stack overview
- `backend-cache-performance.mdc` — file cache, repository pattern
- `database-indexing-queries.mdc` — table indexes + query optimization
- `database-optimization.mdc` — pagination
- `zod-input-validation.mdc` — Zod form schemas
- `react-query-api.mdc` — TanStack Query hooks
- `frontend-patterns.mdc` — shadcn/Radix structure
- `pwa-offline-first.mdc` — Workbox offline-first

**Project skill:** `.cursor/skills/nurul-hikmah-stack/SKILL.md`

**skills.sh packages installed** (`.agents/skills/`) — **20 skills**:

`shadcn`, `radix-ui-design-system`, `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`, `frontend-design`, `tanstack-query-best-practices`, `zod`, `react-hook-form-zod-shadcn`, `react-vite-best-practices`, `tailwind-css-patterns`, `tailwindcss-mobile-first`, `laravel-specialist`, `laravel-11-12-app-guidelines`, `laravel-patterns`, `laravel-security`, `pest-testing`, `mysql`, `database-indexing-strategy`, `pwa-development`

See [`skills.md`](skills.md) for full index.

**Agent docs:** `AGENTS.md`, `skills.md`, `memory.md` (this file)

**Backend state:** Laravel 12 scaffold complete — models, repositories, migrations (with indexes), public V1 API, admin CRUD routes, Sanctum auth.

**Frontend state:** Minimal Vite + React 19 scaffold only. **Not yet installed:** TanStack Query, Zod, shadcn, Tailwind v4, vite-plugin-pwa, react-hook-form.

---

## 4. Follow-ups (not done)

- [ ] Scaffold frontend: Tailwind v4, shadcn init, TanStack Query, Zod, react-hook-form, axios
- [ ] Add `vite-plugin-pwa` + Workbox runtime caching per `pwa-offline-first.mdc`
- [ ] Create `frontend/src/lib/api.ts`, `src/hooks/query-keys.ts`, example domain hook
- [ ] Create `frontend/src/schemas/common.ts` (pagination, slug, id primitives)
- [x] Docker Compose dev stack with hot reload (`docker-compose.yml`, `Makefile`)
- [ ] Wire public pages to `/api/v1` endpoints
- [ ] Admin dashboard + Sanctum login flow on frontend
- [ ] Set `CACHE_STORE=file` in `.env.example` and document hosting constraints
- [ ] Add Pest/Feature tests for public API pagination + cache invalidation

---

## 5. Decisions log

| Date       | Decision                                       | Rationale                                     |
| ---------- | ---------------------------------------------- | --------------------------------------------- |
| 2026-07-03 | File cache only, no Redis                      | Shared hosting limitation                     |
| 2026-07-03 | Repository + `HasCache` trait                  | Consistent caching on all reads               |
| 2026-07-03 | Composite DB indexes per filter pattern        | Match `applyFilters()` query shapes           |
| 2026-07-03 | Offline-first PWA                              | Compensate for no server-side Redis           |
| 2026-07-03 | skills.sh at project level (`.agents/skills/`) | Team-shared, versioned via `skills-lock.json` |

---

## 6. Pitfalls noticed

- `HasCache` uses `Cache::tags()` — verify file cache driver supports tagging on target hosting (fallback: database cache store).
- Legacy `.cursorrules` at repo root overlaps with `.cursor/rules/` — prefer `.cursor/rules/` for new work.
- Frontend `package.json` still has only React + Vite — do not assume TanStack Query/Zod exist until scaffolded.

---

_Update §3–§4 when finishing meaningful work. Keep §5 for architectural decisions only._
