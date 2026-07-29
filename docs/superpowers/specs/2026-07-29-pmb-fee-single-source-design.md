# Single PMB Fee Editor

**Date:** 2026-07-29  
**Status:** Approved / implemented

## Problem

Admins saw registration fee amount in both **Settings** (`pmb_fee`) and **PMB Fees** (`pmb_fees`).

## Decision

- Canonical editor: `/admin/pmb-fees` only
- Hide `pmb_fee` from Settings UI
- Show callout on Settings → PMB linking to fees page
- Keep backend sync of active fee → `pmb_fee` setting for portal fallback (not admin-edited)
