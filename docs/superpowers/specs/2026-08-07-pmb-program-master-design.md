# PMB Program Master — Design

**Date:** 2026-08-07  
**Status:** Approved  
**Related:** [pmb-fees-design](./2026-07-29-pmb-fees-design.md), admin form `/admin/pmb-fees/create`

## Goal

Replace hardcoded program options (`reguler` / `icp`) with a **Master Program** so admins can add many programs over time. The Program select on PMB fee create/edit loads from **active** master rows.

## Decisions (approved)

| Topic | Choice |
|-------|--------|
| Admin UX | Full CRUD (list / create / edit / deactivate), same spirit as Academic Years |
| Label vs code | Unique `code` immutable after create; `name` (label) editable — new forms show new label |
| Data link | Table `pmb_programs` + FK on `pmb_fees` (approach 1) |

## Data model

### `pmb_programs`

| Column | Notes |
|--------|--------|
| `id`, `uuid` | UUID for public/admin detail routes |
| `school_id` | FK indexed; scoped per school |
| `code` | string max 30; unique per `school_id`; set only on create |
| `name` | string max 100; display label; editable |
| `sort_order` | int, default 0; list/select order |
| `is_active` | boolean; inactive hidden from new fee selects |
| timestamps, softDeletes | Project convention |

Indexes: unique `(school_id, code)`; index `(school_id, is_active, sort_order)`.

Seed / data migrate existing strings: `reguler` → Reguler, `icp` → ICP (per school that has fees or default school).

### `pmb_fees` changes

- Add `pmb_program_id` (FK → `pmb_programs`, indexed, required after backfill).
- Keep string column `program` as **code snapshot** for payment payloads / portal compatibility.
- Unique constraint becomes `(school_id, academic_year_id, jenjang, pmb_program_id)` (replace old jenjang+program string unique).
- On create/update fee: resolve program from `pmb_program_id`; set `program` = master `code`.

### API resource (`PmbFeeResource`)

Expose at least: `pmb_program_id`, `program` (code), `program_name` (from relation / snapshot preference: live `name` from master when loaded).

## Admin API

- Prefix `admin`, Sanctum + admin (same gate as `pmb-fees` / admin PMB).
- `GET/POST /admin/pmb-programs`, `GET/PUT/DELETE /admin/pmb-programs/{pmb_program:uuid}`.
- Validation: `code` required on store (`alpha_dash` / lowercase slug-like); unique per school; `name` required; `is_active`, `sort_order` optional.
- Update: **forbid changing `code`** (ignore or 422 if sent differently).
- Soft delete; refuse delete (or soft-delete only) if fees still reference — prefer soft-delete + `is_active=false`; block hard dependency errors with clear ID message. Soft delete is enough; do not force cascade delete of fees.
- List/select helper: admin index + optional `?active=1` for fee form dropdown.
- Repository + `HasCache`; clear cache on CUD.

## Admin UI

- Nav group PMB: **Program PMB** near Biaya PMB (`/admin/pmb-programs`).
- List + form pages (Bahasa Indonesia), mobile-first; toggle aktif.
- Fee form Program select: options from active programs (`code` value / display `name`); submit `pmb_program_id`.
- Fee list/detail: show `program_name` (fallback code).

## Public / portal

- Portal payment step: jenjang then program options derived from **active fees** (unchanged flow); labels use `program_name` / master name when present.
- Draft/submit validation: keep accepting program **code** string on payload where already used; ensure codes come from fees tied to master.
- Payment snapshot continues to store `program` code (+ fee name); may also store `program_name` at submit time for LOA/email consistency (optional enhancement if snapshot already has fee_name).

## Jenjang

Out of scope for this master: jenjang remains enum (`kb`, `tk`, `sd` — KB already added separately). No `pmb_jenjangs` table in this spec.

## Out of scope

- Master Jenjang
- Changing PMB status / email flows
- Multi-school UI beyond existing `school_id` scoping
- Renaming historical payment snapshot codes

## Tests

- Backend: admin CRUD programs; cannot change code on update; fee create with `pmb_program_id`; unique fee per year+jenjang+program FK; inactive program excluded from active list used by fee form.
- Frontend: Zod schema accepts `pmb_program_id`; program label helper; fee form select wiring (smoke/unit as existing patterns).

## Success criteria

1. Admin can add a new program (e.g. “Tahfidz”) without deploy.
2. `/admin/pmb-fees/create` Program select shows active master programs only.
3. Existing Reguler/ICP fees keep working after migrate.
4. Renaming program label updates new UI; codes and uniqueness stay stable.
