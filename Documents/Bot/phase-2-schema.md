# Enrollify AI — Phase 2 Schema and Backend Foundation

| Field | Details |
|-------|---------|
| Phase | 2 — Schema and backend foundation (PRD §9.2) |
| Status | Complete |
| Date | 2026-06-23 |
| Branch | `feature/enrollify-ai-backend` |
| Linked PRD | [enrollify-ai-prd.md](./enrollify-ai-prd.md) |
| Supabase project | **Enrollify Edu** — `lissrpaczvrvcolrxafx` (ap-southeast-2) |

## 1. Purpose

Phase 2 establishes the Supabase schema, RLS policies, version-controlled migrations, TypeScript repository classes, and completes the backend foundation (logging, error handling, health check with DB probe).

---

## 2. Supabase project

| Item | Value |
|------|-------|
| Name | Enrollify Edu |
| Region | ap-southeast-2 (Sydney) |
| Project ref | `lissrpaczvrvcolrxafx` |
| API URL | `https://lissrpaczvrvcolrxafx.supabase.co` |

Store `SUPABASE_SERVICE_ROLE_KEY` in `apps/backend/.env` only — never commit.

---

## 3. Schema

### 3.1 Tables

| Table | Purpose |
|-------|---------|
| `students` | Lead identity + qualification fields + enrolment status |
| `conversations` | Per-student conversation sessions |
| `messages` | Inbound/outbound message history |
| `institutions` | NZ education provider reference data |
| `courses` | Courses linked to institutions |
| `knowledge_articles` | RAG knowledge base with full-text `search_vector` |
| `lead_scores` | One score record per student (upsert on `student_id`) |
| `appointments` | Future appointment booking (out of scope release 1) |
| `student_notes` | Staff notes per lead (Phase 5) — see [phase-5-admin-features.md](./phase-5-admin-features.md) |
| `staff_profiles` | Staff identity linked to `auth.users` (Phase 5) |

### 3.2 Enums

| Enum | Values |
|------|--------|
| `channel_type` | `facebook`, `webchat` |
| `message_type` | `user`, `assistant` |
| `enrolment_status` | `enquiry`, `qualified_lead`, `appointment_booked`, `application_submitted`, `enrolled`, `not_qualified` |
| `staff_role` | `admin`, `consultant` (Phase 5) |

### 3.3 Key constraints

- `students(channel, channel_user_id)` — unique (FR-7: no duplicate PSIDs)
- `lead_scores.student_id` — unique (one current score per student)
- Factor scores: 0–10 each; `overall_score`: 0–100

### 3.4 Lead scoring (provisional — OQ-1)

`LeadScoreRepository.computeOverallScore()` sums seven factors (max 70) and scales to 0–100:

```text
overall = round((sum_of_factors / 70) * 100)
```

Pipeline bands (FR-12): Hot ≥ 70, Warm 40–69, Cold < 40.

---

## 4. Migrations

| File | Description |
|------|-------------|
| `supabase/migrations/20260623084818_initial_schema.sql` | Tables, indexes, `updated_at` triggers |
| `supabase/migrations/20260623084836_rls_policies.sql` | RLS + `is_admin()` helper + admin policies |
| `supabase/migrations/20260623120200_security_hardening.sql` | `set_updated_at` search_path fix; revoke `is_admin` from `anon` |
| `supabase/migrations/20260623140000_ai_providers.sql` | `ai_providers` table |
| `supabase/migrations/20260626120000_student_notes.sql` | Lead notes (Phase 5) |
| `supabase/migrations/20260626140000_staff_profiles.sql` | Staff profiles + `staff_role` enum (Phase 5) |
| `supabase/migrations/20260626180000_staff_profiles_insert_own.sql` | Client insert-own RLS for admin profile bootstrap (Phase 5) |

Remote may also list `20260626040047_staff_profiles_insert_own` — same policy, applied earlier via MCP.

Migrations applied to remote project via Supabase MCP (initial schema + RLS). Apply `20260623120200_security_hardening.sql` if not yet run:

```bash
supabase db push
```

---

## 5. Row-Level Security

| Role | Access |
|------|--------|
| `anon` | Deny all (no policies) |
| `authenticated` + `app_metadata.role = 'admin'` | Full CRUD on core tables via `is_admin()` |
| `authenticated` + own `auth.uid()` | Select/update own `staff_profiles` row (Phase 5) |
| `authenticated` + `app_metadata.role = 'admin'` + own `auth.uid()` | Insert own `staff_profiles` row (`staff_profiles_insert_own`, Phase 5) |
| `service_role` (backend) | Bypasses RLS |

Admin role check uses **`app_metadata.role`** (not `user_metadata`) per Supabase security guidance.

---

## 6. Backend repositories

Location: [`apps/backend/src/repositories/`](../../apps/backend/src/repositories/)

| Class | Key methods |
|-------|-------------|
| `StudentRepository` | `findByChannelUserId`, `create`, `update`, `updateEnrolmentStatus`, `list` |
| `ConversationRepository` | `findActiveByStudentId`, `createForChannel`, `updateLastMessageAt` |
| `MessageRepository` | `createUserMessage`, `createAssistantMessage`, `listByConversationId` |
| `LeadScoreRepository` | `upsert`, `findByStudentId`, `listByScoreBand`, `computeOverallScore` |
| `KnowledgeRepository` | `searchRelevant` (full-text, limit 3), `create` |
| `StudentNoteRepository` | `listByStudentId`, `findLatestByStudentIds`, CRUD (Phase 5) |
| `StaffProfileRepository` | `findById`, `create`, `update`, `ensureProfile` (Phase 5) |

All repositories receive `ServiceSupabaseClient` via constructor injection (NFR-8).

Wired in [`apps/backend/src/index.ts`](../../apps/backend/src/index.ts) as `repositories` export for Phase 3 services.

---

## 7. Backend foundation updates

| Component | Status |
|-----------|--------|
| Zod env validation | Done (Phase 1) |
| `createServiceClient()` | Done — service role, no session persistence |
| Structured logger | Done — pino with PII redaction paths |
| Error middleware | Done — `RepositoryError` + generic 500 |
| `GET /health` | Done — probes DB connectivity (`503` if unavailable) |
| `notFoundHandler` | Done |

---

## 8. Phase 2 deliverables checklist

- [x] Eight Supabase tables created with indexes and FKs
- [x] RLS enabled on all tables
- [x] Migrations version-controlled in `supabase/migrations/`
- [x] Migrations applied to Enrollify Edu project
- [x] Five repository classes implemented
- [x] `@supabase/supabase-js` added to backend
- [x] Health endpoint includes database probe
- [x] `apps/backend` builds with `tsc` (strict mode)
- [x] Website `npm run build` unchanged
- [ ] Apply `20260623120200_security_hardening.sql` to remote (if pending)
- [ ] Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in local `apps/backend/.env`

---

## 9. Next steps (Phase 3)

See PRD §9.3:

1. `ChannelAdapter` interface + `MessengerChannelAdapter`
2. `ConversationService`, `AIService`, `LeadScoringService`, `KnowledgeService`
3. Admin panel Next.js app
4. JWT authentication for admin routes
