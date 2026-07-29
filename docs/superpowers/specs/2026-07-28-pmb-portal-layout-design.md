# PMB Portal Layout — Design Spec

**Date:** 2026-07-28  
**Status:** Approved for implementation

## Summary

Dedicated authenticated portal shell for PMB applicants (`pendaftar`): sidebar navigation + status pipeline timeline on `/pmb/daftar` and `/pmb/portal/*`, replacing the public site chrome.

## Locked decisions

| Topic          | Choice                                                                       |
| -------------- | ---------------------------------------------------------------------------- |
| Scope          | Full portal: wizard + dashboard share `PmbPortalLayout`                      |
| Shell          | Sidebar (desktop) + sheet drawer (mobile), no public Header/Footer           |
| Timeline       | Status pipeline in sidebar, distinct from wizard form stepper                |
| Auth           | Guest allowed on `/pmb/daftar` login step; detail routes require `pendaftar` |
| OAuth callback | No layout (`/pmb/daftar/oauth`)                                              |
| Redirect       | Non-draft registration → portal detail; draft → wizard                       |

## Status pipeline

`draft` → `awaiting_payment_review` → `submitted` → `review` → `accepted` | `rejected`

## Navigation

- Masuk & Daftar / Lanjutkan pendaftaran → `/pmb/daftar`
- Status & Timeline → `/pmb/portal/pendaftaran/:uuid`
- Pesan → `#pesan` on detail page (when reviewable)
- Surat Penerimaan → `#loa` (when `accepted`)
- Info PMB → `/pmb` (public, leaves layout)
- Keluar → logout

## Out of scope

- LoA PDF download implementation
- New backend endpoints
- Reusing `AdminLayout` / `admin-nav` for pendaftar
