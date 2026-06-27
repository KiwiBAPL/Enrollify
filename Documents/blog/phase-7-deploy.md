# Phase 7 — Deploy and Rollout (Enrollify Blog)

**Target project:** Enrollify monorepo  
**Hosting:** Netlify (SPA), Railway (backend — unchanged)  
**Status:** Ready for implementation  
**Linked PRD:** [`../portable-blog-prd-enrollify.md`](../portable-blog-prd-enrollify.md)

---

## Summary

Phase 7 merges the feature branch, deploys to Netlify, submits sitemap to Google Search Console, and obtains owner sign-off. Document operational procedures for post-publish rebuilds.

---

## Task 7.1 — Pre-merge checklist

- [ ] All Phase 6 tests pass on feature branch
- [ ] Code review: no `VITE_*` secret keys; no blog routes in Express backend
- [ ] `.env.example` has placeholders only
- [ ] `robots.txt` disallows `/enrollify-manage`
- [ ] PR description links to PRD and phase docs

```bash
git checkout main
git merge feature/blog-v1
```

---

## Task 7.2 — Netlify configuration

**Environment variables** (scope **All**):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

**Build command:** `npm run build` (includes feed generation)

**Publish directory:** `dist`

Verify edge function `blog-og` deploys with site.

---

## Task 7.3 — Production smoke test

After deploy:

1. [ ] `/blog` loads; published posts visible
2. [ ] `/blog/{slug}` renders post
3. [ ] `/blog/rss.xml` valid
4. [ ] `/sitemap.xml` includes blog URLs
5. [ ] `/enrollify-manage` login works for admin
6. [ ] Draft post not accessible at public slug URL
7. [ ] OG tags on slug URL (curl or debugger)

---

## Task 7.4 — Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console)
2. Submit sitemap: `https://<production-domain>/sitemap.xml`
3. URL Inspection on `/blog` and initial post URLs — request indexing

**Target:** Landing page and majority of posts indexed within 30 days of launch (PRD success measure).

---

## Task 7.5 — Operational documentation

Document for site owner:

### After publishing a new post

1. Post is live immediately on `/blog` and `/blog/:slug` (SPA + edge OG).
2. **Rebuild and redeploy Netlify** to refresh:
   - `/blog/rss.xml`
   - `/sitemap.xml`
   - Build-time OG HTML shells at `/blog/{slug}/index.html`
3. Runtime edge OG updates without redeploy when meta changes in Supabase.

### Admin access

- Bookmark `/enrollify-manage` — not linked in public navigation.
- Sign in with Supabase Auth admin credentials.

---

## Task 7.6 — Rollback plan

If critical issues after deploy:

1. Revert merge commit on `main`
2. Redeploy previous Netlify build
3. Blog routes return 404 until fix merged

Draft posts remain in Supabase — no data loss on rollback.

---

## Task 7.7 — Owner sign-off

| Item | Owner | Date |
|---|---|---|
| Blog listing and detail acceptable | | |
| Admin workflow acceptable | | |
| SEO meta and OG previews verified | | |
| Analytics tracking confirmed (if enabled) | | |
| Search Console sitemap submitted | | |

Resolve any remaining open questions (PRD Section 12):

| ID | Question |
|---|---|
| OQ-E1 | Default author name |
| OQ-E2 | End-of-article CTA copy/link |
| OQ-E3 | GA4 / Plausible / both / neither |
| OQ-E4 | Confirmed SPA app root |
| OQ-E5 | Manual redeploy for feeds (default) |

---

## Exit criteria

- [ ] Production deploy successful
- [ ] Smoke tests pass
- [ ] Sitemap submitted to Search Console
- [ ] Owner sign-off recorded
- [ ] Post-publish rebuild procedure documented

---

## Post-launch monitoring

- Monitor Netlify deploy logs and edge function errors
- Check GA4/Plausible for blog traffic trends (optional)
- Regular publishing cadence to meet organic traffic success measure
