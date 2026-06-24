# Enrollify AI — Backend

Express + TypeScript API for Facebook Messenger webhooks, AI conversation handling, and admin panel auth.

## Setup

```bash
cd apps/backend
npm install
cp .env.example .env
# Fill in SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD, AI_PROVIDER_ENCRYPTION_KEY
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
| `POST` | `/api/auth/login` | Public | Admin JWT login |
| `GET/PATCH/…` | `/api/admin/*` | JWT | Students, pipeline, analytics, AI providers |
| `POST` | `/dev/simulate-message` | Dev only | Test conversation pipeline locally |

Full route list: [Phase 3 doc](../../Documents/Bot/phase-3-core-services.md).

## Environment variables

See [`.env.example`](.env.example). All secrets are server-only — never prefix with `VITE_`.

Key vars for Phase 3:

| Variable | Required | Purpose |
|----------|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server DB access |
| `JWT_SECRET` | Yes | Admin JWT signing (min 32 chars) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Yes | Admin login |
| `AI_PROVIDER_ENCRYPTION_KEY` | Yes | Encrypts AI API keys in Supabase (min 32 chars) |
| `PERPLEXITY_API_KEY` | No | Bootstrap first provider if DB empty |

## Local dev test

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

Email and password must match `ADMIN_EMAIL` and `ADMIN_PASSWORD` in **this** `.env` file exactly.

## Deployment

Target: **Railway**. Set all vars from `.env.example`. Run `npm run build && npm run start` (not tsx).
