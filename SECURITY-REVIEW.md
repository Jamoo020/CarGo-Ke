# Security Review Snapshot

Read-only source review of the current worktree on 2026-11-19. This is a
configuration and code snapshot, not a penetration test; no files were changed
as part of the review itself.

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|----------|------|-------|---------------|------------|
| 1 | 🟠 HIGH | `src/routes/authRoutes.ts` | 8-11 | No rate limiting was found on public login or registration routes, enabling high-volume password guessing and account-creation abuse. | 9/10 |
| 2 | 🟠 HIGH | `src/routes/inspectionRoutes.ts`; `src/services/inspectionPhotoService.ts` | 12-30; 34-51 | Inspection photos are buffered in memory; client-supplied MIME metadata is trusted without magic-byte validation. Up to ten 10 MiB files can be accepted per request (up to 100 MiB). | 9/10 |
| 3 | 🟡 MEDIUM | `src/app.ts` | 19-31 | HTTP CORS allows any origin (`*`) while enabling credentials, with no HTTP origin allowlist. This is broad exposure, but is not itself an authentication bypass; protected routes require a bearer token. | 9/10 |
| 4 | 🟡 MEDIUM | `src/middleware/validateRequest.ts`; `src/controllers/authController.ts`; `src/services/authService.ts` | 4-27; 12-24, 34-52; 31-46 | Registration checks required values/types but no server-side email-format validation or password-length policy was found. | 9/10 |
| 5 | 🟡 MEDIUM | `frontend/src/lib/storage.ts`; `src/services/authService.ts` | 1-12; 72-77 | The frontend stores the bearer token in `localStorage`; issued JWTs expire after eight hours. Token theft through an XSS flaw would expose the token until expiry or invalidation. | 10/10 |
| 6 | ⚪ LOW | `src/controllers/authController.ts`; `src/routes/authRoutes.ts`; `src/services/adminService.ts` | 34-56; 8-11; 115-170 | Login success/failure audit events were not found, and no password-change handler was found. Admin account-status changes do have transactional audit logging. | 7/10 |

## Additional observations

- Socket.IO has a separate configured origin allowlist; production requires
  configured HTTPS origins. Its origin check permits requests without an
  `Origin` header.
- No rate-limiting implementation was found in the repository. The public
  payment webhook route is also not protected by authentication middleware;
  its request authenticity must therefore rely on the webhook-specific
  verification logic.
- The frontend clears its stored token if the startup `/me` request returns
  HTTP 401; no separate client-side expiry timer was found.

## Priorities

- **Most exploitable:** Missing throttling on login makes credential stuffing
  and online password guessing easier.
- **Easiest to fix:** Replace wildcard HTTP CORS with an explicit configured
  origin allowlist.
- **Hardest to fix:** Replacing localStorage bearer-token auth with HttpOnly
  cookies requires coordinated frontend/backend changes and CSRF protections.
- **Before launch:** Prioritize auth throttling, password policy, HTTP CORS
  restrictions, and upload content/aggregate protections. Add auth audit events
  as part of the launch security baseline.
- **Less severe than it may appear:** Wildcard CORS alone does not bypass
  authentication; protected API routes still require a bearer token. Socket.IO
  already has a distinct origin-allowlist configuration.
