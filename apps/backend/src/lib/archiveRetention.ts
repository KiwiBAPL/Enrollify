export const DEFAULT_ARCHIVE_RETENTION_DAYS = 90

export function archivePurgeCutoff(retentionDays: number, now = new Date()): Date {
  const cutoff = new Date(now)
  cutoff.setUTCDate(cutoff.getUTCDate() - retentionDays)
  return cutoff
}

export function isEligibleForPurge(
  archivedAt: Date | string,
  retentionDays: number,
  now = new Date(),
): boolean {
  const archived = typeof archivedAt === 'string' ? new Date(archivedAt) : archivedAt
  return archived < archivePurgeCutoff(retentionDays, now)
}
