# Product Requirements Document (PRD) — PB Consult Blog Page

## Document control

| Field | Details |
|---|---|
| Product / feature name | PB Consult Blog Page (v1) |
| Document owner | Paul Benn |
| Contributors | Paul Benn (Product Owner / Business Analyst) |
| Status | Implemented (Phases 1–5.5 as-built on `feature/blog-v1`; Phase 6 deploy pending) |
| Version | 1.2 (FR-10A template picker + preview modal) |
| Last updated | 2026-06-08 |
| Target release | v1 (initial blog release) |
| Linked artefacts | [as-built.md](../../PB-Consultant/clarity-strategy-blueprint/docs/blog/as-built.md), phase-1-discovery.md through phase-5.5-article-template.md, Frontend PRD |

---

## 1. Overview

### 1.1 Summary

This PRD defines a blog capability for the Paul Benn Consulting (PB Consult) marketing site. It adds an admin-only authoring and publishing workflow plus a public blog landing page and individual post pages, built on the existing React + TypeScript + Vite + Tailwind + Supabase stack. The goal is to let Paul create, edit, and manually publish SEO-optimised articles without developer involvement, demonstrating domain expertise and driving visitors toward the contact form.

### 1.2 Background

As of 2026-06-07, Phases 1–3 of this PRD are implemented on branch `feature/blog-v1` (public `/blog`, hidden admin `/pbc-manage`, Supabase backend). RSS and deployment (Phases 4–6) remain pending. Originally, PB Consult had no blog capability, which limited organic search visibility, reduces opportunities to demonstrate domain expertise, and creates a dependency on external platforms for thought-leadership content. There is no in-house way to draft, format, publish, or manage long-form articles in a consistent, SEO-friendly structure. This PRD addresses that gap with a lightweight but extensible blog module that reuses the site's existing routing, layout, SEO, and access-control patterns rather than introducing a full headless CMS.

### 1.3 Problem statement

- The primary user or stakeholder is: Paul Benn (site owner / admin), supported by public visitors (enterprise and government stakeholders) and search engines.
- They are trying to: publish and discover well-structured, SEO-friendly thought-leadership articles on the PB Consult site.
- Today they cannot do this well because: the site has no blog feature, no authoring workflow, and no public blog pages, forcing reliance on external platforms.
- This causes the following impact: reduced organic search visibility, fewer credibility signals for prospective clients, and weaker internal linking toward contact and service pages.

### 1.4 Desired outcomes

- Outcome 1: Paul can create, edit, and manually publish SEO-optimised blog posts from a protected admin area without developer support.
- Outcome 2: Public visitors can browse a blog landing page and read individual posts in a consistent, accessible, SEO-friendly layout, with clear calls-to-action toward contact.
- Outcome 3: The blog supports internal linking (related posts, in-body links, CTAs) and is indexable by search engines, with an RSS feed for syndication.

### 1.5 Success measures

| Measure | Current baseline | Target | Notes |
|---|---|---|---|
| Time to create and publish a new post once content is written (upload, metadata, publish) | Unknown (no feature today) | Under 15 minutes | Measured from opening the create-post screen to a successful publish. |
| Blog landing page and individual posts indexed by Google | 0 (no blog) | Landing page and majority of posts indexed within 30 days of launch | Assumes Google Search Console set up and sitemap / URL inspection used. |
| SEO field completeness on published posts | Unknown | 100% of published posts have unique meta title, meta description, clean slug, single H1, and alt text on non-decorative images | Enforced by required-field validation at publish. |
| At least one measurable CTA per post | Unknown | 1+ CTA per published post; click-through measurable once analytics is connected | Conversion target to be refined after baseline. |
| Organic sessions to blog pages | 0 | Positive trend after a regular publishing cadence is established | Trend target to be refined after baseline data exists. |

Where a baseline is unknown it is explicitly marked unknown rather than guessed.

---

## 2. Users and stakeholders

### 2.1 Primary users

| User group | Need | Current pain point | Importance |
|---|---|---|---|
| Site Owner / Admin (Paul Benn) | Fast, low-friction way to author, format, add media, set SEO fields, manage drafts, and manually publish posts | No authoring workflow exists; dependent on external platforms | High |
| Public site visitors (enterprise & government stakeholders) | Skimmable, well-structured articles with clear headings, media, and CTAs that signal credibility | No blog content available on the site | High |
| Search engines (Google, etc.) | Clean HTML structure (H1–H3), descriptive titles/meta descriptions, structured URLs, internal links, alt text, valid RSS | No crawlable blog content exists | High |

### 2.2 Stakeholders

| Stakeholder | Role in this work | Decision authority | Notes |
|---|---|---|---|
| Paul Benn | Product Owner, sole admin, public-facing author | Final sign-off on scope, requirements, and prioritisation | Single-admin model in v1 (small admin set possible). |
| AI/non-human implementer (e.g., Cursor) | Implements the feature against this PRD and roadmap | None (executes scoped work) | Roadmap Section 9 is written for this audience. |

---

## 3. Scope

### 3.1 In scope (v1)

- A blog feature implemented inside the existing React + TypeScript + Vite + Tailwind + Supabase application, reusing current routing, layout (Header/Footer/MetaTags), and SEO patterns.
- A `blog_posts` data model supporting draft and published states, publish date, SEO metadata, category, optional series/collection, featured image, author name, rich-text body, and audit timestamps.
- Admin-only blog management at `/pbc-manage` (hidden — not linked from public navigation; PRD originally referenced `/admin`).
- Create and edit workflow using a Quill rich-text editor for the post body.
- Ability to create and retain multiple drafts before publishing.
- Manual publishing only, with the publish date displayed publicly under the post title.
- Public `/blog` listing page showing published posts in a card/tile layout, with filtering by category and series/collection and basic search by title.
- Public individual post pages at `/blog/:slug`, with SEO-friendly layout, rich media rendering, at least one CTA, and LinkedIn/Facebook share buttons.
- Series/collections used as labels and filters (clicking a label opens `/blog` filtered to that series/collection); no dedicated series landing pages.
- Categories used for classification, filtering, and related-post selection (one category per post).
- Rich media: images (with alt text and optional captions), embedded video, and embedded audio/podcast players via safe external embeds.
- A Related posts widget on detail pages using a mixed rule: same series/collection first, then same category.
- An RSS feed at `/blog/rss.xml` exposing summary-level entries for published posts.
- Static public author attribution as "Paul Benn".

### 3.2 Out of scope (v1)

- Scheduled publishing and any date-based or cron/Edge-Function auto-publish workflow.
- Tags in addition to categories.
- Standalone public landing pages for individual series/collections.
- Multi-author attribution, reviewer/editorial workflows, or complex role-based permissions beyond an admin role for Paul (and possibly a small admin set).
- Public comments, likes, or other social interaction features on posts.
- Full CMS-style media library with asset versioning or CDN management.
- Advanced analytics dashboards inside the admin (the blog must remain compatible with external analytics tools instead).
- AI-assisted drafting, AI SEO scoring, or keyword-research assistants.
- Full-text RSS output (v1 RSS is summary-only).
- Direct upload of video/audio files to own hosting (video/audio are external embeds only in v1). *(Confirmed — OQ-1.)*

### 3.3 Assumptions

- Paul Benn is the sole admin user and the public-facing author for all posts in v1; there is no multi-author selection UI.
- Content ideation and drafting may occur outside the system; the blog focuses on formatting, metadata, media embedding, draft management, and publication.
- Publishing is a manual action; a post is visible publicly only after the admin clicks Publish. There is no time-based auto-publish.
- The `published_at` timestamp (set on manual publish) is the date displayed under the title and the default sort key for the public listing (newest first).
- Categories and series/collections are separate concepts: a category classifies one topic area (one per post); a series/collection groups related posts across a theme or sequence (optional per post).
- The Related posts widget is a primary internal-linking mechanism in v1, alongside in-body links and CTAs.
- RSS exists primarily for syndication/automation, so a summary-based feed is sufficient for v1.
- Admin listing and search use Supabase queries with client-side filtering at the expected initial content volume.
- The feature stays lightweight and extensible and does not become a full headless CMS in v1.

---

## 4. User journeys and key scenarios

| Scenario | Trigger | Expected user/system behaviour | Priority |
|---|---|---|---|
| Admin creates a new draft post | Paul wants to prepare a new article | The system provides a protected create-post workflow with Quill editing, metadata fields, category and series/collection selection, media support, and draft save | Must |
| Admin edits an existing draft or published post | Paul opens a post to update content or metadata | The system loads the post, allows edits, preserves draft/published state, and saves changes without developer support | Must |
| Admin manually publishes a post | Paul decides a draft is ready | The system validates required fields, publishes immediately, stores the publish date, and makes the post visible on the listing and detail page | Must |
| Visitor browses the blog listing | A visitor navigates to `/blog` | The system shows published post cards with title, summary, publish date, category, and series/collection labels, with filtering and search | Must |
| Visitor reads a post | A visitor opens a `/blog/:slug` URL | The system renders the post in a readable, SEO-friendly layout with metadata, rich media, CTA, share buttons, and related posts | Must |
| Visitor filters by category or series/collection | A visitor clicks a category/series label or filter control | The system updates the listing to show only matching published posts | Should |
| Visitor follows related posts | A visitor reaches the end of a post or the Related posts section | The system presents related posts (series/collection first, then category) to encourage continued reading | Should |
| External tool consumes RSS | An RSS reader/automation requests `/blog/rss.xml` | The system returns a valid RSS feed of summary entries for published posts only | Could |

### 4.1 Admin creates a new draft blog post

1. Starting point: Paul is logged into the admin area and chooses to create a new post.
2. User goal: create a draft with formatted content, metadata, classification, and media, without a developer.
3. Main steps: open the create-post screen; enter title, slug, meta title, meta description, category, optional series/collection; write and format body in Quill; add a featured image with alt text; optionally add an embedded video/audio; save as draft.
4. Possible failure points: required metadata missing; slug invalid or already in use; image upload or embed configuration fails.
5. Expected outcome: the draft is saved and remains available for later editing or manual publication.

### 4.2 Admin edits an existing draft or published post

1. Starting point: Paul opens an existing post from the admin management view.
2. User goal: update content, metadata, category, series/collection, media, or CTA.
3. Main steps: open the post; modify content/metadata in the form; save while preserving the intended state.
4. Possible failure points: required fields removed during editing; a published post is edited into broken metadata or invalid structure.
5. Expected outcome: the updated post is saved correctly; published changes appear on the public site predictably.

### 4.3 Admin manually publishes a blog post

1. Starting point: Paul has a completed draft open.
2. User goal: publish immediately when ready, without scheduling.
3. Main steps: review content and metadata; click Publish; the system validates required fields, sets the post to published, stores the publish date, and exposes the post on public routes.
4. Possible failure points: required fields incomplete; slug conflicts with an existing published post; publish succeeds in admin but public visibility fails due to query/state issues.
5. Expected outcome: the post is publicly visible on the listing and detail page, with the publish date under the title.

### 4.4 Visitor browses the blog listing

1. Starting point: a visitor arrives at `/blog` from navigation, search, or a shared link.
2. User goal: quickly scan available content and choose an article.
3. Main steps: load the listing; view cards with key metadata; optionally search or filter; click through to a post.
4. Possible failure points: listing slow or unclear; filters produce confusing or empty results; unpublished posts appear accidentally.
5. Expected outcome: the visitor finds a relevant post and navigates into it.

### 4.5 Visitor reads a blog post

1. Starting point: a visitor opens a post from the listing, search, or a shared URL.
2. User goal: read a well-structured article, assess expertise, and decide whether to continue or get in touch.
3. Main steps: view title, publish date, category, series/collection label, author; read body and media in the shared article template (FR-10A); engage with CTA, sharing, or related posts.
4. Possible failure points: media breaks layout or hurts performance; structure inconsistent or hard to scan; related posts irrelevant or absent.
5. Expected outcome: the visitor reads successfully and is encouraged to continue or move toward a contact/service page.

### 4.6 Visitor filters by category or series/collection

1. Starting point: a visitor on the listing or a post page clicks a category or series/collection label.
2. User goal: narrow the content set to a specific topic or thematic group.
3. Main steps: select a category/series-collection; the system updates the listing to matching published posts; the visitor chooses another article.
4. Possible failure points: filters not clearly visible; poor empty-state handling when few posts match.
5. Expected outcome: the visitor sees a filtered list and continues browsing efficiently.

### 4.7 Visitor follows related posts

1. Starting point: a visitor reaches the end of a post or the Related posts section.
2. User goal: continue reading related content without returning to the blog home.
3. Main steps: the system displays related posts (series/collection first, then category); the visitor selects one.
4. Possible failure points: not enough related posts exist; relevance rules produce weak recommendations.
5. Expected outcome: the visitor continues through the blog via internal links.

### 4.8 External tool or reader consumes RSS

1. Starting point: an RSS reader/automation requests the feed endpoint.
2. User goal: retrieve newly published posts in a machine-readable format.
3. Main steps: request the RSS URL; the system returns valid items for published posts only; each item contains summary metadata and canonical links.
4. Possible failure points: invalid feed format; draft posts appear in the feed; missing/weak summaries.
5. Expected outcome: consumers discover new published content reliably without exposing draft/unpublished material.

---

## 5. Requirements

All requirements are written as single-purpose, testable statements. "Must / Should / Could" follow MoSCoW. Acceptance criteria use Given/When/Then for functional requirements and verifiable "The system shall…" statements for non-functional requirements.

### 5.1 Functional requirements

#### FR-1 Blog post data model

**Requirement:** The system shall store each blog post in a dedicated `blog_posts` table containing: id, title, slug, body (Quill HTML/JSON), summary, status (`draft` | `published`), category, optional series/collection, featured image reference, featured image alt text, meta title, meta description, author name, `published_at`, `created_at`, and `updated_at`.

**Rationale:** A structured content model is required to support draft management, publication, filtering, SEO, related posts, and public rendering.

**Priority:** Must

**Acceptance criteria:**
- Given a new blog post is created, when the admin saves it, then the system persists the record with a unique id and all core fields, defaulting status to `draft`.
- Given a post is retrieved for the public site, when it is read, then the record includes the fields required for listing, detail, SEO metadata, and filtering.
- Given a post includes a series/collection, when it is saved, then series/collection is stored in a column distinct from category.
- Given a post is saved, when `created_at` and `updated_at` are written, then `updated_at` is set on every subsequent save and `created_at` is never overwritten.

#### FR-2 Admin access control

**Requirement:** The system shall restrict blog post creation, editing, publishing, and deletion to authenticated admin users only.

**Rationale:** Blog management must be protected from public or unauthorised access.

**Priority:** Must

**Acceptance criteria:**
- Given a non-admin or anonymous user, when they request any `/pbc-manage` blog route (except the login page), then the system denies access and redirects to `/pbc-manage` login.
- Given an authenticated admin user, when they create, edit, publish, or delete a post, then the system permits the action.
- Given a public user queries blog content, when the request is made, then only `published` posts are returned.
- Given a write request bypasses the UI (direct API/DB call), when it is made by a non-admin, then Supabase Row Level Security rejects it.

#### FR-3 Create blog post draft

**Requirement:** The system shall allow an admin user to create a new blog post draft from the admin interface.

**Rationale:** Draft creation is the starting point for the content workflow and must support low-friction authoring.

**Priority:** Must

**Acceptance criteria:**
- Given an admin opens the create-post screen, when they enter at least a title and save, then the system creates a new post with status `draft`.
- Given a post is saved as a draft, when the save completes, then the post is not visible on any public route or in the RSS feed.
- Given draft-level required fields (title, slug) are missing or invalid, when the admin attempts to save, then the system blocks the save and shows inline validation identifying each missing/invalid field.

#### FR-4 Edit existing blog post

**Requirement:** The system shall allow an admin user to edit an existing draft or published blog post.

**Rationale:** Content must remain maintainable after initial creation.

**Priority:** Must

**Acceptance criteria:**
- Given an existing post is opened in admin, when the editor loads, then all current content and metadata are populated in the form for editing.
- Given an admin saves changes to a draft, when the save succeeds, then the updated draft is retained with status unchanged (`draft`) and `updated_at` refreshed.
- Given an admin saves changes to a published post, when the save succeeds, then the public detail page reflects the updated content on next load and status remains `published`.

#### FR-5 Quill editor authoring

**Requirement:** The system shall provide a Quill rich-text editor for authoring the post body, supporting headings (H2/H3), bold, italics, ordered/unordered lists, blockquotes, links, and inline images.

**Rationale:** Quill is the selected v1 authoring experience for flexibility and speed; a defined toolbar keeps output SEO-consistent.

**Priority:** Must

**Acceptance criteria:**
- Given an admin uses a supported formatting control, when the post is saved, then the system preserves that formatting in the stored body.
- Given a saved post is rendered publicly, when the detail page loads, then the rich-text content displays with the same structure authored (headings as H2/H3, lists, quotes, links, images).
- Given body content contains script tags, event handlers, or other unsafe markup, when it is saved or rendered, then the system sanitises it so no active/unsafe content is executed in the public page.
- Given the editor renders headings, when content is saved, then the editor does not allow a second H1 in the body (the post title is the single H1).

#### FR-6 Metadata and SEO fields

**Requirement:** The system shall require and store the metadata needed to publish an SEO-ready post: title, unique slug, meta title, meta description, category, and alt text for each non-decorative image.

**Rationale:** Metadata is necessary for search visibility, clean URLs, and social previews.

**Priority:** Must

**Acceptance criteria:**
- Given an admin attempts to publish, when any of title, slug, meta title, meta description, or category is missing, then the system blocks publish and identifies each missing field.
- Given a non-decorative image is present, when the admin attempts to publish without alt text for it, then the system blocks publish and flags the image.
- Given a slug is entered, when it duplicates an existing post's slug, then the system rejects it and prompts for a unique slug before save/publish.
- Given a post is published, when its public page source is inspected, then meta title, meta description, canonical URL, and Open Graph tags are present and match the stored values.

#### FR-7 Media support

**Requirement:** The system shall allow an admin to attach a featured image and inline images (with alt text) and to add safe external embeds for video and audio (e.g., YouTube, Vimeo, podcast players) via an allow-list of trusted embed sources.

**Rationale:** Rich media is in scope and supports more engaging, useful articles; an allow-list prevents unsafe embeds.

**Priority:** Must

**Acceptance criteria:**
- Given an admin uploads a featured image, when the upload succeeds, then the image is attached to the post and an alt-text field is associated with it.
- Given an admin adds a video or audio embed from an allow-listed source, when the post is saved and viewed publicly, then the embed renders correctly.
- Given an embed URL is from a source not on the allow-list, when the admin attempts to add it, then the system rejects it with an explanatory message.
- Given a featured or inline image is missing or fails to load at view time, when the post is rendered, then the page remains usable (no full-page failure) and shows the image's alt text or a graceful fallback.

#### FR-8 Manual publish workflow

**Requirement:** The system shall allow an admin to manually publish a draft post via an explicit Publish action, with no scheduled or automated publishing.

**Rationale:** A manual publish model was explicitly chosen for v1.

**Priority:** Must

**Acceptance criteria:**
- Given a draft satisfies all publish-required fields (FR-6), when the admin clicks Publish, then the system sets status to `published`.
- Given a post is published, when the publish succeeds, then the system sets `published_at` to the publish time and displays that date under the title on the public page.
- Given a post is not in `published` state, when a public user visits the listing, the direct `/blog/:slug` URL, or the RSS feed, then the post is not shown.
- Given a publish action fails (validation or save error), when it is attempted, then the post remains a draft and the admin sees a clear failure message.

#### FR-9 Blog listing page

**Requirement:** The system shall provide a public blog listing page at `/blog` that displays published posts as cards ordered by `published_at` descending (newest first) by default.

**Rationale:** The listing page is the main discovery surface for blog content.

**Priority:** Must

**Acceptance criteria:**
- Given published posts exist, when a visitor opens `/blog`, then the page lists them newest first by `published_at`.
- Given a post card renders, when it is displayed, then it shows featured image (where present), title, summary text, publish date, category, series/collection label (where present), and read-time estimate.
- Given no published posts match the current filter/search state, when the listing loads, then the system shows a clear empty state rather than a broken or blank page.
- Given only draft posts exist, when a visitor opens `/blog`, then no draft post appears in the listing.

#### FR-10 Blog detail page

**Requirement:** The system shall provide a public detail page for each published post at `/blog/:slug`.

**Rationale:** Each post needs a canonical public URL for reading, sharing, and search indexing.

**Priority:** Must

**Acceptance criteria:**
- Given a published post exists, when a visitor opens its `/blog/:slug`, then the system renders that post.
- Given the detail page loads, when it is displayed, then it shows the title as the single H1, publish date, author ("Paul Benn"), category, series/collection label (where present), read-time estimate, the Quill body, at least one CTA near the end, share buttons, and a Related posts section.
- Given a slug does not match any published post, when the route is opened, then the system returns a not-found (404) state rather than an error or an unpublished post.
- Given a post is a draft, when a visitor opens its slug URL directly, then the system returns the not-found state.

#### FR-10A Single blog article template

**Requirement:** The system shall render every published post at `/blog/:slug` using a consistent reusable single blog article template.

**Rationale:** A defined article template reduces implementation ambiguity and ensures consistent readability and presentation across all published posts. A template registry allows additional layouts in future releases without rewriting the detail page shell.

**Priority:** Must

**Acceptance criteria:**
- Given a published post is opened, when the detail page renders, then the page uses the shared single-article template rather than post-specific ad hoc layout variations.
- Given the template renders, when the page is displayed, then the section order is title block, metadata row, featured image if present, article body, end-of-article CTA, share actions, and Related posts.
- Given a featured image exists, when the page loads, then the image appears in the defined template position and preserves its configured alt text treatment (`featured_image_alt`, falling back to the post title when alt is absent).
- Given a post has no featured image, when the template renders, then the remaining layout still renders correctly without broken spacing or layout collapse.
- Given long-form body content is rendered, when viewed on desktop or mobile, then the page maintains a consistent readable content width, spacing, and heading hierarchy aligned with the site design system (single H1 for title; body H2/H3 only per FR-5).
- Given an admin edits a post, when they save or publish, then they can select an article layout from the registered templates and the choice is persisted on `blog_posts.article_template`.
- Given a published post has a stored `article_template`, when the detail page loads, then `getArticleTemplate(post.article_template)` resolves the correct layout (falling back to `classic` if the value is unknown).
- Given an admin clicks Preview on the post editor, when the modal opens, then it renders the selected template using the current form values (title, summary, body, metadata, featured image) without requiring a save.

**Implementation notes (v1):**
- Default template id: `classic` (editorial layout with title/metadata header, optional hero image, two-column body with author sidebar, end CTA, share, related posts).
- Database column: `article_template text NOT NULL DEFAULT 'classic'` — migration `002_blog_posts_article_template.sql` (apply via `supabase db push`).
- Template resolution: `getArticleTemplate(post.article_template)` in `BlogPostDetail.tsx`; registry in `src/components/blog/templates/registry.ts`.
- Admin: **Article layout** dropdown in `BlogPostForm.tsx` (options from `ARTICLE_TEMPLATE_OPTIONS`); **Layout** column on admin post list; **Preview** button opens `ArticleTemplatePreviewDialog` (maps form values via `formValuesToPreviewPost` in `src/lib/blog-preview.ts`).
- Template `preview` mode omits go-back, share, and related sections in the modal.
- FR-10 remains the functional requirement for detail-page content and 404 behaviour; FR-10A defines presentation structure and extensibility.

#### FR-11 Category and series/collection filtering

**Requirement:** The system shall allow visitors to filter the `/blog` listing by category and by series/collection.

**Rationale:** Filters improve content discovery and support thematic navigation.

**Priority:** Should

**Acceptance criteria:**
- Given a visitor selects a category filter, when the listing updates, then only published posts in that category are shown.
- Given a visitor selects (or clicks) a series/collection label, when the listing updates, then only published posts in that series/collection are shown.
- Given filters are cleared, when the listing resets, then all eligible published posts are shown again, newest first.
- Given a filter matches no published posts, when it is applied, then the system shows the empty state defined in FR-9.

#### FR-12 Related posts

**Requirement:** The system shall display a Related posts section on each detail page using a mixed rule: prioritise published posts in the same series/collection, then fill remaining slots with published posts in the same category.

**Rationale:** Related posts are a deliberate internal-linking mechanism in v1.

**Priority:** Should

**Acceptance criteria:**
- Given a post belongs to a series/collection, when related posts are generated, then same-series/collection posts are selected first (excluding the current post).
- Given fewer same-series posts exist than the configured slot count, when related posts are generated, then remaining slots are filled with same-category posts (excluding the current post and any already selected).
- Given the widget renders publicly, when it is displayed, then it excludes the current post and all unpublished posts.
- Given no related posts can be found, when the detail page loads, then the section either hides gracefully or shows a clear empty state, without breaking the page.

#### FR-13 Social sharing

**Requirement:** The system shall provide LinkedIn and Facebook share actions on public blog detail pages.

**Rationale:** Social sharing supports distribution of published content.

**Priority:** Should

**Acceptance criteria:**
- Given a visitor uses a share action, when the share dialog/link opens, then it targets the current post's canonical `/blog/:slug` URL.
- Given social metadata (Open Graph title, description, image) is configured for the post, when the shared link is previewed by LinkedIn or Facebook, then those configured values are available to the platform.
- Given share buttons render, when the page loads, then they do not block page rendering or require third-party scripts that fail the page if unavailable.

#### FR-14 RSS feed

**Requirement:** The system shall expose an RSS feed at `/blog/rss.xml` containing summary-level entries for published posts only.

**Rationale:** RSS supports syndication and external automation while keeping v1 simple.

**Priority:** Could

**Acceptance criteria:**
- Given published posts exist, when the RSS endpoint is requested, then the response is valid RSS and contains only `published` posts.
- Given an RSS item is returned, when it is inspected, then it includes title, summary/description, canonical URL, publish date, author ("Paul Benn"), and featured image where practical.
- Given a post is a draft, when the feed is generated, then that post is excluded.
- Given the feed is requested, when it is returned, then item bodies contain summary text only (no full post body) in v1.

#### FR-15 Admin blog management list

**Requirement:** The system shall provide an admin management view listing all posts with their status and key metadata, with filtering and search.

**Rationale:** Post management becomes inefficient without a central admin list.

**Priority:** Must

**Acceptance criteria:**
- Given posts exist, when an admin opens the management view, then both draft and published posts are listed with title, status, category, series/collection, and publish date.
- Given an admin filters by status or searches by title, when the query is applied, then the list updates to matching posts.
- Given an admin selects a post and chooses Edit, when the action runs, then the system opens that post in the edit workflow (FR-4).
- Given an admin chooses Delete on a post, when they confirm, then the post is removed and no longer appears in the public listing, detail route, or RSS feed.

### 5.2 Non-functional requirements

#### NFR-1 Access control and data protection

**Requirement:** The system shall protect unpublished blog content through route protection, query filtering, and Supabase Row Level Security.

**Category:** Security

**Rationale:** Draft content and admin actions must remain private and protected at every layer.

**Priority:** Must

**Acceptance criteria:**
- The system shall prevent anonymous and non-admin users from reading draft posts via UI, direct URL, API, or RSS.
- The system shall restrict create, edit, publish, and delete actions to authenticated admin users.
- The system shall enforce access control at both the application layer (route guards, query filters) and the data layer (RLS policies on `blog_posts`).

#### NFR-2 Performance of public blog pages

**Requirement:** The system shall render the public listing and detail pages within performance budgets aligned to Core Web Vitals "good" thresholds on a typical mobile connection.

**Category:** Performance

**Rationale:** Slow blog pages harm user experience and SEO outcomes.

**Priority:** Must

**Acceptance criteria:**
- The system shall lazy-load below-the-fold images and defer non-critical media so they do not block initial render.
- The system shall reserve layout space for images and embeds so Cumulative Layout Shift stays at or below 0.1 on listing and detail pages.
- The system shall target Largest Contentful Paint at or below 2.5 seconds on a typical mobile connection for the listing and detail pages, verified with Lighthouse / PageSpeed Insights before launch.

#### NFR-3 Accessibility

**Requirement:** The system shall provide an accessible blog experience for admin users and public readers, targeting WCAG 2.1 AA for public pages.

**Category:** Accessibility

**Rationale:** Accessibility is required for usability, professionalism, and inclusive access.

**Priority:** Must

**Acceptance criteria:**
- The system shall render public pages with semantic headings (single H1, logical H2/H3) and readable structure.
- The system shall support keyboard navigation for core admin (create/edit/publish) and public (browse/filter/read/share) interactions.
- The system shall require alt text for non-decorative images in published posts (enforced via FR-6) and meet WCAG 2.1 AA contrast for body and interactive text.

#### NFR-4 Maintainability and extensibility

**Requirement:** The system shall implement the blog consistently with the existing application architecture so it can be extended later without a CMS rewrite.

**Category:** Maintainability

**Rationale:** The feature is lightweight in v1 but must remain extensible.

**Priority:** Must

**Acceptance criteria:**
- The system shall reuse existing routing, admin route protection, Supabase access patterns, and SEO conventions (react-helmet-async, JSON-LD, Open Graph) where they exist.
- The system shall store category and series/collection as separate fields so future features (e.g., series landing pages, tags) can be added without data migration of existing posts.
- The system shall not introduce scheduled-publishing infrastructure (cron/Edge Functions) in v1.

#### NFR-5 Reliability of publishing and rendering

**Requirement:** The system shall publish and display posts predictably and recoverably.

**Category:** Reliability

**Rationale:** Publishing errors or inconsistent display would undermine trust in the workflow.

**Priority:** Must

**Acceptance criteria:**
- The system shall not expose a post publicly unless its status is `published`.
- The system shall show clear validation or failure feedback when a save or publish action does not complete successfully, leaving the post in its prior valid state.
- The system shall preserve saved body content and metadata across subsequent edit sessions without data loss.

---

## 6. UX and content notes

| Topic | Requirement or guidance | Owner | Status |
|---|---|---|---|
| Navigation | Add a "Blog" entry to the main site navigation linking to `/blog`; series/collection and category labels are clickable and route to filtered `/blog`. | Paul | Planned |
| Empty states | Listing and filtered/search views show a clear "No posts yet / no posts match" message; Related posts hides or shows an empty state when none found. | Paul | Planned |
| Error states | 404 for unknown or unpublished slugs; clear inline validation on create/edit/publish; graceful fallback for missing/broken media. | Paul | Planned |
| Accessibility | Single H1 (post title), logical H2/H3, keyboard navigation, WCAG 2.1 AA contrast, required alt text for non-decorative images. | Paul | Planned |
| Content/copy | Author shown as "Paul Benn"; at least one CTA per post near the end; read-time estimate on cards and detail pages. | Paul | Planned |

---

## 7. Data and integrations

### 7.1 Data requirements

| Data item | Source | Used for | Sensitivity / classification | Notes |
|---|---|---|---|---|
| `blog_posts` record (title, slug, body, summary, status, category, series/collection, featured image + alt, meta title/description, author, `published_at`, timestamps) | Supabase Postgres | Authoring, publishing, listing, detail, filtering, related posts, RSS, SEO | Public once published; drafts are private | Slug must be unique; status `draft`/`published`. |
| Featured / inline images | Supabase Storage (or existing media handling) | Public rendering, social previews | Public once post published | Alt text required for non-decorative images. |
| External media embeds (video/audio) | Allow-listed providers (YouTube, Vimeo, podcast hosts) | Public rendering | Public | Embed source allow-list enforced (FR-7). |

### 7.2 Integrations

| System / service | Purpose | Dependency type | Owner | Risks / notes |
|---|---|---|---|---|
| Supabase (Postgres + RLS + Storage) | Data model, access control, media storage | Technical | Paul | RLS must mirror existing content tables; new `blog_posts` table + indexes required. |
| react-helmet-async / JSON-LD / Open Graph | SEO metadata and social previews | Technical | Paul | Reuse existing SEO conventions. |
| LinkedIn / Facebook share | Social distribution | External | Paul | Share endpoints must not block render; OG tags drive previews. |
| RSS consumers / automation tools | Syndication of published posts | External | Paul | Summary-only feed in v1; must be valid RSS. |
| External analytics (e.g., GA / Search Console) | Indexing, traffic, CTA click tracking | External | Paul | Blog must be compatible; no in-admin analytics dashboard in v1. |

---

## 8. Risks, dependencies, and open questions

### 8.1 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Over-engineering vs maintainability (building a full CMS) | Medium | Medium | Start with an opinionated single template, simple embeds, clean domain model; design for extensibility without building advanced CMS features now. |
| SEO misconfiguration (duplicate titles, missing meta, bad headings/indexing) | Medium | High | Enforce required SEO fields and unique slug (FR-6); single H1 (FR-5/FR-10); reuse existing SEO conventions (NFR-4). |
| Content quality/consistency over time | Medium | Medium | Opinionated structure, required summary/CTA, Related posts to encourage internal linking. |
| Performance/UX regression from rich media | Medium | High | Lazy-load, reserve layout space, allow-listed embeds, verify CWV with Lighthouse before launch (NFR-2). |
| Draft content leaking to public | Low | High | RLS + route guards + query filtering + RSS filtering verified in testing (NFR-1, FR-8). |

### 8.2 Dependencies

| Dependency | Type | Owner | Status | Notes |
|---|---|---|---|---|
| Existing React/Vite/Tailwind SPA and routing | Technical | Paul | Done | Header/Footer/MetaTags; Blog nav link added. |
| Supabase backend, RLS patterns, Storage | Technical | Paul | Done | `blog_posts`, RLS, `blog-images` bucket; migration `001_blog_posts.sql`. |
| Admin auth / protected routes | Technical | Paul | Done | New: Supabase Auth + `/pbc-manage` (greenfield; not pre-existing). |
| Google Search Console / sitemap setup | Operational | Paul | Not started | Phase 4/6; required for indexing success measure. |

### 8.3 Open questions

| Question | Owner | Due date | Resolution |
|---|---|---|---|
| OQ-1: Embeds-only for video/audio? | Paul | 2026-06-07 | **Yes** — YouTube, Vimeo, Spotify, Apple Podcasts, SoundCloud only. |
| OQ-2: Read-time method? | Paul | 2026-06-07 | **Computed at render** (~200 WPM); not stored. `src/lib/read-time.ts`. |
| OQ-3: Related posts slot count? | Paul | 2026-06-07 | **3 slots**; series-first, then category. |
| OQ-4: Search scope? | Paul | 2026-06-07 | **Title-only** on `/blog` listing. |
| OQ-5: Image storage? | Paul | 2026-06-07 | **Supabase Storage** `blog-images`; 2 MB; JPEG/PNG/WebP. |

---

## 9. Implementation Roadmap (for AI or non-human implementers)

This roadmap is written for an AI/non-human implementer (e.g., Cursor). It is ordered; complete each phase before the next. Security and reliability checks are embedded throughout, not deferred.

### 9.0 Phase completion summary

| Phase | Status | Artefact |
|---|---|---|
| Phase 1 – Discovery and setup | **Complete** | `phase-1-discovery.md` |
| Phase 2 – Schema and backend | **Complete** | `phase-2-backend.md`, `supabase/migrations/001_blog_posts.sql` |
| Phase 3 – Frontend / UX | **Complete** | `phase-3-frontend.md` |
| Phase 4 – Integrations and feeds | **Complete** | `phase-4-integrations.md`, RSS, sitemap |
| Phase 5 – Testing and verification | **Complete** (automated) | `phase-5-testing.md`; manual sign-off pending |
| Phase 5.5 – Single article template (FR-10A) | **Complete** | `phase-5.5-article-template.md`, `ClassicArticleTemplate` |
| Phase 6 – Deployment and rollout | Pending | Merge, Netlify |

Branch: `feature/blog-v1` in `clarity-strategy-blueprint`.

### 9.1 Phase 1 – Discovery and setup

**Status: Complete.**

**Goal:** Understand the current environment and prepare for scoped changes without unintended side effects.

- Inspect the existing tech stack:
  - Confirm front-end framework and build setup (React + TypeScript + Vite + Tailwind).
  - Identify the component library / design system and shared UI patterns (cards, forms, layout, buttons) to reuse for listing cards, the editor form, and CTAs.
  - Locate the routing structure (React Router) and the Header/Footer/MetaTags layout to reuse for `/blog`, `/blog/:slug`, and admin routes.
- Inspect backend / database integration:
  - Locate the Supabase client setup and existing data-access patterns.
  - Review existing content tables (e.g., devotional tables) for naming, RLS, indexes, and helper functions to mirror for `blog_posts`.
  - Confirm Supabase Storage approach and constraints for featured/inline images (resolves OQ-5).
- Create a dedicated feature branch:
  - Branch from `main` for the blog feature so schema, backend, and UI changes stay isolated.
- Confirm implementation boundaries vs PRD scope:
  - Reconcile this PRD's in-scope/out-of-scope (Section 3) with the current codebase.
  - Confirm category vs series/collection separation and that no scheduled-publishing infrastructure is introduced.
  - Record any conflicts as assumptions, risks, or open questions (Section 8) rather than guessing; surface OQ-1 to OQ-5 for confirmation.
- Initial security and safety review:
  - Review existing auth, admin vs public route protection, and RLS patterns.
  - Define the RLS policy intent for `blog_posts` (anonymous read = published only; admin = full CRUD).
  - Note the embed allow-list (FR-7) and body sanitisation requirement (FR-5) as constraints for later phases.
- Exit criteria: stack and backend patterns documented, feature branch created, scope boundaries confirmed, OQ-1/OQ-5 resolved, RLS and security constraints noted.

### 9.2 Phase 2 – Schema and backend changes

**Status: Complete.**

**Goal:** Create the data model, access controls, and backend access paths the blog needs.

- Task 2.1: Create the `blog_posts` table with all FR-1 fields, a unique constraint on `slug`, and status defaulting to `draft`.
- Task 2.2: Add indexes for `published_at` (listing sort), `status`, `category`, and `series_collection` (filtering and related posts).
- Task 2.3: Implement RLS policies: anonymous/public can select only `status = 'published'`; authenticated admin can insert/update/delete (NFR-1).
- Task 2.4: Set up image storage (per OQ-5 resolution) with alt-text association and access rules.
- Task 2.5: Provide data-access functions/queries for: admin CRUD, public listing (published, newest first), public detail by slug (published only), filtered listing (category, series/collection), related posts (series-first then category), and the RSS query (published summaries).
- Verification: confirm via tests that anonymous reads return only published posts and that non-admin writes are rejected by RLS.

### 9.3 Phase 3 – Frontend / UX implementation

**Status: Complete.**

**Goal:** Build admin authoring/management and public reading experiences, reusing existing components.

- Task 3.1: Admin create/edit workflow (FR-3, FR-4, FR-6) with Quill editor (FR-5), required-field validation, slug uniqueness check, featured-image upload with alt text, and allow-listed embeds (FR-7).
- Task 3.2: Admin management list (FR-15) with status filter, title search, Edit, and Delete with confirmation.
- Task 3.3: Manual Publish action (FR-8) that validates required fields, sets `published_at`, and toggles status; clear success/failure feedback (NFR-5).
- Task 3.4: Public `/blog` listing (FR-9) with cards (image, title, summary, date, category, series label, read-time), newest-first sort, empty states, category and series/collection filters (FR-11), and title search (per OQ-4).
- Task 3.5: Public `/blog/:slug` detail (FR-10) with single H1, metadata row, author "Paul Benn", sanitised Quill body, rich media, CTA, share buttons (FR-13), Related posts (FR-12), and 404 for unknown/unpublished slugs.
- Task 3.6: SEO wiring (NFR-4): meta title/description, canonical URL, Open Graph, and JSON-LD using existing conventions; add "Blog" to main navigation.
- Task 3.7: Accessibility pass (NFR-3): semantic headings, keyboard navigation, contrast, alt-text enforcement.

### 9.4 Phase 4 – Integrations and feeds

**Status: Pending.**

**Goal:** Add syndication and social distribution without introducing scheduling infrastructure.

- Task 4.1: Implement the RSS feed at `/blog/rss.xml` (FR-14): valid RSS, published-only, summary entries with title, summary, canonical URL, publish date, author, and featured image where practical.
- Task 4.2: Verify LinkedIn/Facebook share targets and Open Graph previews (FR-13).
- Task 4.3: Confirm compatibility with external analytics and Search Console (no in-admin analytics dashboard); ensure sitemap includes published blog URLs.
- Constraint: no cron/Edge-Function publish pipeline (NFR-4, Out-of-scope).

### 9.5 Phase 5 – Testing and verification

**Status: Complete (automated); manual sign-off pending before Phase 6.**

- Functional tests for each FR against its acceptance criteria (draft creation, edit, publish, listing, detail, filtering, related posts, sharing, RSS, admin list, delete).
- Negative/security tests for NFR-1: anonymous and non-admin cannot read drafts or write via UI, direct URL, API, or RSS; RLS rejects unauthorised writes.
- Performance verification for NFR-2 with Lighthouse / PageSpeed Insights (LCP ≤ 2.5s, CLS ≤ 0.1 on listing and detail).
- Accessibility verification for NFR-3 (headings, keyboard, contrast, alt text).
- Regression checks for existing site flows (navigation, existing admin, other content).
- Reliability checks for NFR-5: save/publish failure feedback and no content loss across edits.

Artefact: [`phase-5-testing.md`](phase-5-testing.md) (in app repo `docs/blog/`)

### 9.5.1 Phase 5.5 – Single article template (FR-10A)

**Status: Complete.**

**Goal:** Replace the inline detail-page layout with a reusable article template system and a first `classic` template aligned with the site design system.

- Task 5.5.1: Introduce template types and registry (`src/components/blog/templates/`) with `classic` as the default for all published posts.
- Task 5.5.2: Extract shared article blocks (go back, metadata, featured image, author aside, end CTA) under `src/components/blog/article/`.
- Task 5.5.3: Implement `ClassicArticleTemplate` with FR-10A section order: title block → metadata row → featured image (conditional) → body (+ author sidebar) → end CTA → share → Related posts.
- Task 5.5.4: Refactor `BlogPostDetail.tsx` to a thin shell that resolves and renders the template component.
- Task 5.5.5: Verify FR-10A acceptance criteria (with/without featured image, responsive prose, existing FR-10/FR-12/FR-13 behaviour unchanged).
- Task 5.5.6: Add `article_template` column (migration `002`); admin **Article layout** dropdown; persist and resolve template per post.
- Task 5.5.7: Admin **Preview** modal — `ArticleTemplatePreviewDialog` renders selected template from current form values; `preview` mode on templates.

**Future (out of scope for 5.5):** Additional template implementations beyond `classic`; side-by-side live preview panel.

Artefact: [`phase-5.5-article-template.md`](phase-5.5-article-template.md) (in app repo `docs/blog/`)

### 9.6 Phase 6 – Deployment and rollout

- Deploy the feature branch via the existing pipeline (Netlify) after review and merge.
- Submit the updated sitemap and use Search Console URL inspection to request indexing of `/blog` and initial posts (supports the 30-day indexing measure).
- Monitor performance and errors post-launch; keep a rollback plan (revert merge / feature branch) if public exposure or performance issues appear.

---

## 10. Quality check (Stage 7)

### Passed

- The PRD follows the agreed template structure (Overview, Users, Scope, Journeys, Requirements, UX, Data/Integrations, Risks/Dependencies/Open questions, Implementation Roadmap, Quality check, Approvals).
- Every functional requirement (FR-1 to FR-15, FR-10A) and non-functional requirement (NFR-1 to NFR-5) has concrete acceptance criteria; functional requirements use Given/When/Then.
- The Implementation Roadmap is its own section with numbered phases and starts with Phase 1 – Discovery and setup, including stack inspection, backend/RLS inspection, feature branch, scope-boundary confirmation, and an initial security review.
- Previously vague language was tightened: "acceptable performance" → CWV thresholds (LCP ≤ 2.5s, CLS ≤ 0.1); "where practical" lazy-loading → explicit lazy-load and layout-reservation criteria; accessibility tied to WCAG 2.1 AA; media embeds constrained by an allow-list; body content sanitised and limited to a single H1.
- Scope (Section 3) matches what the roadmap implements; out-of-scope items (scheduling, tags, multi-author, comments, CMS media library, in-admin analytics, AI tooling, full-text RSS) are consistent with requirements and roadmap constraints.
- Cross-cutting concerns (security via NFR-1 + Phase 1/2/5; performance via NFR-2 + Phase 5; accessibility via NFR-3 + Phase 3/5) are addressed in both requirements and roadmap verification.

### Issues

- FR-11, FR-12, FR-13 priorities were elevated from "Must" in some Stage 4 narrative to "Should" per the Stage 4 journey table; confirm final priority with the owner. (Resolved in this draft to Should for filtering/related/sharing, matching the journey-table priorities; flag for sign-off.)
- Five open questions (OQ-1 to OQ-5) remain that affect FR-7, FR-9/FR-10, FR-12, and the data model. They are explicitly listed with owners and due phases rather than guessed.

### Actions

- Owner to resolve OQ-1 (embeds-only) and OQ-5 (image storage) before Phase 2.
- Owner to resolve OQ-2 (read-time), OQ-3 (related-posts slot count), and OQ-4 (title-only vs content search) before Phase 3.
- Owner to confirm final MoSCoW priority for FR-11/FR-12/FR-13.

**Stage 7 gate:** Quality-checked with cautions — ready for human review, conditional on resolving OQ-1 to OQ-5 and confirming FR-11/FR-12/FR-13 priorities before the corresponding implementation phases. The roadmap is present, Discovery is the first phase, and all important requirements have solid acceptance criteria.

---

## 11. As-built implementation (Phases 1–5.5)

See also: `docs/blog/as-built.md` in the app repository.

### 11.1 Routes implemented

| Route | Purpose |
|---|---|
| `/blog` | Public listing (filters: `?category`, `?series`, `?search`) |
| `/blog/:slug` | Public post detail (FR-10 + FR-10A `classic` template) |
| `/pbc-manage` | Hidden admin login |
| `/pbc-manage/posts` | Admin post list |
| `/pbc-manage/posts/new` | Create post |
| `/pbc-manage/posts/:id` | Edit post |

RSS at `/blog/rss.xml` and sitemap generation are implemented (Phase 4).

### 11.2 Environment and security

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- Client uses publishable key only; RLS enforces data access
- Admin role: `app_metadata.role = 'admin'` on Supabase Auth user
- `robots.txt`: `Disallow: /pbc-manage`

### 11.3 FR status at a glance

| FR | Built |
|---|---|
| FR-1 – FR-15 | Yes |
| FR-10A Single article template | Yes (Phase 5.5; `classic` default) |
| FR-14 RSS | Yes (Phase 4) |

### 11.4 Notable deviations from original PRD

| Item | PRD | As-built |
|---|---|---|
| Admin URL | `/admin` | `/pbc-manage` (hidden, bookmark-only) |
| Admin auth | Assumed pre-existing | Greenfield Supabase Auth |
| Env var naming | Anon key (legacy) | `VITE_SUPABASE_PUBLISHABLE_KEY` |

---

## 12. Approvals

| Name | Role | Decision | Date |
|---|---|---|---|
| Paul Benn | Product Owner | Approve / Approve with changes / Reject | |

---

## Revision notes

- Assembled Sections 1–11 from Stage 1–2, Stage 3–4, and Stage 5 source material into the PRD template structure.
- Added measurable success metrics with explicit "unknown" baselines where no data exists.
- Tightened all requirements to single-purpose, testable statements; removed vague terms ("where practical", "acceptable performance", "robust").
- Added concrete acceptance criteria to every requirement, including previously thin Should/Could items (FR-11 to FR-14) and the data-model/edit timestamp behaviours.
- Added an embed allow-list (FR-7), single-H1 and sanitisation rules (FR-5/FR-10), and 404 behaviour for unpublished/unknown slugs.
- Added CWV-based performance thresholds (NFR-2) and WCAG 2.1 AA target (NFR-3).
- Built a six-phase Implementation Roadmap with Phase 1 = Discovery and setup, per the guardrails and review checklist.
- Captured five open questions (OQ-1 to OQ-5) with owners and due phases instead of guessing.
- **2026-06-07:** As-built update — Phases 1–3 implemented on `feature/blog-v1`; Section 11 added; OQs resolved; admin path documented as `/pbc-manage`.
- **2026-06-07:** Added **FR-10A** (single blog article template) and **Phase 5.5** — reusable template registry, `ClassicArticleTemplate`, shared article blocks; detail page refactored to template shell; admin template picker and `article_template` column (migration `002`).
- **2026-06-08:** FR-10A extended — admin **Preview** modal (`ArticleTemplatePreviewDialog`, `blog-preview.ts`); migration `002` applied to Supabase project `sscvdpngzfthaxhghllc`.
