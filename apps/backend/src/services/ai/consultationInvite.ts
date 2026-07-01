const GENERIC_INVITE =
  "Want tailored advice on your study plans? Book a free consultation and we'll help you take the next step."

const TOPIC_INVITES: Array<{ pattern: RegExp; invite: string }> = [
  {
    pattern: /\bvisa\b/i,
    invite:
      "If you'd like help mapping visa steps to your situation, book a free consultation and we'll walk you through it.",
  },
  {
    pattern: /\b(cost|fee|tuition|budget|afford|living cost|expense)/i,
    invite:
      'To get a realistic picture of costs for your situation, book a free consultation and we can break it down with you.',
  },
  {
    pattern: /\b(course|programme|program|degree|diploma|study|university|college|nzqa)/i,
    invite:
      'If you want help narrowing down courses that fit you, book a free consultation and we can explore options together.',
  },
  {
    pattern: /\b(english|ielts|pte|toefl|language)/i,
    invite:
      'Unsure about English requirements for your pathway? Book a free consultation and we can talk through what you need.',
  },
  {
    pattern: /\b(work|job|part.?time|employment)/i,
    invite:
      'Working while studying can depend on your visa and course — book a free consultation for advice tailored to you.',
  },
  {
    pattern: /\b(accommodation|housing|rent|flat)/i,
    invite:
      'Housing options vary by city and budget — book a free consultation and we can point you in the right direction.',
  },
]

export function sanitizeConsultationInvite(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function buildConsultationInviteFallback(userMessage: string): string {
  for (const { pattern, invite } of TOPIC_INVITES) {
    if (pattern.test(userMessage)) return invite
  }
  return GENERIC_INVITE
}

export function resolveConsultationInvite(
  invite: string | null | undefined,
  userMessage: string,
  suppress: boolean,
): string | null {
  if (suppress) return null
  return sanitizeConsultationInvite(invite) ?? buildConsultationInviteFallback(userMessage)
}
