# Phase 4 — Public UI (Enrollify Blog)

**Target project:** Enrollify monorepo  
**Status:** Ready for implementation  
**Linked PRD:** [`../portable-blog-prd-enrollify.md`](../portable-blog-prd-enrollify.md) — FR-9, FR-10, FR-10A, FR-11, FR-12, FR-13, FR-16, FR-17, FR-18

---

## Summary

Phase 4 builds public blog pages: listing with filters and search, post detail with template registry, related posts, share buttons, and SEO meta tags. Apply **Enrollify styling only** — functional section order from FR-10A is fixed; visual presentation is project-specific.

---

## Dependencies

```bash
npm install fuse.js react-helmet-async
```

Wrap app in `HelmetProvider` in `main.tsx`.

---

## Task 4.1 — Blog listing (FR-9, FR-11, FR-16, FR-18)

Port `src/pages/BlogListing.tsx` and supporting components:

| Component | Purpose |
|---|---|
| `BlogListingToolbar.tsx` | Search (debounced 300ms), sort, series filter |
| `BlogPostCard.tsx` | Card → links to `/blog/{slug}` |
| `BlogCategorySidebar.tsx` | Category filter links (preserve URL params) |
| `BlogFeaturedSidebar.tsx` | Up to 5 featured posts (`FEATURED_SIDEBAR_LIMIT`) |

**Data:** `usePublishedPosts({})` — load all published posts; filter client-side.

**URL params:**

| Param | Values |
|---|---|
| `category` | Filter by category |
| `series` | Filter by series_collection |
| `search` | Fuse.js fuzzy search |
| `sort` | `newest` (default), `oldest`, `title` |

Port `src/lib/blog-search.ts`:

- Fuse weights: title 0.5, summary 0.3, H2–H4 headings 0.2
- When `search` active, skip sort
- `getFeaturedPosts()` — `is_featured === true`, newest first, limit 5

**Empty state:** Clear message when no posts match.

**Nav:** Add "Blog" link in site header → `/blog`.

---

## Task 4.2 — Blog detail (FR-10, FR-10A)

Port `src/pages/BlogPostDetail.tsx` as thin shell:

1. Read `slug` from `useParams()`
2. `usePublishedPost(slug)` → 404 if null
3. `useRelatedPosts(post)` for related section
4. `getArticleTemplate(post.article_template)` → render template component
5. Compute read-time from body (`src/lib/read-time.ts` — 200 WPM, min 1 min)

### Template registry

Port `src/components/blog/templates/`:

| File | Purpose |
|---|---|
| `templates/types.ts` | `BlogArticleTemplateId`, props interface |
| `templates/registry.ts` | `getArticleTemplate()`, `DEFAULT_ARTICLE_TEMPLATE = "classic"` |
| `templates/classic/ClassicArticleTemplate.tsx` | v1 layout |

**Functional section order (FR-10A):**

1. Title block (sole H1)
2. Metadata row (date, author, category, series, read-time)
3. Featured image (conditional)
4. Body + optional author/FAQ aside slots
5. End-of-article CTA (Enrollify copy/link — resolve OQ-E2)
6. Share actions
7. Related posts

Port shared blocks under `src/components/blog/article/`:

- `ArticleGoBack`, `ArticleMetadata`, `ArticleFeaturedImage`
- `ArticleAuthorAside`, `ArticleFaqAside` (FAQ from `parseFaqText`)
- `ArticleEndCta`, `ShareButtons`, `RelatedPosts`

**404:** Use existing `NotFound` component for unknown/unpublished slugs.

---

## Task 4.3 — Body rendering (FR-5)

Port `src/components/blog/BlogBody.tsx`:

- `sanitizeBlogHtml()` via DOMPurify
- `loading="lazy"` on images
- Inline image styles via `applyBlogInlineImageStyles()`

Port `src/lib/parse-faq.ts` for FAQ sidebar + JSON-LD input.

---

## Task 4.4 — Related posts (FR-12)

Port `src/components/blog/RelatedPosts.tsx`:

- Uses `getRelatedPosts()` — curated slugs first, else series → category, 3 slots
- Hide section gracefully when empty

---

## Task 4.5 — Social sharing (FR-13)

Port `src/components/blog/ShareButtons.tsx`:

- LinkedIn and Facebook share URLs targeting canonical `/blog/:slug`
- No third-party scripts that block render

---

## Task 4.6 — SEO meta tags

Port `src/components/blog/BlogMetaTags.tsx` + `src/lib/blog-og-meta.ts`:

**Listing meta:** title, description, canonical, OG, RSS alternate link

**Post meta:** title, description, canonical, OG/Twitter article tags, Article JSON-LD, optional FAQPage JSON-LD

Resolution: `meta_title || title`, `meta_description || summary`, featured image or `DEFAULT_OG_IMAGE`

Constants from `src/lib/site.ts`.

---

## Task 4.7 — Category/series label links

On detail page, category and series labels link to `/blog?category=...` or `/blog?series=...` (FR-11).

---

## Exit criteria

- [ ] `/blog` lists published posts newest first
- [ ] Filters, search, sort work via URL params
- [ ] Featured sidebar shows up to 5 featured posts
- [ ] `/blog/:slug` renders published post; 404 for draft/unknown
- [ ] Template section order matches FR-10A
- [ ] Related posts show (curated or auto)
- [ ] Share buttons open correct URLs
- [ ] Helmet meta tags present in page source
- [ ] FAQ sidebar + JSON-LD when `faq_text` set
- [ ] All UI uses Enrollify design system (no PB-Consult styling)

---

## Phase 5 next

RSS, sitemap, build-time OG shells, Netlify edge function.
