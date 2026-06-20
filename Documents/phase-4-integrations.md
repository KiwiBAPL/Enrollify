# EnRollifyEdu Landing Page — Phase 4 Integrations

| Field | Details |
|-------|---------|
| Phase | 4 — Integrations (PRD §9.4) |
| Status | Complete |
| Date | 2026-06-20 |
| Linked PRD | [EnRollifyEdu-landing-page-prd.md](./EnRollifyEdu-landing-page-prd.md) |
| Prior phases | [phase-1-discovery.md](./phase-1-discovery.md), [phase-2-core-build.md](./phase-2-core-build.md), [phase-3-implementation.md](./phase-3-implementation.md) |

## 1. Purpose

Phase 4 finalises analytics event delivery, documents form notification setup, and adds basic client-side monitoring for form submission failures — without logging PII.

---

## 2. Analytics integration (finalised)

### 2.1 What changed from Phase 2 foundation

| Item | Location | Change |
|------|----------|--------|
| Script loading | [`src/lib/analytics/loadScript.ts`](../src/lib/analytics/loadScript.ts) | Async load with `onload`; events queued until ready |
| App bootstrap | [`src/main.tsx`](../src/main.tsx) | Waits for `initAnalytics()` before render |
| Error events | [`src/lib/analytics/events.ts`](../src/lib/analytics/events.ts) | `provider_contact_submit_error`, `student_interest_submit_error` |
| Debug mode | `VITE_ANALYTICS_DEBUG=true` | Logs events in production for smoke tests |

### 2.2 Event catalogue

| Event | When fired | FR |
|-------|------------|-----|
| `pageview` | After analytics ready, on page load | FR-7 |
| `provider_contact_submit` | Provider form POST succeeds | FR-4, FR-7 |
| `student_interest_submit` | Student form POST succeeds | FR-5, FR-7 |
| `provider_contact_submit_error` | Provider form POST fails | Phase 4 monitoring |
| `student_interest_submit_error` | Student form POST fails | Phase 4 monitoring |

No PII is sent in analytics payloads.

### 2.3 Provider dispatch

| Provider | Env vars | Dispatch |
|----------|----------|----------|
| **Plausible** | `VITE_ANALYTICS_PROVIDER=plausible`, `VITE_ANALYTICS_ID=<domain>` | `window.plausible(event)` |
| **GA4** | `VITE_ANALYTICS_PROVIDER=ga4`, `VITE_ANALYTICS_ID=G-XXXXXXXXXX` | `gtag('event', event, { event_category: 'engagement' })` |

### 2.4 Netlify setup (manual)

1. Site configuration → Environment variables → add `VITE_ANALYTICS_PROVIDER` and `VITE_ANALYTICS_ID`
2. Trigger a new deploy (env vars are baked in at build time)
3. Smoke test on production URL:
   - Load page → confirm `pageview` in Plausible realtime / GA4 DebugView
   - Submit provider form → confirm `provider_contact_submit`
   - Submit student form → confirm `student_interest_submit`
4. Optional: set `VITE_ANALYTICS_DEBUG=true` temporarily to see `[analytics]` logs in browser console

**Plausible:** Register custom events (`provider_contact_submit`, etc.) as Goals if using goal-based dashboards.

---

## 3. Form notification integration (finalised)

Notifications are configured in the **Netlify dashboard** — not in application code.

### 3.1 Checklist

| Step | Action | Status |
|------|--------|--------|
| 1 | Deploy latest `main` to Netlify | Manual |
| 2 | Site configuration → Forms → confirm `provider-contact` and `student-interest` appear | Manual |
| 3 | Form notifications → add email for `provider-contact` | Manual |
| 4 | Form notifications → add email for `student-interest` | Manual |
| 5 | Submit test entries on live site; confirm email received | Manual |

### 3.2 Recommended recipients

| Form | Recommended recipient | Source |
|------|----------------------|--------|
| `provider-contact` | `hello@enrollifyedu.com` | [`src/content/site.ts`](../src/content/site.ts) |
| `student-interest` | `hello@enrollifyedu.com` | Same (update when founders confirm) |

Documented in [`.env.example`](../.env.example) and [`netlify.toml`](../netlify.toml) comments.

---

## 4. Form error monitoring

### 4.1 Implementation

| Item | Location |
|------|----------|
| Error classification | [`src/lib/monitoring/formErrors.ts`](../src/lib/monitoring/formErrors.ts) |
| Hook integration | [`src/lib/forms/useFormSubmit.ts`](../src/lib/forms/useFormSubmit.ts) |

On submission failure:

1. Error is classified as `network`, `server`, or `unknown` (no field values logged)
2. Analytics error event is fired for the form type
3. Production console logs a generic message: `[EnRollifyEdu] Form submission failed (form-name, reason)`

### 4.2 Security

- No form field values in logs or analytics
- Error reasons are coarse-grained only
- Aligns with Phase 1 / Phase 2 security review

---

## 5. Verification checklist

| Check | How |
|-------|-----|
| Build | `npm run build` passes |
| Analytics queue | Pageview fires after script load on production |
| Success events | Form submit triggers conversion events |
| Error events | Block network in DevTools → submit → error event + generic log |
| Notifications | Live Netlify submit → email + Forms dashboard entry |

---

## 6. Phase 4 deliverables checklist

- [x] Analytics event queue and async script loading
- [x] GA4 and Plausible dispatch finalised
- [x] Form submission error analytics events
- [x] Form error monitoring module (no PII)
- [x] Notification integration documented with recipient checklist
- [x] `.env.example` and `netlify.toml` updated
- [x] This document
- [x] `npm run build` passes

---

## 7. Next steps (Phase 5)

1. Execute functional tests against PRD §5 acceptance criteria
2. Run accessibility scan (no critical violations)
3. Security validation (HTTPS, form data handling, logging review)
4. Regression checks after any fixes

Optional later: Cloudflare Turnstile on forms (deferred from Phase 4 scope).
