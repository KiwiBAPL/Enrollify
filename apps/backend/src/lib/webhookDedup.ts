const TTL_MS = 5 * 60 * 1000

interface DedupEntry {
  expiresAt: number
}

export class WebhookDedupCache {
  private readonly seen = new Map<string, DedupEntry>()

  isDuplicate(messageId: string | null): boolean {
    if (!messageId) return false

    this.prune()

    if (this.seen.has(messageId)) {
      return true
    }

    this.seen.set(messageId, { expiresAt: Date.now() + TTL_MS })
    return false
  }

  private prune(): void {
    const now = Date.now()
    for (const [key, entry] of this.seen) {
      if (entry.expiresAt <= now) {
        this.seen.delete(key)
      }
    }
  }
}
