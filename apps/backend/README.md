# Enrollify AI — Backend

Express + TypeScript API for website chat, Facebook Messenger webhooks (on hold), AI conversation handling, and admin panel auth.

**Website chat:** See [website-chat-implementation-plan.md](../../Documents/Bot/website-chat-implementation-plan.md).

**Blog:** Blog post CRUD is handled by the Vite SPA via Supabase client + RLS — no blog routes in this backend. See [Documents/phase-6-blog.md](../../Documents/phase-6-blog.md).

## Setup

```bash
cd apps/backend
npm install
cp .env.example .env
# Fill in SUPABASE_SERVICE_ROLE_KEY, AI_PROVIDER_ENCRYPTION_KEY
# One-time bootstrap: set ADMIN_EMAIL + ADMIN_PASSWORD (plain) — remove after first startup
# Optional: PERPLEXITY_API_KEY (pplx-…) auto-seeds first AI provider on startup
npm run dev
```

The server refuses to start if any required environment variable is missing or invalid. Local dev loads `apps/backend/.env` automatically via `dotenv`.

**Use `npm run dev` for local development** — do not run `node dist/index.js` alongside it (see troubleshooting below).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload (tsx) on port 3001 |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled output (production) |
| `npm run typecheck` | Type-check without emit |

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | Public | `{ status, database }` probe |
| `POST` | `/api/chat/messages` | Public (rate limited) | Website chat — `{ sessionId, text }` → `{ reply, studentId, conversationId }`. `reply` is plain text (no markdown). |
| `GET/PATCH/…` | `/api/admin/*` | Supabase JWT | Students, notes, profile, pipeline, analytics, AI providers |
| `GET` | `/webhook` | Public | Meta webhook verification (Facebook on hold) |
| `POST` | `/webhook` | Signed | Inbound Messenger messages (Facebook on hold) |
| `POST` | `/dev/simulate-message` | Dev only | Test conversation pipeline locally |
| `POST` | `/dev/simulate-webhook` | Dev only | Test signed webhook locally |

Full route list: [website chat plan](../../Documents/Bot/website-chat-implementation-plan.md) · [Phase 3 doc](../../Documents/Bot/phase-3-core-services.md) · [Phase 5 admin features](../../Documents/Bot/phase-5-admin-features.md).

## Environment variables

See [`.env.example`](.env.example). All secrets are server-only — never prefix with `VITE_`.

Key vars for Phase 3:

| Variable | Required | Purpose |
|----------|----------|---------|
| `CHAT_ENABLED` | Default `true` | Set `false` to disable website chat API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server DB access + admin bootstrap |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | One-time | Bootstrap admin user in Supabase Auth; remove after first startup |
| `ADMIN_FIRST_NAME` / `ADMIN_LAST_NAME` | `Paul` / `Benn` | Staff profile name on bootstrap and backfill |
| `AI_PROVIDER_ENCRYPTION_KEY` | Yes | Encrypts AI API keys in Supabase (min 32 chars) |
| `CORS_ORIGIN` | Yes | Comma-separated allowed origins (e.g. `http://localhost:5180` or production URL) |
| `PERPLEXITY_API_KEY` | No | Bootstrap first provider if DB empty |
| `FB_*` | No | Optional — Facebook Messenger on hold |

### AI reply formatting (website chat)

The chat widget renders replies as plain text only. Before returning a reply, both AI providers run it through `formatChatReply()` (`src/services/ai/formatChatReply.ts`), which strips markdown, Perplexity citation markers (`[1][4]`), and URLs. The shared system prompt in `src/prompts/system.ts` also instructs the model to write short, conversational plain text.

Perplexity uses structured JSON output; the `reply` field description in `STRUCTURED_RESPONSE_SCHEMA` reinforces the same rules.

## Local dev test

### Website chat API

```bash
SESSION=$(uuidgen | tr '[:upper:]' '[:lower:]')
curl -X POST http://localhost:3001/api/chat/messages \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION\",\"text\":\"Hi, my name is Jane\"}"
```

### Dev simulate (legacy)

```bash
curl -X POST http://localhost:3001/dev/simulate-message \
  -H "Content-Type: application/json" \
  -d '{"channelUserId":"test-1","text":"Hi, my name is Jane"}'
```

Verify health shows database connected:

```bash
curl http://localhost:3001/health
# {"status":"ok","database":"connected"}
```

## Troubleshooting

### `Cannot POST /dev/simulate-message` or login returns 404

An old `node dist/index.js` process may be holding port 3001 with only the Phase 1 health route.

```bash
lsof -i :3001          # find PID
kill <PID>             # stop stale process
cd apps/backend && npm run dev
```

Confirm the correct server: `/health` must include `"database":"connected"`.

### `Environment validation failed: AI_PROVIDER_ENCRYPTION_KEY`

Add to `.env` (min 32 characters):

```env
AI_PROVIDER_ENCRYPTION_KEY=dev-local-ai-encryption-key-32ch
```

### Admin login fails

1. Ensure backend started once with `ADMIN_EMAIL` + `ADMIN_PASSWORD` to bootstrap the Supabase Auth user (plain password, not bcrypt).
2. Admin SPA requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in root `.env.local` (or Netlify env).
3. Sign in at `/enrollify-manage/login` with the bootstrapped email/password — login calls `ensureStaffProfile` (client insert via RLS if row missing).
4. In Supabase dashboard: disable public sign-ups; confirm Email provider is enabled.
5. For password reset: add `/enrollify-manage/login` redirect URLs in Supabase Auth (see [phase-4 deploy doc](../../Documents/Bot/phase-4-messenger-deploy.md)).

### `401 Staff profile not found`

The admin auth user exists but has no `staff_profiles` row for **API routes** (leads, notes, etc.). Primary fix: sign out and sign in again (`ensureStaffProfile` on login). Fallback: restart the backend — `ensureStaffProfileForAdmins()` creates missing profiles on startup. Set `ADMIN_FIRST_NAME` / `ADMIN_LAST_NAME` in `.env` if you need a custom display name.

## Deployment (Railway)

Target: **Railway**. Config: [`railway.toml`](railway.toml), [`Procfile`](Procfile).

1. Railway → New project → connect GitHub repo
2. Set **Root directory** to `apps/backend`
3. Add production env vars from `.env.example` (see [website chat plan](../../Documents/Bot/website-chat-implementation-plan.md) Step 4)
4. Deploy; verify: `curl https://<railway-host>/health`
5. Set Netlify **`BACKEND_URL`** to the Railway URL (no trailing slash) — see plan Step 5
6. Set **`CORS_ORIGIN=https://www.enrollifyedu.com`** on Railway

Facebook webhook registration is deferred — see [phase-4-messenger-deploy.md](../../Documents/Bot/phase-4-messenger-deploy.md).
