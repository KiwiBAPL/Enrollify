# Phase 5 — Integrations and Feeds (Enrollify Blog)

**Target project:** Enrollify monorepo  
**Hosting:** Netlify  
**Status:** Ready for implementation  
**Linked PRD:** [`../portable-blog-prd-enrollify.md`](../portable-blog-prd-enrollify.md) — FR-13, FR-14

---

## Summary

Phase 5 adds build-time syndication (RSS, sitemap, OG HTML shells), runtime OG injection for social crawlers, and analytics exclusion for admin routes. No Express backend involvement.

---

## Task 5.1 — Feed generation script

Port `scripts/generate-feeds.ts` and `scripts/supabase-node-client.ts`.

**Post-build flow:** `vite build` → `generate-feeds.ts` queries Supabase → writes to `dist/`.

**Outputs:**

| Path | Content |
|---|---|
| `dist/blog/rss.xml` | RSS 2.0, published only, summary entries |
| `dist/sitemap.xml` | Static routes + `/blog/{slug}` with `lastmod` |
| `dist/blog/{slug}/index.html` | OG HTML shell per published post |

Port `src/lib/feeds.ts` — RSS and sitemap builders.

**RSS item fields:** title, description (summary), canonical URL, pubDate, author, featured image enclosure when present.

**Graceful skip:** If Supabase env vars missing at build time, build still succeeds; edge function handles runtime OG.

Wire in `package.json`:

```json
{
  "scripts": {
    "build": "vite build && npm run generate:feeds",
    "generate:feeds": "tsx scripts/generate-feeds.ts"
  }
}
```

---

## Task 5.2 — Netlify edge function (FR-13 crawlers)

Port `netlify/edge-functions/blog-og.ts`:

- Intercept GET/HEAD `/blog/{slug}`
- Fetch published post from Supabase REST API (`status=eq.published`)
- Inject OG/Twitter/JSON-LD head tags into `index.html` shell
- Cache ~5 minutes

Port shared logic from `src/lib/blog-og-meta.ts`.

**`netlify.toml`:**

```toml
[[edge_functions]]
  path = "/blog/*"
  function = "blog-og"

[[redirects]]
  from = "/blog/:slug"
  to = "/blog/:slug/index.html"
  status = 200
```

---

## Task 5.3 — Static file serving

Ensure `public/_redirects` has SPA fallback:

```
/*    /index.html   200
```

Static XML/HTML in `dist/` must be served before catch-all.

Optional: `@netlify/plugin-sitemap` for static route discovery — ensure it does not conflict with custom `sitemap.xml` from generate-feeds.

---

## Task 5.4 — RSS autodiscovery

In `BlogMetaTags` listing variant, add:

```html
<link rel="alternate" type="application/rss+xml" title="Blog RSS" href="/blog/rss.xml" />
```

---

## Task 5.5 — Analytics exclusion (optional)

Match Enrollify analytics setup (OQ-E3):

| Provider | Implementation |
|---|---|
| GA4 | Pageview tracker component; skip paths starting with `/enrollify-manage` |
| Plausible | Exclude admin path in script config or custom events filter |

Blog posts at `/blog/{slug}` tracked automatically once public pages exist — no CMS changes on publish.

---

## Task 5.6 — Feed security verification

Port `scripts/verify-feeds.ts`:

- RSS contains published posts only
- No draft slugs in sitemap
- Valid XML structure

Add to `test:security` npm script (with `verify-rls.ts`).

---

## Deploy note

**RSS, sitemap, and build-time OG shells refresh on redeploy.** After publishing new posts, rebuild and redeploy Netlify. Runtime edge OG updates without redeploy when post meta changes in Supabase.

---

## Manual verification checklist

1. [ ] `curl -s https://<domain>/blog/rss.xml` — valid RSS, no drafts
2. [ ] `curl -s https://<domain>/sitemap.xml` — includes blog slugs
3. [ ] `curl -s https://<domain>/blog/{slug} | grep og:title` — post meta, not site default
4. [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
5. [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## Exit criteria

- [ ] `npm run build` produces RSS, sitemap, OG shells
- [ ] Edge function deployed and returns OG tags for crawlers
- [ ] Admin routes excluded from analytics (if analytics enabled)
- [ ] `verify-feeds.ts` passes

---

## Phase 6 next

Automated tests, security scripts, manual QA, Lighthouse.
