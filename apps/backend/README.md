# Enrollify AI — Backend

Express + TypeScript API for Facebook Messenger webhooks, AI conversation handling, and admin panel auth.

## Setup

```bash
cd apps/backend
npm install
cp .env.example .env
# Fill in all values in .env (see .env.example)
npm run dev
```

The server refuses to start if any required environment variable is missing or invalid (NFR-9). Local dev loads `apps/backend/.env` automatically via `dotenv`; production (e.g. Railway) uses platform env vars.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled output |
| `npm run typecheck` | Type-check without emit |

## Endpoints (Phase 1)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Uptime check — returns `{ "status": "ok" }` |

Webhook (`/webhook`) and admin API routes are added in Phases 3–4.

## Environment variables

See [`.env.example`](.env.example). All secrets are server-only — never prefix with `VITE_`.

## Deployment

Target: **Railway** (Render documented as fallback in Phase 1 discovery).
