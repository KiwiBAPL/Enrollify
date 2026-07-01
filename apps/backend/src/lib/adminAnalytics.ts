export interface AdminAnalyticsPayload {
  totalConversations: number | string
  averageFirstResponseTimeSeconds: number | string
  leadCaptureRate: number | string
  conversionRate: number | string
}

export function formatPercentRate(numerator: number, denominator: number): string | null {
  if (denominator <= 0) return null
  return `${Math.round((numerator / denominator) * 100)}%`
}

export function formatCountMetric(count: number): number | string {
  return count > 0 ? count : '—'
}

export function buildAdminAnalytics(input: {
  conversationCount: number
  studentCount: number
  leadsWithEmail: number
  appointedCount: number
}): AdminAnalyticsPayload {
  const leadCaptureRate = formatPercentRate(input.leadsWithEmail, input.studentCount)
  const conversionRate = formatPercentRate(input.appointedCount, input.studentCount)

  return {
    totalConversations: formatCountMetric(input.conversationCount),
    averageFirstResponseTimeSeconds: '—',
    leadCaptureRate: leadCaptureRate ?? '—',
    conversionRate: conversionRate ?? '—',
  }
}
