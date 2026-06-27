# Phase 2 — Schema and Backend (Enrollify Blog)

**Target project:** Enrollify monorepo  
**Status:** Ready for implementation  
**Linked PRD:** [`../portable-blog-prd-enrollify.md`](../portable-blog-prd-enrollify.md)

---

## Summary

Phase 2 delivers the Supabase backend: `blog_posts` table with RLS, `blog-images` storage bucket, TypeScript data-access layer, types, and RLS verification script. Apply migrations via Supabase CLI (`supabase db push`).

---

## Deliverables

| Item | Location |
|---|---|
| SQL migrations 001–006 | `supabase/migrations/` |
| Supabase config | `supabase/config.toml` (`supabase init` if missing) |
| Data-access layer | `src/lib/blog.ts` |
| Types | `src/types/database.ts` |
| Supabase client | `src/lib/supabase.ts` |
| RLS verify script | `scripts/verify-rls.ts` |
| Env template | `.env.example` |

---

## Task 2.1 — Apply migrations (in order)

```bash
supabase link --project-ref <project-ref>
supabase db push
```

| File | Purpose |
|---|---|
| `001_blog_posts.sql` | Core table, indexes, triggers, RLS, storage bucket |
| `002_blog_posts_article_template.sql` | `article_template` column |
| `003_blog_posts_related_post_slugs.sql` | `related_post_slugs text[]` |
| `004_blog_posts_is_featured.sql` | `is_featured boolean` + partial index |
| `005_blog_security_linter_fixes.sql` | **Enrollify blog-only** — see below |
| `006_blog_posts_faq.sql` | `faq_text text` |

### Migration 005 — Enrollify adaptation

The PB-Consult reference `005_security_linter_fixes.sql` also touches `contact_messages` and other site tables. For Enrollify, create **`005_blog_security_linter_fixes.sql`** with **blog-relevant portions only**:

```sql
-- Blog security linter fixes (Enrollify — blog-only)

CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- Public bucket URLs work without storage.objects SELECT policy
DROP POLICY IF EXISTS blog_images_public_read ON storage.objects;
```

If Enrollify already has `is_admin()` for other features, merge rather than duplicate.

---

## Task 2.2 — Admin user setup

1. Create admin user in Supabase Auth (Dashboard → Authentication → Users).
2. Grant admin role:

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
WHERE email = 'owner@example.com';
```

---

## Task 2.3 — Implement `src/lib/supabase.ts`

Single browser client:

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn("Supabase env vars missing — blog features disabled");
}

export const supabase = createClient<Database>(url ?? "", key ?? "");
```

---

## Task 2.4 — Implement `src/types/database.ts`

Define:

- `BlogPostStatus = "draft" | "published"`
- `BlogArticleTemplateId = "classic"` (extend registry later)
- `BlogPost` interface with all columns from PRD Section 4.2
- `BlogPostInsert`, `BlogPostUpdate`
- `Database` interface for typed client

---

## Task 2.5 — Port `src/lib/blog.ts`

Copy from PB-Consult reference and adapt:

| Function | Scope | Notes |
|---|---|---|
| `getPublishedPosts` | Public | `.eq("status", "published")`; optional category/series filters |
| `getPublishedPostBySlug` | Public | Published only |
| `getRelatedPosts` | Public | Curated slugs first; else series → category (limit 3) |
| `getDistinctCategories` | Public | Unique non-empty categories |
| `getPostsForRss` | Build/feed | Published, selected columns |
| `listAllPosts` | Admin | All statuses; sort by **`created_at desc`** (not `updated_at`) |
| `getPostById` | Admin | Any status |
| `createPost` | Admin | Default `status: draft`, `author_name` from `DEFAULT_AUTHOR_NAME` |
| `updatePost` | Admin | |
| `deletePost` | Admin | |
| `publishPost` | Admin | Sets `published_at` to now |
| `isSlugAvailable` | Admin | |
| `uploadFeaturedImage` | Admin | Resize via `featured-image-process.ts` |
| `uploadBodyImage` | Admin | Path `{postId}/inline/...` |
| `deleteBodyImageIfOrphaned` | Admin | Storage cleanup |

Constants: `BLOG_IMAGES_BUCKET = "blog-images"`, `MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024`.

All functions return `{ data, error }` with `BlogResult<T>`.

---

## Task 2.6 — RLS verification

Port `scripts/verify-rls.ts` from reference. Run:

```bash
npx tsx scripts/verify-rls.ts
```

| Check | Expected |
|---|---|
| Anonymous SELECT | Published posts only; no drafts |
| Anonymous INSERT | Blocked (42501) |
| Admin CRUD | Pass when `SUPABASE_TEST_ADMIN_EMAIL/PASSWORD` set |

Add npm script:

```json
"test:security": "tsx scripts/verify-rls.ts && tsx scripts/verify-feeds.ts"
```

(`verify-feeds.ts` added in Phase 5 — stub or skip until then.)

---

## RLS policy summary

| Policy | Operation | Rule |
|---|---|---|
| `blog_posts_public_read` | SELECT | `status = 'published'` |
| `blog_posts_admin_read` | SELECT | `is_admin()` |
| `blog_posts_admin_insert` | INSERT | `is_admin()` |
| `blog_posts_admin_update` | UPDATE | `is_admin()` |
| `blog_posts_admin_delete` | DELETE | `is_admin()` |

Storage: admin INSERT/UPDATE/DELETE on `blog-images` bucket via `is_admin()`.

---

## Exit criteria

- [ ] Migrations 001–006 applied to Enrollify Supabase project
- [ ] Admin user has `app_metadata.role = 'admin'`
- [ ] `blog.ts` compiles; public and admin query split verified
- [ ] `verify-rls.ts` passes anonymous checks
- [ ] No `VITE_*` secret keys in codebase

---

## Phase 3 next

Admin UI: auth context, protected routes, post editor, publish workflow.
