import type { LeadScoreFactors, Student, StudentUpdate } from '../../types/domain.js'
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

export function generateMockFromMessage(student: Student, userMessage: string): AIGenerateOutput {
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

  const reply = student.name
    ? `Thanks for your message! I'd love to help you explore study options in New Zealand. What qualification level are you interested in — for example a diploma, bachelor's, or master's?`
    : `Kia ora! Welcome to Enrollify. I'd be happy to help you explore studying in New Zealand. To get started, could you tell me your name?`

  return {
    reply,
    fieldUpdates,
    scoreFactors: Object.keys(fieldUpdates).length > 0 ? DEFAULT_FACTORS : null,
  }
}
