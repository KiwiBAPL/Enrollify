# Phase 3 — Admin UI (Enrollify Blog)

**Target project:** Enrollify monorepo  
**Admin base path:** `/enrollify-manage`  
**Status:** Ready for implementation  
**Linked PRD:** [`../portable-blog-prd-enrollify.md`](../portable-blog-prd-enrollify.md) — FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-15

---

## Summary

Phase 3 builds the hidden admin CMS: authentication, protected routes, post list, create/edit form with Quill editor, validation, media upload, and manual publish. **Restyle all UI** with Enrollify design tokens — port logic and component structure only.

---

## Dependencies

Add if missing:

```bash
npm install @tanstack/react-query react-quill quill dompurify
npm install -D @types/dompurify
```

---

## Task 3.1 — Auth layer

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | `isAdminUser(user)` → `user.app_metadata.role === 'admin'` |
| `src/contexts/AuthContext.tsx` | Session, `signInWithPassword`, `signOut`, `isAdmin` |
| `src/components/auth/ProtectedRoute.tsx` | Redirect to `/enrollify-manage` if no session or not admin |
| `src/pages/admin/AdminLogin.tsx` | Email/password form |
| `src/components/admin/AdminLayout.tsx` | Header nav (All posts / New post), sign out, user email |

Wire routes in `App.tsx`:

```tsx
<Route path="/enrollify-manage" element={<AdminLogin />} />
<Route path="/enrollify-manage/posts" element={<ProtectedRoute><AdminPostList /></ProtectedRoute>} />
<Route path="/enrollify-manage/posts/new" element={<ProtectedRoute><AdminPostEditor /></ProtectedRoute>} />
<Route path="/enrollify-manage/posts/:id" element={<ProtectedRoute><AdminPostEditor /></ProtectedRoute>} />
```

---

## Task 3.2 — React Query hooks

Port `src/hooks/useBlog.ts`:

**Query keys:** `blogKeys.published`, `.post(slug)`, `.related(id)`, `.adminList(filters)`, `.adminPost(id)`, `.categories`

**Hooks:** `useBlogCategories`, `usePublishedPosts`, `usePublishedPost`, `useRelatedPosts`, `useAdminPosts`, `useAdminPost`

**Mutations (`useBlogMutations`):** `create`, `update`, `remove`, `publish` — invalidate `blogKeys.all` on success.

Wrap app in `QueryClientProvider` if not already present.

---

## Task 3.3 — Admin post list (FR-15)

Port `src/pages/admin/AdminPostList.tsx`:

- `useAdminPosts({ status?, search? })`
- Columns: title, status, category, series, publish date, article template
- Status filter dropdown; title search (`ilike`)
- **Featured toggle** inline — updates `is_featured` via mutation
- Edit → `/enrollify-manage/posts/:id`
- Delete with confirmation dialog
- Sort: list query uses `created_at desc` (featured toggle must not reorder rows incorrectly)

---

## Task 3.4 — Post editor (FR-3, FR-4, FR-5, FR-6, FR-7, FR-8)

Port `src/pages/admin/AdminPostEditor.tsx` + `src/components/admin/BlogPostForm.tsx`.

### Form fields

| Field | Notes |
|---|---|
| title, slug | Slug auto-suggest from title; regex validation |
| summary | Listing excerpt |
| body | Quill editor |
| category | `CategoryCombobox` — search existing or create |
| series_collection | Optional text |
| meta_title, meta_description | Required at publish |
| featured_image_url, featured_image_alt | Upload after draft save (needs post ID) |
| author_name | Default from config |
| article_template | Dropdown from `ARTICLE_TEMPLATE_OPTIONS` |
| related_post_slugs | `RelatedPostsPicker` |
| faq_text | Optional plain-text Q&A |

### Save flows

1. **Save draft:** `validateDraftSave()` → slug uniqueness → `createPost()` or `updatePost()`
2. **Publish:** `validatePublish()` → save → `publishPost()` sets status + `published_at`
3. **New post:** Save draft first → redirect to `/enrollify-manage/posts/:id` (required for image uploads)

### Validation — port `src/lib/blog-validation.ts`

**Draft save:** title required, slug regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`, known article template

**Publish:** + meta_title, meta_description, category, featured_image_alt if image, inline `<img>` alt scan

Sanitize body via `sanitizeBlogHtml()` before persist.

---

## Task 3.5 — Quill editor (FR-5)

Port from reference:

| File | Purpose |
|---|---|
| `src/components/admin/QuillEditor.tsx` | Toolbar: H2/H3, bold, italic, lists, blockquote, link, image, alignment, embed |
| `src/components/admin/quill/BlogImageBlot.ts` | Custom inline image blot |
| `src/components/admin/ImageInsertDialog.tsx` | Upload/URL, alt, layout, optional link URL |
| `src/lib/blog-image-html.ts` | `<figure class="blog-inline-image">` markup |
| `src/lib/embed-allowlist.ts` | YouTube, Vimeo, Spotify, Apple Podcasts, SoundCloud |
| `src/lib/sanitize.ts` | DOMPurify allow-list |
| `src/lib/featured-image-process.ts` | Resize featured to max 1400px width |

**Embed rule:** Reject URLs not on allow-list with explanatory message.

**Inline image orphan cleanup:** On remove from editor, call `deleteBodyImageIfOrphaned()`.

---

## Task 3.6 — Preview modal (FR-10A)

Port:

- `src/lib/blog-preview.ts` — `formValuesToPreviewPost()`
- `src/components/admin/ArticleTemplatePreviewDialog.tsx`

Preview renders selected template from current form values without save. Preview mode omits go-back, share, related sections.

---

## Task 3.7 — Supporting admin components

| Component | Purpose |
|---|---|
| `CategoryCombobox.tsx` | Searchable category picker |
| `RelatedPostsPicker.tsx` | Filter published posts; checkbox selection |
| `ArticleTemplatePreviewDialog.tsx` | Preview modal shell |

---

## Exit criteria

- [ ] Admin can log in at `/enrollify-manage`
- [ ] Non-admin redirected from protected routes
- [ ] Create draft → edit → publish workflow complete
- [ ] Drafts invisible on `/blog` (Phase 4 will add public pages; verify via Supabase or Phase 6)
- [ ] Publish blocked when required fields missing
- [ ] Featured image upload works after first draft save
- [ ] Inline images and allow-listed embeds work
- [ ] Preview modal renders without save

---

## Phase 4 next

Public `/blog` listing and `/blog/:slug` detail pages.
