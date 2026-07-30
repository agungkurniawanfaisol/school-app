# PMB Email — Laravel Mail (SMTP Gmail)

**Date:** 2026-07-29  
**Status:** Implemented

## Summary

Email PMB murni Laravel: otomatis saat submit & diterima ke `parent_email`, plus kirim manual (1/N) dan broadcast dari admin. Async via `database` queue + `SendPmbEmailJob`. Log di `pmb_email_logs`.

## Decisions

| Topic         | Choice                                                     |
| ------------- | ---------------------------------------------------------- |
| Transport     | Laravel Mail + SMTP Gmail (App Password)                   |
| Penerima      | `parent_email` saja                                        |
| Queue         | `QUEUE_CONNECTION=database` + `queue:work`                 |
| Idempotency   | Email `accepted` hanya sekali per registration             |
| Personalisasi | `{student_name}`, `{registration_number}`, `{parent_name}` |

## Triggers

- Portal `submit` → `PmbRegistrationSubmittedMail`
- Admin status → `accepted` → `PmbRegistrationAcceptedMail`
- `POST /api/admin/pmb-emails/send` → custom ke UUID terpilih
- `POST /api/admin/pmb-emails/broadcast` → custom + filter status

## Admin UI

- Detail pendaftaran: panel "Kirim email"
- Daftar PMB: checkbox multi-select + Broadcast modal

## Out of scope v1

- Halaman log email admin
- Lampiran email
- `email_secondary` sebagai penerima

## Transport (updated)

Default production transport: **Gmail API OAuth2** (`MAIL_MAILER=gmail`) via `google/apiclient`.
Admin connects once at Settings → Hubungkan Gmail. Refresh token stored encrypted in
`storage/app/private/gmail-oauth.json` (or `GOOGLE_GMAIL_REFRESH_TOKEN` in `.env`).
