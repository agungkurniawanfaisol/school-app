# HARNESS.md — Nurul Hikmah Project Harness

**One-page map** for humans and AI agents: how to run, test, and work in this repo.

| Doc | Purpose |
|-----|---------|
| [`HARNESS.md`](HARNESS.md) | This file — run, verify, agent loop |
| [`AGENTS.md`](AGENTS.md) | Architecture, conventions, feature checklist |
| [`skills.md`](skills.md) | Skills & Cursor rules index |
| [`memory.md`](memory.md) | Session handoff — read when resuming |

---

## 1. Dev environment (Docker Compose)

### Modes

| Mode | Command | What runs | URLs |
|------|---------|-----------|------|
| **API only** | `make dev` | MySQL + Laravel | API `http://localhost:8000/api` |
| **Full stack** | `make dev-full` | + nginx + Vite in Docker | UI `http://localhost:8080`, Vite `:5173` |
| **Host Vite** | `make dev` then `cd frontend && npm run dev` | API in Docker, Vite on host | UI `http://localhost:5173` |

**First-time setup:**

```bash
cp .env.example .env
cp backend/.env.docker backend/.env
make dev
```

**After `package-lock.json` changes (Docker frontend volume):**

```bash
make sync-frontend
docker compose --profile full restart frontend
```

**Do not** run host Vite and Docker frontend on port **5173** at the same time.

### Common commands

```bash
make migrate          # run migrations
make test             # PHPUnit + Vitest (in Docker)
make logs             # all service logs
make shell-backend    # backend container shell
make shell-frontend   # frontend container shell (full profile)
make down             # stop stack
```

---

## 2. Test harness

### Backend — PHPUnit

- **Location:** `backend/tests/`
- **Base:** `Tests\TestCase` — `RefreshDatabase`, `actingAsAdmin()`, `sanctumAdmin()`, `createSchool()`
- **Traits:** `Tests\Concerns\AssertsAdminCrud`, `AssertsPublicReadApi`

```bash
make test-backend
# or
docker compose exec backend php artisan test
docker compose exec backend php artisan test --filter=NewsApiTest
```

### Frontend — Vitest

- **Runner:** `vitest` via `npm test` in `frontend/`
- **Setup:** `frontend/vite.config.ts` (test env: happy-dom)
- **Pattern:** colocated `*.test.ts(x)` next to source

```bash
make test-frontend
# or
cd frontend && npm test
cd frontend && npm run test:watch
```

### Full suite

```bash
make test
# or
./scripts/harness.sh --test
```

**Rule:** behavior changes require updated tests — see `.cursor/rules/tests-required.mdc`.

---

## 3. AI agent harness

### Load order

1. User prompt
2. [`memory.md`](memory.md) — in-flight work
3. [`.cursor/rules/`](.cursor/rules/) — auto-attached by glob
4. [`AGENTS.md`](AGENTS.md) — architecture & checklist
5. [`skills.md`](skills.md) — pick skills by task

### Always-on rules

| Rule | Topic |
|------|-------|
| `core-stack.mdc` | Stack, no Redis |
| `owasp-security.mdc` | Security |
| `superpowers-workflow.mdc` | Brainstorm → TDD → verify |
| `tests-required.mdc` | PHPUnit + Vitest on changes |
| `uuid-urls.mdc` | UUID in detail URLs |

### Feature workflow (Superpowers)

```
brainstorming → writing-plans → test-driven-development → implementation → verification-before-completion
```

Project skill: `.cursor/skills/nurul-hikmah-stack/SKILL.md`

### Verify harness integrity

```bash
make harness          # checks files + optional tests
./scripts/harness.sh  # same
```

---

## 4. Stack constraints (quick reference)

- **No Redis** — `CACHE_STORE=file` only
- **Repository + HasCache** — reads cached, CUD clears tags
- **Frontend** — Zod (`schemas/`), TanStack Query (`hooks/`), shadcn (`components/ui/`)
- **UI text** — Bahasa Indonesia
- **Motion** — `motion` package, tiered animations — `motion-animation.mdc`
- **PWA** — Workbox in production build — `pwa-offline-first.mdc`

---

## 5. Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 5173 in use | Stop host `npm run dev` OR stop Docker frontend |
| `motion` / deps missing in Docker | `make sync-frontend` |
| `FadeInView` export error | Fixed — no circular imports via `@/components/motion` barrel inside motion folder |
| MySQL connection refused | `make dev`; host port **3307** |
| Stale `memory.md` | Update §3–§4 after large sessions |

---

*Run `make harness` after cloning or major infra changes.*
