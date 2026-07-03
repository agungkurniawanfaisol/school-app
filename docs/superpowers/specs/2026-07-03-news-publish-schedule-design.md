# News Publish Schedule — Design Spec

**Date:** 2026-07-03  
**Status:** Approved

## Goal

Admin berita: CRUD lengkap dengan publish/unpublish dan **jendela waktu tampil** (mulai–akhir). Berita otomatis tidak tampil di publik setelah tanggal akhir.

## Data Model

- `published_at` — waktu mulai tampil
- `publish_ends_at` — waktu akhir tampil (nullable = tanpa akhir)
- `status` — `draft` | `published` | `archived`

## Display Status (computed, admin UI)

| Status | Rule |
|--------|------|
| `draft` | `status = draft` |
| `scheduled` | `published` & `published_at > now()` |
| `live` | `published` & started & not ended |
| `ended` | `published` & `publish_ends_at <= now()` |
| `archived` | `status = archived` |

## Public Visibility

`status = published`, `is_active`, `published_at <= now()`, and (`publish_ends_at` null OR `publish_ends_at > now()`).

## API

- `PATCH /admin/news/{uuid}/publish` body: `{ published_at?, publish_ends_at? }`
- `PATCH /admin/news/{uuid}/unpublish` clears schedule fields
- Admin list filter: `display_status`

## UI

- Radix Dialog for publish schedule (datetime-local, Bahasa Indonesia)
- List badges + filter chips
- Form sidebar schedule section
