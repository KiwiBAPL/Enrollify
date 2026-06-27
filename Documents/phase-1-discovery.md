# EnRollifyEdu Landing Page — Phase 1 Discovery

| Field | Details |
|-------|---------|
| Phase | 1 — Discovery and setup (PRD §9.1) |
| Status | Complete |
| Date | 2026-06-20 |
| Linked PRD | [EnRollifyEdu-landing-page-prd.md](./EnRollifyEdu-landing-page-prd.md) |
| Design reference | [design.json](../design.json) |

## 1. Purpose

Phase 1 establishes project structure, hosting approach, content outline, data-handling strategy, and an initial security review before form backends and full section polish (Phases 2–3).

---

## 2. Stack and scope decisions

### 2.1 Confirmed stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Vite + React 19** | Landing page at `/`; React Router 7 added in Phase 6 for blog and contact |
| Language | **TypeScript** | Strict mode enabled |
| Styling | **Tailwind CSS v4** + CSS vars from `design.json` | Theme mapped in `tailwind.config.ts` |
| Routing | **React Router DOM 7** | `/`, `/contact`, `/blog`, `/blog/:slug`, `/enrollify-manage/*` (Phase 6) |
| Database | **Supabase** (Postgres + Auth + Storage) | Blog posts + admin auth; publishable key + RLS (Phase 6) |
| Hosting | **Netlify** | HTTPS by default; SPA fallback; blog edge function |

### 2.2 Deviation from PRD

The PRD (§3.1, NFR-4) specifies **Next.js**. The team confirmed keeping **Vite SPA on Netlify** instead.

**Rationale:** Single scrollable page with anchor navigation does not require Next.js routing or SSR. Form handling will use Netlify Forms (Phase 2) or Netlify Functions instead of Next.js API routes.

**Risk:** Low for v1 landing scope. Phase 6 added React Router for blog and contact routes — see [phase-6-blog.md](./phase-6-blog.md).

---

## 3. Routing, hosting, and deployment

### 3.1 Routing model (landing page — Phase 1)

Single scrollable landing page at `/` with in-page anchor navigation:

| Section | Anchor ID | PRD |
|---------|-----------|-----|
| Hero | `#hero` | FR-1 |
| Who we're for | `#who-were-for` | Scope §3.1 |
| How it works | `#how-it-works` | FR-2 |
| Benefits | `#benefits` | FR-3 |
| Supporting content | `#supporting` | Scope §3.1 |
| Provider contact | `#provider-contact` | FR-4 (primary CTA) |
| Student interest | `#student-interest` | FR-5 (secondary) |

Primary hero CTA scrolls to `#provider-contact` (FR-1 acceptance criteria).

**Post-v1 (Phase 6):** Additional SPA routes — `/contact`, `/blog`, `/blog/:slug`, and hidden admin at `/enrollify-manage/*`. Documented in [phase-6-blog.md](./phase-6-blog.md).

### 3.2 Netlify configuration

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA redirect:** `/* → /index.html` (200) — see `netlify.toml`
- **Environment variables:** Server-side only on Netlify dashboard for notification recipients; public analytics IDs may use `VITE_*` prefix (see `.env.example`)

### 3.3 Deployment flow

```text
Git push → Netlify build (tsc + vite build) → dist/ published → HTTPS CDN
```

Phase 6 will add smoke tests and monitoring before directing traffic.

---

## 4. Content outline and messaging

The EnRollifyEdu **brief artefact is not in the repository**. Copy below is derived from the PRD and marked **draft — pending founder review**.

### 4.1 Tone and hierarchy

- **Provider-first:** Primary CTA, nav emphasis, and hero copy target education provider decision-makers.
- **Student-secondary:** Register-interest section uses secondary button styling and appears before the footer.
- **Tone:** Clear, confident, concise.

### 4.2 Section narrative

| # | Section | Draft messaging | Status |
|---|---------|-----------------|--------|
| 1 | **Hero** | Technology-enabled international student recruitment for NZ/global providers. Better-qualified students, lower costs, smoother admissions. CTA: “Contact us”. | Draft |
| 2 | **Who we're for** | Primary: provider decision-makers (international recruitment, marketing, admissions). Secondary: international students researching NZ study. | Draft |
| 3 | **How it works** | Five steps: Attraction → Qualification → Assessment → Review → Delivery. | Draft |
| 4 | **Benefits** | (1) Better-qualified students, (2) Lower recruitment costs, (3) Smoother admissions workflows. | Draft |
| 5 | **Supporting content** | Differentiation vs generic agents/lead generators; end-to-end process emphasis. | Draft |
| 6 | **Provider contact** | Primary conversion — organisation, role, email, needs description. | Draft |
| 7 | **Student register interest** | Lightweight form before footer; secondary visual weight. | Draft |
| 8 | **Footer** | Contact email, privacy link placeholder, copyright. | Draft |

Copy modules live in `src/content/site.ts` for easy updates without refactoring components.

### 4.3 Missing assets

| Asset | Status | Interim approach |
|-------|--------|------------------|
| EnRollifyEdu logo | Not supplied | Text wordmark “EnRollifyEdu” using brand tokens |
| EnRollifyEdu brief | Not in repo | PRD-derived draft copy; founder review required |
| Design mocks | Not available | `design.json` + existing hero visual pattern |

---

## 5. Data handling approach

Implementation deferred to **Phase 2**. This section records the agreed direction.

### 5.1 Recommended approach: Netlify Forms (Option A)

| Aspect | Detail |
|--------|--------|
| Mechanism | HTML forms with `data-netlify="true"` and `netlify-honeypot` |
| Notifications | Netlify email notifications to EnRollify team |
| Storage | Netlify Forms dashboard; retention per Netlify policy |
| HTTPS | Enforced by Netlify on submit |
| Complexity | Low — no custom backend for v1 |

**Alternative (Option B):** Netlify Functions + email API (e.g. Resend) if custom validation, logging, or CRM forwarding is required later. Reserved folder: `netlify/functions/`.

### 5.2 Provisional form fields

#### Provider contact (`provider-contact`)

| Field | Required | Notes |
|-------|----------|-------|
| Organisation name | Yes | |
| Your name | Yes | |
| Role / title | Yes | |
| Work email | Yes | Email validation |
| Phone | No | |
| Country / region | Yes | |
| Brief description of needs | Yes | Textarea |
| Consent checkbox | Yes | Privacy acknowledgement |
| Honeypot (`bot-field`) | — | Spam protection |

#### Student register interest (`student-interest`)

| Field | Required | Notes |
|-------|----------|-------|
| Full name | Yes | |
| Email | Yes | |
| Country of residence | Yes | |
| Level of study interest | Yes | Select: UG, PG, pathway, other |
| Area of study | No | Free text |
| Consent checkbox | Yes | |
| Honeypot (`bot-field`) | — | Spam protection |

**Action:** Product/design to confirm field lists before Phase 2 wiring.

### 5.3 Retention and operations

- Submissions emailed to EnRollify team for **manual follow-up** (PRD §3.3 assumption).
- No public database in v1.
- Privacy policy URL and retention period to be finalised with legal/founders before launch.

### 5.4 Phase 2 integration plan

1. Add hidden static form definitions to `index.html` (Netlify build-time form detection).
2. Wire client-side submit handlers with success/error states and inline validation.
3. Configure Netlify notification recipients.
4. Fire analytics events on successful submission (`lib/analytics.ts`).
5. Remove “Phase 2” placeholder notes from form UI.

---

## 6. Initial security review

Covers PRD NFR-3 and Phase 1 security checklist.

| Topic | Assessment | Mitigation |
|-------|------------|------------|
| **HTTPS** | Required | Netlify default TLS |
| **Secret exposure** | Risk if API keys in client bundle | Notification/API keys only in Netlify env vars — never `VITE_*` unless intentionally public (analytics ID) |
| **Form transport** | PII in transit | HTTPS POST only |
| **Access control** | Who sees submissions | Netlify site admins + configured notification recipients only |
| **Logging** | PII in logs | Do not log form field values to console or analytics in production |
| **XSS** | User-supplied form data | React text binding; no `dangerouslySetInnerHTML` on user content |
| **Spam** | Automated submissions | Netlify honeypot on both forms; optional Turnstile in Phase 4 if needed |
| **Privacy** | Consent and policy | Consent checkbox on forms; footer privacy link (placeholder until legal copy) |
| **Analytics** | Pseudonymous tracking | Stub only in Phase 1; no PII in event payloads (Phase 4) |

Supabase/RLS patterns are **not required** for Netlify Forms MVP. Revisit only if submission storage moves to Supabase.

Phase 5 will repeat validation (HTTPS enforcement, form-data review, insecure logging check).

---

## 7. Analytics (stub)

| Item | Status |
|------|--------|
| Tool choice | **TBD** — recommend Plausible (privacy-friendly) or GA4 |
| Implementation | Stub in `src/lib/analytics.ts` |
| Env vars | `VITE_ANALYTICS_PROVIDER`, `VITE_ANALYTICS_ID` (see `.env.example`) |
| Events | `pageview`, `provider_contact_submit`, `student_interest_submit` |
| Wiring | Phase 4 |

---

## 8. Open questions and resolutions

| Question | Owner | Phase 1 resolution |
|----------|-------|-------------------|
| Next.js vs Vite | Engineering | **Resolved:** Vite SPA on Netlify |
| Student form placement | Product/Design | **Recommended:** `#student-interest` section before footer, secondary styling |
| Exact form fields | Product/Design/Engineering | Provisional lists in §5.2 — confirm before Phase 2 |
| Analytics tool | Product/Engineering | TBD — stub ready; decide before Phase 4 |
| EnRollifyEdu brief | Founders/Marketing | Missing — draft copy flagged for review |
| Logo asset | Design | Missing — text wordmark interim |
| Privacy policy URL | Legal/Founders | Placeholder `#privacy` in footer |

---

## 9. Assumptions and risks

| Item | Type | Notes |
|------|------|-------|
| Manual submission handling at launch | Assumption | Per PRD §3.3 |
| Draft copy acceptable for Phase 2–3 build | Assumption | Founder review before public launch |
| Netlify Forms sufficient for v1 volume | Assumption | Migrate to Functions if CRM integration needed |
| Student path dilutes provider messaging | Risk (medium) | Mitigated by secondary CTA styling and placement |
| Brief delay blocks launch-quality copy | Risk (medium) | Mitigated by PRD-derived outline and review cycle |

---

## 10. Phase 1 deliverables checklist

- [x] Folder tree: `components/`, `sections/`, `content/`, `lib/`, `types/`, `public/assets/`, `netlify/functions/`
- [x] TypeScript + Tailwind configured with `design.json` tokens
- [x] `netlify.toml` and `.env.example`
- [x] This discovery document
- [x] `App.tsx` renders PRD-ordered sections with correct anchor IDs
- [x] Form stubs present (no live backend — Phase 2)
- [x] `npm run build` passes

---

## 11. Next steps (Phase 2)

Completed — see [phase-2-core-build.md](./phase-2-core-build.md).

1. ~~Finalise form field lists with product/design.~~ (Provisional lists implemented; confirm before launch.)
2. ~~Enable Netlify Forms and notification recipients.~~ (Forms wired in code; dashboard setup documented in Phase 2 doc.)
3. ~~Implement client-side validation and submission states.~~
4. ~~Remove form placeholder notes from UI.~~

**Phase 3:** Section polish, copy review, responsive/a11y pass.
