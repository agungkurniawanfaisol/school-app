# PMB Program Master Implementation Plan

> **For agentic workers:** Use executing-plans / TDD task-by-task. Steps use checkbox syntax.

**Goal:** Admin CRUD for PMB programs; fee form Program select loads active masters via FK.

**Architecture:** `pmb_programs` master + `pmb_fees.pmb_program_id` FK; keep `program` string as code snapshot. Mirror Academic Year admin patterns.

**Tech Stack:** Laravel 12, Sanctum, React admin, Zod, TanStack Query, PHPUnit, Vitest.

## Global Constraints

- File cache only; Repository + HasCache; UUID routes; softDeletes; Bahasa Indonesia UI; tests required.

---

### Task 1: Migration + model `PmbProgram` + fee FK backfill

- [ ] Create `pmb_programs` migration + backfill reguler/icp per school + add `pmb_program_id` on fees
- [ ] Model, factory, seeder defaults
- [ ] Tests for admin program CRUD (write first)

### Task 2: Admin API programs

- [ ] Repository, requests, resource, controller, routes
- [ ] Pass program admin tests

### Task 3: Wire PmbFee to program FK

- [ ] Update PmbFee model/request/resource/repo/factory/tests
- [ ] Portal labels use program_name

### Task 4: Frontend admin CRUD + fee select

- [ ] Hooks, pages, nav, i18n
- [ ] Update pmb-fee schema + form
- [ ] Vitest schema/list smoke

### Task 5: Verify + commit

- [ ] `make test-backend` filter PmbProgram/PmbFee; frontend tests
- [ ] Commit (include pending KB jenjang if still unstaged)
