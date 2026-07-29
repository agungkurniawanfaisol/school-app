# PMB Accepted Celebration + LoA + Registration Form Print

**Date:** 2026-07-29  
**Status:** Approved for implementation

## Summary

When a pendaftar registration reaches `accepted`, the portal detail page shows a celebration banner, a printable **Surat Penerimaan (LoA)**, and a printable **formulir pendaftaran** styled like `docs/presentations/Output.pdf`. Documents are generated in the browser (HTML + `window.print` / Save as PDF). Barcode is CODE128 of `registration_number` via `jsbarcode`.

## Decisions

| Topic           | Choice                                                                               |
| --------------- | ------------------------------------------------------------------------------------ |
| Scope           | Celebration + LoA letter + registration form (both documents)                        |
| PDF generation  | Frontend only — no DomPDF / `loa_media_id` file store in v1                          |
| LoA unlock      | `status === 'accepted'` (admin “Terbitkan LoA” still sets `loa_issued_at` for audit) |
| Barcode         | CODE128 `registration_number`                                                        |
| Visual language | Logo header, soft watermark, label:value rows, Sidoarjo date, dual signature columns |

## UX

1. **Celebration** — one-shot confetti (CSS) + hero “Selamat … diterima” per registration UUID (`localStorage`). CTA scrolls to `#loa`. Respect `prefers-reduced-motion`.
2. **LoA** — formal acceptance letter; Cetak / Unduh PDF.
3. **Formulir** — full registration form matching Output.pdf layout; Cetak / Unduh PDF.
4. **Print** — `@media print` shows only the active `.pmb-print-root[data-print-active="true"]`.

## Out of scope

- Server-side PDF stored in media
- Email LoA
- Public barcode verification API
