# Enrollify AI — Phase 3 Core Services and Admin Panel

| Field | Details |
|-------|---------|
| Phase | 3 — Core services and admin panel (PRD §9.3) |
| Status | Complete |
| Date | 2026-06-23 |
| Branch | `feature/enrollify-ai-backend` |
| Linked PRD | [enrollify-ai-prd.md](./enrollify-ai-prd.md) |

## 1. Purpose

Phase 3 implements the conversation pipeline (services + channel adapters), JWT admin API, and Next.js admin dashboard. Facebook webhook wiring and production deploy are Phase 4.

---

## 2. Backend services

| Service | Path | Role |
|---------|------|------|
| `ConversationService` | `apps/backend/src/services/ConversationService.ts` | Orchestrates inbound message flow (FR-7, FR-8) |
| `AIService` | `apps/backend/src/services/AIService.ts` | Multi-provider AI with failover (Perplexity default) |
| `KnowledgeService` | `apps/backend/src/services/KnowledgeService.ts` | Full-text RAG, up to 3 articles (FR-16) |
| `LeadScoringService` | `apps/backend/src/services/LeadScoringService.ts` | Factor scoring + upsert (FR-9) |
| `MessengerChannelAdapter` | `apps/backend/src/channels/MessengerChannelAdapter.ts` | Meta Send API (FR-4) — used in Phase 4 |
| `MockChannelAdapter` | `apps/backend/src/channels/MockChannelAdapter.ts` | Logs outbound messages for local dev |

All services use constructor injection via [`container.ts`](../../apps/backend/src/container.ts) (NFR-8).

---

## 3. AI providers and mock mode

Provider implementations live in [`apps/backend/src/services/ai/`](../../apps/backend/src/services/ai/):

| Provider | Type | Notes |
|----------|------|-------|
| `PerplexityProvider` | `perplexity` | Default; OpenAI-compatible API + JSON schema for lead extraction |
| `ClaudeProvider` | `claude` | Optional failover; Anthropic tool calling |
| Mock (dev) | — | Used when no enabled providers or all fail (non-production) |

Configs are stored in `ai_providers` (encrypted API keys). On first startup, if the table is empty and `PERPLEXITY_API_KEY` is set (not a placeholder), a bootstrap row is created automatically.

| Condition | Behaviour |
|-----------|-----------|
| No enabled providers + dev | Mock replies + basic field extraction |
| Enabled providers in DB | Tried in ascending `priority` order; failover on error |
| All providers fail + production | Generic fallback message |

Admin UI: `/settings/ai-providers` — add, edit, enable/disable, set priority, test connection.

---

## 4. New environment variables

See [`apps/backend/.env.example`](../../apps/backend/.env.example):

| Variable | Default | Purpose |
|----------|---------|---------|
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | — | One-time bootstrap into Supabase Auth; remove after first startup |
| `CORS_ORIGIN` | `http://localhost:5173` | Admin frontend origin |
| `PERPLEXITY_API_KEY` | — | Optional bootstrap key (`pplx-…`) |
| `PERPLEXITY_MODEL` | `sonar-pro` | Default model for env bootstrap |
| `AI_PROVIDER_ENCRYPTION_KEY` | — | Encrypts provider keys in DB (min 32 chars) |
| `AI_REQUEST_TIMEOUT_MS` | `8000` | AI call timeout |

---

## 5. API routes

### Auth

Admin login uses **Supabase Auth** (SPA `signInWithPassword`). Backend `/api/admin/*` routes verify the Supabase access token and require `app_metadata.role = 'admin'`.

Root SPA env (public): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

### Admin (Bearer Supabase JWT required)

| Method | Path | PRD |
|--------|------|-----|
| `GET` | `/api/admin/students` | FR-10 |
| `GET` | `/api/admin/students/:id` | FR-10 |
| `PATCH` | `/api/admin/students/:id/enrolment-status` | FR-13 |
| `GET` | `/api/admin/students/:id/messages` | FR-11 |
| `GET` | `/api/admin/students/export` | FR-14 |
| `GET` | `/api/admin/pipeline` | FR-12 |
| `GET` | `/api/admin/analytics` | FR-15 |
| `GET` | `/api/admin/ai-providers` | List AI providers (masked keys) |
| `POST` | `/api/admin/ai-providers` | Create provider |
| `PATCH` | `/api/admin/ai-providers/:id` | Update provider |
| `DELETE` | `/api/admin/ai-providers/:id` | Delete provider |
| `POST` | `/api/admin/ai-providers/:id/test` | Test provider connection |

### Dev only (`NODE_ENV !== production`)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/dev/simulate-message` | Test full conversation pipeline locally |

```bash
curl -X POST http://localhost:3001/dev/simulate-message \
  -H "Content-Type: application/json" \
  -d '{"channelUserId":"test-psid-1","text":"Hi, my name is Jane. I want to study in NZ."}'
```

---

## 6. Admin panel

Location: **`/enrollify-manage`** on the Netlify site ([`src/pages/admin/`](../../src/pages/admin/))

| Route | Feature |
|-------|---------|
| `/enrollify-manage/login` | Email/password → Supabase Auth session |
| `/enrollify-manage` | Unified dashboard — all leads, Hot/Warm/Cold filters, search, CSV export |
| `/enrollify-manage/leads/[id]` | Chat view, enrolment status |
| `/enrollify-manage/settings/ai-providers` | AI provider management |

Not linked from public navigation. Blocked in [`public/robots.txt`](../../public/robots.txt).

API proxy: `/api/*` → Railway backend via Netlify `BACKEND_URL` env (production) or Vite dev proxy (local).

Legacy Next.js admin in [`apps/admin/`](../../apps/admin/) is deprecated.

---

## 7. Local dev workflow

Terminal 1 — backend:

```bash
cd apps/backend
cp .env.example .env   # fill SUPABASE_SERVICE_ROLE_KEY + one-time ADMIN_* bootstrap
npm run dev
```

Terminal 2 — site + admin (from repo root):

```bash
cp .env.example .env.local   # fill VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

1. Open http://localhost:5173/enrollify-manage/login
2. Sign in with bootstrapped admin credentials (same as one-time `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
3. Simulate a message via curl (above)
4. Refresh Students / Pipeline in admin

---

## 8. Troubleshooting

### Wrong server on port 3001

If `curl http://localhost:3001/health` returns only `{"status":"ok"}` (no `"database":"connected"`), or API routes return `Cannot POST …`, a stale `node dist/index.js` process is likely blocking the dev server.

```bash
lsof -i :3001
kill <PID>
cd apps/backend && npm run dev
```

Always use `npm run dev` locally — not `node dist/index.js` at the same time.

### Admin login fails

1. Bootstrap: start backend once with `ADMIN_EMAIL` + plain `ADMIN_PASSWORD` in `apps/backend/.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in root `.env.local`.
3. Disable public sign-ups in Supabase Auth settings.

### Missing `AI_PROVIDER_ENCRYPTION_KEY`

Required since multi-provider AI (min 32 chars). See [`apps/backend/.env.example`](../../apps/backend/.env.example).

---

## 9. Phase 3 exit criteria

- [x] Services with constructor DI
- [x] `POST /dev/simulate-message` creates student, messages, lead score
- [x] Mock AI mode without real API key
- [x] Multi-provider AI (Perplexity + admin-managed failover)
- [x] JWT auth; `/api/admin/*` returns 401 without token
- [x] Admin UI: students, conversation, pipeline, analytics, CSV, enrolment status
- [x] Website unchanged (`src/`, `netlify.toml`)
- [x] `apps/backend` and `apps/admin` build cleanly

---

## 10. Phase 4 handoff

See [phase-4-messenger-deploy.md](./phase-4-messenger-deploy.md) for webhook integration, Railway/Vercel deploy, and Meta registration.
