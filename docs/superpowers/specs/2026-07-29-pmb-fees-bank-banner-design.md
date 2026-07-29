# PMB Fees List — Bank Banner + Delete Active

**Date:** 2026-07-29  
**Status:** Approved

## Changes

1. **Banner** on `/admin/pmb-fees`: Bank, No. Rekening, Atas nama from settings (`pmb_bank_*`). Empty → warning + link to Settings.
2. **Delete** always shown. Active fees may be soft-deleted (remove previous block). Confirm dialog warns when deleting the active fee.
3. Bank stays in settings only — not columns on `pmb_fees`.

## Security

- Delete remains admin/pmb-admin only (existing middleware).
- SoftDeletes only; no hard delete.
- Settings read via existing admin/settings or public pmb settings scoped to school.
