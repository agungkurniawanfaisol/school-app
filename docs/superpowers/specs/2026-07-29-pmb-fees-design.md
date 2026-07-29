# PMB Fees per Academic Year

**Date:** 2026-07-29  
**Status:** Approved

## Summary

Manage registration fee amounts as numeric records tied to academic years, with add/edit/delete and one active fee per school. Portal displays the active fee formatted as Rupiah.

## Data

`pmb_fees`: uuid, school_id, academic_year_id (unique per school+year), amount (unsigned int IDR), notes nullable, is_active, timestamps, softDeletes.

Activating one fee deactivates others for the same school. One fee row per academic year (update amount for revisions; soft-delete for history removal).

## API

- Admin CRUD `/api/admin/pmb-fees` (+ activate via is_active on store/update)
- Public: active fee via settings override or `GET /api/v1/pmb/fees/active`

## Frontend

Admin list/form under PMB menu. Portal wizard/info uses active fee amount formatted.
