---
name: security-audit
description: OWASP security audit workflow for Nurul Hikmah School App — access control, SQL injection, XSS, auth, and Laravel Sanctum. Use when adding auth endpoints, public POST routes, file uploads, admin CRUD, or when the user asks for security review or OWASP compliance.
---

# Security Audit — Nurul Hikmah

## Skills to load

| Skill | Use for |
|-------|---------|
| `owasp-security-check` | OWASP Top 10 checklist |
| `laravel-security` | Laravel-specific patterns |
| `laravel-security-audit` | Laravel route/model audit |
| Global `owasp-security` | Deep reference (injection, XSS, SSRF) |

## Rules (always enforced)

- `.cursor/rules/owasp-security.mdc`
- `.cursor/rules/injection-prevention.mdc`

## Audit workflow

```
Security audit progress:
- [ ] 1. Route map — public vs admin vs auth
- [ ] 2. Access control — middleware on every admin route
- [ ] 3. Injection — Form Requests + Eloquent only
- [ ] 4. IDOR — school_id / ownership in repository queries
- [ ] 5. Auth — throttle login, generic errors, token revoke
- [ ] 6. XSS — API Resources, no unsafe HTML render in React
- [ ] 7. Uploads — validation, storage path, no direct execution
- [ ] 8. Config — APP_DEBUG, CORS, secrets not in code
```

### 1. Route map

| Prefix | Auth | Writes allowed |
|--------|------|----------------|
| `/api/v1/*` GET | None | No |
| `/api/v1/pmb/registrations` POST | None | Yes — throttle + validate |
| `/api/admin/*` | Sanctum + admin | Yes |

### 2. Access control checks

```php
// Admin group must have BOTH:
Route::middleware(['auth:sanctum', EnsureUserIsAdmin::class])
```

- New admin resource → inside this group only.
- `EnsureUserIsAdmin`: `isAdmin()` AND `is_active`.

### 3. Injection checks

- [ ] Every `store`/`update` uses dedicated Form Request
- [ ] No `$request->all()` in controllers
- [ ] Repository search uses `searchableColumns()` whitelist
- [ ] Frontend Zod schemas match backend rules

### 4. IDOR checks

- Admin updates: verify record belongs to allowed scope before `update()`/`delete()`.
- Public track token (`pmb/track/{token}`): token must be unguessable (UUID/random).

### 5. Auth checks

- Login route: `throttle:5,1`
- Password: `Hash::check()` only; min 8 chars in `LoginRequest`
- Logout: `$request->user()->currentAccessToken()->delete()`

### 6. XSS checks (React)

- Default: React escapes text — use for all user content.
- Rich HTML (news content): sanitize server-side before store OR use DOMPurify on render.
- Never `dangerouslySetInnerHTML` without sanitization.

### 7. File upload checks

- Validate mime/size in Form Request
- Store in `storage/app/` — serve via `/storage` or controlled controller
- Randomize filenames — no user-controlled paths

## Report format

```markdown
## Security audit — [feature]

### Critical (fix before merge)
- ...

### Warning
- ...

### Passed
- ...
```
