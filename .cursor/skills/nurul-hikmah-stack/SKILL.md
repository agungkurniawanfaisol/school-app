---
name: nurul-hikmah-stack
description: End-to-end development workflow for Nurul Hikmah School App — Laravel file-cache backend, MySQL indexing, React PWA with Radix/shadcn, Zod forms, and TanStack Query. Use when building features, APIs, database migrations, or frontend pages for this project.
---

# Nurul Hikmah Stack

## Quick Reference

| Concern | Location | Skill |
|---------|----------|-------|
| React patterns | `frontend/src/` | `vercel-react-best-practices`, `react-vite-best-practices` |
| UI design | public pages | `frontend-design`, `web-design-guidelines` |
| Tailwind | layouts | `tailwind-css-patterns`, `tailwindcss-mobile-first` |
| Radix/shadcn | `frontend/src/components/ui/` | `shadcn`, `radix-ui-design-system` |
| Backend | `backend/app/` | `laravel-specialist`, `laravel-patterns`, `laravel-11-12-app-guidelines` |
| Tests | `backend/tests/` | `pest-testing` |
| Security | auth/API | `laravel-security` |
| Migrations | `backend/database/migrations/` | `mysql`, `database-indexing-strategy` |
| PWA | `frontend/vite.config.ts` | `pwa-development` |

**Cache constraint**: file driver only — NO Redis.

## Feature Workflow

Copy and track:

```
Task Progress:
- [ ] 1. Migration with indexes
- [ ] 2. Model + scopes
- [ ] 3. Repository (HasCache)
- [ ] 4. Form Request + API Resource
- [ ] 5. Controller + route
- [ ] 6. Zod schema
- [ ] 7. TanStack Query hook
- [ ] 8. UI page (shadcn/Radix)
- [ ] 9. PWA cache rule (if public GET)
- [ ] 10. Tests — Feature (backend) + Vitest (frontend)
- [ ] 11. `make test` passes
```

### Step 1 — Migration

```php
Schema::create('example', function (Blueprint $table) {
    $table->id();
    $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
    $table->string('title', 250);
    $table->string('slug', 270)->unique();
    $table->boolean('is_active')->default(true)->index();
    $table->integer('order')->default(0)->index();
    $table->timestamps();
    $table->softDeletes();
    $table->index(['school_id', 'is_active', 'order']);
});
```

### Step 2–5 — Backend

Extend `BaseRepository`. Override `defaultSelect()`, `defaultWith()`, `searchableColumns()`.
Cache reads; `clearCache()` on CUD. Paginate with `perPage` max 50.

### Step 6–8 — Frontend

```typescript
// schema → hook → component
const form = useForm<NewsFormValues>({ resolver: zodResolver(newsFormSchema) });
const { data, isFetching } = useNewsList({ page, per_page: 15 });
```

### Step 9 — PWA

Add public GET routes to Workbox `runtimeCaching` with `StaleWhileRevalidate`.

## Performance Checklist

- [ ] Composite indexes match `applyFilters()` WHERE + ORDER BY
- [ ] Repository uses `select()` + `with()` — no N+1
- [ ] GET endpoints cached (`remember()` + HTTP `Cache-Control`)
- [ ] CUD clears repository cache tag
- [ ] TanStack Query `staleTime` set per data freshness needs
- [ ] Paginated lists use `keepPreviousData`
- [ ] Service worker caches static shell + public API reads

## Cursor Rules

Detailed patterns in `.cursor/rules/`:

- `core-stack.mdc` — always applied
- `backend-cache-performance.mdc`
- `database-optimization.mdc`
- `frontend-patterns.mdc`
- `pwa-offline-first.mdc`
