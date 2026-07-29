# PMB Pendaftar Portal — Design Spec

**Date:** 2026-07-28  
**Status:** Approved for implementation

## Summary

Authenticated PMB applicant portal: Google auto-creates `pendaftar` users; draftable wizard (data → manual transfer proof → submit); timeline with Admin PMB review messaging; LoA shell after acceptance.

## Locked decisions

| Topic     | Choice                                             |
| --------- | -------------------------------------------------- |
| Payment   | Manual transfer + bukti upload; Admin PMB verifies |
| Wizard    | Google → data → transfer → submit                  |
| Draft     | Autosave + resume                                  |
| Admin PMB | PMB module only                                    |
| Google    | Auto-create `pendaftar` for new emails             |
| LoA       | Fields + UI shell; template later                  |
| Visual    | Existing Nurul Hikmah brand tokens                 |

## Roles

- `admin` — full CMS + PMB override
- `guru` — profile only
- `admin_pmb` — PMB only
- `pendaftar` — applicant portal only

## Status pipeline

`draft` → `awaiting_payment_review` → `submitted` → `review` → `accepted` | `rejected`

## Data

- `pmb_registrations`: uuid, user*id, draft_payload, current_step, payment_info, loa*\*
- `pmb_registration_messages`, `pmb_registration_events`

## Out of scope

Payment gateway, LoA PDF template art, guest anonymous registration.
