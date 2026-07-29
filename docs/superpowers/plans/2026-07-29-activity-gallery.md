# Kegiatan Cover + Gallery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or implement tasks directly with TDD).

**Goal:** Cover upload + multi-photo gallery for student activities, matching facilities, with OWASP controls from the approved spec.

**Spec:** `docs/superpowers/specs/2026-07-29-activity-gallery-design.md`

## File map

| File                                                                         | Role                                      |
| ---------------------------------------------------------------------------- | ----------------------------------------- |
| `backend/database/migrations/*_create_student_activity_photos_table.php`     | Gallery table                             |
| `backend/app/Models/StudentActivityPhoto.php`                                | Model + uuid boot                         |
| `backend/app/Models/StudentActivity.php`                                     | `photos()` relation                       |
| `backend/app/Http/Controllers/Admin/Concerns/SyncsStudentActivityPhotos.php` | Scoped sync                               |
| `backend/app/Http/Controllers/Admin/StudentActivityController.php`           | Sync on store/update; load photos         |
| `backend/app/Http/Requests/StudentActivity/*`                                | photos validation + SafeMediaUrl + max:24 |
| `backend/app/Http/Resources/V1/StudentActivityPhotoResource.php`             | Photo JSON                                |
| `backend/app/Http/Resources/V1/StudentActivityResource.php`                  | Include photos                            |
| `backend/app/Repositories/StudentActivityRepository.php`                     | `defaultWith` photos                      |
| `backend/database/factories/StudentActivityPhotoFactory.php`                 | Factory                                   |
| `backend/tests/Feature/{Admin,Api}/StudentActivity*Test.php`                 | Security + CRUD tests                     |
| `frontend/src/schemas/activity.ts`                                           | photos Zod                                |
| `frontend/src/types/index.ts`                                                | types                                     |
| `frontend/src/components/admin/ActivityPhotoGalleryEditor.tsx`               | Multi upload UI                           |
| `frontend/src/pages/admin/ActivityFormPage.tsx`                              | Cover + gallery                           |
| `frontend/src/pages/activities/ActivityDetailPage.tsx`                       | Hero + gallery                            |
| Locales `admin.json`                                                         | Gallery copy                              |

## Tasks

### Task 1: Migration + model + failing admin photo sync test

### Task 2: Sync trait + Form Request + Resource + repository

### Task 3: Public API tests + resource photos

### Task 4: Frontend schema/types + gallery editor + form

### Task 5: Public detail gallery UI + Vitest

### Task 6: `make test-backend` / `make test-frontend` (affected suites)
