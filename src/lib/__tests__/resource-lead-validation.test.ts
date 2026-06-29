import { describe, expect, it } from 'vitest'
import {
  isValidAccessToken,
  parseResourceLeadForm,
  validateResourceLead,
} from '@/lib/validation/resourceLead'

function formDataFrom(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value)
  }
  return fd
}

describe('resourceLead validation', () => {
  it('parses form fields', () => {
    const fields = parseResourceLeadForm(
      formDataFrom({
        firstName: 'Alex',
        lastName: 'Nguyen',
        email: 'alex@example.com',
        linkedinUrl: 'https://www.linkedin.com/in/alex',
        consent: 'yes',
      }),
    )

    expect(fields).toEqual({
      firstName: 'Alex',
      lastName: 'Nguyen',
      email: 'alex@example.com',
      linkedinUrl: 'https://www.linkedin.com/in/alex',
      consent: true,
    })
  })

  it('requires first name, last name, email, and consent', () => {
    const errors = validateResourceLead({
      firstName: '',
      lastName: '',
      email: '',
      consent: false,
    })

    expect(errors.firstName).toBeDefined()
    expect(errors.lastName).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.consent).toBeDefined()
  })

  it('rejects invalid email', () => {
    const errors = validateResourceLead({
      firstName: 'Alex',
      lastName: 'Nguyen',
      email: 'not-an-email',
      consent: true,
    })

    expect(errors.email).toContain('valid email')
  })

  it('accepts empty optional linkedin', () => {
    const errors = validateResourceLead({
      firstName: 'Alex',
      lastName: 'Nguyen',
      email: 'alex@example.com',
      consent: true,
    })

    expect(errors.linkedinUrl).toBeUndefined()
  })

  it('rejects non-linkedin URLs when linkedin is provided', () => {
    const errors = validateResourceLead({
      firstName: 'Alex',
      lastName: 'Nguyen',
      email: 'alex@example.com',
      linkedinUrl: 'https://example.com/profile',
      consent: true,
    })

    expect(errors.linkedinUrl).toContain('LinkedIn')
  })

  it('accepts valid linkedin URL', () => {
    const errors = validateResourceLead({
      firstName: 'Alex',
      lastName: 'Nguyen',
      email: 'alex@example.com',
      linkedinUrl: 'https://linkedin.com/in/alex',
      consent: true,
    })

    expect(Object.keys(errors)).toHaveLength(0)
  })
})

describe('isValidAccessToken', () => {
  it('accepts valid UUID v4', () => {
    expect(isValidAccessToken('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('rejects invalid tokens', () => {
    expect(isValidAccessToken('')).toBe(false)
    expect(isValidAccessToken('not-a-uuid')).toBe(false)
    expect(isValidAccessToken('550e8400-e29b-41d4-a716')).toBe(false)
  })
})
