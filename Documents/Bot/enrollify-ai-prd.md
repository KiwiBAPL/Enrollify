# Product Requirements Document — Enrollify AI (Facebook Messenger Bot + Admin Panel)

## Document control

| Field | Details |
|---|---|
| Product / feature name | Enrollify AI — Facebook Messenger Integration + Admin Panel |
| Product type | IT / software |
| Document owner | Enrollify Business Owner |
| Contributors | TBD |
| Status | Draft |
| Version | 0.1 |
| Last updated | 22 June 2026 |
| Target release | TBD |
| Linked artefacts | Existing website: https://enrollifyedu.com/ · GitHub: https://github.com/KiwiBAPL/Enrollify · Facebook Bot planning document |

---

## 1. Overview

### 1.1 Summary

Enrollify AI is a shared-backend AI admissions platform that connects Facebook Messenger to an AI assistant helping prospective students explore study opportunities in New Zealand. The system handles Messenger conversations, qualifies leads naturally over multiple messages, captures and scores lead data in Supabase, and provides an internal admin dashboard for the Enrollify team to review leads and conversations. The architecture is designed so website chat and additional channels can be added later without rebuilding the core services.

### 1.2 Background

Enrollify operates a public website at enrollifyedu.com and handles student admissions enquiries manually. As enquiry volume grows, staff time is increasingly consumed by low-quality or early-stage conversations with prospective students who may not qualify or are not yet serious. There is no automated first-response capability, no systematic lead capture, and no centralised record of enquiry conversations or outcomes.

The business has decided to introduce an AI admissions assistant as the primary first-touch channel, starting with Facebook Messenger. The assistant will qualify students naturally, capture lead data automatically, and surface high-quality leads to staff through an internal admin panel. The existing website and codebase should be preserved; this work adds a backend application layer on top of it.

### 1.3 Problem statement

- **The primary user or stakeholder is:** The Enrollify business owner and admissions handling team.
- **They are trying to:** Identify, respond to, and qualify prospective students who are suitable candidates to study in New Zealand.
- **Today they cannot do this well because:** Too much time is spent manually handling enquiries, including conversations with people who are unlikely to qualify or are not serious candidates.
- **This causes the following impact:** Staff time is consumed by low-value conversations, response capacity is reduced, and strong candidate leads may be delayed, missed, or handled inconsistently.

### 1.4 Desired outcomes

- **Outcome 1:** Prospective students receive a timely initial AI response and natural qualification screening through Facebook Messenger, with website chat able to use the same backend in a future release.
- **Outcome 2:** The business captures more leads who meet Enrollify's target criteria and spends less staff time on poor-fit or low-intent enquiries.
- **Outcome 3:** Enquiry, lead, and conversation data is stored centrally so the team can review conversations, track lead quality, and follow progression toward appointment, application, and enrolment.

### 1.5 Success measures

| Measure | Current baseline | Target | Notes |
|---|---|---|---|
| First-response time for incoming conversations | Unknown | TBD — establish baseline in release 1 | Important operational KPI |
| Number of conversations handled per week | Unknown | TBD | Used to measure adoption and system workload |
| Percentage of conversations captured as leads | Unknown | TBD | Measures qualification and data capture effectiveness |
| Percentage of leads with name, email, and phone collected | Unknown | TBD | Measures completeness of lead records |
| Conversion to booked appointment or application | Unknown | TBD | Measures progression from conversation to next step |
| Number / percentage of leads who later enrol | Unknown | TBD | Final outcome measure; enrolment status entered manually in admin panel |

*All targets are marked TBD as no baseline data exists today. Targets should be set after release 1 establishes initial baselines.*

---

## 2. Users and stakeholders

### 2.1 Primary users

| User group | Need | Current pain point | Importance |
|---|---|---|---|
| Prospective students | Receive quick, helpful answers about studying in New Zealand; explore options without feeling interrogated | No automated first response; enquiries may go unanswered or be delayed | High |
| Enrollify admissions staff | View and action qualified leads; review conversations; track pipeline | No central record of enquiries; manual screening of all messages | High |
| Enrollify business owner | Monitor lead quality, conversion, and system health; sign off on data | No visibility into enquiry pipeline or outcomes | High |

### 2.2 Stakeholders

| Stakeholder | Role in this work | Decision authority | Notes |
|---|---|---|---|
| Business owner | Approves scope, priorities, and sign-off | Final decision authority | Also a primary user of the admin panel |
| Admissions staff | Day-to-day users of the admin panel | Input on admin UX requirements | |
| Developer / Cursor AI | Implementation | None — executes against this PRD | |
| Meta (Facebook) | Provides the Messenger platform API | Platform rules apply | Webhook review and approval process required |
| Supabase | Provides hosted Postgres and auth services | None — vendor | Service availability is a dependency |

---

## 3. Scope

### 3.1 In scope

- End-to-end Enrollify AI solution for Facebook Messenger as the first live channel
- Meta Messenger webhook verification (GET endpoint), inbound message handling (POST endpoint), outbound reply handling, typing indicators, read receipts, and App Secret signature validation
- AI conversation handling for prospective student enquiries using Claude API with OpenAI-compatible architecture
- Natural qualification flow that gathers lead information over multiple messages without interrogating the student
- Automatic lead capture and storage in Supabase on each new conversation
- Lead scoring based on defined qualification factors (ready to apply, English ability, budget, intake timeframe, visa readiness, education match, interest level)
- Supabase schema: students, conversations, messages, institutions, courses, knowledge_articles, lead_scores, appointments tables
- Admin panel for internal staff: view students, search leads, review conversations, monitor lead pipeline and hot leads, export CSV, view basic analytics
- Manual enrolment-status input in the admin panel
- Basic internal analytics: average response time, conversation volume, lead capture rate, conversion tracking
- Shared backend architecture so website chat and future channels can be added without redesigning core services
- Knowledge base architecture supporting retrieval-augmented generation (RAG-ready) for PDFs, Word docs, FAQs, institution, course, visa, and scholarship information
- Conversation memory within a session and across sessions for returning students

### 3.2 Out of scope

- Instagram integration (release 1)
- WhatsApp integration (release 1)
- HubSpot integration (release 1)
- Appointment booking workflow (release 1)
- Advanced analytics and reporting beyond basic operational metrics (release 1)
- Facebook Messenger production launch *(deferred — Meta business verification pending; webhook code remains in repo)*

### 3.3 Assumptions

- **Website chat** is the first production channel (July 2026 pivot). It is **analytics-only** — questions are stored in `webchat_messages` and viewed on the **Chat Insights** admin page; it does not create leads. **Consultation leads** use `channel: lead_bot` (Lead Bot modal) and appear on the Leads dashboard.
- Facebook Messenger webhook code is implemented but **not registered** until Meta verification completes.
- The existing Enrollify website gains a floating chat widget on public pages (`SiteLayout`) and required `/api/chat` proxy wiring.
- The admin panel is for internal use only in release 1; it is not publicly accessible.
- AI providers are managed via admin UI (Perplexity default; Claude optional failover).
- The backend is deployed separately on Railway; admin UI and chat widget are served from the Netlify SPA with `/api/*` proxied to Railway.
- Supabase will be used for all application data storage and Row-Level Security (RLS) policies will be applied to all tables.
- Supabase JWT authentication secures all admin panel API routes.
- Lead-scoring factor weights and thresholds are to be agreed with the business owner before implementation. *(TBD — see Open Questions OQ-1.)*
- The business owner will provide qualification criteria and knowledge-base source content before build begins. *(TBD — see Open Questions OQ-2.)*

---

## 4. User journeys and key scenarios

| Scenario | Trigger | Expected user/system behaviour | Priority |
|---|---|---|---|
| SC-1: New student sends first Messenger message | Student messages the Enrollify Facebook Page | System verifies webhook, receives message, stores new student + conversation record, sends typing indicator, calls AI, returns AI reply within 10 seconds, stores reply | Must |
| SC-2: AI qualifies student over multiple messages | Student continues conversation | AI collects qualification fields naturally across multiple turns; updates lead record incrementally; scores lead after each turn | Must |
| SC-3: Lead is captured and scored | Enough qualification data collected | System creates or updates lead_scores record; score is visible in admin panel within 60 seconds of last message | Must |
| SC-4: Admin staff views lead pipeline | Staff opens admin panel | Pipeline view shows leads grouped by score band (Hot, Warm, Cold); each lead shows student name, score, last activity | Must |
| SC-5: Admin staff reviews a conversation | Staff clicks on a student | Full message history shown in chronological order; lead fields and score visible alongside | Must |
| SC-6: Admin staff searches for a student | Staff uses search field | System filters student list by name, email, phone, country, or lead score within 1 second | Should |
| SC-7: Admin staff updates enrolment status | Staff selects a status on a student record | Status is saved immediately; change is visible to all staff in the admin panel | Must |
| SC-8: Admin staff exports leads to CSV | Staff clicks export | CSV file downloads containing student fields and lead scores for the selected date range | Should |
| SC-9: Returning student sends a new message | Student who was previously captured messages again | System recognises the student by channel_user_id; retrieves prior conversation context; AI responds with continuity | Must |
| SC-10: Webhook signature validation fails | Inbound POST with invalid or missing X-Hub-Signature-256 | System rejects the request with HTTP 403; logs the rejection; does not process the message | Must |

**SC-1 critical journey detail:**

1. *Starting point:* Student has found the Enrollify Facebook Page.
2. *User goal:* Ask about studying in New Zealand.
3. *Main steps:* Student sends message → Meta delivers webhook POST → Backend validates signature → Backend stores message → Backend sends typing_on → Backend calls AI service → AI generates reply → Backend sends reply via Messenger Send API → Backend stores reply.
4. *Possible failure points:* Webhook unreachable; signature validation failure; AI provider timeout; Messenger Send API error.
5. *Expected outcome:* Student receives a warm, helpful reply within 10 seconds; conversation is stored in Supabase.

---

## 5. Requirements

### 5.1 Functional requirements

#### FR-1 Webhook verification

**Requirement:** The Messenger webhook service shall respond to a GET request at `/webhook` by verifying that the `hub.verify_token` query parameter matches the configured `FB_VERIFY_TOKEN` environment variable and, if it matches, respond with the `hub.challenge` value and HTTP 200.

**Rationale:** Meta requires webhook verification before it will deliver messages to the endpoint.

**Priority:** Must

**Acceptance criteria:**
- Given a GET request to `/webhook` with `hub.mode=subscribe`, `hub.verify_token` equal to `FB_VERIFY_TOKEN`, and a `hub.challenge` string, when the request is received, then the system shall respond with HTTP 200 and the body equal to the `hub.challenge` string.
- Given a GET request to `/webhook` with a `hub.verify_token` that does not match `FB_VERIFY_TOKEN`, when the request is received, then the system shall respond with HTTP 403 and shall not echo the challenge.

---

#### FR-2 Inbound message signature validation

**Requirement:** The Messenger webhook service shall validate the HMAC-SHA256 signature of every inbound POST request to `/webhook` by computing the signature from the raw request body and the `FB_APP_SECRET` environment variable and comparing it to the value in the `X-Hub-Signature-256` header.

**Rationale:** Signature validation ensures that only genuine Meta-originated payloads are processed, preventing spoofed or injected messages.

**Priority:** Must

**Acceptance criteria:**
- Given a POST to `/webhook` with a valid HMAC-SHA256 signature in `X-Hub-Signature-256`, when the system processes the request, then it shall accept the payload and proceed to message handling.
- Given a POST to `/webhook` with a missing or invalid `X-Hub-Signature-256` header, when the system processes the request, then it shall respond with HTTP 403, log the rejection with sender IP and timestamp, and not process the payload.

---

#### FR-3 Inbound message handling

**Requirement:** The Messenger webhook service shall parse the `entry[].messaging[]` array from each verified POST payload, extract the sender PSID, message text, and timestamp for each text message event, and pass these values to the ConversationService.

**Rationale:** This is the entry point for every student message. Without correct parsing, no conversation can proceed.

**Priority:** Must

**Acceptance criteria:**
- Given a valid webhook POST containing one text message event, when the system parses the payload, then it shall call `ConversationService.handleIncomingMessage` with the sender PSID, message text, timestamp, and `channel='facebook'`.
- Given a valid webhook POST containing a non-text event (e.g., delivery confirmation, read receipt), when the system parses the payload, then it shall acknowledge the event and take no further action.

---

#### FR-4 Typing indicator and read receipt

**Requirement:** The MessengerChannelAdapter shall send a `typing_on` sender action to the Messenger Send API before calling the AI service and a `typing_off` action after the AI reply has been dispatched.

**Rationale:** Typing indicators signal to the student that their message is being processed, improving the conversational experience.

**Priority:** Must

**Acceptance criteria:**
- Given an inbound message has passed validation and been stored, when the system begins generating a reply, then it shall call the Messenger Send API with `sender_action: 'typing_on'` for the sender PSID before the AI call.
- Given the AI reply has been sent to the student, when the reply is successfully dispatched, then it shall call the Messenger Send API with `sender_action: 'typing_off'` for the sender PSID.

---

#### FR-5 AI conversation and response

**Requirement:** The AIService shall generate a reply for each inbound student message by assembling a prompt that includes the system prompt, full conversation history for the session, captured lead fields for the student, and relevant knowledge base snippets retrieved via RAG, then calling the Claude API.

**Rationale:** Contextual AI responses that draw on conversation history and knowledge base content are essential to a natural, helpful student experience.

**Priority:** Must

**Acceptance criteria:**
- Given an inbound message from a student, when the AIService is called, then it shall include the system prompt, all prior messages in the conversation, the current student lead fields, and up to 3 relevant knowledge base snippets in the prompt context.
- Given the AI service receives a reply from Claude, when the reply is received, then the system shall store the reply as a message record in Supabase with `message_type='assistant'` and dispatch it via the MessengerChannelAdapter within 10 seconds of the original inbound message timestamp.
- Given the Claude API returns an error or timeout, when the error is detected, then the system shall send a fallback message to the student ("I'm having trouble right now, please try again in a moment.") and log the error with full context.

---

#### FR-6 Natural qualification flow

**Requirement:** The Enrollify AI system prompt shall instruct the AI assistant to collect the following lead fields naturally across multiple conversation turns without asking more than one or two questions per message: name, email, phone, country of residence, citizenship, current education level, desired qualification, field of study, English level, preferred intake date, budget, visa status, and any student questions.

**Rationale:** Collecting qualification data naturally improves conversion rates and student experience compared to form-like interrogation.

**Priority:** Must

**Acceptance criteria:**
- Given a new conversation, when the AI generates 10 or more turns, then the conversation transcript shall not contain two or more qualification questions in any single AI message turn.
- Given the AI collects a value for a qualification field (e.g., email address), when the value is collected, then the StudentRepository shall update the corresponding student record field in Supabase within 5 seconds of the message being processed.

---

#### FR-7 Student and conversation record creation

**Requirement:** The ConversationService shall create a new student record in the `students` table and a new conversation record in the `conversations` table on the first inbound message from an unrecognised Facebook PSID, linking them by student ID.

**Rationale:** Every interaction must be traceable from student identity through to conversation history and lead score.

**Priority:** Must

**Acceptance criteria:**
- Given an inbound message with a Facebook PSID that does not exist in the `students` table, when the message is processed, then a new student record shall be created with `channel='facebook'` and `channel_user_id` equal to the sender PSID, and a new conversation record linked to that student shall be created before the AI service is called.
- Given an inbound message from a PSID that already exists in `students`, when the message is processed, then no duplicate student record shall be created; the existing student record shall be reused.

---

#### FR-8 Message persistence

**Requirement:** The ConversationService shall persist every inbound student message and every outbound AI reply as individual records in the `messages` table, linked to the conversation ID, with `message_type`, `content`, and `created_at` fields populated.

**Rationale:** Persistent message records are required for admin review, conversation continuity, and audit purposes.

**Priority:** Must

**Acceptance criteria:**
- Given any inbound student message, when it is processed, then a record shall exist in `messages` with `message_type='user'`, `content` equal to the message text, and `created_at` matching the Meta webhook timestamp within 5 seconds.
- Given any outbound AI reply, when it is dispatched, then a record shall exist in `messages` with `message_type='assistant'`, `content` equal to the reply text, and `created_at` populated with the dispatch time.

---

#### FR-9 Lead scoring

**Requirement:** The LeadScoringService shall compute a numeric lead score between 0 and 100 for each student after every conversation turn in which a qualification field is updated, based on weighted factor scores for: ready to apply (0–10), English ability (0–10), budget fit (0–10), intake timeframe (0–10), visa readiness (0–10), education match (0–10), and interest level (0–10).

**Rationale:** Automated scoring allows staff to prioritise outreach toward the highest-value leads without manually reviewing every conversation.

**Priority:** Must

**Acceptance criteria:**
- Given a student record is updated with at least one qualification field, when the LeadScoringService runs, then a lead_scores record linked to that student shall be created or updated with an overall score and individual factor scores within 60 seconds of the triggering update.
- Given a student has no qualification fields populated, when scoring runs, then the overall score shall be 0 and all factor scores shall be 0.
- *Note: Factor weights and scoring thresholds are TBD pending business owner decision (OQ-1). This requirement is incomplete until weights are confirmed.*

---

#### FR-10 Admin panel — student list and search

**Requirement:** The admin panel shall display a paginated list of all students, showing name, email, phone, country, lead score, and last activity date, and shall allow an authenticated staff member to filter the list by name, email, phone, country, and lead score range.

**Rationale:** Staff need a fast, scannable view of all leads to prioritise outreach.

**Priority:** Must

**Acceptance criteria:**
- Given an authenticated staff member loads the student list view, when the page renders, then all students shall be shown in a paginated table with 25 records per page, sorted by last activity date descending by default.
- Given an authenticated staff member enters a search term in the search field, when the term is submitted, then the list shall update to show only students whose name, email, or phone contains the search term, within 1 second.

---

#### FR-11 Admin panel — conversation view

**Requirement:** The admin panel shall display the full message history for a selected student in chronological order, showing message content, sender (student or assistant), and timestamp for every message.

**Rationale:** Staff must be able to read the full context of a conversation to make informed outreach decisions.

**Priority:** Must

**Acceptance criteria:**
- Given an authenticated staff member selects a student from the list, when the conversation view loads, then all messages for that student's conversations shall be displayed in chronological order with sender label and timestamp.
- Given a conversation has more than 50 messages, when the view loads, then the most recent 50 messages shall be shown with a "load more" control to retrieve older messages.

---

#### FR-12 Admin panel — lead pipeline view

**Requirement:** The admin panel shall provide a lead pipeline view that groups students into score bands: Hot (score ≥ 70), Warm (score 40–69), and Cold (score < 40), showing student name, score, and last activity for each record in each band.

**Rationale:** A pipeline view allows the admissions team to focus on the highest-value leads without manually calculating scores.

**Priority:** Must

**Acceptance criteria:**
- Given the pipeline view is loaded by an authenticated staff member, when the page renders, then each student shall appear in exactly one band corresponding to their current overall lead score, and band boundaries shall be Hot ≥ 70, Warm 40–69, Cold < 40.
- Given a student's lead score changes (e.g., after a new conversation turn), when the pipeline view is refreshed, then the student shall appear in the band that matches their updated score.

---

#### FR-13 Admin panel — enrolment status update

**Requirement:** The admin panel shall allow an authenticated staff member to set a student's enrolment status to one of the following values: Enquiry, Qualified Lead, Appointment Booked, Application Submitted, Enrolled, Not Qualified, and shall save the change immediately to the student record in Supabase.

**Rationale:** Manual enrolment-status tracking is required to measure end-to-end conversion and to identify where students drop out.

**Priority:** Must

**Acceptance criteria:**
- Given an authenticated staff member selects a status value from the enrolment status control on a student record, when the selection is confirmed, then the student record in Supabase shall be updated within 2 seconds and the new status shall be visible to all logged-in staff without requiring a page reload.

---

#### FR-14 Admin panel — CSV export

**Requirement:** The admin panel shall allow an authenticated staff member to export a CSV file containing student fields (name, email, phone, country, citizenship, current education, desired qualification, field of study, English level, preferred intake, budget, visa status, enrolment status) and lead scores (overall score and individual factor scores) for all students or for a specified date range.

**Rationale:** CSV export enables offline analysis and supports future CRM integration.

**Priority:** Should

**Acceptance criteria:**
- Given an authenticated staff member clicks the export button, when no date range is specified, then a CSV file containing all student records and their latest lead scores shall download within 5 seconds for up to 1,000 student records.
- Given an authenticated staff member specifies a date range, when the export is triggered, then only students whose last conversation activity falls within the specified range shall be included in the CSV.

---

#### FR-15 Admin panel — analytics

**Requirement:** The admin panel shall display the following analytics on an analytics page: total conversations to date, average first-response time in seconds, percentage of conversations captured as leads, and lead-to-appointment conversion rate.

**Rationale:** Basic analytics allow the business owner to measure system performance and track improvement over time.

**Priority:** Should

**Acceptance criteria:**
- Given the analytics page is loaded, when the data renders, then all four metrics shall be computed from Supabase data and displayed. If insufficient data exists, each metric shall show "—" rather than a calculated value.
- Given at least 30 days of data is available, when the analytics page renders, then each metric shall be presented alongside a trend indicator (up/down/flat compared to the prior 30-day period).

---

#### FR-16 Knowledge base content retrieval

**Requirement:** The KnowledgeService shall, before each AI call, query the `knowledge_articles` table using semantic similarity to retrieve up to 3 articles relevant to the student's most recent message and insert their content into the AI prompt context.

**Rationale:** Grounding AI responses in institutional knowledge ensures accuracy and reduces hallucination about courses, visas, and scholarships.

**Priority:** Must

**Acceptance criteria:**
- Given a knowledge article exists in `knowledge_articles` and a student message contains related terms, when the KnowledgeService runs before the AI call, then the article content shall be included in the AI prompt context for that turn.
- Given no relevant articles exist for a student message, when the KnowledgeService runs, then the AI call shall proceed without knowledge context and no error shall be thrown.

---

#### FR-17 Channel-agnostic backend architecture

**Requirement:** The ConversationService, AIService, LeadScoringService, and KnowledgeService shall not contain any Facebook Messenger-specific code; all channel-specific logic shall be isolated in the MessengerChannelAdapter, which implements a shared ChannelAdapter interface.

**Rationale:** Channel isolation ensures that website chat, Instagram, and WhatsApp channels can be added later by implementing a new adapter without modifying the core services.

**Priority:** Must

**Acceptance criteria:**
- Given the MessengerChannelAdapter is removed from the running application, when the ConversationService is inspected, then it shall contain no direct references to any Meta API endpoint, Facebook PSID format, or Messenger Send API call.
- Given a second channel adapter (e.g., a WebChatAdapter stub) is added to the codebase, when it implements the ChannelAdapter interface and is registered, then the ConversationService shall route messages through it without modification.

---

### 5.2 Non-functional requirements

#### NFR-1 Response latency

**Requirement:** The backend system shall dispatch an AI reply to the Messenger Send API within 10 seconds of receiving a valid inbound webhook POST from Meta under normal operating conditions (single active conversation, Claude API available).

**Category:** Performance

**Rationale:** Students expect near-conversational response times; delays beyond 10 seconds significantly reduce engagement.

**Priority:** Must

**Acceptance criteria:**
- The system shall be tested with simulated single-conversation load. The time from inbound POST receipt to Messenger Send API call shall be ≤ 10 seconds in 95% of test runs.
- If the AI provider response time exceeds 8 seconds, the system shall send a `typing_on` indicator to the student to prevent the appearance of a stalled conversation.

---

#### NFR-2 Availability

**Requirement:** The Enrollify AI backend shall maintain an uptime of at least 99% per calendar month, excluding planned maintenance windows communicated at least 24 hours in advance.

**Category:** Reliability

**Rationale:** Facebook Messenger users may contact the page at any hour; prolonged outages result in missed leads.

**Priority:** Must

**Acceptance criteria:**
- Measured over any rolling 30-day period, the backend shall be reachable (returning HTTP 200 on a health endpoint) for at least 99% of minutes in that period.
- Any unplanned downtime event shall be logged with start time, end time, and root cause.

---

#### NFR-3 Webhook endpoint rate limiting

**Requirement:** The `/webhook` POST endpoint shall enforce rate limiting of no more than 500 requests per minute from any single source IP address, returning HTTP 429 to requests that exceed this limit.

**Category:** Security

**Rationale:** Rate limiting protects the backend from abuse, denial-of-service attempts, and runaway webhook replay loops.

**Priority:** Must

**Acceptance criteria:**
- Given a source IP sends more than 500 POST requests to `/webhook` within a 60-second window, when the 501st request is received, then the system shall return HTTP 429 and not process the payload.
- Given a source IP rate is below 500 requests per minute, when a request arrives, then normal processing shall proceed without delay.

---

#### NFR-4 Authentication — admin panel

**Requirement:** The admin panel shall require all users to authenticate using JWT-based authentication before accessing any route; unauthenticated requests to any admin route shall be redirected to the login page.

**Category:** Security

**Rationale:** The admin panel contains personally identifiable information (PII) about prospective students; unrestricted access is not acceptable.

**Priority:** Must

**Acceptance criteria:**
- Given an unauthenticated user navigates to any admin panel route, when the route loads, then the system shall redirect the user to the login page and not render any student or conversation data.
- Given an authenticated user with a valid JWT accesses an admin route, when the JWT is validated, then the route shall render normally.
- Given a JWT has expired, when the user attempts to access any admin route, then the system shall invalidate the session and redirect to the login page.

---

#### NFR-5 Row-Level Security (RLS)

**Requirement:** All Supabase tables (`students`, `conversations`, `messages`, `lead_scores`, `institutions`, `courses`, `knowledge_articles`, `appointments`) shall have RLS policies enabled and configured such that no table row is accessible to an unauthenticated Supabase client.

**Category:** Security

**Rationale:** RLS is the last line of defence at the database layer; without it, a misconfigured API key could expose all student PII.

**Priority:** Must

**Acceptance criteria:**
- Given RLS is enabled on all tables, when an unauthenticated Supabase client attempts to select any row from any listed table, then the query shall return an empty result set and no error that leaks data.
- Given an authenticated service-role client is used from the backend, when it queries any listed table, then it shall return data as expected.

---

#### NFR-6 Personal data handling

**Requirement:** The system shall store all personally identifiable student data (name, email, phone, country, citizenship) exclusively in the Supabase database hosted in a region acceptable to New Zealand data-handling obligations, and shall not log PII values to application logs.

**Category:** Privacy

**Rationale:** Student data includes PII governed by the New Zealand Privacy Act 2020; logging PII to plaintext logs creates unnecessary exposure.

**Priority:** Must

**Acceptance criteria:**
- Given the system processes a student message containing name and email, when application logs are inspected, then they shall not contain the raw name or email values; they shall contain only anonymised identifiers (e.g., student UUID, conversation ID).
- Given student data is written to Supabase, when the Supabase project region is inspected, then it shall be confirmed as a region consistent with NZ Privacy Act data-residency guidance.

---

#### NFR-7 Error handling and logging

**Requirement:** The backend shall catch all unhandled errors at a central error-handling middleware, log them with a structured format including request ID, timestamp, error type, and stack trace, and return a generic error response (HTTP 500 with no internal detail) to the caller.

**Category:** Reliability

**Rationale:** Unhandled errors that surface internal stack traces to callers are a security and reliability risk; centralised logging enables diagnosis without exposing internals.

**Priority:** Must

**Acceptance criteria:**
- Given any unhandled exception is thrown within a request handler, when the error middleware intercepts it, then the HTTP response shall contain only a generic message and HTTP 500 status, and the internal stack trace shall appear in the structured application log and not in the HTTP response body.

---

#### NFR-8 TypeScript and code quality

**Requirement:** All backend source files shall be written in TypeScript with strict mode enabled; all service classes shall use dependency injection; all data-access logic shall be encapsulated in repository classes; no raw SQL shall appear outside repository files.

**Category:** Maintainability

**Rationale:** Type safety, dependency injection, and the repository pattern make the codebase predictable, testable, and safe to extend for future channels and features.

**Priority:** Must

**Acceptance criteria:**
- Given the TypeScript compiler runs with `strict: true`, when the build completes, then it shall produce zero type errors.
- Given any service class is inspected, when its constructor is examined, then it shall receive all dependencies as constructor parameters and shall not import concrete implementations directly.

---

#### NFR-9 Environment variable configuration

**Requirement:** All secrets and environment-specific configuration values (API keys, connection strings, tokens) shall be loaded exclusively from environment variables via a validated configuration module; no secret value shall appear hardcoded in source code.

**Category:** Security

**Rationale:** Hardcoded secrets in source code are a critical security risk, especially in a GitHub-hosted repository.

**Priority:** Must

**Acceptance criteria:**
- Given the repository is scanned for hardcoded credential patterns, when the scan completes, then no source file shall contain a string matching the pattern of a Supabase anon key, service role key, Meta App Secret, or Claude API key.
- Given a required environment variable is absent at startup, when the configuration module validates the environment, then the process shall terminate with a clear error message naming the missing variable before handling any requests.

---

## 6. UX, content, and design notes

| Topic | Requirement or guidance | Owner | Status |
|---|---|---|---|
| Admin panel navigation | Single-page application with sidebar navigation. Sections: Dashboard (analytics), Students (list + search), Conversations (linked from student), Pipeline (lead board), Settings. | Developer | TBD |
| Admin panel visual style | Polished, clean internal tool aesthetic; Tailwind v4 styling consistent with Enrollify brand colours. Admin-only — no need for public-facing polish, but must be professional and intuitive. | Developer | TBD |
| Student conversation view | Messages displayed in a chat-bubble layout, with student messages on the left and AI messages on the right. Timestamps shown on hover. | Developer | TBD |
| Empty states | Student list with no data: "No leads yet — conversations will appear here once students message on Facebook." Pipeline with no data: same message. Never show a blank screen. | Developer | TBD |
| Error states | API errors in the admin panel should show an inline error banner with a retry button, not a full-page crash. | Developer | TBD |
| Accessibility | Admin panel must be keyboard-navigable; all interactive elements shall have visible focus states; all data tables shall use semantic `<table>` elements with `<th>` headers. | Developer | TBD |
| AI persona tone | Warm, professional, helpful. Never robotic. Never mentions "AI" or "prompts" unless the student asks. Always calls itself "Enrollify AI" if asked. | Business owner | Agreed |
| Knowledge base content | Business owner to supply PDFs, Word docs, FAQs, institution info, course info, visa info, and scholarships before Phase 3 build begins. | Business owner | Not started |

---

## 7. Data, integrations, and materials

### 7.1 Data requirements

| Item | Source | Used for | Sensitivity / classification | Notes |
|---|---|---|---|---|
| Student PII (name, email, phone, citizenship, country) | Facebook Messenger conversation / AI-extracted | Lead record; admin panel display; CSV export | High — personal data under NZ Privacy Act 2020 | Must not be logged to application logs |
| Conversation messages | Facebook Messenger inbound; AI-generated outbound | Admin review; AI context; analytics | Medium — contains conversational PII | Retained indefinitely (no retention policy set; add to Open Questions) |
| Lead scores | Computed by LeadScoringService | Admin pipeline; outreach prioritisation | Low | Recalculated on each qualification update |
| Knowledge articles | Business owner uploads (PDFs, Word docs, FAQs) | AI prompt context via RAG | Low | Source documents to be provided before Phase 3 |
| Facebook PSID (sender ID) | Meta Messenger webhook | Student identity linkage across conversations | Medium — channel identifier | Not a real-world identity; links to student record |
| JWT tokens | Issued by backend auth service | Admin panel session authentication | High — grants access to all student data | Short-lived; expiry policy TBD (OQ-3) |

### 7.2 Integrations

| System / service | Purpose | Dependency type | Owner | Risks / notes |
|---|---|---|---|---|
| Meta Messenger API (webhooks + Send API) | Receive student messages; send AI replies; typing indicators; read receipts | Technical + Vendor | Meta | Webhook URL must be publicly reachable; Meta app review may introduce delay |
| Claude API (Anthropic) | AI conversation generation | Technical + Vendor | Anthropic | API rate limits and availability; cost per token at scale |
| Supabase (PostgreSQL + Auth + Storage) | Application database; RLS; file storage for knowledge base | Technical + Vendor | Supabase | Service availability; data-residency region selection required |
| Vercel (admin frontend hosting) | Host admin panel Next.js frontend | Technical + Vendor | Vercel | Must be separate deployment from Netlify website |
| Railway or Render (backend hosting) | Host Node/Express backend | Technical + Vendor | TBD | Must expose a public HTTPS URL for Meta webhook verification |
| Netlify (existing website hosting) | Existing website delivery | Technical (preserve) | Enrollify | No changes permitted to existing Netlify configuration |

---

## 8. Risks, dependencies, and open questions

### 8.1 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Meta app review process delays launch | Medium | High | Begin Meta developer app configuration and webhook verification early in Phase 1; do not defer until Phase 4 |
| Lead-scoring weights not agreed before build | Medium | Medium | Set provisional equal weights (10/70 each factor) as a default; flag for business owner review before launch |
| Claude API costs exceed budget at scale | Low | Medium | Monitor token usage from day 1; set hard spending alerts in Anthropic console; design prompt to be concise |
| Knowledge base content not supplied before Phase 3 | Medium | Medium | System must function without knowledge content (graceful degradation); knowledge base can be populated post-launch |
| RLS misconfiguration exposes student PII | Low | High | Phase 1 security review; Phase 5 explicit RLS validation test; use Supabase RLS policy testing tools |
| Existing Netlify website broken by backend changes | Low | High | Backend is a separate deployment; no changes to netlify.toml or website source during this project |

### 8.2 Dependencies

| Dependency | Type | Owner | Status | Notes |
|---|---|---|---|---|
| Meta Facebook Page and developer app with Messenger permissions | Vendor / Operational | Business owner | Not started | Required for webhook verification in Phase 1 |
| Supabase project provisioning | Technical | Developer | Not started | Must be set up before Phase 2 schema work |
| Claude API key | Vendor | Business owner | Not started | Must be available before Phase 3 AI integration |
| Railway or Render account and deployment target | Technical | Developer | Not started | Required for Phase 4 backend hosting |
| Qualification logic and lead-scoring factor weights | Operational | Business owner | Not started | See OQ-1 |
| Knowledge base source documents | Operational | Business owner | Not started | Required before Phase 3 completion |

### 8.3 Open questions

| Question | Owner | Due date | Resolution |
|---|---|---|---|
| OQ-1: What are the lead-scoring factor weights and the score thresholds for Hot/Warm/Cold bands? | Business owner | Before Phase 2 | Unresolved |
| OQ-2: Which qualification fields are most critical to collect? Is there a minimum set required before a student is considered a "lead"? | Business owner | Before Phase 2 | Unresolved |
| OQ-3: What should the JWT session expiry time be for admin panel sessions? | Business owner | Before Phase 3 | Unresolved |
| OQ-4: What is the data retention policy for conversation messages? Should messages older than X months be archived or deleted? | Business owner | Before launch | Unresolved |
| OQ-5: Should the admin panel support multiple staff accounts, or only a single admin login in release 1? | Business owner | Before Phase 3 | Unresolved |
| OQ-6: Which Supabase region should be used to satisfy NZ Privacy Act data-residency guidance? | Developer + Business owner | Before Phase 2 | Unresolved |

---

## 9. Implementation Roadmap

### 9.1 Phase 1 – Discovery and setup

**Goal:** Understand the current environment, establish the project foundation, and identify constraints before writing any feature code.

- **Inspect existing tech stack:**
  - Review the existing Enrollify GitHub repository (https://github.com/KiwiBAPL/Enrollify) and identify current React 19 + Vite + Tailwind v4 + TypeScript structure.
  - Identify all existing routes, components, and shared utilities that must be preserved.
  - Confirm Netlify deployment configuration and any environment variables already in use.

- **Inspect backend / database integration:**
  - Confirm no existing Supabase project is in use on the current codebase; if one exists, document its schema.
  - Review whether any existing API routes conflict with the planned `/webhook` endpoint.
  - Identify the target Supabase region for data-residency compliance (OQ-6).

- **Establish project structure:**
  - Create a dedicated feature branch from main: `feature/enrollify-ai-backend`.
  - Confirm the monorepo or multi-repo structure for frontend (Vercel) and backend (Railway/Render).
  - Provision the Supabase project, set the region, and confirm service-role and anon key availability.
  - Set up the Node.js + Express + TypeScript backend scaffold with environment variable validation (zod schema).

- **Confirm implementation boundaries:**
  - Reconcile this PRD scope against the current codebase; record any conflicts as updates to Assumptions or Open Questions.
  - Confirm that no existing Netlify or website configuration will be altered.

- **Initial security and safety review (mandatory):**
  - Audit planned admin panel routes: confirm all admin routes require JWT authentication before any data is returned.
  - Confirm RLS policy design for all eight Supabase tables: no unauthenticated row access; service-role access from backend only.
  - Review Meta App Secret handling: confirm it is stored only in environment variables and is never committed to source control.
  - Review Claude API key handling: same constraint.
  - Identify data-exposure risks at the webhook endpoint: confirm signature validation runs before any payload parsing or database access.
  - Review CORS policy: confirm that the `/webhook` endpoint does not expose unnecessary origins.
  - Document all security constraints identified as a checklist that will be verified in Phase 5.

---

### 9.2 Phase 2 – Schema and backend foundation

**Goal:** Establish the Supabase schema, RLS policies, and backend service scaffold.

- Task 2.1: Create Supabase tables: `students`, `conversations`, `messages`, `institutions`, `courses`, `knowledge_articles`, `lead_scores`, `appointments` with all required fields, foreign key relationships, and indexes.
- Task 2.2: Enable RLS on all tables; write and test policies for unauthenticated (deny all), authenticated admin (read-write on student data tables), and service-role (full access from backend).
- Task 2.3: Create Supabase migrations for all table definitions so schema changes are version-controlled.
- Task 2.4: Build TypeScript repository classes: `StudentRepository`, `ConversationRepository`, `MessageRepository`, `LeadScoreRepository`, `KnowledgeRepository`.
- Task 2.5: Build the backend configuration module with zod validation for all required environment variables (`FB_PAGE_ACCESS_TOKEN`, `FB_VERIFY_TOKEN`, `FB_APP_SECRET`, `CLAUDE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`).
- Task 2.6: Implement the central error-handling middleware and structured logger (pino or winston).
- Task 2.7: Implement the health-check endpoint (`GET /health` → HTTP 200) for uptime monitoring.

---

### 9.3 Phase 3 – Core services and admin panel

**Goal:** Build the ConversationService, AIService, LeadScoringService, KnowledgeService, and the admin panel frontend.

- Task 3.1: Implement the `ChannelAdapter` interface defining `sendMessage`, `sendTypingOn`, `sendTypingOff`, and `markSeen` methods.
- Task 3.2: Implement `MessengerChannelAdapter` with Facebook Messenger Send API calls for all four methods.
- Task 3.3: Implement `ConversationService.handleIncomingMessage` with student/conversation creation, message persistence, AI call, and reply dispatch.
- Task 3.4: Implement `AIService` with Claude API integration, system prompt injection, conversation history assembly, and knowledge context injection.
- Task 3.5: Implement `KnowledgeService` with RAG retrieval from `knowledge_articles` (initial version: keyword/full-text search; upgrade to vector search in a future release).
- Task 3.6: Implement `LeadScoringService` with factor scoring and overall score computation. *(Pending OQ-1 resolution for weights.)*
- Task 3.7: Build the admin panel Next.js frontend: student list with search and pagination, conversation view, pipeline view (Hot/Warm/Cold), enrolment status control, CSV export, and analytics page.
- Task 3.8: Implement JWT authentication for the admin panel: login page, token issuance endpoint, and route guards on all admin routes.

---

### 9.4 Phase 4 – Messenger integration and deployment

**Goal:** Wire the Facebook Messenger webhook, complete backend deployment, and validate end-to-end message flow.

- Task 4.1: Implement the GET `/webhook` verification endpoint with `FB_VERIFY_TOKEN` matching and `hub.challenge` echo.
- Task 4.2: Implement the POST `/webhook` endpoint with HMAC-SHA256 signature validation, payload parsing, and routing to `ConversationService`.
- Task 4.3: Implement typing indicator and read-receipt dispatch in the message handling flow.
- Task 4.4: Deploy the backend to Railway or Render; confirm it is reachable over public HTTPS.
- Task 4.5: Register the backend webhook URL in the Meta Developer app; complete webhook verification; subscribe to the `messages` event.
- Task 4.6: Configure the Meta app with the Enrollify Facebook Page and obtain Page Access Token; store in backend environment variables.
- Task 4.7: Deploy the admin panel frontend to Vercel; confirm all admin routes are protected behind JWT auth.

---

### 9.5 Phase 5 – Testing and verification

**Goal:** Validate all functional requirements, run regression checks on the existing website, and perform mandatory security and RLS validation.

- Functional tests: test each acceptance criterion defined in Section 5.1 (FR-1 through FR-17) with documented pass/fail outcomes.
- End-to-end Messenger test: send a test message from a personal Facebook account to the Enrollify Page; verify reply is received, student record and conversation are created in Supabase, lead score is calculated, and the conversation appears in the admin panel.
- Regression check: confirm the existing Enrollify website (enrollifyedu.com) continues to function normally with no broken pages, forms, or Netlify integrations.
- **Security and RLS validation (mandatory — do not skip):**
  - Test all eight Supabase tables with an unauthenticated Supabase client; confirm empty result sets are returned for all queries.
  - Attempt to call all admin panel API routes without a valid JWT; confirm HTTP 401 or redirect is returned.
  - Send a POST to `/webhook` with a forged `X-Hub-Signature-256`; confirm HTTP 403 is returned and no processing occurs.
  - Review application logs for any instance of PII (email, phone, name) appearing in plain text; confirm none are present.
  - Confirm all environment variable secrets are absent from the source code repository using a secret-scanning tool.
  - Verify rate limiting on the `/webhook` endpoint by simulating 600 requests per minute; confirm HTTP 429 after 500.
- Performance test: simulate single-conversation load and measure end-to-end reply latency; confirm ≤ 10 seconds for 95% of requests.
- Admin panel accessibility check: keyboard-navigate all admin routes; confirm all interactive elements are reachable and have visible focus states.

---

### 9.6 Phase 6 – Deployment and rollout

**Goal:** Release to production and establish operational monitoring.

- Confirm all environment variables are set correctly in the production backend deployment (Railway/Render) and admin frontend (Vercel).
- Run a final smoke test in production: send one message via the Enrollify Facebook Page; confirm full flow from message to admin panel display.
- Set up uptime monitoring on the backend health endpoint (`/health`); configure alerts for downtime > 2 minutes.
- Set up Claude API spend alerts in the Anthropic console.
- Configure application log aggregation (e.g., Railway/Render native logging or a logging service).
- Communicate the launch to admissions staff; provide a brief walkthrough of the admin panel.
- **Rollback plan:** If a critical issue is found within 48 hours of launch, the Meta webhook registration shall be unregistered (removing the Messenger integration) while the backend and admin panel remain running, so conversations revert to manual handling without data loss. The webhook can be re-registered once the issue is resolved.
- Post-launch: establish baseline metrics for the success measures in Section 1.5 after the first 30 days of operation.

---

## 10. Quality check

### Passed

- Problem is clearly stated with specific stakeholders, root cause, and impact.
- Desired outcomes are concrete and traceable to the scope.
- Scope boundaries are explicit; out-of-scope items are listed with release labels.
- Assumptions are numbered and listed; key unknowns are identified as Open Questions.
- All 17 functional requirements are written as single-purpose declarative statements with explicit acceptance criteria (FR-9 partial — pending OQ-1 resolution).
- All 9 non-functional requirements have category, rationale, priority, and acceptance criteria.
- Implementation Roadmap exists, starts with Phase 1 – Discovery and setup, and includes explicit initial security review in Phase 1 and mandatory security/RLS validation in Phase 5.
- Rollback plan is present in Phase 6.

### Issues

- FR-9 lead scoring acceptance criteria are incomplete pending OQ-1 (factor weights and score thresholds from business owner).
- OQ-3 (JWT session expiry), OQ-4 (data retention policy), OQ-5 (single vs multi-user admin), and OQ-6 (Supabase region) are unresolved and must be agreed before Phases 2–3 begin.
- Success measure targets (Section 1.5) are all TBD; baselines cannot be set until release 1 is live.
- Knowledge base source documents not yet supplied (OQ-2); RAG content will not be available at Phase 3 unless resolved.

### Actions

- Business owner to provide lead-scoring factor weights and Hot/Warm/Cold score thresholds before Phase 2 begins (resolves OQ-1 and completes FR-9 AC).
- Business owner to confirm minimum qualification fields for lead capture before Phase 2 begins (resolves OQ-2).
- Business owner to confirm JWT session expiry, data retention policy, and admin user count before Phase 3 begins (resolves OQ-3, OQ-4, OQ-5).
- Developer to confirm Supabase region selection with business owner before Phase 2 Supabase provisioning (resolves OQ-6).

---

## 11. Approvals

| Name | Role | Decision | Date |
|---|---|---|---|
| | Business owner | Approve / Approve with changes / Reject | |
| | Developer / technical lead | Approve / Approve with changes / Reject | |

---

## Appendix A – Suggested future developments

- Website chat widget launch using the shared Enrollify AI backend
- Instagram integration
- WhatsApp integration
- HubSpot CRM integration (sync students and lead scores to HubSpot contacts/deals)
- Appointment booking workflow
- Advanced analytics and reporting
- Vector-based semantic search for the knowledge base (upgrade from full-text)
- Multi-staff admin accounts with role-based access control
- Additional channel and automation opportunities
