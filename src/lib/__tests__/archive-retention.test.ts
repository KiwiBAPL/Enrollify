import { describe, expect, it } from 'vitest'
import {
  DEFAULT_ARCHIVE_RETENTION_DAYS,
  archivePurgeCutoff,
  isEligibleForPurge,
} from '../../../apps/backend/src/lib/archiveRetention'

describe('archive retention', () => {
  const now = new Date('2026-07-01T12:00:00.000Z')

  it('uses 90 days as the default retention window', () => {
    expect(DEFAULT_ARCHIVE_RETENTION_DAYS).toBe(90)
  })

  it('computes purge cutoff from retention days', () => {
    const cutoff = archivePurgeCutoff(90, now)
    expect(cutoff.toISOString()).toBe('2026-04-02T12:00:00.000Z')
  })

  it('marks archives older than retention as eligible for purge', () => {
    expect(isEligibleForPurge('2026-04-01T12:00:00.000Z', 90, now)).toBe(true)
    expect(isEligibleForPurge('2026-04-02T12:00:00.000Z', 90, now)).toBe(false)
    expect(isEligibleForPurge('2026-05-01T12:00:00.000Z', 90, now)).toBe(false)
  })
})
