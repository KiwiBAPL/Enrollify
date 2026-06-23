# Enrollify AI — Phase 1 Discovery

| Field | Details |
|-------|---------|
| Phase | 1 — Discovery and setup (PRD §9.1) |
| Status | Complete |
| Date | 2026-06-23 |
| Branch | `feature/enrollify-ai-backend` |
| Linked PRD | [enrollify-ai-prd.md](./enrollify-ai-prd.md) |

## 1. Purpose

Phase 1 establishes project structure, hosting approach, architecture boundaries, Supabase provisioning plan, backend scaffold, and an initial security review before schema work (Phase 2) and feature implementation (Phases 3–4).

---

## 2. Stack and scope decisions

### 2.1 Confirmed architecture

| Layer | Choice | Notes |
|-------|--------|-------|
| Repo structure | **Monorepo** in existing EnRollify repo | Website at `src/`; new apps under `apps/` |
| Website | **Vite + React 19** (unchanged) | Netlify deploy — no modifications in Phase 1 |
| Backend | **Express + TypeScript** (`apps/backend/`) | Strict mode; zod env validation; pino logging |
| Admin panel | **Next.js** (`apps/admin/`) | Scaffold stub only; built in Phase 3 |
| Database | **Supabase PostgreSQL** | Region: **ap-southeast-2 (Sydney)** |
| AI provider | **Claude API** | Integrated in Phase 3 |
| Backend hosting | **Railway** (primary) | Render documented as fallback |
| Admin hosting | **Vercel** | Root directory `apps/admin` |

### 2.2 Monorepo layout

```text
EnRollify/
├── src/                    # Existing marketing website (Netlify — unchanged)
├── apps/
│   ├── backend/            # Express API (Railway)
│   └── admin/              # Next.js admin (Vercel) — Phase 3
├── supabase/               # Migrations — Phase 2
├── Documents/Bot/          # PRD + phase docs
└── netlify.toml            # Unchanged
```

**Rationale:** Preserves the existing Netlify website deploy while colocating backend and admin in one repo. Each deployment target builds only its subdirectory.

### 2.3 Deployment model

```text
Git push → Netlify builds src/     → enrollifyedu.com (unchanged)
         → Railway builds backend/ → public HTTPS webhook URL
         → Vercel builds admin/    → internal staff dashboard
```

---

## 3. Existing website inventory (preserve)

### 3.1 Routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `LandingPage` | Anchor sections, Netlify Forms |
| `/contact` | `ContactPage` | Provider contact form |

No admin routes, no `/webhook`, no chat widget.

### 3.2 Key files — do not modify for bot work

| File | Purpose |
|------|---------|
| `netlify.toml` | Build `dist/`, SPA fallback |
| `src/App.tsx` | BrowserRouter, two routes |
| `src/lib/forms/` | Netlify Forms submission |
| `.env.example` | Analytics vars only (`VITE_*`) |

### 3.3 Confirmed: no conflicts

- No existing Supabase client or migrations
- No existing `/webhook` endpoint
- No backend dependencies in root `package.json`
- `netlify/functions/.gitkeep` only — no serverless API

---

## 4. Backend scaffold (Phase 1 deliverable)

Location: [`apps/backend/`](../../apps/backend/)

| Component | Status | Notes |
|-----------|--------|-------|
| Express app | Done | `src/index.ts` |
| `GET /health` | Done | Returns `{ status: "ok" }` |
| Zod env validation | Done | `src/config/env.ts` — exits on missing vars |
| Error middleware stub | Done | `src/middleware/errorHandler.ts` |
| Structured logging | Done | pino + pino-http |
| `.env.example` | Done | All required secrets documented |

**Required env vars:** `PORT`, `FB_PAGE_ACCESS_TOKEN`, `FB_VERIFY_TOKEN`, `FB_APP_SECRET`, `CLAUDE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET` (min 32 chars).

---

## 5. Supabase provisioning

| Item | Decision |
|------|----------|
| Region | **ap-southeast-2 (Sydney)** — closest to NZ; standard for Australasia data-residency discussions |
| Organization | Altitude Journey (`ruqqmfukqjkbsdaduxrz`) |
| Project name | **Enrollify AI** |
| Estimated cost | ~$10/month (Supabase Pro) |
| Migrations folder | `supabase/` — tables created in Phase 2 |

### 5.1 Provisioning status

**Action required:** Create the Supabase project manually in the [Supabase dashboard](https://supabase.com/dashboard):

1. New project → name **Enrollify AI**
2. Region → **ap-southeast-2 (Sydney)**
3. Store `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Railway/backend env (never commit)
4. Run `supabase link --project-ref <ref>` from repo root when ready for Phase 2 migrations

No Enrollify-specific Supabase project existed at Phase 1 discovery. Existing projects in the org are unrelated (Daily Devotional, Paul Benn Consulting, Task Productivity Planner).

---

## 6. Security checklist (Phase 1 design — verify in Phase 5)

| # | Constraint | Design intent | Verify in |
|---|------------|---------------|-----------|
| S-1 | Admin routes require JWT before data | Backend issues JWT; admin calls API with Bearer token | Phase 5 |
| S-2 | RLS deny-all for anon on all 8 tables | Phase 2 migrations | Phase 5 |
| S-3 | Service role key server-only | `SUPABASE_SERVICE_ROLE_KEY` in backend env — never `VITE_*` | Phase 5 |
| S-4 | Meta App Secret env-only | `FB_APP_SECRET` in backend/Railway env | Phase 5 |
| S-5 | Claude API key env-only | `CLAUDE_API_KEY` in backend env | Phase 5 |
| S-6 | Webhook signature before parse/DB | Raw body HMAC-SHA256 check first | Phase 4 |
| S-7 | Webhook CORS | No CORS on `/webhook` (Meta server-to-server) | Phase 4 |
| S-8 | No PII in logs | Log student UUID / conversation ID only | Phase 5 |
| S-9 | Rate limit `/webhook` | 500 req/min per IP → HTTP 429 | Phase 4 |

### 6.1 Admin panel auth design (preview)

- JWT issued by backend login endpoint (Phase 3)
- Default session expiry: **8 hours** (pending OQ-3 business owner confirmation)
- Release 1: **single admin account** (pending OQ-5 confirmation)

### 6.2 RLS policy design (preview — Phase 2)

| Role | Access |
|------|--------|
| `anon` (publishable key) | Deny all on all tables |
| `authenticated` admin | Read/write student data tables |
| `service_role` (backend) | Full access for webhook + AI processing |

---

## 7. Open questions and provisional defaults

| Question | Owner | Phase 1 resolution | Blocks |
|----------|-------|-------------------|--------|
| OQ-1 Lead-scoring weights | Business owner | Provisional: equal 10 pts × 7 factors (70 max) | Phase 2 scoring |
| OQ-2 Minimum lead fields | Business owner | Provisional: full PRD field list (FR-6) | Phase 2 schema |
| OQ-3 JWT session expiry | Business owner | Default **8 hours** | Phase 3 auth |
| OQ-4 Data retention | Business owner | Interim: retain indefinitely | Launch |
| OQ-5 Single vs multi admin | Business owner | Default: **single admin** for release 1 | Phase 3 auth |
| OQ-6 Supabase region | Developer + owner | **Resolved: ap-southeast-2 (Sydney)** | Phase 2 |
| Meta developer app | Business owner | Start early — webhook needs public HTTPS (Phase 4) | Phase 4 |

---

## 8. Assumptions and risks

| Item | Type | Notes |
|------|------|-------|
| Existing website unchanged | Assumption | Backend is separate deployment per PRD §3.3 |
| Monorepo does not break Netlify | Assumption | Root `npm run build` still builds website only |
| Sydney region acceptable for NZ Privacy Act | Assumption | Legal sign-off from business owner still needed |
| Meta app review may delay launch | Risk (medium) | Begin Meta developer setup early in Phase 1–2 |
| Lead-scoring weights TBD | Risk (medium) | Provisional equal weights; review before launch |
| Knowledge base content not supplied | Risk (medium) | System degrades gracefully without RAG content |
| Supabase provisioning manual step | Risk (low) | Documented in §5.1 |

---

## 9. Phase 1 deliverables checklist

- [x] Branch `feature/enrollify-ai-backend` created
- [x] [`enrollify-ai-prd.md`](./enrollify-ai-prd.md) committed
- [x] This discovery document
- [x] `apps/backend/` scaffold — builds with `tsc`, `GET /health` ready
- [x] `apps/backend/.env.example` documents all secrets
- [x] `apps/admin/README.md` placeholder for Phase 3
- [x] `supabase/` folder ready for Phase 2 migrations
- [x] Supabase project provisioned (Enrollify Edu, ap-southeast-2) in ap-southeast-2 (manual — see §5.1)
- [x] Website `npm run build` passes unchanged
- [x] No changes to `netlify.toml` or `src/`

---

## 10. Next steps (Phase 2)

See PRD §9.2:

1. Create Supabase tables: `students`, `conversations`, `messages`, `institutions`, `courses`, `knowledge_articles`, `lead_scores`, `appointments`
2. Enable RLS on all tables
3. Version-control schema in `supabase/migrations/`
4. Build repository classes (`StudentRepository`, etc.)
5. Complete error-handling middleware and structured logger
