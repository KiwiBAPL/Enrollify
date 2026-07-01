# Enrollify AI — Phase 5 Admin Features (Lead Notes + Staff Profiles)

| Field | Details |
|-------|---------|
| Phase | 5 — Admin UX and staff identity |
| Status | Complete |
| Date | 2026-06-26 |
| Branch | `feature/enrollify-ai-backend` |
| Linked PRD | [enrollify-ai-prd.md](./enrollify-ai-prd.md) |

## 1. Purpose

Extend the admin panel with per-lead staff notes and staff user profiles (name, email, role). Consultants exist in the schema for future RBAC; only **Admin** can sign in today.

---

## 2. Schema additions

| Migration | Table / type | Purpose |
|-----------|--------------|---------|
| `20260626120000_student_notes.sql` | `student_notes` | Multiple dated notes per lead (`students.id`) |
| `20260626140000_staff_profiles.sql` | `staff_role` enum, `staff_profiles` | 1:1 with `auth.users` — name, email, role |
| `20260626180000_staff_profiles_insert_own.sql` | RLS policy | Admin users can insert own profile row on login |

### `student_notes`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `student_id` | uuid FK → `students` | CASCADE delete |
| `content` | text | Non-empty trimmed |
| `author_email` | text | From authenticated staff session |
| `created_at`, `updated_at` | timestamptz | |

RLS: admin-only CRUD via `is_admin()` (same pattern as other core tables).

### `staff_profiles`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK → `auth.users.id` | CASCADE delete |
| `email` | text | Mirrored from auth; synced after email confirmation |
| `first_name`, `last_name` | text | Display name (e.g. Paul Benn) |
| `role` | `staff_role` | `admin` \| `consultant` |
| `created_at`, `updated_at` | timestamptz | |

RLS:

- Staff can `select` / `update` own row (`auth.uid() = id`)
- Admin can `select` all rows via `is_admin()`
- Admin can `insert` own row (`staff_profiles_insert_own`): `auth.uid() = id` and `app_metadata.role = 'admin'`
- Backend service role bypasses RLS for bootstrap/backfill (`AdminBootstrapService`)

**Auth gate vs profile role:** `app_metadata.role = 'admin'` controls who can sign in and call `/api/admin/*`. `staff_profiles.role` is for display and future consultant RBAC.

---

## 3. Backend

### Repositories

| Class | Table |
|-------|-------|
| `StudentNoteRepository` | `student_notes` |
| `StaffProfileRepository` | `staff_profiles` |

### Bootstrap (`AdminBootstrapService`)

On every backend startup:

1. Creates Supabase Auth admin user if `ADMIN_EMAIL` + `ADMIN_PASSWORD` set (one-time)
2. **`ensureStaffProfileForAdmins()`** — for each auth user with `app_metadata.role = 'admin'`, creates missing `staff_profiles` row

Env vars (see [`apps/backend/.env.example`](../../apps/backend/.env.example)):

| Variable | Default | Purpose |
|----------|---------|---------|
| `ADMIN_FIRST_NAME` | `Paul` | Bootstrap / backfill first name |
| `ADMIN_LAST_NAME` | `Benn` | Bootstrap / backfill last name |

Restart the backend after migration so profiles are backfilled for existing admins (fallback if client insert on login did not run).

### Auth middleware

[`authJwt.ts`](../../apps/backend/src/middleware/authJwt.ts) loads `staff_profiles` on each request. Missing profile → `401 Staff profile not found`.

`req.auth` fields: `userId`, `email`, `role`, `firstName`, `lastName`, `sub` (email alias).

### API routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/me` | Staff profile — backend fallback (SPA uses Supabase direct) |
| `PATCH` | `/api/admin/me` | Update `first_name`, `last_name`; optional `email` sync — backend fallback |
| `GET` | `/api/admin/students/:id/notes` | List notes for lead |
| `POST` | `/api/admin/students/:id/notes` | Create note |
| `PATCH` | `/api/admin/students/:id/notes/:noteId` | Edit note |
| `DELETE` | `/api/admin/students/:id/notes/:noteId` | Delete note |

`GET /api/admin/students` includes `latest_note: { id, content, created_at } | null` per row.

---

## 4. Admin panel (SPA)

Location: [`src/pages/admin/`](../../src/pages/admin/)

| Route | Feature |
|-------|---------|
| `/enrollify-manage/login` | Supabase Auth login + forgot password |
| `/enrollify-manage` | Leads dashboard — **Welcome, {name}** + Notes column (consultation leads only) |
| `/enrollify-manage/chat-insights` | Chat Insights — website AI chat questions by category |
| `/enrollify-manage/posts` | Blog post list — Supabase direct (`src/lib/blog.ts`) |
| `/enrollify-manage/posts/new` | Create blog post |
| `/enrollify-manage/posts/:id` | Edit blog post |
| `/enrollify-manage/settings/profile` | Edit first/last name and email |
| Notes modal | `LeadNotesModal` — view/add/edit/delete notes per lead |

`AdminShell` sidebar includes **Blog** nav item linking to `/enrollify-manage/posts`. Blog docs: [phase-6-blog.md](../../Documents/phase-6-blog.md).

### Profile (SPA — direct Supabase)

Client helpers in [`src/lib/admin/profile.ts`](../../src/lib/admin/profile.ts):

- `ensureStaffProfile` — called on login; inserts own row if missing (RLS `staff_profiles_insert_own`)
- `getStaffProfile` / `updateStaffProfile` — read/update via Supabase `staff_profiles` table

Leads, notes, analytics, and AI providers still use `/api/admin/*` via `apiFetch`.

### Profile email change

1. Names saved via `updateStaffProfile` (Supabase direct)
2. Email changed via `supabase.auth.updateUser({ email })` (confirmation email sent)
3. After confirmation, `onAuthStateChange` syncs email to `staff_profiles` via `updateStaffProfile`

---

## 5. Out of scope (this phase)

- Consultant login or RBAC enforcement
- Consultant user creation UI
- In-app password change on profile page (forgot-password on login page is in scope)
- Notes on lead detail page (dashboard modal only)
- Legacy `apps/admin/` Next.js app

---

## 6. Verification checklist

- [ ] `supabase db push` applied all three Phase 5 migrations (notes, profiles, insert-own policy)
- [ ] Supabase Auth redirect URLs include `/enrollify-manage/login` (prod + `localhost:5180`)
- [ ] Sign in creates or loads `staff_profiles` row (client `ensureStaffProfile`)
- [ ] Backend restarted — admin has `staff_profiles` row for API routes (Paul Benn)
- [ ] Dashboard shows welcome message with name
- [ ] Profile page loads and saves name changes
- [ ] Forgot password sends email and redirects to login page
- [ ] Notes modal: create, edit, delete; latest note on dashboard updates
- [ ] Non-admin JWT → 401 on admin routes
