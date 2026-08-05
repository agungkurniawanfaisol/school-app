# PMB Status Change Email — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or implement directly with TDD). Spec: `docs/superpowers/specs/2026-08-05-pmb-status-change-email-design.md`

**Goal:** Email `parent_email` on every admin status change, including optional admin note.

**Tech:** Laravel Mail + existing `SendPmbEmailJob` / `PmbEmailService` / Gmail transport.

## Files

| File                                                       | Change                                              |
| ---------------------------------------------------------- | --------------------------------------------------- |
| `app/Models/PmbEmailLog.php`                               | Add `TYPE_STATUS_CHANGED`                           |
| `app/Services/PmbEmailService.php`                         | `queueStatusChanged()`; accepted no longer one-shot |
| `app/Mail/Pmb/PmbRegistrationStatusChangedMail.php`        | New mailable                                        |
| `resources/views/mail/pmb/status_changed.blade.php`        | New view                                            |
| `app/Mail/Pmb/PmbRegistrationAcceptedMail.php`             | Optional admin note                                 |
| `resources/views/mail/pmb/accepted.blade.php`              | Show note if present                                |
| `app/Jobs/SendPmbEmailJob.php`                             | Handle `status_changed`                             |
| `app/Http/Controllers/Admin/PmbRegistrationController.php` | Call on any status change                           |
| `tests/Feature/Admin/PmbEmailTest.php`                     | Extend coverage                                     |

## Tasks

### Task 1: Failing tests for status-change emails

Extend `PmbEmailTest`: needs_revision sends mail + note; rejected sends; accepted still sends and can send again; notes-only does not send status email.

### Task 2: Service + mailable + job

Implement `queueStatusChanged`, type constant, mailable/view, job match, enhance accepted mail with note from `log->body`.

### Task 3: Controller wire-up

Replace accepted-only block with status-change call passing note when present.

### Task 4: Verify

`docker compose exec backend php artisan test --filter=PmbEmailTest`
