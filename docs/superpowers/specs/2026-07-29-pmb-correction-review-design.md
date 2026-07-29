# PMB Correction While Status = review

**Approved:** 2026-07-29

- Status `review`: pendaftar may edit data + re-upload payment proof via `/pmb/daftar`.
- `PATCH registration` (draft save) allowed for `review` (autosave).
- `POST registration/correction` full validation; status stays `review`; event `correction_submitted`.
- Other submitted statuses remain read-only.
