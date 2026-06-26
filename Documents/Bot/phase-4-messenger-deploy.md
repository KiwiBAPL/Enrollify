# Enrollify AI — Phase 4 Messenger Integration and Deployment

| Field | Details |
|-------|---------|
| Phase | 4 — Messenger integration and deployment (PRD §9.4) |
| Status | Complete (code + deploy configs) |
| Date | 2026-06-23 |
| Branch | `feature/enrollify-ai-backend` |
| Linked PRD | [enrollify-ai-prd.md](./enrollify-ai-prd.md) |

## 1. Purpose

Phase 4 connects Facebook Messenger to the existing conversation pipeline, adds webhook security controls, and documents production deployment to Railway (backend) and Vercel (admin).

---

## 2. Webhook implementation

| File | Role |
|------|------|
| [`apps/backend/src/routes/webhook.ts`](../../apps/backend/src/routes/webhook.ts) | GET verify + POST handler |
| [`apps/backend/src/lib/metaSignature.ts`](../../apps/backend/src/lib/metaSignature.ts) | HMAC-SHA256 validation (FR-2) |
| [`apps/backend/src/lib/parseMessengerWebhook.ts`](../../apps/backend/src/lib/parseMessengerWebhook.ts) | Parse `entry[].messaging[]` text events (FR-3) |
| [`apps/backend/src/middleware/webhookRateLimit.ts`](../../apps/backend/src/middleware/webhookRateLimit.ts) | 500 POST/min per IP (NFR-3) |
| [`apps/backend/src/lib/webhookDedup.ts`](../../apps/backend/src/lib/webhookDedup.ts) | In-memory `message.mid` dedup (5 min TTL) |

### GET `/webhook` (FR-1)

- Query: `hub.mode=subscribe`, `hub.verify_token`, `hub.challenge`
- Token matches `FB_VERIFY_TOKEN` → `200` with challenge as plain text
- Otherwise → `403`

### POST `/webhook` (FR-2, FR-3)

1. Rate limit check (429 if exceeded)
2. Validate `X-Hub-Signature-256` against raw body + `FB_APP_SECRET`
3. Parse text message events (PSID, text, timestamp, `mid`)
4. Return `200 { status: 'ok' }` immediately
5. Process each event async via `ConversationService` + `MessengerChannelAdapter`
6. Skip duplicate `mid` values (Meta retries)

### App wiring

[`apps/backend/src/app.ts`](../../apps/backend/src/app.ts):

- `/webhook` mounted **before** `express.json()` with `express.raw({ type: 'application/json' })`
- No CORS on `/webhook` (PRD S-7)

### Read receipts (FR-4)

`ConversationService` calls `adapter.markSeen()` before `sendTypingOn()` for all channels (mock logs only).

---

## 3. Local testing

### Pipeline (no webhook)

```bash
curl -X POST http://localhost:3001/dev/simulate-message \
  -H "Content-Type: application/json" \
  -d '{"channelUserId":"test-1","text":"Hi, my name is Jane"}'
```

### Signed webhook (dev only)

```bash
curl -X POST http://localhost:3001/dev/simulate-webhook \
  -H "Content-Type: application/json" \
  -d '{"channelUserId":"test-psid-1","text":"Hello from webhook test"}'
```

This builds a signed Meta payload and POSTs it to `/webhook` locally.

### ngrok + Meta (pre-deploy)

```bash
# Terminal 1
cd apps/backend && npm run dev

# Terminal 2
ngrok http 3001
```

Register `https://<ngrok-id>.ngrok.io/webhook` in Meta Developer Console (see §6).

### Signature rejection test

```bash
curl -X POST http://localhost:3001/webhook \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=invalid" \
  -d '{"object":"page","entry":[]}'
# Expected: 403
```

---

## 4. Railway deployment (backend)

Config: [`apps/backend/railway.toml`](../../apps/backend/railway.toml), [`apps/backend/Procfile`](../../apps/backend/Procfile)

### Steps

1. Create a Railway project; connect this repo
2. Set **root directory** to `apps/backend`
3. Add environment variables (see below)
4. Deploy; note public URL (e.g. `https://enrollify-backend.up.railway.app`)
5. Verify: `curl https://<host>/health` → `{"status":"ok","database":"connected"}`

### Required Railway env vars

| Variable | Notes |
|----------|-------|
| `NODE_ENV` | `production` |
| `FB_PAGE_ACCESS_TOKEN` | From Meta Page settings |
| `FB_VERIFY_TOKEN` | Your chosen verify string (same as Meta webhook config) |
| `FB_APP_SECRET` | Meta app → Settings → Basic |
| `SUPABASE_URL` | Enrollify Edu project |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` (server only) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | One-time bootstrap only — remove after admin exists in Supabase Auth |
| `ADMIN_FIRST_NAME` / `ADMIN_LAST_NAME` | Default `Paul` / `Benn` — staff profile on bootstrap/backfill |
| `AI_PROVIDER_ENCRYPTION_KEY` | Min 32 chars; unique production value |
| `CORS_ORIGIN` | Netlify site URL (e.g. `https://enrollifyedu.com`) |
| `PERPLEXITY_API_KEY` | Optional if providers already in DB |

`PORT` is set automatically by Railway.

---

## 5. Admin panel (Netlify — same site)

Staff admin is integrated into the marketing site at **`/enrollify-manage`** (not linked in public nav, blocked in `robots.txt`).

| Route | Purpose |
|-------|---------|
| `/enrollify-manage/login` | Supabase Auth login |
| `/enrollify-manage` | Unified leads dashboard — welcome, notes, Hot/Warm/Cold filters |
| `/enrollify-manage/leads/:id` | Conversation + enrolment status |
| `/enrollify-manage/settings/profile` | Staff profile (name, email) |
| `/enrollify-manage/settings/ai-providers` | AI provider settings |

### Netlify configuration

1. Set **`BACKEND_URL`** in Netlify site env to your Railway backend URL (no trailing slash)
   - Example: `https://enrollify-backend.up.railway.app`
2. Set **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_PUBLISHABLE_KEY`** in Netlify env (admin auth)
3. Build command appends `/api/*` proxy to `dist/_redirects` (see [`netlify.toml`](../../netlify.toml))
4. Set Railway **`CORS_ORIGIN=https://enrollifyedu.com`** (and `http://localhost:5173` for local dev)

### Local dev

```bash
# Terminal 1 — backend
cd apps/backend && npm run dev

# Terminal 2 — site + admin
npm run dev
# Open http://localhost:5173/enrollify-manage
```

Vite proxies `/api/*` → `localhost:3001` (see [`vite.config.ts`](../../vite.config.ts)).

Login uses Supabase Auth — credentials are stored in Supabase (bootstrapped once via backend `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then removed from env).

The legacy Next.js app in [`apps/admin/`](../../apps/admin/) is **deprecated** — do not deploy to Vercel.

---

## 6. Meta Developer setup

### Checklist

1. [Meta Developer Console](https://developers.facebook.com/) → your app
2. **Messenger → Settings → Webhooks**
   - Callback URL: `https://<railway-host>/webhook`
   - Verify token: same string as `FB_VERIFY_TOKEN` in Railway
   - Click **Verify and save**
3. Subscribe to **`messages`** field
4. **Messenger → Settings** → link your Enrollify Facebook Page to the app
5. Generate **Page Access Token** → copy to Railway `FB_PAGE_ACCESS_TOKEN`
6. **App mode:**
   - **Development:** add test users / testers who can message the Page
   - **Live:** submit for Meta App Review (`pages_messaging` permission) for public messaging

### Webhook verification

Meta sends `GET /webhook?hub.mode=subscribe&hub.verify_token=…&hub.challenge=…`

Success: Railway logs show no 403; Meta console shows webhook verified.

### Smoke test

1. Message the Enrollify Facebook Page from an allowed account
2. Expect typing indicator + AI reply within ~10 seconds
3. Check admin panel: new student, conversation, lead score

---

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Meta webhook verify fails | `FB_VERIFY_TOKEN` mismatch | Match Railway env and Meta console exactly |
| POST returns 403 | Invalid signature | Check `FB_APP_SECRET`; ensure raw body HMAC (not re-serialized JSON) |
| No reply in Messenger | Invalid `FB_PAGE_ACCESS_TOKEN` | Regenerate Page token; confirm Page linked to app |
| Duplicate replies | Meta retry | Dedup cache handles `mid`; check logs for "Skipping duplicate" |
| Admin login fails on Netlify | `BACKEND_URL` not set or wrong CORS | Set Netlify `BACKEND_URL`; Railway `CORS_ORIGIN=https://enrollifyedu.com` |
| `Cannot POST /webhook` locally | Stale `dist/index.js` on :3001 | Kill old process; use `npm run dev` |

---

## 8. Phase 4 exit criteria

- [x] `GET /webhook` verification endpoint (FR-1)
- [x] `POST /webhook` HMAC validation (FR-2)
- [x] Text message parsing → `ConversationService` (FR-3)
- [x] Typing on/off + mark_seen (FR-4)
- [x] Rate limiting 500/min/IP (NFR-3)
- [x] Message `mid` deduplication
- [x] Railway + Vercel deploy configs
- [x] Dev webhook simulator + ngrok docs
- [ ] Railway deployed (manual — user action)
- [ ] Netlify `BACKEND_URL` set for admin API proxy
- [ ] Meta webhook registered (manual — user action)
- [ ] End-to-end Messenger smoke test (Phase 5)

---

## 9. Phase 5 handoff

1. Security validation: forged signature → 403; RLS deny-all; JWT on admin routes
2. Rate limit test: 600 req/min → 429 after 500
3. Full FR acceptance criteria matrix
4. Regression: marketing site (`src/`) unchanged on Netlify
5. Meta App Review if Page is public
