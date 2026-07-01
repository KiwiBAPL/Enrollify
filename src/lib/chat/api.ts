export interface ChatMessageResponse {
  reply: string
  consultationInvite: string | null
  studentId: string
  conversationId: string
}

export class ChatApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ChatApiError'
  }
}

export async function sendChatMessage(
  sessionId: string,
  text: string,
  options?: { leadBotCompleted?: boolean },
): Promise<ChatMessageResponse> {
  const response = await fetch('/api/chat/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      text,
      leadBotCompleted: options?.leadBotCompleted ?? false,
    }),
  })

  const body = (await response.json().catch(() => ({}))) as { error?: string; reply?: string }

  if (!response.ok) {
    throw new ChatApiError(body.error ?? 'Something went wrong. Please try again.', response.status)
  }

  return body as ChatMessageResponse
}
