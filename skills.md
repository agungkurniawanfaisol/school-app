# skills.md — Agent Skills Index

Skills and install guide for AI assistants in **Nurul Hikmah School App**.

## Start here

1. **[`AGENTS.md`](AGENTS.md)** — architecture, conventions, commands
2. **[`memory.md`](memory.md)** — recent session context
3. **Project skill** — `.cursor/skills/nurul-hikmah-stack/SKILL.md`
4. **Cursor rules** — `.cursor/rules/` (auto-loaded by glob)

### Dev URLs

| Service       | URL                       |
| ------------- | ------------------------- |
| Frontend (UI) | http://localhost:5173     |
| Backend (API) | http://localhost:8000/api |
| MySQL         | localhost:3307            |

```bash
make dev                      # Docker: MySQL + backend
cd frontend && npm run dev    # Host: Vite HMR
```

---

## Project-local skills (`.cursor/skills/`)

Committed with the repo. No install step.

| Skill                  | When to use                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `nurul-hikmah-stack`   | New feature end-to-end (migration → API → Zod → React Query → UI → PWA) |
| `security-audit`       | OWASP review — auth, injection, IDOR, uploads                           |
| `superpowers-workflow` | Brainstorm → plan → TDD → verify                                        |
| `laravel-development`  | Backend repository + PHPUnit patterns                                   |

---

## Installed skills (`.agents/skills/`)

**22 skills** installed via [skills.sh](https://skills.sh). Locked in `skills-lock.json`.

### Backend (Laravel / MySQL)

| Skill                          | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `laravel-specialist`           | Laravel 12 patterns, Eloquent, routing    |
| `laravel-11-12-app-guidelines` | Laravel 11/12 app structure & conventions |
| `laravel-patterns`             | Architecture, service layer, repositories |
| `laravel-security`             | Auth, validation, OWASP for Laravel       |
| `pest-testing`                 | Pest feature/unit tests                   |
| `mysql`                        | Query optimization, EXPLAIN, indexes      |
| `database-indexing-strategy`   | Composite index design                    |

### Frontend (React / Vite / UI)

| Skill                         | Purpose                            |
| ----------------------------- | ---------------------------------- |
| `shadcn`                      | Radix UI components via shadcn CLI |
| `radix-ui-design-system`      | Radix primitives & accessibility   |
| `tailwind-css-patterns`       | Tailwind utility patterns          |
| `tailwindcss-mobile-first`    | Mobile-first responsive layouts    |
| `react-vite-best-practices`   | Vite + React build & HMR           |
| `vercel-react-best-practices` | React performance                  |
| `vercel-composition-patterns` | Component composition              |
| `frontend-design`             | Distinctive, production-grade UI   |
| `web-design-guidelines`       | UX audit & accessibility checklist |

### Data & forms

| Skill                           | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `tanstack-query-best-practices` | TanStack Query caching & mutations |
| `zod`                           | Schema validation                  |
| `react-hook-form-zod-shadcn`    | Forms with RHF + Zod + shadcn      |

### Superpowers (obra)

| Skill                            | Purpose                       |
| -------------------------------- | ----------------------------- |
| `using-superpowers`              | Check applicable skills first |
| `brainstorming`                  | Design before implementation  |
| `writing-plans`                  | Implementation plan           |
| `test-driven-development`        | Red-green-refactor            |
| `executing-plans`                | Batch plan execution          |
| `verification-before-completion` | Evidence before done          |

### Testing

| Skill              | Purpose                       |
| ------------------ | ----------------------------- |
| `laravel-testing`  | PHPUnit feature/unit tests    |
| `vitest`           | Vitest + Testing Library      |
| `frontend-testing` | React component test patterns |

### Security (OWASP)

| Skill                    | Purpose                              |
| ------------------------ | ------------------------------------ |
| `owasp-security-check`   | OWASP Top 10 checklist               |
| `laravel-security-audit` | Laravel route & model security audit |

### PWA

| Skill             | Purpose                           |
| ----------------- | --------------------------------- |
| `pwa-development` | Service worker, manifest, offline |

### Install / update

```bash
npx skills list -p          # list project skills
npx skills update -p -y     # update all project skills
npx skills find <query>     # search skills.sh registry
```

**Install all project skills (fresh clone):**

```bash
npx skills add shadcn/ui@shadcn -y -p
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -y -p
npx skills add vercel-labs/agent-skills@vercel-composition-patterns -y -p
npx skills add vercel-labs/agent-skills@web-design-guidelines -y -p
npx skills add deckardger/tanstack-agent-skills@tanstack-query-best-practices -y -p
npx skills add pproenca/dot-skills@zod -y -p
npx skills add sortweste/frontend-skills@react-hook-form-zod-shadcn -y -p
npx skills add jeffallan/claude-skills@laravel-specialist -y -p
npx skills add thienanblog/awesome-ai-agent-skills@laravel-11-12-app-guidelines -y -p
npx skills add affaan-m/everything-claude-code@laravel-patterns -y -p
npx skills add affaan-m/everything-claude-code@laravel-security -y -p
npx skills add bagisto/agent-skills@pest-testing -y -p
npx skills add planetscale/database-skills@mysql -y -p
npx skills add aj-geddes/useful-ai-prompts@database-indexing-strategy -y -p
npx skills add alinaqi/claude-bootstrap@pwa-development -y -p
npx skills add giuseppe-trisciuoglio/developer-kit@tailwind-css-patterns -y -p
npx skills add josiahsiegel/claude-plugin-marketplace@tailwindcss-mobile-first -y -p
npx skills add asyrafhussin/agent-skills@react-vite-best-practices -y -p
npx skills add sickn33/antigravity-awesome-skills@radix-ui-design-system -y -p
npx skills add sickn33/antigravity-awesome-skills@laravel-security-audit -y -p
npx skills add sergiodxa/agent-skills@owasp-security-check -y -p
npx skills add anthropics/skills@frontend-design -y -p
npx skills add obra/superpowers@brainstorming -y -p
npx skills add obra/superpowers@using-superpowers -y -p
npx skills add obra/superpowers@test-driven-development -y -p
npx skills add obra/superpowers@writing-plans -y -p
npx skills add obra/superpowers@executing-plans -y -p
npx skills add obra/superpowers@verification-before-completion -y -p
npx skills add fusengine/agents@laravel-testing -y -p
npx skills add jezweb/claude-skills@vitest -y -p
npx skills add aj-geddes/useful-ai-prompts@frontend-testing -y -p
```

---

## Cursor rules (`.cursor/rules/`)

Auto-attached by file glob — no manual load needed.

| Rule                            | Scope                            | Topic                              |
| ------------------------------- | -------------------------------- | ---------------------------------- |
| `core-stack.mdc`                | Always                           | Stack overview, no Redis           |
| `backend-cache-performance.mdc` | `backend/**/*`                   | File cache, repository pattern     |
| `database-indexing-queries.mdc` | migrations, Repositories, Models | Indexes + query optimization       |
| `database-optimization.mdc`     | Repositories                     | Pagination                         |
| `zod-input-validation.mdc`      | `frontend/src/schemas/**`        | Zod forms                          |
| `react-query-api.mdc`           | `frontend/src/hooks/**`          | TanStack Query                     |
| `frontend-patterns.mdc`         | `frontend/**/*`                  | shadcn, structure — links to responsive rule |
| `responsive-mobile-web.mdc`     | `frontend/**/*.{tsx,css}`        | Mobile & web layouts; pairs with `tailwindcss-mobile-first` |
| `motion-animation.mdc`          | `frontend/**/*.{tsx,ts}`         | Motion spring animations; lightweight Chrome performance |
| `pwa-offline-first.mdc`         | `frontend/**/*`                  | Workbox offline-first              |
| `owasp-security.mdc`            | Always                           | OWASP Top 10, auth, access control |
| `injection-prevention.mdc`      | Requests, Repositories, Models   | SQL/input injection                |

---

## Load by task

| Task                  | Skills                                                             |
| --------------------- | ------------------------------------------------------------------ |
| New CRUD feature      | `nurul-hikmah-stack` + `laravel-patterns` + `laravel-specialist`   |
| Database migration    | `database-indexing-strategy` + `mysql`                             |
| Backend tests         | `pest-testing`                                                     |
| API security          | `laravel-security`                                                 |
| Form / input          | `zod` + `react-hook-form-zod-shadcn`                               |
| API hook              | `tanstack-query-best-practices`                                    |
| shadcn component      | `shadcn` + `radix-ui-design-system`                                |
| Page layout / responsive | `responsive-mobile-web.mdc` + `tailwind-css-patterns` + `tailwindcss-mobile-first` (linked from `frontend-patterns.mdc`, `AGENTS.md`) |
| UI animation / spring    | `motion-animation.mdc` — Motion (`motion` package), spring presets, tier policy |
| Public page design    | `frontend-design` + `web-design-guidelines`                        |
| React performance     | `vercel-react-best-practices` + `react-vite-best-practices`        |
| Superpowers / TDD     | `superpowers-workflow`, `brainstorming`, `test-driven-development` |
| Backend + tests       | `laravel-development`, `laravel-testing`                           |
| Frontend tests        | `vitest`, `frontend-testing`                                       |
| Security audit        | `security-audit`, `owasp-security-check`, `laravel-security-audit` |
| Auth / admin API      | `laravel-security` + rules `owasp-security`                        |
| Vite config / build   | `react-vite-best-practices`                                        |

---

## Not recommended for this project

| Skill / tool                       | Reason                         |
| ---------------------------------- | ------------------------------ |
| Redis-related skills               | Hosting does not support Redis |
| `supabase-postgres-best-practices` | Project uses MySQL             |
| `vercel-react-native-skills`       | Web PWA only                   |

---

## Global skills (optional)

`~/.agents/skills/` may have additional skills (`superpowers`, `laravel-expert`, etc.). **Prefer project skills** in `.agents/skills/` for this repo.
