import { describe, expect, it } from 'vitest'
import { defaultPhoneDialCodeValue, dialCodeForResidenceCountry } from '@/lib/lead-bot/country-to-dial-code'
import {
  MCQ_ACKNOWLEDGEMENT_TEMPLATES,
  buildStepPrompt,
  firstNameFromName,
  formatPhoneSubmission,
  getCurrentStepId,
  pickMcqAcknowledgement,
  validateStepValue,
} from '@/lib/lead-bot/flow'

describe('lead bot flow', () => {
  it('extracts first name', () => {
    expect(firstNameFromName('Priya Sharma')).toBe('Priya')
    expect(firstNameFromName('Alex')).toBe('Alex')
  })

  it('personalizes prompts after name is known', () => {
    const prompt = buildStepPrompt('country', 'Priya')
    expect(prompt).toContain('Priya')
    expect(prompt).toContain('Which country are you currently living in?')
  })

  it('tracks current step from partial answers', () => {
    expect(getCurrentStepId({ name: 'Alex' })).toBe('country')
    expect(
      getCurrentStepId({
        name: 'Alex',
        country: 'India',
        field_of_study: 'IT',
      }),
    ).toBe('preferred_intake')
  })

  it('validates email and phone', () => {
    expect(validateStepValue('email', 'not-an-email')).toMatch(/valid email/i)
    expect(validateStepValue('email', 'alex@example.com')).toBeNull()
    expect(validateStepValue('phone', '123')).toMatch(/valid phone/i)
    expect(validateStepValue('phone', '+64 211234567')).toBeNull()
    expect(validateStepValue('phone', '+91 9876543210')).toBeNull()
  })

  it('formats phone submission with dial code and local digits', () => {
    expect(formatPhoneSubmission('+64', '21 123 4567')).toBe('+64 211234567')
    expect(formatPhoneSubmission('91', '98765 43210')).toBe('+91 9876543210')
  })

  it('varies MCQ acknowledgements', () => {
    const results = new Set(
      Array.from({ length: 30 }, () => pickMcqAcknowledgement('ASAP')),
    )
    expect(results.size).toBeGreaterThan(1)
    for (const result of results) {
      const matchesTemplate = MCQ_ACKNOWLEDGEMENT_TEMPLATES.some((template) =>
        template.replace('{value}', 'ASAP') === result,
      )
      expect(matchesTemplate).toBe(true)
    }
  })
})

describe('country to dial code', () => {
  it('maps common country names to dial codes', () => {
    expect(dialCodeForResidenceCountry('India')).toBe('+91')
    expect(dialCodeForResidenceCountry('New Zealand')).toBe('+64')
    expect(dialCodeForResidenceCountry('unknown place')).toBe('+64')
  })

  it('builds default select value from residence country', () => {
    expect(defaultPhoneDialCodeValue('India')).toBe('+91|IN')
    expect(defaultPhoneDialCodeValue(null)).toBe('+64|NZ')
  })
})
