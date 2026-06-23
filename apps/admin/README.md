# Enrollify AI — Admin Panel

Internal admin dashboard for reviewing leads, conversations, and pipeline status.

**Status:** Placeholder — full Next.js app built in Phase 3 (PRD §9.3, Task 3.7).

## Planned stack

- **Framework:** Next.js + TypeScript + Tailwind v4
- **Hosting:** Vercel (root directory: `apps/admin`)
- **Auth:** JWT issued by `apps/backend`
- **Data:** Supabase via backend API (publishable key + RLS for admin role)

## Planned routes

| Route | Purpose |
|-------|---------|
| `/login` | Staff authentication |
| `/` | Dashboard analytics |
| `/students` | Student list + search |
| `/students/:id` | Conversation view + enrolment status |
| `/pipeline` | Hot / Warm / Cold lead board |

See [Documents/Bot/enrollify-ai-prd.md](../../Documents/Bot/enrollify-ai-prd.md) for full requirements.
