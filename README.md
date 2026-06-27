# EnRollifyEdu Marketing Site

Marketing site for EnRollifyEdu — technology-enabled international student recruitment for New Zealand and global education providers. Includes a student-focused landing page, Study in New Zealand guide, SEO pillar routes, contact page, public blog, and hidden admin panel.

Built with **Vite**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **React Router 7**, and **Supabase**. Visual design tokens from [`design.json`](design.json).

## Run locally

```bash
npm install
cp .env.example .env.local   # fill VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

Open **http://localhost:5180** (Vite strict port).

Blog and admin features require Supabase env vars in `.env.local`. For Enrollify AI admin API routes, also run the backend (see below).

For Netlify Forms testing (submissions require Netlify handler):

```bash
npm run netlify:dev
```

## Public routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (anchor navigation) |
| `/study-in-new-zealand` | Study in New Zealand guide — structured content, universities map with click-to-enlarge lightbox |
| `/find-a-course` | Course finder hub |
| `/find-a-course/:categorySlug` | Course category pages |
| `/career-guides` | Career guides hub (placeholder) |
| `/student-resources` | Student resources hub (placeholder) |
| `/student-resources/:topic` | Student resource topic pages (placeholder) |
| `/city-guides` | City guides hub (placeholder) |
| `/book-consultation` | Free consultation booking |
| `/contact` | Contact page |
| `/blog` | Blog listing (filters, search, sort) |
| `/blog/:slug` | Blog post detail |
| `/blog/rss.xml` | RSS feed (build-time static) |
| `/sitemap.xml` | Sitemap (build-time static; includes `/study-in-new-zealand`) |

## Build

```bash
npm run build    # tsc + vite build + generate:feeds
npm run preview
```

`generate:feeds` requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (reads `.env.local` locally; set in Netlify env with scope **All** for production builds).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (port 5180) |
| `npm run build` | Typecheck, build, generate RSS/sitemap/OG shells |
| `npm run generate:feeds` | Build RSS, sitemap, and OG HTML shells |
| `npm run verify:feeds` | Validate feed output |
| `npm test` | Unit tests (Vitest) |
| `npm run test:security` | RLS verification + feed checks |
| `npm run typecheck` | TypeScript check |
| `npm run netlify:dev` | Local Netlify dev (forms) |

## Deploy

Configured for **Netlify** via [`netlify.toml`](netlify.toml). Pushes to `main` trigger production deploys when the repo is connected.

Set environment variables from [`.env.example`](.env.example):

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` — required for blog, admin auth, and build-time feeds
- `VITE_ANALYTICS_PROVIDER` and `VITE_ANALYTICS_ID` — optional analytics
- `BACKEND_URL` — Railway backend URL for `/api/*` proxy (Enrollify AI admin)

Blog OG injection uses Netlify edge function `blog-og` on `/blog/*`.

## Enrollify AI (Messenger bot + admin panel)

Separate backend under `apps/` — blog does not use it.

| App | Path | Docs |
|-----|------|------|
| Backend API | [`apps/backend/`](apps/backend/) | [Phase 4](Documents/Bot/phase-4-messenger-deploy.md) |
| Admin panel | `/enrollify-manage` on Netlify site (`src/`) | [Phase 4](Documents/Bot/phase-4-messenger-deploy.md) |
| PRD | — | [`Documents/Bot/enrollify-ai-prd.md`](Documents/Bot/enrollify-ai-prd.md) |

### Admin routes (`/enrollify-manage`)

Not linked in public nav; blocked in `robots.txt`.

| Route | Purpose |
|-------|---------|
| `/enrollify-manage/login` | Supabase Auth login |
| `/enrollify-manage` | Leads dashboard |
| `/enrollify-manage/leads/:id` | Lead conversation |
| `/enrollify-manage/posts` | Blog post list |
| `/enrollify-manage/posts/new` | Create blog post |
| `/enrollify-manage/posts/:id` | Edit blog post |
| `/enrollify-manage/settings/profile` | Staff profile |
| `/enrollify-manage/settings/ai-providers` | AI provider settings |

Backend env vars: [`apps/backend/.env.example`](apps/backend/.env.example) (server-only — never `VITE_*`).

## Documentation

### Marketing site

| Phase | Document |
|-------|----------|
| 1 — Discovery | [`Documents/phase-1-discovery.md`](Documents/phase-1-discovery.md) |
| 2 — Core build | [`Documents/phase-2-core-build.md`](Documents/phase-2-core-build.md) |
| 3 — Implementation | [`Documents/phase-3-implementation.md`](Documents/phase-3-implementation.md) |
| 4 — Integrations | [`Documents/phase-4-integrations.md`](Documents/phase-4-integrations.md) |
| 5 — Testing | [`Documents/phase-5-testing-verification.md`](Documents/phase-5-testing-verification.md) |
| 6 — Blog | [`Documents/phase-6-blog.md`](Documents/phase-6-blog.md) |
| Quality check (PRD §10) | [`Documents/quality-check.md`](Documents/quality-check.md) |
| PRD | [`Documents/EnRollifyEdu-landing-page-prd.md`](Documents/EnRollifyEdu-landing-page-prd.md) |

### Enrollify AI bot

| Phase | Document |
|-------|----------|
| 1 — Discovery | [`Documents/Bot/phase-1-discovery.md`](Documents/Bot/phase-1-discovery.md) |
| 2 — Schema | [`Documents/Bot/phase-2-schema.md`](Documents/Bot/phase-2-schema.md) |
| 3 — Core services | [`Documents/Bot/phase-3-core-services.md`](Documents/Bot/phase-3-core-services.md) |
| 4 — Messenger + deploy | [`Documents/Bot/phase-4-messenger-deploy.md`](Documents/Bot/phase-4-messenger-deploy.md) |
| 5 — Admin features (notes, profiles) | [`Documents/Bot/phase-5-admin-features.md`](Documents/Bot/phase-5-admin-features.md) |
| PRD | [`Documents/Bot/enrollify-ai-prd.md`](Documents/Bot/enrollify-ai-prd.md) |

## Design source

Colors, typography, spacing, and component styles are mapped from [`design.json`](design.json).
