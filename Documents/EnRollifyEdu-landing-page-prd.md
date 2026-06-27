# EnRollifyEdu Website Landing Page — Product Requirements Document

## Document control

| Field | Details |
|------|--------|
| Product / feature name | EnRollifyEdu Marketing Site (landing page + blog) |
| Product type | IT / software product |
| Document owner | TBD (founder assignment) |
| Contributors | Engineering (Phases 1–6 implementation) |
| Status | **Landing page complete** (Phases 1–5); **blog module complete** (Phase 6); Phase 7 deployment and launch prep deferred |
| Version | 1.1 |
| Last updated | 2026-06-27 |
| Target release | Pre-launch (pending Netlify E2E, copy, logo, privacy policy) |
| Linked artefacts | [quality-check.md](./quality-check.md); [phase-1-discovery.md](./phase-1-discovery.md) through [phase-6-blog.md](./phase-6-blog.md); EnRollifyEdu brief; logo (pending); design.json |

## 1. Overview

### 1.1 Summary

The EnRollifyEdu marketing site combines a provider-first landing page with a public blog for content and SEO. The landing page remains a single scrollable page at `/` aimed primarily at education providers in New Zealand and globally who want to recruit qualified international students more efficiently.[cite:10] It communicates EnRollifyEdu’s technology-enabled, end-to-end recruitment approach and is designed to drive high-intent providers to contact EnRollifyEdu, while also giving international students a lightweight way to register interest without distracting from the provider-focused narrative.[cite:10] Phase 6 adds `/blog` listing and article pages plus hidden admin authoring at `/enrollify-manage/posts` — see [phase-6-blog.md](./phase-6-blog.md).

### 1.2 Background

EnRollifyEdu is positioned as a technology-enabled international student recruitment service for education providers.[cite:10] The brief and earlier stages emphasise delivering better-qualified prospective students rather than raw enquiry volume, lowering recruitment costs, improving admissions efficiency, and using a process spanning attraction, qualification, assessment, review, and delivery.[cite:10] There is currently no dedicated landing page in scope beyond this new build, so this page acts as the first structured web touchpoint for providers and students.[cite:10]

### 1.3 Problem statement

The primary user is a decision-maker at an education provider, such as a director or manager of international recruitment, marketing, or admissions, who needs to attract and enrol qualified international students more reliably.[cite:10] Today, these users often face low-quality or poorly matched enquiries, high and unpredictable recruitment costs, and significant manual admissions workload.[cite:10] This creates wasted staff time, inconsistent applicant quality, and difficulty scaling international enrolments effectively.[cite:10]

### 1.4 Desired outcomes

- Education providers visiting the landing page understand how EnRollifyEdu differs from generic recruitment agents or lead generators.[cite:10]
- A meaningful proportion of relevant providers submit their details through the provider contact section to explore working with EnRollifyEdu.[cite:10]
- International students who land on the page understand that EnRollifyEdu can connect them with NZ providers and can register interest in a simple, low-friction way.[cite:10]

### 1.5 Success measures

| Measure | Current baseline | Target | Notes |
|--------|------------------|--------|------|
| Monthly provider contact submissions | Unknown [cite:10] | TBD [cite:10] | Baseline to be measured after launch. [cite:10] |
| Visit to provider-contact conversion rate | Unknown [cite:10] | TBD [cite:10] | Initial target to be validated. [cite:10] |
| Share of submissions from education providers vs students/other | Unknown [cite:10] | High majority [cite:10] | Indicates provider-first positioning is working. [cite:10] |
| Monthly student register-interest submissions | Unknown [cite:10] | TBD [cite:10] | Secondary indicator that should not overshadow provider leads. [cite:10] |

## 2. Users and stakeholders

### 2.1 Primary users

| User group | Need | Current pain point | Importance |
|----------|------|--------------------|-----------|
| Education provider decision-makers | Understand EnRollifyEdu’s value and decide whether to engage. [cite:10] | Overwhelmed by low-quality leads, high recruitment costs, and fragmented processes. [cite:10] | High [cite:10] |
| Operational / admissions staff | See that EnRollifyEdu will reduce manual workload and improve applicant quality. [cite:10] | Time-consuming qualification and follow-up on unqualified enquiries. [cite:10] | Medium–High [cite:10] |
| International students wanting to study in NZ | Understand that EnRollifyEdu can connect them with suitable NZ education providers and register interest. [cite:10] | Fragmented information and no clear way to express interest to multiple providers. [cite:10] | Medium [cite:10] |

### 2.2 Stakeholders

| Stakeholder | Role in this work | Decision authority | Notes |
|-----------|-------------------|--------------------|------|
| EnRollify founders | Own product vision and positioning. [cite:10] | High [cite:10] | Approve messaging, scope, and launch readiness. [cite:10] |
| Marketing / Growth | Own traffic generation, messaging tests, and analytics. [cite:10] | Medium [cite:10] | Influence content decisions and success measures. [cite:10] |
| Engineering / Implementation | Build the landing page and integrations. [cite:10] | Medium [cite:10] | Responsible for technical feasibility and delivery. [cite:10] |
| Design / UX | Visual design, layout, and interaction details. [cite:10] | Medium [cite:10] | Ensures clarity, brand fit, and usability. [cite:10] |

## 3. Scope

### 3.1 In scope

- Single, scrollable landing page for EnRollifyEdu using Vite, React, Tailwind CSS, and TypeScript, hosted on Netlify.[cite:10]
- Core sections: hero, who-we’re-for, how-it-works process, benefits/outcomes, supporting content, provider contact section, student register-interest section, navigation, and footer.[cite:10]
- Responsive layout for desktop and mobile.[cite:10]
- Basic analytics for pageviews and form submissions, plus simple notifications on form submissions.[cite:10]
- Use of the EnRollifyEdu logo and initial brand direction from the brief.[cite:10]
- **Blog module (Phase 6):** public `/blog` listing and `/blog/:slug` detail; hidden admin post CRUD at `/enrollify-manage/posts`; Supabase `blog_posts` + RLS; RSS at `/blog/rss.xml`; sitemap and OG meta for social crawlers — [phase-6-blog.md](./phase-6-blog.md).[cite:10]

### 3.2 Out of scope

- Additional marketing pages beyond the landing page and blog (e.g. separate About, For Students, or For Providers pages).[cite:10]
- Provider self-serve portal, dashboards, or login flows.[cite:10]
- Student application workflows beyond register interest, such as document uploads or full applications.[cite:10]
- Deep CRM or SIS integrations beyond simple notifications or low-complexity integrations.[cite:10]
- A/B testing infrastructure and detailed SEO strategy beyond on-page basics.[cite:10]

### 3.3 Assumptions

- Core value proposition, tone of voice, and key messaging will be available from the EnRollifyEdu brief or founders in time for content drafting.[cite:10]
- A simple, manually handled process for responding to provider contacts and student interest submissions will exist at launch.[cite:10]
- Traffic acquisition is managed outside this PRD.[cite:10]

## 4. User journeys and key scenarios

| Scenario | Trigger | Expected behaviour | Priority |
|--------|---------|--------------------|---------|
| Provider evaluates EnRollifyEdu | Provider arrives from outreach, search, or referral. [cite:10] | Understands the offering, sees fit, and submits the contact form. [cite:10] | Must [cite:10] |
| Provider submits contact | Provider selects the contact CTA. [cite:10] | Completes required fields, receives confirmation, and EnRollify receives the details. [cite:10] | Must [cite:10] |
| International student registers interest | Student discovers the page while researching NZ study options. [cite:10] | Reads a brief explanation, submits the register-interest form, and gets confirmation. [cite:10] | Should [cite:10] |
| Error and edge states | Validation, network, or server issues occur. [cite:10] | User sees clear error messages and recovery options. [cite:10] | Must [cite:10] |

## 5. Requirements

### 5.1 Functional requirements

#### FR-1 Hero section for education providers

**Requirement**  
The system shall display a hero section that clearly states EnRollifyEdu’s value proposition for education providers and includes a primary CTA leading to the provider contact action.[cite:10]

**Rationale**  
Providers need to understand what EnRollifyEdu does and what action to take within the first screenful of content.[cite:10]

**Priority**  
Must.[cite:10]

**Acceptance criteria**
- Given a visitor loads the page on desktop, when the page renders, then the hero section is visible above the fold with a headline, supporting copy, and a primary CTA.[cite:10]
- Given a visitor clicks the primary CTA, when the click is processed, then the page moves the user to the provider contact section without leaving the page.[cite:10]

#### FR-2 How-it-works process section

**Requirement**  
The system shall present an overview of EnRollifyEdu’s recruitment process covering attraction, qualification, assessment, review, and delivery.[cite:10]

**Rationale**  
Providers need to see a structured, end-to-end process so the service is clearly differentiated from generic lead generation.[cite:10]

**Priority**  
Must.[cite:10]

**Acceptance criteria**
- Given a visitor scrolls to the how-it-works section, when they view the content, then all five process steps are shown with concise descriptions and clear grouping.[cite:10]
- Given the page is viewed on mobile, when the section renders, then the steps remain readable and appear in the correct order.[cite:10]

#### FR-3 Benefits and outcomes section

**Requirement**  
The system shall include a section highlighting provider outcomes, including better-qualified students, lower recruitment costs, and smoother admissions workflows.[cite:10]

**Rationale**  
Providers evaluate the service based on the business and operational outcomes it may create.[cite:10]

**Priority**  
Must.[cite:10]

**Acceptance criteria**
- Given a provider scrolls to the benefits section, when the section is visible, then at least three clearly labelled benefits with short explanations are shown.[cite:10]
- Given the page is viewed on mobile, when the benefits section renders, then text and layout remain readable without horizontal scrolling.[cite:10]

#### FR-4 Provider contact section

**Requirement**  
The system shall provide a provider-focused contact section with a form or equivalent mechanism that captures provider organisation, role, contact details, and a brief description of needs.[cite:10]

**Rationale**  
This section is the primary conversion path and is a required element for the landing page.[cite:10]

**Priority**  
Must.[cite:10]

**Acceptance criteria**
- Given a provider submits a valid form, when the submission is processed, then the data is sent to the designated destination and a success message is displayed.[cite:10]
- Given required fields are blank or invalid, when the provider attempts submission, then inline validation messages appear and submission is blocked until corrected.[cite:10]
- Given a submission succeeds, when analytics is configured, then a provider-contact submission event is recorded.[cite:10]

**Form fields (finalized)**  
Required: organisation name, your name, role/title, work email, country/region, brief description of needs, consent. Optional: phone. Honeypot for spam protection. See [phase-1-discovery.md](./phase-1-discovery.md) §5.2.

#### FR-5 International student register-interest form

**Requirement**  
The system shall provide a lightweight register-interest form for international students that captures minimal data such as name, email, country of residence, and level or area of study interest.[cite:10]

**Rationale**  
International students are an additional audience, and their interest should be captured without distracting from the provider-first conversion goal.[cite:10]

**Priority**  
Should.[cite:10]

**Acceptance criteria**
- Given a student submits a valid register-interest form, when the submission is processed, then the data is sent to the designated destination and a confirmation message is displayed.[cite:10]
- Given required fields are blank or invalid, when the student attempts submission, then clear validation messages are shown and submission is blocked until corrected.[cite:10]
- Given a student submission succeeds, when analytics is configured, then a student-interest submission event is recorded.[cite:10]

**Form fields (finalized)**  
Required: full name, email, country of residence, level of study interest (undergraduate, postgraduate, pathway/foundation, other), consent. Optional: area of study. Placement: `#student-interest` section before footer, secondary styling. See [phase-1-discovery.md](./phase-1-discovery.md) §5.2.

#### FR-6 Navigation and footer

**Requirement**  
The system shall include basic navigation with the logo and key section links, plus a footer with contact details and any necessary links such as privacy information.[cite:10]

**Rationale**  
Users need clear orientation and access to key sections throughout the page.[cite:10]

**Priority**  
Must.[cite:10]

**Acceptance criteria**
- Given the page loads on desktop, when the header renders, then the logo and navigation links to key sections are visible and functional.[cite:10]
- Given a user clicks a navigation item, when the interaction is processed, then the viewport scrolls to the corresponding section.[cite:10]
- Given the page loads on mobile, when navigation renders, then it remains usable through a simple responsive pattern.[cite:10]

#### FR-7 Analytics tracking

**Requirement**  
The system shall record basic analytics events for page views and each successful provider-contact and student-interest submission.[cite:10]

**Rationale**  
Tracking is required to measure performance and support future optimisation.[cite:10]

**Priority**  
Must.[cite:10]

**Acceptance criteria**
- Given a user loads the landing page, when the page renders successfully, then a pageview event is triggered to the configured analytics tool.[cite:10]
- Given a provider-contact or student-interest form is submitted successfully, when the submission completes, then a distinct analytics event is triggered indicating the submission type.[cite:10]

#### FR-8 Blog module (Phase 6)

**Requirement**  
The system shall provide a blog with admin-only authoring, public listing and detail pages, draft/publish lifecycle, SEO metadata, RSS, and sitemap entries.[cite:10]

**Rationale**  
EnRollifyEdu needs an in-house content channel for thought leadership and organic search visibility without external platforms.[cite:10]

**Priority**  
Should (Phase 6 — complete).[cite:10]

**Acceptance criteria**  
See [phase-6-blog.md](./phase-6-blog.md) §9 for full verification. Summary:

- Given an admin user, when they create and publish a post, then it appears on `/blog` and `/blog/:slug` with correct SEO meta.
- Given a draft post, when a public visitor browses listing, detail, or RSS, then the draft is absent.
- Given published posts exist, when `/blog/rss.xml` or `/sitemap.xml` is requested, then valid feeds return published posts only.
- Given a non-admin user, when they access `/enrollify-manage/posts`, then access is denied and they are redirected to login.
- Blog CRUD uses Supabase client + RLS only — no Express backend routes.

### 5.2 Non-functional requirements

#### NFR-1 Performance and responsiveness

**Requirement**  
The landing page shall load quickly and render responsively on common desktop and mobile devices.[cite:10]

**Category**  
Performance.[cite:10]

**Priority**  
Should.[cite:10]

**Acceptance criteria**
- Given a first-time visitor on a typical connection, when they request the page, then the initial meaningful content appears within an acceptable threshold of approximately three seconds in realistic test conditions.[cite:10]
- Given the page is viewed on common mobile resolutions, when the layout renders, then no horizontal scrolling is required for primary content areas.[cite:10]

#### NFR-2 Accessibility

**Requirement**  
The landing page shall follow basic accessibility best practices, including semantic HTML, alt text for key images, keyboard navigability, and sufficient contrast.[cite:10]

**Category**  
Accessibility.[cite:10]

**Priority**  
Should.[cite:10]

**Acceptance criteria**
- Given a keyboard-only user navigates the page, when they move through interactive elements, then all CTAs, fields, and links are reachable in a logical order.[cite:10]
- Given an automated accessibility scan is run, when the report is generated, then no critical accessibility violations are present.[cite:10]

#### NFR-3 Security and privacy

**Requirement**  
The landing page shall handle provider and student contact information securely and in line with EnRollifyEdu privacy expectations.[cite:10]

**Category**  
Security / Privacy.[cite:10]

**Priority**  
Must.[cite:10]

**Acceptance criteria**
- Given form submissions are implemented through a backend endpoint or external service, when data is transmitted, then it is sent over HTTPS.[cite:10]
- Given data is stored or forwarded, when the implementation is reviewed, then it follows the agreed data-retention and access-control approach determined during Phase 1 discovery and security review.[cite:10]
- Given Phase 1 and Phase 5 security checks are completed, when the roadmap is followed, then data-handling risks are explicitly documented and validated.[cite:10]

#### NFR-4 Maintainability

**Requirement**  
The implementation shall use Vite, React, Tailwind CSS, and TypeScript and be structured for straightforward updates.[cite:10]

**Category**  
Maintainability.[cite:10]

**Priority**  
Should.[cite:10]

**Acceptance criteria**
- Given a future developer inspects the codebase, when they review the landing page implementation, then components and sections are clearly separated with minimal duplication.[cite:10]
- Given a copy change is needed, when the change is applied, then it can be made without significant refactoring.[cite:10]

## 6. UX, content, or design notes

| Topic | Requirement or guidance | Owner | Status |
|------|------------------------|-------|-------|
| Navigation and form factor | Use a single-page layout with clear scrolling anchors, with hero and provider contact emphasised as the primary path. [cite:10] | Design/UX [cite:10] | Implemented — [phase-3-implementation.md](./phase-3-implementation.md) |
| CTA hierarchy | Keep the provider contact CTA primary and the student register-interest CTA visually secondary. [cite:10] | Design/UX [cite:10] | Implemented — [phase-3-implementation.md](./phase-3-implementation.md) |
| Error states | Show inline, human-readable validation and error messages, plus a recoverable global error state if backend submission fails. [cite:10] | Engineering/Design [cite:10] | Implemented — Phases 2–3 |
| Accessibility | Use semantic HTML, appropriate ARIA where needed, sufficient contrast, and visible focus states. [cite:10] | Engineering/Design [cite:10] | Implemented — [phase-3-implementation.md](./phase-3-implementation.md); verified Phase 5 |
| Content and tone | Use clear, confident, provider-first messaging with concise supporting copy for students. [cite:10] | Product/Marketing [cite:10] | Draft copy — pending founder review |

## 7. Data, integrations, and materials

### 7.1 Data requirements

| Item | Source | Used for | Sensitivity | Notes |
|----|--------|---------|-------------|------|
| Provider contact form fields | Provider user [cite:10] | Follow-up and qualification [cite:10] | Personal/contact [cite:10] | Organisation name, contact name, role, work email, phone (optional), country/region, needs description, consent. [cite:10] |
| Student register-interest form fields | Student user [cite:10] | Routing to relevant providers and pipeline insight [cite:10] | Personal/contact [cite:10] | Full name, email, country of residence, study level, area of study (optional), consent. [cite:10] |
| Analytics events | Frontend [cite:10] | Conversion tracking and optimisation [cite:10] | Pseudonymous [cite:10] | `pageview`, `provider_contact_submit`, `student_interest_submit` (+ error events). Plausible or GA4 via env vars. Admin routes excluded from tracking. [cite:10] |
| Blog posts | Admin user via Supabase [cite:10] | Public articles, SEO, syndication [cite:10] | Content [cite:10] | `blog_posts` table; draft/published lifecycle; see [phase-6-blog.md](./phase-6-blog.md). [cite:10] |
| Blog images | Admin upload via Supabase Storage [cite:10] | Featured and inline article images [cite:10] | Content [cite:10] | `blog-images` bucket; 2 MB; JPEG/PNG/WebP. [cite:10] |

### 7.2 Integrations

| System / service | Purpose | Dependency type | Owner | Risks / notes |
|----------------|---------|-----------------|-------|--------------|
| Analytics tool | Track pageviews and form submissions via Plausible or GA4 (`VITE_ANALYTICS_PROVIDER`, `VITE_ANALYTICS_ID`). [cite:10] | Technical [cite:10] | Engineering [cite:10] | Provider choice at Netlify deploy; see [phase-4-integrations.md](./phase-4-integrations.md). [cite:10] |
| Email / notification channel | Receive provider and student submissions via Netlify Forms email notifications. [cite:10] | Technical / Operational [cite:10] | Engineering / Ops [cite:10] | Configure in Netlify dashboard; manual handling at launch. [cite:10] |
| Supabase (Postgres + Auth + Storage) | Blog posts, admin auth, image storage; RLS enforces access. [cite:10] | Technical [cite:10] | Engineering [cite:10] | `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` in browser and build scripts; see [phase-6-blog.md](./phase-6-blog.md). [cite:10] |
| Netlify build + edge | RSS, sitemap, OG HTML shells; runtime OG for social crawlers. [cite:10] | Technical [cite:10] | Engineering [cite:10] | `generate:feeds` post-build; `blog-og` edge function. [cite:10] |

## 8. Risks, dependencies, and open questions

### 8.1 Risks

| Risk | Likelihood | Impact | Mitigation |
|-----|-----------|--------|----------|
| Over-emphasis on the student path dilutes provider-first messaging. [cite:10] | Medium [cite:10] | Medium–High [cite:10] | Keep the student CTA secondary and concise. [cite:10] |
| Process explanation is too thin, making EnRollifyEdu appear generic. [cite:10] | Medium [cite:10] | High [cite:10] | Make the how-it-works section clearly structured and differentiated. [cite:10] |
| Student-interest submissions become operationally heavy. [cite:10] | Medium [cite:10] | Medium [cite:10] | Start with a simple manual handling process and expand later if needed. [cite:10] |
| Security and privacy expectations for contact data are under-specified. [cite:10] | Low–Medium [cite:10] | High [cite:10] | Phase 1 and Phase 5 security reviews completed; see [quality-check.md](./quality-check.md). [cite:3][cite:10] |

### 8.2 Dependencies

| Dependency | Type | Owner | Status | Notes |
|----------|------|-------|--------|------|
| Final messaging and value proposition | Product/Marketing [cite:10] | Founders/Marketing [cite:10] | In progress [cite:10] | Draft copy implemented; founder review before public launch. [cite:10] |
| Logo and brand basics | Design [cite:10] | Founders/Design [cite:10] | In progress [cite:10] | Text wordmark interim; logo asset pending. [cite:10] |
| Exact placement of the student register-interest form | Product/Design [cite:10] | Product [cite:10] | Resolved [cite:10] | `#student-interest` section before footer, secondary styling. [cite:10] |

### 8.3 Open questions

| Question | Owner | Due date | Resolution |
|--------|-------|----------|-----------|
| Where exactly should the student register-interest form appear? [cite:10] | Product/Design [cite:10] | 2026-06-20 [cite:10] | **`#student-interest` section** before footer, secondary styling — [phase-1-discovery.md](./phase-1-discovery.md) |
| What exact fields are required in each form? [cite:10] | Product/Design/Engineering [cite:10] | 2026-06-20 [cite:10] | Finalized — [phase-1-discovery.md](./phase-1-discovery.md) §5.2; PRD §5 FR-4/FR-5 |
| Which analytics tool will be used initially? [cite:10] | Product/Engineering [cite:10] | At deploy [cite:10] | **Plausible or GA4** supported; set `VITE_ANALYTICS_*` on Netlify — [phase-4-integrations.md](./phase-4-integrations.md) |

## 9. Implementation Roadmap

### 9.1 Phase 1 – Discovery and setup

Goal: understand constraints, confirm scope, and identify security considerations before build starts.[cite:6][cite:3][cite:10]

- Set up or review the base Vite, React, Tailwind CSS, and TypeScript project structure.[cite:10]
- Confirm routing, hosting, and deployment approach for the landing page.[cite:10]
- Review the EnRollifyEdu brief and finalise the content outline and core messaging.[cite:10]
- Define the minimal data-handling approach for provider and student submissions, including storage, forwarding, and retention.[cite:10]
- Perform the initial security review, covering HTTPS, data exposure risks, and who can access submission data.[cite:3][cite:6][cite:10]
- Record any conflicts between scope and technical constraints as assumptions, risks, or open questions.[cite:10]

### 9.2 Phase 2 – Core build

- Implement or configure endpoints or services to receive provider and student form submissions.[cite:10]
- Set up basic notification handling for EnRollify team follow-up.[cite:10]
- Configure the analytics foundation and initial event structure.[cite:10]

### 9.3 Phase 3 – Implementation

- Build the landing page sections in Vite, React, and Tailwind styling.[cite:10]
- Connect both forms to the configured endpoints or services.[cite:10]
- Implement responsive behaviour and accessibility essentials.[cite:10]

### 9.4 Phase 4 – Integrations

- Finalise analytics integration and confirm event firing for pageviews and submissions.[cite:10]
- Finalise notification integration for both forms and confirm recipients.[cite:10]
- Add basic logging or monitoring for form errors and failures.[cite:10]

### 9.5 Phase 5 – Testing and verification

- Execute functional tests for each requirement and acceptance criterion in Section 5.[cite:10]
- Run regression checks to confirm there are no route or configuration conflicts.[cite:10]
- Perform security validation, including HTTPS enforcement, review of form-data handling, and confirmation that sensitive data is not logged insecurely.[cite:3][cite:6][cite:10]
- Fix issues discovered during verification.[cite:10]

### 9.6 Phase 6 – Blog module

- Implement Supabase schema, RLS, and storage for blog posts.[cite:10]
- Build admin post list and editor with Quill, image upload, and publish validation.[cite:10]
- Build public `/blog` listing and `/blog/:slug` detail with SEO meta, RSS, sitemap, and OG support.[cite:10]
- Verify with unit tests and RLS script — [phase-6-blog.md](./phase-6-blog.md).[cite:10]

**Status:** Complete (2026-06-27).

### 9.7 Phase 7 – Deployment and rollout

- Deploy the marketing site to the chosen hosting environment.[cite:10]
- Run smoke tests for page load, forms, analytics events, and blog routes.[cite:10]
- Set up monitoring or alerting for availability and form failures.[cite:10]
- Define a rollback plan for critical issues and begin directing traffic to the page.[cite:3][cite:10]

## 10. Quality check

See [quality-check.md](./quality-check.md) for the full report. Summary:

### 10.1 Passed

- The PRD follows the expected structure and includes all major sections required by the template.[cite:3][cite:10]
- Important functional and non-functional requirements include concrete acceptance criteria.[cite:3][cite:10]
- The Implementation Roadmap starts with Phase 1 Discovery and setup and includes security review in Phase 1 and Phase 5.[cite:3][cite:6][cite:10]
- Phases 1–5 complete: all Must FRs implemented; form fields and student placement resolved; security validated; build and local/preview verification pass.[cite:10]
- Phase 6 blog module complete: admin CRUD, public pages, feeds, RLS verified — [phase-6-blog.md](./phase-6-blog.md).[cite:10]

### 10.2 Issues

- Document owner, contributors, and target release remain TBD (founder assignment).[cite:3][cite:10]
- Success measure baselines/targets to be set post-launch.[cite:10]
- Draft copy, logo asset, and privacy policy URL pending founder/legal review before public launch.[cite:10]
- Netlify live E2E (forms, notifications, production analytics, blog feeds) pending Phase 7 dashboard confirmation.[cite:10]

### 10.3 Actions

| Action | Status |
|--------|--------|
| Finalise form field lists → update §5 and §7 | Done |
| Confirm student form placement → UX/requirements | Done |
| Decide analytics tool → update §7.2 | Partial — dual-provider; choice at Netlify deploy |
| Assign document owner and contributors | Open |
| Phase 6 blog module | Done — §9.6 |
| Phase 7 deployment and smoke tests | Next — §9.7 |

## 11. Approvals

Formal approvals are not required for this internal working PRD, and sign-off will be handled informally by the core EnRollifyEdu team.[cite:10]
