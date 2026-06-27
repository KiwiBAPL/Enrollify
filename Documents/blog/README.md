# Enrollify Blog — Implementation Documentation

Portable blog system documentation for porting the PB-Consultant blog to the Enrollify monorepo.

## Start here

**[portable-blog-prd-enrollify.md](../portable-blog-prd-enrollify.md)** — Full PRD with requirements, acceptance criteria, tech spec, and architecture.

## Phased implementation guides

Execute in order:

| Phase | Document | Focus |
|---|---|---|
| 1 | [phase-1-discovery.md](phase-1-discovery.md) | Stack audit, env vars, routes, feature branch |
| 2 | [phase-2-backend.md](phase-2-backend.md) | Supabase migrations, `blog.ts`, RLS verification |
| 3 | [phase-3-admin.md](phase-3-admin.md) | Auth, admin CMS, Quill editor, publish workflow |
| 4 | [phase-4-public.md](phase-4-public.md) | `/blog` listing, detail, templates, SEO |
| 5 | [phase-5-integrations.md](phase-5-integrations.md) | RSS, sitemap, OG edge function, analytics |
| 6 | [phase-6-testing.md](phase-6-testing.md) | Unit tests, security scripts, QA, Lighthouse |
| 7 | [phase-7-deploy.md](phase-7-deploy.md) | Netlify deploy, Search Console, sign-off |

## Reference source (PB-Consultant)

| Artefact | Location |
|---|---|
| Working implementation | `PB-Consultant/clarity-strategy-blueprint/` |
| As-built doc | `PB-Consultant/clarity-strategy-blueprint/docs/blog/as-built.md` |
| Original PRD | `Documents/Blog Page/pb-consult-blog-prd.md` |

## Key differences from PB-Consultant

| Item | PB-Consultant | Enrollify |
|---|---|---|
| Admin path | `/pbc-manage` | `/enrollify-manage` |
| Backend | Client-only Supabase | Client-only Supabase (Express not used for blog) |
| Styling | PB-Consult design system | Enrollify design system — **do not port visuals** |
| Stack versions | Vite 5, React 18, Router 6, Tailwind 3 | Vite 6, React 19, Router 7, Tailwind 4 |

## Estimated effort

15–23 days for a single implementer adapting from the reference codebase.
