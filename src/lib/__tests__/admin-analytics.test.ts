import { describe, expect, it } from 'vitest'
import {
  buildAdminAnalytics,
  formatCountMetric,
  formatPercentRate,
} from '../../../apps/backend/src/lib/adminAnalytics'

describe('formatPercentRate', () => {
  it('returns rounded percentage when denominator is positive', () => {
    expect(formatPercentRate(4, 10)).toBe('40%')
    expect(formatPercentRate(1, 3)).toBe('33%')
  })

  it('returns null when denominator is zero', () => {
    expect(formatPercentRate(0, 0)).toBeNull()
  })
})

describe('formatCountMetric', () => {
  it('returns the count when positive', () => {
    expect(formatCountMetric(15)).toBe(15)
  })

  it('returns em dash when zero', () => {
    expect(formatCountMetric(0)).toBe('—')
  })
})

describe('buildAdminAnalytics', () => {
  it('builds payload from active lead counts', () => {
    expect(
      buildAdminAnalytics({
        conversationCount: 15,
        studentCount: 15,
        leadsWithEmail: 6,
        appointedCount: 0,
      }),
    ).toEqual({
      totalConversations: 15,
      averageFirstResponseTimeSeconds: '—',
      leadCaptureRate: '40%',
      conversionRate: '0%',
    })
  })

  it('uses em dash when there are no active conversations or students', () => {
    expect(
      buildAdminAnalytics({
        conversationCount: 0,
        studentCount: 0,
        leadsWithEmail: 0,
        appointedCount: 0,
      }),
    ).toEqual({
      totalConversations: '—',
      averageFirstResponseTimeSeconds: '—',
      leadCaptureRate: '—',
      conversionRate: '—',
    })
  })
})
