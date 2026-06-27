# EnRollifyEdu Marketing Site — Phase 6 Blog Module

| Field | Details |
|-------|---------|
| Phase | 6 — Blog module |
| Status | Complete |
| Date | 2026-06-27 |
| Linked PRD | [EnRollifyEdu-landing-page-prd.md](./EnRollifyEdu-landing-page-prd.md) §5 (FR-8+) |
| Prior phases | [phase-1-discovery.md](./phase-1-discovery.md) through [phase-5-testing-verification.md](./phase-5-testing-verification.md) |

## 1. Purpose

Phase 6 adds a self-contained blog module to the EnRollify marketing SPA: admin-only authoring and publishing, public listing and detail pages, SEO metadata, RSS, sitemap, and social OG support. The Express backend (`apps/backend`) is **not** used for blog v1 — all blog CRUD runs client-side via Supabase publishable key + RLS.

---

## 2. Architecture

| Layer | Responsibility |
|-------|----------------|
| Vite SPA (`src/`) | Public blog UI, admin post editor, Supabase client calls |
| Supabase Postgres + RLS | `blog_posts` table, access control via `is_admin()` |
| Supabase Auth | Admin login; `app_metadata.role = 'admin'` |
| Supabase Storage | `blog-images` bucket (featured + inline images) |
| Build script | `scripts/generate-feeds.ts` — RSS, sitemap, per-slug OG HTML shells |
| Netlify Edge Function | `netlify/edge-functions/blog-og.ts` — runtime OG for social crawlers |
| Express backend | **Out of scope** — no blog API routes |

Security comes from RLS, not key secrecy. Never expose secret keys in `VITE_*` variables.

---

## 3. Routes

### 3.1 Public

| Route | Component | Notes |
|-------|-----------|-------|
| `/blog` | `BlogListingPage` | Filters: `?category`, `?series`, `?search`, `?sort` |
| `/blog/:slug` | `BlogPostDetailPage` | 404 for draft or unknown slug |
| `/blog/rss.xml` | Static (build-time) | Published posts only, summary entries |
| `/sitemap.xml` | Static (build-time) | Static routes + `/blog/{slug}` per published post |

"Blog" link in site header → `/blog`. Admin routes are not linked publicly.

### 3.2 Admin (hidden — `/enrollify-manage`)

Shared with Enrollify AI admin. Blog routes:

| Route | Component |
|-------|-----------|
| `/enrollify-manage/posts` | `AdminPostListPage` |
| `/enrollify-manage/posts/new` | `AdminPostEditorPage` |
| `/enrollify-manage/posts/:id` | `AdminPostEditorPage` |

`AdminShell` sidebar includes a **Blog** nav item. `public/robots.txt` disallows `/enrollify-manage/`. Analytics excludes `/enrollify-manage/*`.

---

## 4. Schema and RLS

Migration: [`supabase/migrations/20260627120000_blog_posts.sql`](../supabase/migrations/20260627120000_blog_posts.sql)

**`blog_posts` columns:** `id`, `title`, `slug`, `body`, `summary`, `status` (`draft` | `published`), `category`, `series_collection`, `featured_image_url`, `featured_image_alt`, `meta_title`, `meta_description`, `author_name`, `published_at`, `article_template`, `related_post_slugs`, `is_featured`, `faq_text`, `created_at`, `updated_at`.

**RLS policies:**

| Policy | Operation | Rule |
|--------|-----------|------|
| `blog_posts_public_read` | SELECT | `status = 'published'` |
| `blog_posts_admin_read` | SELECT | `is_admin()` |
| `blog_posts_admin_insert` | INSERT | `is_admin()` |
| `blog_posts_admin_update` | UPDATE | `is_admin()` |
| `blog_posts_admin_delete` | DELETE | `is_admin()` |

**Storage:** `blog-images` bucket — public read; admin write (2 MB; JPEG/PNG/WebP). Paths: `{postId}/...` (featured), `{postId}/inline/...` (body).

Apply migration: `supabase db push` (or equivalent for remote project).

---

## 5. Key modules

| Area | Location |
|------|----------|
| Data layer | [`src/lib/blog.ts`](../src/lib/blog.ts) |
| Validation | [`src/lib/blog-validation.ts`](../src/lib/blog-validation.ts) |
| Search / filters | [`src/lib/blog-search.ts`](../src/lib/blog-search.ts) |
| OG meta | [`src/lib/blog-og-meta.ts`](../src/lib/blog-og-meta.ts) |
| Feeds | [`src/lib/feeds.ts`](../src/lib/feeds.ts) |
| Sanitization | [`src/lib/sanitize.ts`](../src/lib/sanitize.ts) |
| React Query hooks | [`src/hooks/useBlog.ts`](../src/hooks/useBlog.ts) |
| Public pages | [`src/pages/BlogListingPage.tsx`](../src/pages/BlogListingPage.tsx), [`src/pages/BlogPostDetailPage.tsx`](../src/pages/BlogPostDetailPage.tsx) |
| Admin pages | [`src/pages/admin/AdminPostListPage.tsx`](../src/pages/admin/AdminPostListPage.tsx), [`AdminPostEditorPage.tsx`](../src/pages/admin/AdminPostEditorPage.tsx) |
| Admin components | [`src/components/admin/blog/`](../src/components/admin/blog/) |
| Public components | [`src/components/blog/`](../src/components/blog/) |
| Build scripts | [`scripts/generate-feeds.ts`](../scripts/generate-feeds.ts), [`scripts/verify-feeds.ts`](../scripts/verify-feeds.ts), [`scripts/verify-rls.ts`](../scripts/verify-rls.ts) |
| Edge function | [`netlify/edge-functions/blog-og.ts`](../netlify/edge-functions/blog-og.ts) |
| Netlify config | [`netlify.toml`](../netlify.toml) |

---

## 6. Environment variables

See [`.env.example`](../.env.example).

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Browser + build scripts | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser + build scripts | Publishable key; security via RLS |
| `SUPABASE_TEST_ADMIN_EMAIL` | `verify-rls.ts` only (optional) | Admin CRUD checks in RLS script |
| `SUPABASE_TEST_ADMIN_PASSWORD` | `verify-rls.ts` only (optional) | Admin CRUD checks in RLS script |

**Netlify:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with scope **All** — required at **build time** for `generate:feeds` (RSS, sitemap, OG shells) and at runtime for blog/admin UI.

Never prefix secret keys with `VITE_`.

---

## 7. Build and deploy

```bash
npm run build   # tsc + vite build + generate:feeds
```

`generate:feeds` writes:

- `dist/blog/rss.xml`
- `dist/sitemap.xml`
- `dist/blog/{slug}/index.html` (OG meta shells)

[`netlify.toml`](../netlify.toml):

- Edge function `blog-og` on `/blog/*`
- Redirect `/blog/:slug` → `/blog/:slug/index.html` (OG shells before SPA catch-all)

---

## 8. Admin workflow

1. Sign in at `/enrollify-manage/login` (requires admin user with `app_metadata.role = 'admin'`)
2. Open **Blog** in sidebar → post list
3. Create draft → save first (required for image uploads — post ID needed)
4. Edit with Quill editor; set SEO fields, category, optional series/FAQ
5. Publish — validation gate ensures required metadata; `published_at` set on first publish
6. Drafts are invisible on `/blog`, direct slug URL, and RSS

---

## 9. Verification

### 9.1 Automated

```bash
npm test                  # Unit tests (blog-validation, feeds, sanitize, etc.)
npm run test:security     # verify-rls.ts + verify-feeds.ts
npm run verify:feeds      # Feed/sitemap checks only
npm run typecheck
npm run build
```

### 9.2 Deploy smoke checklist

- [ ] `/blog` loads; published posts visible; drafts absent
- [ ] `/blog/{slug}` renders published post; draft/unknown → 404
- [ ] `/blog/rss.xml` valid; published only; no admin paths
- [ ] `/sitemap.xml` includes blog URLs; no admin paths
- [ ] Social OG preview correct (edge function + build shells)
- [ ] Admin: create draft → publish → appears on public listing
- [ ] `robots.txt` disallows `/enrollify-manage/`
- [ ] Express backend unchanged — no blog routes added

---

## 10. Out of scope (v1)

- Express backend blog API routes
- Scheduled / automated publishing
- Multi-author workflows, comments, tags
- Full-text RSS
- Visual design ported from external reference projects
- Deprecated `apps/admin/` Next.js app

---

## 11. Phase 6 deliverables checklist

- [x] Supabase migration (`blog_posts`, RLS, storage)
- [x] Data layer and React Query hooks
- [x] Admin post list, editor, Quill, image upload
- [x] Public listing and detail with template registry (`classic`)
- [x] SEO meta, JSON-LD, share buttons, related posts
- [x] RSS, sitemap, OG shells, edge function
- [x] Unit tests and RLS verification script
- [x] Navigation update (Blog in header)
- [x] This document
