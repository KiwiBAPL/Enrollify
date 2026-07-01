const SESSION_KEY = 'enrollify_lead_bot_session'
const COMPLETED_KEY = 'enrollify_lead_bot_completed'
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function createSessionId(): string {
  return crypto.randomUUID()
}

export function getOrCreateLeadBotSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing && UUID_V4.test(existing)) return existing
    const id = createSessionId()
    localStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return createSessionId()
  }
}

export function resetLeadBotSessionId(): string {
  const id = createSessionId()
  try {
    localStorage.setItem(SESSION_KEY, id)
    localStorage.removeItem(COMPLETED_KEY)
  } catch {
    // ignore storage errors
  }
  return id
}

export function markLeadBotCompleted(): void {
  try {
    localStorage.setItem(COMPLETED_KEY, '1')
  } catch {
    // ignore storage errors
  }
}

export function isLeadBotCompleted(): boolean {
  try {
    return localStorage.getItem(COMPLETED_KEY) === '1'
  } catch {
    return false
  }
}
