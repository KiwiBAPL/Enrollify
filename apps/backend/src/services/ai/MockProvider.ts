import type { LeadScoreFactors, Student, StudentUpdate } from '../../types/domain.js'
import { buildConsultationInviteFallback } from './consultationInvite.js'
import type { AIGenerateInput, AIGenerateOutput } from './types.js'

const DEFAULT_FACTORS: LeadScoreFactors = {
  ready_to_apply: 3,
  english_ability: 3,
  budget_fit: 3,
  intake_timeframe: 3,
  visa_readiness: 3,
  education_match: 3,
  interest_level: 5,
}

export function generateMock(input: AIGenerateInput): AIGenerateOutput {
  return generateMockFromMessage(input.student, input.userMessage)
}

export function generateMockFromMessage(_student: Student, userMessage: string): AIGenerateOutput {
  const fieldUpdates: StudentUpdate = {}
  const lower = userMessage.toLowerCase()

  const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) fieldUpdates.email = emailMatch[0]

  if (lower.includes('my name is')) {
    const name = userMessage.replace(/my name is/i, '').trim().split(/[.,!]/)[0]?.trim()
    if (name) fieldUpdates.name = name
  }

  if (lower.includes('new zealand') || lower.includes('nz')) {
    fieldUpdates.country = 'New Zealand'
  }

  const reply =
    'Thanks for your question! New Zealand offers great study options across many fields. I can share general guidance here — for personalised next steps, use the consultation link below.'

  return {
    reply,
    consultationInvite: buildConsultationInviteFallback(userMessage),
    fieldUpdates,
    scoreFactors: Object.keys(fieldUpdates).length > 0 ? DEFAULT_FACTORS : null,
  }
}
