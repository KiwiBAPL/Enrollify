export interface MessengerTextEvent {
  senderPsid: string
  text: string
  timestamp: Date
  messageId: string | null
}

interface WebhookPayload {
  object?: string
  entry?: Array<{
    messaging?: Array<{
      sender?: { id?: string }
      timestamp?: number
      message?: { mid?: string; text?: string }
      delivery?: unknown
      read?: unknown
      postback?: unknown
    }>
  }>
}

export function parseMessengerTextEvents(payload: unknown): MessengerTextEvent[] {
  const body = payload as WebhookPayload
  if (body.object !== 'page' || !Array.isArray(body.entry)) {
    return []
  }

  const events: MessengerTextEvent[] = []

  for (const entry of body.entry) {
    if (!Array.isArray(entry.messaging)) continue

    for (const event of entry.messaging) {
      const text = event.message?.text
      const senderPsid = event.sender?.id

      if (!text || !senderPsid || typeof event.timestamp !== 'number') {
        continue
      }

      events.push({
        senderPsid,
        text,
        timestamp: new Date(event.timestamp),
        messageId: event.message?.mid ?? null,
      })
    }
  }

  return events
}

export function buildMessengerWebhookPayload(
  senderPsid: string,
  text: string,
  messageId?: string,
): Record<string, unknown> {
  const mid = messageId ?? `mid.dev.${Date.now()}`
  return {
    object: 'page',
    entry: [
      {
        id: '0',
        time: Date.now(),
        messaging: [
          {
            sender: { id: senderPsid },
            recipient: { id: 'PAGE_ID' },
            timestamp: Math.floor(Date.now() / 1000),
            message: { mid, text },
          },
        ],
      },
    ],
  }
}
