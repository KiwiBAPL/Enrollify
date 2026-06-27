# Phase 1 — Discovery and Setup (Enrollify Blog)

**Target project:** Enrollify monorepo  
**Admin path:** `/enrollify-manage`  
**Status:** Ready for implementation  
**Linked PRD:** [`../portable-blog-prd-enrollify.md`](../portable-blog-prd-enrollify.md)

---

## 1. Executive summary

Phase 1 confirms the Enrollify stack, locates the landing SPA app root, documents environment variables, defines the hidden admin route, and creates a feature branch. No blog code ships in this phase — only discovery artefacts and setup.

---

## 2. Stack inventory (Enrollify)

| Layer | Technology | Blog usage |
|---|---|---|
| Runtime | Node.js, TypeScript, ES modules | Build scripts, edge functions |
| Landing SPA | Vite 6, React 19, React DOM 19 | All blog UI |
| Routing | React Router DOM 7 | `/blog`, `/blog/:slug`, `/enrollify-manage/*` |
| Styling | Tailwind CSS 4, `@tailwindcss/vite` | **Enrollify design system only** — do not port PB-Consult visuals |
| Database | Supabase, PostgreSQL 17, RLS | `blog_posts`, storage, auth |
| Client SDK | `@supabase/supabase-js` | Single browser client |
| Backend API | Express 5 (`apps/backend`, Railway) | **Out of scope for blog v1** |
| AI | Claude, Perplexity (`apps/backend`) | Out of scope for blog v1 |
| Messaging | Meta Messenger webhooks | Out of scope for blog v1 |
| Analytics | Plausible, GA4 (optional) | Exclude `/enrollify-manage/*` from tracking |
| Forms | Netlify Forms | Unrelated to blog |
| Hosting | Netlify (SPA + admin) | Build, edge functions, deploy |
| Package manager | npm | |
| Fonts | Google Fonts (Poppins, Nunito Sans) | Enrollify typography |

### Deprecated — do not use for blog

| Item | Location | Note |
|---|---|---|
| Next.js 15 admin | `apps/admin` | Deprecated; blog admin lives in landing SPA |
| Vercel config | `apps/admin/vercel.json` | Ignore |

---

## 3. Monorepo layout (confirm before Phase 2)

| Path | Purpose |
|---|---|
| Landing Vite SPA | Confirm: repo root or `apps/web` (resolve OQ-E4) |
| `apps/backend` | Express API — no blog routes in v1 |
| `apps/admin` | Deprecated Next.js — ignore |
| `supabase/migrations/` | Blog SQL migrations |
| `netlify/` | Edge functions, deploy config |
| `scripts/` | `generate-feeds.ts`, `verify-rls.ts`, `verify-feeds.ts` |

---

## 4. Environment variables

Add to `.env.example` (placeholders only — never commit real keys):

```env
# Client-side (browser) — public, bundled by Vite
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Optional — RLS verification script only (never VITE_ prefix)
SUPABASE_TEST_ADMIN_EMAIL=
SUPABASE_TEST_ADMIN_PASSWORD=
```

**Never** prefix secret keys with `VITE_`. Blog v1 uses publishable key + RLS only.

Set the same `VITE_*` vars in Netlify dashboard (scope **All**) for production builds.

---

## 5. Routes plan

### Public

| Route | Component | Notes |
|---|---|---|
| `/blog` | `BlogListing` | Add nav link in site header |
| `/blog/:slug` | `BlogPostDetail` | 404 if draft or unknown |
| `/blog/rss.xml` | Static (build-time) | Phase 5 |

### Hidden admin (bookmark only — not in public nav)

| Route | Component | Access |
|---|---|---|
| `/enrollify-manage` | `AdminLogin` | Public login form |
| `/enrollify-manage/posts` | `AdminPostList` | Protected |
| `/enrollify-manage/posts/new` | `AdminPostEditor` | Protected |
| `/enrollify-manage/posts/:id` | `AdminPostEditor` | Protected |

### robots.txt

```
Disallow: /enrollify-manage
Sitemap: https://<production-domain>/sitemap.xml
```

---

## 6. Architecture decisions (locked)

1. **Client-only Supabase** for all blog CRUD — no Express backend routes.
2. **Admin auth:** Supabase Auth email/password; `app_metadata.role = 'admin'`.
3. **Security:** Three-pass gate — route guard, app-layer filters, RLS.
4. **Styling:** Port component boundaries and logic from PB-Consult reference; reimplement all CSS with Enrollify tokens.
5. **Content format:** Quill HTML body, sanitized with DOMPurify (not Markdown).

---

## 7. Reference codebase

Port logic from PB-Consultant `clarity-strategy-blueprint`:

| Reference | Purpose |
|---|---|
| `supabase/migrations/001–006` | Schema |
| `src/lib/blog.ts` | Data layer |
| `src/hooks/useBlog.ts` | React Query |
| `docs/blog/as-built.md` | As-built feature list |
| `Documents/Blog Page/pb-consult-blog-prd.md` | Original AC source |

---

## 8. Feature branch

```bash
git checkout -b feature/blog-v1
```

Keep blog schema, UI, and docs isolated until merge-ready.

---

## 9. Configurable constants stub

Create `src/lib/site.ts`:

```typescript
export const SITE_URL = import.meta.env.PROD
  ? "https://<production-domain>"
  : "http://localhost:5173";
export const SITE_NAME = "Enrollify";
export const DEFAULT_AUTHOR_NAME = "Site Owner"; // resolve OQ-E1
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`; // project asset
export const ADMIN_BASE_PATH = "/enrollify-manage";
```

---

## 10. Exit criteria

- [ ] Landing SPA app root confirmed (OQ-E4)
- [ ] `.env.example` updated with Supabase placeholders
- [ ] Feature branch created
- [ ] `site.ts` constants stub in place
- [ ] RLS intent documented (published-only public read; admin CRUD)
- [ ] Blog nav entry planned in site header
- [ ] Owner resolved OQ-E1 through OQ-E5 (see PRD Section 12)

---

## 11. Dependencies for Phase 2

- Supabase project provisioned (PostgreSQL 17)
- Supabase CLI installed and linked (`supabase link`)
- Publishable key available for local dev
