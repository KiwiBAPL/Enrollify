import type { FieldErrors, ProviderContactFields } from '@/types/forms'
import { isValidEmail } from '@/lib/validation/email'

function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message
}

export function parseProviderContactForm(formData: FormData): ProviderContactFields {
  return {
    organisationName: String(formData.get('organisationName') ?? ''),
    contactName: String(formData.get('contactName') ?? ''),
    role: String(formData.get('role') ?? ''),
    workEmail: String(formData.get('workEmail') ?? ''),
    phone: String(formData.get('phone') ?? '').trim() || undefined,
    countryRegion: String(formData.get('countryRegion') ?? ''),
    needsDescription: String(formData.get('needsDescription') ?? ''),
    consent: formData.get('consent') === 'on' || formData.get('consent') === 'yes',
  }
}

export function validateProviderContact(
  fields: ProviderContactFields,
): FieldErrors<ProviderContactFields> {
  const errors: FieldErrors<ProviderContactFields> = {}

  const organisationName = required(fields.organisationName, 'Organisation name is required.')
  if (organisationName) errors.organisationName = organisationName

  const contactName = required(fields.contactName, 'Your name is required.')
  if (contactName) errors.contactName = contactName

  const role = required(fields.role, 'Role / title is required.')
  if (role) errors.role = role

  if (!fields.workEmail.trim()) {
    errors.workEmail = 'Work email is required.'
  } else if (!isValidEmail(fields.workEmail)) {
    errors.workEmail = 'Enter a valid email address.'
  }

  const countryRegion = required(fields.countryRegion, 'Country / region is required.')
  if (countryRegion) errors.countryRegion = countryRegion

  const needsDescription = required(fields.needsDescription, 'Please describe your needs.')
  if (needsDescription) errors.needsDescription = needsDescription

  if (!fields.consent) {
    errors.consent = 'You must agree before submitting.'
  }

  return errors
}

export function hasFieldErrors<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
): boolean {
  return Object.keys(errors).length > 0
}
