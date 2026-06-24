# Enrollify AI — Admin Panel

Internal Next.js dashboard for reviewing leads, conversations, and pipeline.

## Setup

```bash
cd apps/admin
npm install
cp .env.example .env.local   # optional — defaults work for local dev
npm run dev
```

Open http://localhost:3000 (backend must run on :3001).

Default login matches `apps/backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Production server |

## API proxy

`/api/*` requests rewrite to the backend (`BACKEND_URL` or `http://localhost:3001`).

## Deploy

Vercel: set root directory to `apps/admin`, env `BACKEND_URL` to Railway backend URL.
