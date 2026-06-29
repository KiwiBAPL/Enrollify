import type { FieldErrors } from '@/types/forms'
import { isValidEmail } from '@/lib/validation/email'

export type ResourceLeadFields = {
  firstName: string
  lastName: string
  email: string
  linkedinUrl?: string
  consent: boolean
}

const LINKEDIN_PATTERN = /^https?:\/\/(www\.)?linkedin\.com\//i

function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message
}

export function parseResourceLeadForm(formData: FormData): ResourceLeadFields {
  const linkedinRaw = String(formData.get('linkedinUrl') ?? '').trim()

  return {
    firstName: String(formData.get('firstName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    email: String(formData.get('email') ?? ''),
    linkedinUrl: linkedinRaw || undefined,
    consent: formData.get('consent') === 'on' || formData.get('consent') === 'yes',
  }
}

export function validateResourceLead(
  fields: ResourceLeadFields,
): FieldErrors<ResourceLeadFields> {
  const errors: FieldErrors<ResourceLeadFields> = {}

  const firstName = required(fields.firstName, 'First name is required.')
  if (firstName) errors.firstName = firstName
  else if (fields.firstName.trim().length > 100) {
    errors.firstName = 'First name must be 100 characters or fewer.'
  }

  const lastName = required(fields.lastName, 'Last name is required.')
  if (lastName) errors.lastName = lastName
  else if (fields.lastName.trim().length > 100) {
    errors.lastName = 'Last name must be 100 characters or fewer.'
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(fields.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (fields.linkedinUrl) {
    if (!LINKEDIN_PATTERN.test(fields.linkedinUrl.trim())) {
      errors.linkedinUrl = 'Enter a valid LinkedIn profile URL (linkedin.com).'
    } else if (fields.linkedinUrl.trim().length > 500) {
      errors.linkedinUrl = 'LinkedIn URL must be 500 characters or fewer.'
    }
  }

  if (!fields.consent) {
    errors.consent = 'You must agree before submitting.'
  }

  return errors
}

export function isValidAccessToken(token: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    token.trim(),
  )
}
