# EnRollifyEdu Landing Page — Phase 2 Core Build

| Field | Details |
|-------|---------|
| Phase | 2 — Core build (PRD §9.2) |
| Status | Complete |
| Date | 2026-06-20 |
| Linked PRD | [EnRollifyEdu-landing-page-prd.md](./EnRollifyEdu-landing-page-prd.md) |
| Prior phase | [phase-1-discovery.md](./phase-1-discovery.md) |

## 1. Purpose

Phase 2 wires form submissions to Netlify Forms, adds client-side validation and submission states, documents email notification setup, and establishes a dual-provider analytics foundation (Plausible + GA4).

---

## 2. What was implemented

### 2.1 Netlify Forms (SPA pattern)

| Item | Location |
|------|----------|
| Build-time form detection | Hidden forms in [`index.html`](../index.html) |
| Client POST handler | [`src/lib/forms/submitNetlifyForm.ts`](../src/lib/forms/submitNetlifyForm.ts) |
| Form submit hook | [`src/lib/forms/useFormSubmit.ts`](../src/lib/forms/useFormSubmit.ts) |
| Provider form UI | [`src/components/forms/ProviderContactForm.tsx`](../src/components/forms/ProviderContactForm.tsx) |
| Student form UI | [`src/components/forms/StudentInterestForm.tsx`](../src/components/forms/StudentInterestForm.tsx) |
| Shared field UI | [`src/components/forms/FormField.tsx`](../src/components/forms/FormField.tsx) |

**Flow:** User submits → client validation → `fetch('/', POST, urlencoded)` → Netlify Forms stores entry → optional email notification (dashboard) → success UI + analytics event.

### 2.2 Validation

| Form | Module |
|------|--------|
| Provider contact | [`src/lib/validation/providerContact.ts`](../src/lib/validation/providerContact.ts) |
| Student interest | [`src/lib/validation/studentInterest.ts`](../src/lib/validation/studentInterest.ts) |
| Email format | [`src/lib/validation/email.ts`](../src/lib/validation/email.ts) |

Inline errors appear under each field; submission is blocked until valid (FR-4, FR-5).

### 2.3 Analytics foundation

| Item | Location |
|------|----------|
| Event constants | [`src/lib/analytics/events.ts`](../src/lib/analytics/events.ts) |
| Script loading (Plausible + GA4) | [`src/lib/analytics/loadScript.ts`](../src/lib/analytics/loadScript.ts) |
| Public API | [`src/lib/analytics.ts`](../src/lib/analytics.ts) |

**Events:**

| Event name | Trigger |
|------------|---------|
| `pageview` | Page load ([`src/App.tsx`](../src/App.tsx)) |
| `provider_contact_submit` | Successful provider form POST |
| `student_interest_submit` | Successful student form POST |

**Env vars** (see [`.env.example`](../.env.example)):

```env
VITE_ANALYTICS_PROVIDER=plausible   # or ga4
VITE_ANALYTICS_ID=your-domain-or-measurement-id
```

- **Plausible:** loads `plausible.io/js/script.js` with `data-domain`
- **GA4:** loads gtag with `send_page_view: false` (manual pageview event)
- **Dev / unset env:** console info only — no script injection, no PII logged

Phase 4 will finalise production verification and monitoring.

---

## 3. Netlify notification setup (manual)

Form notifications are configured in the **Netlify dashboard**, not in repo code.

### Checklist

1. **Connect repo** — Link `KiwiBAPL/Enrollify` to a Netlify site (if not already).
2. **Deploy** — Push to `main`; confirm build uses `npm run build` and publish `dist`.
3. **Verify forms registered** — After deploy, open **Site configuration → Forms**. Both `provider-contact` and `student-interest` should appear (parsed from built `index.html`).
4. **Email notifications** — **Forms → Form notifications → Add notification**:
   - Form: `provider-contact` → Email to team (e.g. `hello@enrollifyedu.com`)
   - Form: `student-interest` → Email to team (same or separate recipient)
5. **Environment variables** — Add `VITE_ANALYTICS_PROVIDER` and `VITE_ANALYTICS_ID` when ready (Site configuration → Environment variables).
6. **Smoke test** — Submit both forms on the live Netlify URL; confirm entries in Forms tab and notification email received.

---

## 4. Local testing

| Method | Forms work? | Notes |
|--------|-------------|-------|
| `npm run dev` (Vite) | No | Validation and UI work; POST to `/` fails (no Netlify handler) |
| `npm run netlify:dev` | Yes | Requires [Netlify CLI](https://docs.netlify.com/cli/get-started/) linked to site |
| Deploy preview / production | Yes | Full end-to-end test |

Install Netlify CLI globally if needed: `npm install -g netlify-cli`, then `netlify link` in project root.

---

## 5. Security notes (unchanged from Phase 1)

- Form POST over HTTPS on Netlify
- Honeypot field on both forms
- No PII in analytics payloads or production console logs
- Notification/API secrets stay off `VITE_*` env vars

---

## 6. Phase 2 deliverables checklist

- [x] Hidden static Netlify forms in `index.html`
- [x] `submitNetlifyForm` + `useFormSubmit` hook
- [x] Validation modules with inline errors
- [x] Provider and student forms wired with success/error states
- [x] Analytics events module with Plausible + GA4 support
- [x] `.env.example` and `netlify:dev` script
- [x] This document
- [x] `npm run build` passes

---

## 7. Next steps (Phase 3)

Completed — see [phase-3-implementation.md](./phase-3-implementation.md).

**Phase 4:** Finalise analytics in production, confirm Netlify notification recipients, optional Turnstile spam protection.
