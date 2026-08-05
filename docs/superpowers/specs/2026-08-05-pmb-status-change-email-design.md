# PMB Status Change Email — Design

**Date:** 2026-08-05  
**Status:** Approved

## Goal

When an admin changes a PMB registration status, automatically email the client (`parent_email`) with the new status and any admin note from the same update.

## Behavior

| Event                                 | Email                          |
| ------------------------------------- | ------------------------------ |
| Admin changes status (new ≠ previous) | Yes → `parent_email`           |
| Same update includes notes            | One email: status + note       |
| Notes-only update (status unchanged)  | No email (portal message only) |
| Pendaftar submit                      | Unchanged (`submitted`)        |
| Missing `parent_email`                | Skip + log `skipped`           |
| Same status transition again later    | Send again each transition     |

## Approach

Generic `status_changed` flow in `PmbEmailService`; keep dedicated accepted template when new status is `accepted`; other statuses use one shared blade.

## Out of scope

- Email on portal chat messages alone
- SMS / WhatsApp
- Changing Gmail OAuth setup
