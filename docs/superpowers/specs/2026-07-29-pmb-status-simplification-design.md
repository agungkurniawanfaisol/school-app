# PMB Status Simplification — 2026-07-29

## Goal

Ringkas status admin PMB dan batasi edit pendaftar hanya saat status **Perlu perbaikan**.

## Canonical statuses

| Status                  | Label               | Arti                                                          |
| ----------------------- | ------------------- | ------------------------------------------------------------- |
| `draft`                 | Draf                | Masih mengisi form                                            |
| `awaiting_verification` | Menunggu verifikasi | Sudah kirim; admin cek data/bayar; **tidak bisa diedit**      |
| `needs_revision`        | Perlu perbaikan     | Admin minta perbaikan; **pendaftar boleh edit & kirim ulang** |
| `accepted`              | Diterima            | Diterima; LoA bisa diterbitkan                                |
| `rejected`              | Ditolak             | Ditolak                                                       |

## Mapping dari status lama

- `awaiting_payment_review`, `submitted`, `review`, `pending`, `paid` → `awaiting_verification`
- (Admin set manual ke `needs_revision` bila minta perbaikan)

## Rules

- Autosave / correction draft: hanya `draft` atau `needs_revision`
- Submit correction: hanya dari `needs_revision` → kembali ke `awaiting_verification`
- Tolak pembayaran: set `needs_revision` (bukan draft) agar pendaftar bisa perbaiki bukti
- Verifikasi pembayaran: tetap / set `awaiting_verification`

## UX info

- API mengembalikan `status_label` + `status_description`
- Admin select menampilkan deskripsi status
- Portal timeline & detail menampilkan penjelasan status aktif
