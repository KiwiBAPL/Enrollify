const SESSION_KEY = 'enrollify_chat_session'

export function getOrCreateSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const id = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, id)
  return id
}
