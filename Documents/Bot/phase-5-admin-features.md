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
- **Insert** only via backend service role (bootstrap) — no client insert policy

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

Restart the backend after migration so profiles are backfilled for existing admins.

### Auth middleware

[`authJwt.ts`](../../apps/backend/src/middleware/authJwt.ts) loads `staff_profiles` on each request. Missing profile → `401 Staff profile not found`.

`req.auth` fields: `userId`, `email`, `role`, `firstName`, `lastName`, `sub` (email alias).

### API routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/me` | Current staff profile |
| `PATCH` | `/api/admin/me` | Update `first_name`, `last_name`; optional `email` sync (must match JWT email) |
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
| `/enrollify-manage` | Leads dashboard — **Welcome, {name}** + Notes column |
| `/enrollify-manage/settings/profile` | Edit first/last name and email |
| Notes modal | `LeadNotesModal` — view/add/edit/delete notes per lead |

### Profile email change

1. Names saved via `PATCH /api/admin/me`
2. Email changed via `supabase.auth.updateUser({ email })` (confirmation email sent)
3. After confirmation, `onAuthStateChange` syncs email to `staff_profiles` via `PATCH /api/admin/me`

Client helpers: [`src/lib/admin/profile.ts`](../../src/lib/admin/profile.ts)

---

## 5. Out of scope (this phase)

- Consultant login or RBAC enforcement
- Consultant user creation UI
- Password change on profile page
- Notes on lead detail page (dashboard modal only)
- Legacy `apps/admin/` Next.js app

---

## 6. Verification checklist

- [ ] `supabase db push` applied both migrations
- [ ] Backend restarted — admin has `staff_profiles` row (Paul Benn)
- [ ] Dashboard shows welcome message with name
- [ ] Profile page loads and saves name changes
- [ ] Notes modal: create, edit, delete; latest note on dashboard updates
- [ ] Non-admin JWT → 401 on admin routes
