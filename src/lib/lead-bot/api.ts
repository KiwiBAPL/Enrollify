import type { LeadBotStepId } from './flow'

export interface LeadBotSessionState {
  sessionId: string
  studentId: string
  conversationId: string
  currentStep: LeadBotStepId | null
  completed: boolean
  firstName: string | null
  prompt: string | null
  inputType: 'text' | 'mcq' | null
  options: string[] | null
}

export interface LeadBotStepResult {
  currentStep: LeadBotStepId | null
  completed: boolean
  assistantMessages: string[]
  nextPrompt: string | null
  inputType: 'text' | 'mcq' | null
  options: string[] | null
  band?: 'hot' | 'warm' | 'nurture' | 'cold'
  overallScore?: number
}

export class LeadBotApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'LeadBotApiError'
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new LeadBotApiError(
      'Unable to reach the server. Make sure the backend is running on port 3001.',
      0,
    )
  }

  const data = (await response.json().catch(() => ({}))) as T & { error?: string }

  if (!response.ok) {
    throw new LeadBotApiError(
      data.error ?? `Request failed (${response.status})`,
      response.status,
    )
  }

  return data
}

export function createLeadBotSession(sessionId: string): Promise<LeadBotSessionState> {
  return postJson<LeadBotSessionState>('/api/lead-bot/sessions', { sessionId })
}

export function submitLeadBotStep(
  sessionId: string,
  stepId: LeadBotStepId,
  value: string,
): Promise<LeadBotStepResult> {
  return postJson<LeadBotStepResult>(`/api/lead-bot/sessions/${sessionId}/steps`, {
    stepId,
    value,
  })
}
