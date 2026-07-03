# memory.md — AI Session Handoff

> **Read after [`AGENTS.md`](AGENTS.md)** when starting a new session or switching AI/model.  
> This file tracks recent work and follow-ups — not a substitute for rules or skills.

**Last updated:** 2026-07-03 (skills expansion)

---

## 1. Quick start

| Priority | Source |
|----------|--------|
| Architecture & commands | [`AGENTS.md`](AGENTS.md) |
| Skills index | [`skills.md`](skills.md) |
| Feature workflow | `.cursor/skills/nurul-hikmah-stack/SKILL.md` |
| Cursor rules | `.cursor/rules/` |

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

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-03 | File cache only, no Redis | Shared hosting limitation |
| 2026-07-03 | Repository + `HasCache` trait | Consistent caching on all reads |
| 2026-07-03 | Composite DB indexes per filter pattern | Match `applyFilters()` query shapes |
| 2026-07-03 | Offline-first PWA | Compensate for no server-side Redis |
| 2026-07-03 | skills.sh at project level (`.agents/skills/`) | Team-shared, versioned via `skills-lock.json` |

---

## 6. Pitfalls noticed

- `HasCache` uses `Cache::tags()` — verify file cache driver supports tagging on target hosting (fallback: database cache store).
- Legacy `.cursorrules` at repo root overlaps with `.cursor/rules/` — prefer `.cursor/rules/` for new work.
- Frontend `package.json` still has only React + Vite — do not assume TanStack Query/Zod exist until scaffolded.

---

*Update §3–§4 when finishing meaningful work. Keep §5 for architectural decisions only.*
