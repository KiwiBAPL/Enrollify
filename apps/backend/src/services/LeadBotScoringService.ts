import type { LeadScoreFactors } from '../types/domain.js'
import type { LeadBotAnswers } from '../lead-bot/flow.js'

export type LeadBotBand = 'hot' | 'warm' | 'nurture' | 'cold'

const INTAKE_POINTS: Record<string, number> = {
  ASAP: 20,
  'Within 3 months': 15,
  '3–6 months': 10,
  '6–12 months': 5,
  'Just researching': 0,
}

const FUNDING_POINTS: Record<string, number> = {
  'Self-funded': 20,
  'Parents/Family': 15,
  'Education loan': 10,
}

const FUNDS_POINTS: Record<string, number> = {
  Yes: 20,
  Partially: 10,
  'Not yet': 0,
}

const ENGLISH_TEST_POINTS: Record<string, number> = {
  Yes: 15,
  No: 5,
}

const VISA_REFUSAL_POINTS: Record<string, number> = {
  No: 15,
  Yes: 0,
}

export function computeLeadBotScore(answers: LeadBotAnswers): number {
  let score = 0

  if (answers.preferred_intake) {
    score += INTAKE_POINTS[answers.preferred_intake] ?? 0
  }
  if (answers.funding_source) {
    score += FUNDING_POINTS[answers.funding_source] ?? 0
  }
  if (answers.funds_available) {
    score += FUNDS_POINTS[answers.funds_available] ?? 0
  }
  if (answers.english_test_completed) {
    score += ENGLISH_TEST_POINTS[answers.english_test_completed] ?? 0
  }
  if (answers.visa_refusal_history) {
    score += VISA_REFUSAL_POINTS[answers.visa_refusal_history] ?? 0
  }
  if (answers.field_of_study) {
    score += answers.field_of_study === 'Not sure yet' ? 5 : 10
  }

  return Math.min(100, Math.max(0, score))
}

export function getLeadBotBand(overallScore: number): LeadBotBand {
  if (overallScore >= 80) return 'hot'
  if (overallScore >= 60) return 'warm'
  if (overallScore >= 40) return 'nurture'
  return 'cold'
}

export function mapLeadBotAnswersToFactors(answers: LeadBotAnswers): LeadScoreFactors {
  const intake = answers.preferred_intake
  const intakeScore = intake ? Math.round(((INTAKE_POINTS[intake] ?? 0) / 20) * 10) : 0

  const funding = answers.funding_source
  const budgetScore = funding ? Math.round(((FUNDING_POINTS[funding] ?? 0) / 20) * 10) : 0

  const funds = answers.funds_available
  const visaReadiness = funds ? Math.round(((FUNDS_POINTS[funds] ?? 0) / 20) * 10) : 0

  const english = answers.english_test_completed
  const englishScore = english ? Math.round(((ENGLISH_TEST_POINTS[english] ?? 0) / 15) * 10) : 0

  const visaHistory = answers.visa_refusal_history
  const readyScore = visaHistory ? Math.round(((VISA_REFUSAL_POINTS[visaHistory] ?? 0) / 15) * 10) : 0

  const course = answers.field_of_study
  const educationScore = course ? (course === 'Not sure yet' ? 5 : 10) : 0

  const researching = answers.preferred_intake === 'Just researching'
  const interestScore = researching ? 3 : 8

  return {
    ready_to_apply: readyScore,
    english_ability: englishScore,
    budget_fit: budgetScore,
    intake_timeframe: intakeScore,
    visa_readiness: visaReadiness,
    education_match: educationScore,
    interest_level: interestScore,
  }
}
