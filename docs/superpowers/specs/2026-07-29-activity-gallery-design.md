# Kegiatan Cover + Gallery Photos — Design

**Date:** 2026-07-29  
**Status:** Approved (option A + security hard requirements)

## Goal

Student activities (kegiatan) support:

1. **Cover** (`thumbnail`) via secure file upload (not raw URL-only UX)
2. **Gallery** of multiple photos (upload >1 files), shown on public detail

Mirror the existing **Facility** pattern.

## Data model

Table `student_activity_photos`:

| Column              | Notes                               |
| ------------------- | ----------------------------------- |
| id                  | PK                                  |
| uuid                | unique, public-safe if ever needed  |
| student_activity_id | FK indexed                          |
| path                | string(500) — storage URL/path only |
| caption             | string(250) nullable                |
| order               | unsigned int                        |
| is_active           | boolean default true                |
| timestamps          |                                     |
| softDeletes         |                                     |

Indexes: `(student_activity_id, order)`, `(student_activity_id, is_active)`.

`StudentActivity::photos()` hasMany ordered by `order`.

## API / sync

- Nested `photos[]` on admin store/update (same shape as facilities).
- Sync trait scoped to parent: `$activity->photos()->find($id)` — **no cross-activity IDOR**.
- Public GET includes `photos` (active only, ordered).
- Admin show loads all photos for editing.

## Admin UI

- Cover: `AdminImageField` / `useMediaUpload('student-activities')`
- Gallery: multi-file editor (accept jpeg/png/webp), caption, remove, order
- Zod validates photos array before submit

## Public UI

- Hero = `thumbnail` else first gallery photo
- Gallery strip below hero when `photos.length > 0`
- Captions as text (React escape — no HTML)

## Security (non-negotiable)

| Threat                 | Control                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Unauth upload / write  | Admin routes only: `auth:sanctum` + `EnsureUserIsAdmin`                                                             |
| Public writes          | Public API remains GET-only for activities                                                                          |
| Malicious file         | Existing media upload: mime whitelist (jpeg/png/webp), size max, store outside executable web root via Laravel disk |
| SSRF / bad URL in path | `SafeMediaUrl` on `thumbnail` and `photos.*.path`                                                                   |
| Mass assignment        | `$fillable` only; Form Request `validated()` only                                                                   |
| IDOR on photo id       | Update/delete only via `$activity->photos()` relation                                                               |
| DoS large payload      | `photos` max **24**; caption max 250; path max 500                                                                  |
| XSS caption            | React text nodes; no `dangerouslySetInnerHTML` for captions                                                         |
| Enumeration            | Detail routes stay UUID-based                                                                                       |

## Out of scope

- Drag-and-drop reorder polish (order = array index on save is enough)
- Separate CRUD endpoints for individual photos (nested sync only)
- Migrating inline BlockNote images into gallery

## Testing

- Feature: admin create/update syncs photos; guest cannot POST; SafeMediaUrl rejects bad paths; public show returns photos
- Vitest: gallery editor multi-add; detail renders gallery when photos present
