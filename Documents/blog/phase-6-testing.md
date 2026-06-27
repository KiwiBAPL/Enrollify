# Phase 6 — Testing and Verification (Enrollify Blog)

**Target project:** Enrollify monorepo  
**Status:** Ready for implementation  
**Linked PRD:** [`../portable-blog-prd-enrollify.md`](../portable-blog-prd-enrollify.md) — all FR/NFR acceptance criteria

---

## Summary

Phase 6 validates every functional and non-functional requirement through automated unit tests, security scripts, manual QA, Lighthouse performance checks, and accessibility spot-checks. No production deploy until this phase passes.

---

## Task 6.1 — Unit tests (Vitest)

Port test files from reference `src/lib/__tests__/`:

| Test file | Covers |
|---|---|
| `blog-validation.test.ts` | Draft/publish validation, slug regex |
| `sanitize.test.ts` | XSS removal, allowed tags |
| `embed-allowlist.test.ts` | Valid/invalid embed URLs |
| `read-time.test.ts` | WPM calculation |
| `feeds.test.ts` | RSS/sitemap output |
| `blog-og-meta.test.ts` | Meta resolution |
| `blog-search.test.ts` | Fuse search, sort, filters |
| `blog-preview.test.ts` | Preview post mapping |
| `blog-image-html.test.ts` | Inline image HTML builder |
| `blog-storage.test.ts` | Orphan path extraction |
| `featured-image-process.test.ts` | Resize logic |

Run:

```bash
npm test
```

---

## Task 6.2 — Security scripts

```bash
npm run test:security
```

| Script | Checks |
|---|---|
| `scripts/verify-rls.ts` | Anonymous read (no drafts); anonymous INSERT blocked; optional admin CRUD |
| `scripts/verify-feeds.ts` | RSS/sitemap published-only |

Optional env for full admin RLS checks:

```env
SUPABASE_TEST_ADMIN_EMAIL=
SUPABASE_TEST_ADMIN_PASSWORD=
```

---

## Task 6.3 — FR acceptance criteria checklist

### Must (FR-1 – FR-10, FR-10A, FR-15)

| FR | Manual test |
|---|---|
| FR-1 | Create post → verify all columns in Supabase |
| FR-2 | Anonymous `/enrollify-manage/posts` → redirect; direct Supabase write blocked |
| FR-3 | Save draft → not on `/blog` or RSS |
| FR-4 | Edit published → changes visible on reload |
| FR-5 | Formatting persists; script tags stripped |
| FR-6 | Publish blocked without meta/category/alt |
| FR-7 | Featured upload, embed allow-list, orphan delete |
| FR-8 | Publish sets `published_at`; failed publish stays draft |
| FR-9 | Listing newest first; empty state; no drafts |
| FR-10 | Detail 404 for draft slug |
| FR-10A | Section order; preview modal; template fallback |
| FR-15 | List filter/search; delete removes from public |

### Should (FR-11, FR-12, FR-13, FR-16, FR-18)

| FR | Manual test |
|---|---|
| FR-11 | Category/series URL filters |
| FR-12 | Curated related vs auto fallback |
| FR-13 | Share URLs; OG debugger |
| FR-16 | Featured sidebar max 5 |
| FR-18 | Search debounce; sort params |

### Could (FR-14, FR-17)

| FR | Manual test |
|---|---|
| FR-14 | RSS valid; summary-only |
| FR-17 | FAQ sidebar + JSON-LD |

---

## Task 6.4 — NFR verification

### NFR-1 Security

- [ ] Draft slug URL returns 404
- [ ] RSS excludes drafts
- [ ] No draft rows in anonymous Supabase SELECT

### NFR-2 Performance (Lighthouse mobile)

- [ ] `/blog` — LCP ≤ 2.5s, CLS ≤ 0.1
- [ ] `/blog/{slug}` — LCP ≤ 2.5s, CLS ≤ 0.1
- [ ] Images lazy-loaded; embeds reserve space

### NFR-3 Accessibility

- [ ] Single H1 on detail page
- [ ] Keyboard: admin create/edit/publish; public filter/read/share
- [ ] Alt text enforced at publish

### NFR-4 Maintainability

- [ ] Single Supabase client; no secret keys in frontend
- [ ] Template registry extensible

### NFR-5 Reliability

- [ ] Save failure shows error; prior state preserved
- [ ] Content persists across edit sessions

---

## Task 6.5 — Regression checks

- [ ] Existing site routes unaffected
- [ ] Express backend (`apps/backend`) unchanged — no blog routes added
- [ ] Deprecated `apps/admin` untouched
- [ ] Netlify Forms still work (if used on contact pages)

---

## Exit criteria

- [ ] `npm test` green
- [ ] `npm run test:security` green
- [ ] Manual FR checklist signed off
- [ ] Lighthouse targets met on listing + detail
- [ ] Accessibility spot-check passed

---

## Phase 7 next

Production deploy, Search Console, owner sign-off.
