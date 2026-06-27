# Phase 3 Frontend — PB Consult Blog

**Date:** 2026-06-07  
**Branch:** `feature/blog-v1`  
**Status:** Complete — documented in PRD v1.0 as-built and `docs/blog/as-built.md`

---

## Summary

Phase 3 delivered the full blog UX: hidden admin authoring at `/pbc-manage`, public `/blog` listing and `/blog/:slug` detail pages, Quill editor, publish validation, SEO meta tags, and navigation update.

---

## Deliverables

### Shared utilities

| File | Purpose |
|---|---|
| `src/lib/sanitize.ts` | DOMPurify HTML sanitisation |
| `src/lib/embed-allowlist.ts` | YouTube, Vimeo, Spotify, Apple Podcasts, SoundCloud |
| `src/lib/read-time.ts` | ~200 WPM read-time estimate |
| `src/lib/blog-validation.ts` | Draft + publish validation (FR-6) |
| `src/lib/slug.ts` | Auto-slug from title |
| `src/hooks/useBlog.ts` | React Query hooks + mutations |

### Admin (hidden — no public nav links)

| Route | Page |
|---|---|
| `/pbc-manage/posts` | Post list with status filter, title search, edit, delete |
| `/pbc-manage/posts/new` | Create draft |
| `/pbc-manage/posts/:id` | Edit + save / publish |

Components: `AdminLayout`, `QuillEditor`, `BlogPostForm`

### Public blog

| Route | Page |
|---|---|
| `/blog` | Listing with filters (`?category`, `?series`, `?search`) |
| `/blog/:slug` | Detail with CTA, share buttons, related posts |

Components: `BlogPostCard`, `BlogFilters`, `BlogBody`, `RelatedPosts`, `ShareButtons`, `BlogMetaTags`

### Other updates

- `Header.tsx` — "Blog" nav link added (between About and Contact)
- `tailwind.config.ts` — `@tailwindcss/typography` plugin enabled
- `index.css` — responsive embed + Quill editor styles
- Removed `AdminPostsPlaceholder.tsx`

---

## FR coverage

| Requirement | Status |
|---|---|
| FR-3 Create draft | Done |
| FR-4 Edit post | Done |
| FR-5 Quill editor (H2/H3, sanitise) | Done |
| FR-6 Publish metadata validation | Done |
| FR-7 Featured image + embed allow-list | Done |
| FR-8 Manual publish | Done |
| FR-9 Blog listing | Done |
| FR-10 Blog detail + 404 | Done |
| FR-11 Category/series filters | Done |
| FR-12 Related posts (3 slots) | Done |
| FR-13 LinkedIn/Facebook share | Done |
| FR-15 Admin post list | Done |

**Phase 4 (not in this phase):** RSS feed, sitemap

---

## Manual test checklist

1. Sign in at `/pbc-manage` (requires admin user + `role: admin`)
2. Create draft → not visible on `/blog`
3. Publish with full metadata → appears on `/blog` and `/blog/:slug`
4. Unpublished slug → 404
5. Filters via URL params work
6. Related posts on detail page
7. Share links use canonical URL
8. Invalid embed URL rejected in editor
9. Delete removes post from public listing

---

## Owner prereq

Admin user must have password and `app_metadata.role = 'admin'` in Supabase Auth before admin flows work end-to-end.

---

## Phase 4 next

- RSS feed at `/blog/rss.xml`
- Sitemap updates for published post URLs
- Share/OG verification
