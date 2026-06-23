# EnRollifyEdu Landing Page

Single-page marketing site for EnRollifyEdu — technology-enabled international student recruitment for New Zealand and global education providers.

Built with **Vite**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Visual design tokens from [`design.json`](design.json).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

For Netlify Forms testing (submissions require Netlify handler):

```bash
npm run netlify:dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Configured for **Netlify** via [`netlify.toml`](netlify.toml). Connect the repo and set environment variables from [`.env.example`](.env.example) when enabling analytics.

## Enrollify AI (Messenger bot + admin panel)

Separate apps under `apps/` — does not affect the Netlify website build.

| App | Path | Docs |
|-----|------|------|
| Backend API | [`apps/backend/`](apps/backend/) | [Phase 1 discovery](Documents/Bot/phase-1-discovery.md) |
| Admin panel | [`apps/admin/`](apps/admin/) | Phase 3 (stub) |
| PRD | — | [`Documents/Bot/enrollify-ai-prd.md`](Documents/Bot/enrollify-ai-prd.md) |

Backend env vars: [`apps/backend/.env.example`](apps/backend/.env.example) (server-only — never `VITE_*`).

## Documentation

### Landing page

| Phase | Document |
|-------|----------|
| 1 — Discovery | [`Documents/phase-1-discovery.md`](Documents/phase-1-discovery.md) |
| 2 — Core build | [`Documents/phase-2-core-build.md`](Documents/phase-2-core-build.md) |
| 3 — Implementation | [`Documents/phase-3-implementation.md`](Documents/phase-3-implementation.md) |
| 4 — Integrations | [`Documents/phase-4-integrations.md`](Documents/phase-4-integrations.md) |
| 5 — Testing | [`Documents/phase-5-testing-verification.md`](Documents/phase-5-testing-verification.md) |
| Quality check (PRD §10) | [`Documents/quality-check.md`](Documents/quality-check.md) |
| PRD | [`Documents/EnRollifyEdu-landing-page-prd.md`](Documents/EnRollifyEdu-landing-page-prd.md) |

### Enrollify AI bot

| Phase | Document |
|-------|----------|
| 1 — Discovery | [`Documents/Bot/phase-1-discovery.md`](Documents/Bot/phase-1-discovery.md) |
| 2 — Schema | [`Documents/Bot/phase-2-schema.md`](Documents/Bot/phase-2-schema.md) |
| PRD | [`Documents/Bot/enrollify-ai-prd.md`](Documents/Bot/enrollify-ai-prd.md) |

## Design source

Colors, typography, spacing, and component styles are mapped from [`design.json`](design.json).
