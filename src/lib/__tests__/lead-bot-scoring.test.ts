import { describe, expect, it } from 'vitest'
import {
  computeLeadBotScore,
  getLeadBotBand,
  mapLeadBotAnswersToFactors,
} from '../../../apps/backend/src/services/LeadBotScoringService'
import type { LeadBotAnswers } from '../../../apps/backend/src/lead-bot/flow'

const perfectLead: LeadBotAnswers = {
  name: 'Alex Kim',
  country: 'South Korea',
  field_of_study: 'IT',
  preferred_intake: 'ASAP',
  funding_source: 'Self-funded',
  funds_available: 'Yes',
  english_test_completed: 'Yes',
  visa_refusal_history: 'No',
  email: 'alex@example.com',
  phone: '+64 21 123 4567',
}

describe('computeLeadBotScore', () => {
  it('scores a maximum lead at 100', () => {
    expect(computeLeadBotScore(perfectLead)).toBe(100)
  })

  it('scores minimum researching lead at 0', () => {
    expect(
      computeLeadBotScore({
        ...perfectLead,
        field_of_study: 'Not sure yet',
        preferred_intake: 'Just researching',
        funding_source: 'Education loan',
        funds_available: 'Not yet',
        english_test_completed: 'No',
        visa_refusal_history: 'Yes',
      }),
    ).toBe(20)
  })

  it('applies intake points', () => {
    expect(computeLeadBotScore({ preferred_intake: 'Within 3 months' })).toBe(15)
    expect(computeLeadBotScore({ preferred_intake: '3–6 months' })).toBe(10)
    expect(computeLeadBotScore({ preferred_intake: '6–12 months' })).toBe(5)
    expect(computeLeadBotScore({ preferred_intake: 'Just researching' })).toBe(0)
  })

  it('applies funding points', () => {
    expect(computeLeadBotScore({ funding_source: 'Parents/Family' })).toBe(15)
    expect(computeLeadBotScore({ funding_source: 'Education loan' })).toBe(10)
  })

  it('applies funds available points', () => {
    expect(computeLeadBotScore({ funds_available: 'Partially' })).toBe(10)
    expect(computeLeadBotScore({ funds_available: 'Not yet' })).toBe(0)
  })

  it('applies english test points', () => {
    expect(computeLeadBotScore({ english_test_completed: 'Yes' })).toBe(15)
    expect(computeLeadBotScore({ english_test_completed: 'No' })).toBe(5)
  })

  it('applies visa refusal points', () => {
    expect(computeLeadBotScore({ visa_refusal_history: 'No' })).toBe(15)
    expect(computeLeadBotScore({ visa_refusal_history: 'Yes' })).toBe(0)
  })

  it('applies course selection points', () => {
    expect(computeLeadBotScore({ field_of_study: 'Business' })).toBe(10)
    expect(computeLeadBotScore({ field_of_study: 'Not sure yet' })).toBe(5)
  })
})

describe('getLeadBotBand', () => {
  it('maps band boundaries from the PRD', () => {
    expect(getLeadBotBand(100)).toBe('hot')
    expect(getLeadBotBand(80)).toBe('hot')
    expect(getLeadBotBand(79)).toBe('warm')
    expect(getLeadBotBand(60)).toBe('warm')
    expect(getLeadBotBand(59)).toBe('nurture')
    expect(getLeadBotBand(40)).toBe('nurture')
    expect(getLeadBotBand(39)).toBe('cold')
    expect(getLeadBotBand(0)).toBe('cold')
  })
})

describe('mapLeadBotAnswersToFactors', () => {
  it('returns seven factor scores for export compatibility', () => {
    const factors = mapLeadBotAnswersToFactors(perfectLead)
    expect(factors.ready_to_apply).toBeGreaterThan(0)
    expect(factors.english_ability).toBeGreaterThan(0)
    expect(factors.budget_fit).toBeGreaterThan(0)
    expect(factors.intake_timeframe).toBeGreaterThan(0)
    expect(factors.visa_readiness).toBeGreaterThan(0)
    expect(factors.education_match).toBeGreaterThan(0)
    expect(factors.interest_level).toBeGreaterThan(0)
  })
})
