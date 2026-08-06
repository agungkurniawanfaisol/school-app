# PMB Payment Proof Download — Design

**Date:** 2026-08-06  
**Status:** Approved

## Goal

Admin can download bukti transfer from registration **detail** and **list** rows that have proof.

## Approach

Signed media URL with `?download=1` → `Content-Disposition: attachment`. Reuse `PmbMediaUrl` / portal media route.

## UI

- Detail: button **Unduh bukti** under payment proof preview
- List: download icon per row when `proof_url` present

## Out of scope

- Bulk download zip
- Changing jenjang KB/TK/SD options
