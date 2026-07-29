# PMB Wizard UX Redesign — Design Spec

**Date:** 2026-07-28  
**Status:** Approved for implementation

## Summary

Redesign `/pmb/daftar` into a 5-step wizard: Login → Data Diri → Data Orang Tua → Pembayaran → Ringkasan. Extended fields stored in `draft_payload`; registration identity (UUID, No. Registrasi, barcode) shown after first draft save.

## Stepper

| Step | Label          | Content                                      |
| ---- | -------------- | -------------------------------------------- |
| 0    | Masuk          | Email/password + Google OAuth                |
| 1    | Data Diri      | Student biodata + registration identity card |
| 2    | Data Orang Tua | Father/mother names, phones, emails          |
| 3    | Pembayaran     | Transfer notice, bank info, proof upload     |
| 4    | Ringkasan      | Review + submit                              |

## Data Diri fields

- UUID, No. Registrasi, barcode (after draft exists)
- Nama Lengkap → `student_name`
- Nama Panggilan → `draft_payload.nickname`
- Alamat → `address`
- Handphone (+62) → `draft_payload.contact_phone`
- Tempat/Tanggal Lahir → `birth_place`, `birth_date`
- Hubungan dengan Anak → `draft_payload.relationship_to_child`
- Anak ke / Dari saudara ke → `draft_payload.child_order`, `sibling_count`
- Pada Ajaran → `draft_payload.academic_year` (auto, read-only)

## Data Orang Tua fields

- Nama Ayah/Ibu, HP Ayah/Ibu (+62), Email Aktif 1/2
- Sync `parent_name` / `parent_phone` from father (fallback mother) for admin compatibility

## Pembayaran

- Notice: transfer amount, include registration number in transfer note, upload proof
- Settings: `pmb_fee`, `pmb_bank_name`, `pmb_account_number`, `pmb_account_holder`
- Barcode: CODE128 of `registration_number`
- Checkbox transfer confirmation required before submit

## Technical

- No new DB columns; `draft_payload` JSON for extended fields
- `jsbarcode` for barcode rendering
- Mobile-first stepper, brand green tokens
