# Cursor rule: chat + lead bot (copy to `.cursor/rules/enrollify-chat-lead-bot.mdc`)

This file documents the recommended project rule. Copy its frontmatter + body into `.cursor/rules/enrollify-chat-lead-bot.mdc` if not already present.

```yaml
---
description: Enrollify website chat and consultation lead bot — two-channel lead capture, CTA handoff, and z-index conventions
globs: src/components/chat/**,src/lib/chat/**,src/components/lead-bot/**,src/lib/lead-bot/**,apps/backend/src/routes/chat.ts,apps/backend/src/services/ConversationService.ts,apps/backend/src/services/AIService.ts,apps/backend/src/services/ai/**,apps/backend/src/prompts/system.ts
alwaysApply: false
---
```

## Two channels — do not merge

| Channel | UI | Purpose | Admin label |
|---------|-----|---------|-------------|
| `webchat` | `ChatWidget` (floating FAB) | AI Q&A + consultation CTA | Website |
| `lead_bot` | `LeadBotModal` (portaled overlay) | Scripted 10-step qualification | Consultation |

- **Do not** collect structured lead fields in chat prompts — the Lead Bot owns qualification.
- **Do not** use Perplexity/Claude for lead bot question delivery — scripted flow in `src/lib/lead-bot/flow.ts`.
- Separate `localStorage` session keys: `enrollify_chat_session` vs `enrollify_lead_bot_session`.

## Chat-to-lead-bot CTA

Every AI chat reply **after the student's first message** returns `{ reply, consultationInvite }` from `POST /api/chat/messages`. The static welcome screen does **not** show a CTA — only a friendly invite to ask a question.

- `reply` — answer only (plain text, no URLs/markdown).
- `consultationInvite` — one contextual sentence; rendered by `ChatConsultationCta` with fixed button label **Book a free consultation**.
- Button calls `openLeadBot()` from `LeadBotProvider` and closes the chat panel.
- **Welcome screen:** friendly invite to ask a question only — no CTA until the first AI reply.
- Hide CTA when `isLeadBotCompleted()` — set via `markLeadBotCompleted()` in `LeadBotModal` on form completion.
- Pass `leadBotCompleted: true` in chat API body so backend returns `consultationInvite: null`.
- Fallback invites: `apps/backend/src/services/ai/consultationInvite.ts`.

## Overlay / z-index

- `ChatWidget`: `z-50` (FAB + panel).
- `LeadBotModal`: portal to `document.body`, `z-[60]` — must stack above chat when opened from CTA.
- Same portal rule as `MobileNav` and `ImageLightbox` (avoid `backdrop-filter` parent traps).

## Provider output shape

`AIGenerateOutput` includes `consultationInvite: string | null`:

- Perplexity: required `consultation_invite` in JSON schema.
- Claude: `provide_consultation_invite` tool each turn.
- Mock/dev: `buildConsultationInviteFallback(userMessage)`.

## Analytics

- `chat_consultation_cta_click` — fired when student clicks the in-chat consultation button.
