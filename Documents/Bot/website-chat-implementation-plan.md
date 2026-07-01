# Enrollify AI — Website Chat Implementation Plan

| Field | Details |
|-------|---------|
| Status | Code complete — production deploy pending (Steps 4–5, 7) |
| Date | 2026-07-01 |
| Linked PRD | [enrollify-ai-prd.md](./enrollify-ai-prd.md) |
| Facebook Messenger | **On hold** (Meta business verification) |
| First channel | Website chat (`channel: webchat`) |

## Context

Ship a floating chat widget on all public pages that reuses the existing Express conversation pipeline. Leads are stored with `channel: 'webchat'` and displayed as **Website** in the admin panel. Facebook webhook integration remains in the codebase but is not required for launch.

## Architecture

```text
Browser → POST /api/chat/messages (Netlify proxy)
       → Railway Express (ConversationService, AIService, LeadScoring)
       → Supabase (students, conversations, messages, lead_scores)
       → JSON reply to browser
```

## Working agreement

Implement and verify **one step at a time**. Check off self-tests before moving on.

---

## Step 0 — Tracking document

**Status:** Complete

- [x] This document created
- [x] README Bot section links here

---

## Step 1 — Backend: web chat API

**Status:** Complete (verified locally)

### Files

| File | Purpose |
|------|---------|
| `apps/backend/src/services/ConversationService.ts` | `handleIncomingMessageForWeb()` returns reply |
| `apps/backend/src/channels/WebChatChannelAdapter.ts` | No-op adapter |
| `apps/backend/src/routes/chat.ts` | Public chat route |
| `apps/backend/src/middleware/chatRateLimit.ts` | 30/min IP, 20/min session |
| `apps/backend/src/app.ts` | Mount `/api/chat` |
| `apps/backend/src/config/env.ts` | Optional `FB_*`, `CHAT_ENABLED`, CORS default `:5180` |

### Self-test

- [x] `cd apps/backend && npm run dev` starts without real `FB_*` values
- [x] `curl http://localhost:3001/health` → `{ "status": "ok", "database": "connected" }`
- [x] `POST /api/chat/messages` with UUID → `200` with `reply`
- [x] Same `sessionId` → same student; messages append
- [x] Invalid UUID → `400`
- [ ] 31 requests in 1 min from same IP → `429` *(run manually if needed)*
- [x] Logs contain student/conversation UUID only — no PII

### Security

- [x] Public route cannot access admin data
- [x] `sessionId` must be UUID v4
- [x] Generic `500` errors only
- [ ] `CHAT_ENABLED=false` → `503` *(verify on deploy)*

---

## Step 2 — Frontend: chat widget

**Status:** Complete

### Files

| File | Purpose |
|------|---------|
| `src/lib/chat/session.ts` | UUID in `localStorage` |
| `src/lib/chat/api.ts` | `sendChatMessage()` |
| `src/components/chat/ChatWidget.tsx` | FAB + panel UI |
| `src/components/layout/SiteLayout.tsx` | Mount widget |

### Self-test

- [ ] Widget visible on `/`, `/study-in-new-zealand`, `/contact` *(verify in browser with backend running)*
- [x] Widget not on `/enrollify-manage` *(SiteLayout only)*
- [x] `npm run typecheck` passes
- [ ] Send message → reply within ~10s *(browser test)*
- [ ] Reload → same `sessionId` *(browser test)*

### Security

- [x] Calls `/api/chat/messages` only
- [x] No secrets in `src/lib/chat/*`
- [x] React text nodes only

---

## Step 3 — Admin: Website source

**Status:** Complete

### Self-test

- [ ] Website chat lead shows **Website** on dashboard *(after browser chat test)*
- [ ] Lead detail conversation matches widget messages
- [x] Dashboard and detail UI include Source column/badge

---

## Step 4 — Railway deployment (manual)

**Status:** Pending — requires your Railway account

### Steps

1. [Railway](https://railway.app) → New project → GitHub repo
2. Root directory: `apps/backend`
3. Set env vars (see table below)
4. Deploy → note public URL
5. `curl https://<host>/health`

### Production env (Railway)

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `CHAT_ENABLED` | `true` |
| `SUPABASE_URL` | Enrollify project |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` |
| `AI_PROVIDER_ENCRYPTION_KEY` | Min 32 chars |
| `CORS_ORIGIN` | `https://www.enrollifyedu.com` |
| `PERPLEXITY_API_KEY` | Or configure in admin AI providers |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | One-time bootstrap — remove after |
| `FB_*` | Omit (Facebook on hold) |

### Self-test

- [ ] Railway deploy succeeds
- [ ] `/health` → database connected
- [ ] `POST /api/chat/messages` returns reply
- [ ] Railway logs show no PII

---

## Step 5 — Netlify wiring (manual)

**Status:** Pending — requires Netlify dashboard

### Steps

1. Netlify → `BACKEND_URL` = Railway URL (no trailing slash)
2. Confirm `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Railway `CORS_ORIGIN=https://www.enrollifyedu.com`
4. Redeploy Netlify

### Self-test

- [ ] Production widget sends/receives messages
- [ ] `/enrollify-manage` works
- [ ] Marketing site regression pass

---

## Step 6 — Security hardening

**Status:** Complete (automated checks)

### Self-test

- [x] Anon Supabase: `students`, `conversations`, `messages` → empty/error (`npm run test:security`)
- [x] `GET /api/admin/students` without JWT → `401`
- [ ] Wrong browser Origin → CORS blocked *(verify in production)*
- [x] No service role key in `src/`
- [x] `npm run test:security` passes

---

## Step 7 — Production E2E smoke test (manual)

**Status:** Pending — after Steps 4–5

- [ ] Chat on `https://www.enrollifyedu.com` — 2–3 messages with name + email
- [ ] Lead in admin within 60s with **Website** source
- [ ] Lead detail matches conversation
- [ ] Response time < 10s typical
- [ ] No console errors on public pages

---

## Step 8 — Documentation updates

**Status:** Complete

- [x] PRD assumptions updated (website first, Facebook deferred)
- [x] Phase 4 doc notes Meta deferred
- [x] README links this plan
- [x] Backend README updated with chat API + Railway steps

---

## Rollback

| Action | Effect |
|--------|--------|
| Set `CHAT_ENABLED=false` on Railway | Chat API returns 503 |
| Set `VITE_CHAT_ENABLED=false` on Netlify | Widget hidden |
| Remove widget from SiteLayout | UI gone; data retained |

Facebook webhook can be registered later without data loss.

---

## Env quick reference

| Where | Variables |
|-------|-----------|
| Railway | `SUPABASE_*`, `AI_PROVIDER_ENCRYPTION_KEY`, `CORS_ORIGIN`, `CHAT_ENABLED`, optional `PERPLEXITY_API_KEY` |
| Netlify | `BACKEND_URL`, `VITE_SUPABASE_*`, optional `VITE_CHAT_ENABLED` |
| Local `.env.local` | `VITE_SUPABASE_*`, optional `VITE_CHAT_ENABLED` |
| Local `apps/backend/.env` | Server secrets; `CORS_ORIGIN=http://localhost:5180` |

---

## Local dev quick start

```bash
# Terminal 1 — backend
cd apps/backend && npm run dev

# Terminal 2 — site + widget
npm run dev
# Open http://localhost:5180 and use "Chat with us"
```

Test API directly:

```bash
SESSION=$(uuidgen | tr '[:upper:]' '[:lower:]')
curl -X POST http://localhost:3001/api/chat/messages \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION\",\"text\":\"Hi, my name is Jane\"}"
```
