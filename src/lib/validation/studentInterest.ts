import type { FieldErrors, StudentInterestFields, StudyLevel } from '@/types/forms'
import { isValidEmail } from '@/lib/validation/email'

const VALID_STUDY_LEVELS: StudyLevel[] = ['undergraduate', 'postgraduate', 'pathway', 'other']

function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message
}

export function parseStudentInterestForm(formData: FormData): StudentInterestFields {
  const studyLevel = String(formData.get('studyLevel') ?? '') as StudyLevel

  return {
    fullName: String(formData.get('fullName') ?? ''),
    email: String(formData.get('email') ?? ''),
    countryOfResidence: String(formData.get('countryOfResidence') ?? ''),
    studyLevel: VALID_STUDY_LEVELS.includes(studyLevel) ? studyLevel : 'undergraduate',
    areaOfStudy: String(formData.get('areaOfStudy') ?? '').trim() || undefined,
    consent: formData.get('consent') === 'on' || formData.get('consent') === 'yes',
  }
}

export function validateStudentInterest(
  fields: StudentInterestFields,
): FieldErrors<StudentInterestFields> {
  const errors: FieldErrors<StudentInterestFields> = {}

  const fullName = required(fields.fullName, 'Full name is required.')
  if (fullName) errors.fullName = fullName

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(fields.email)) {
    errors.email = 'Enter a valid email address.'
  }

  const countryOfResidence = required(
    fields.countryOfResidence,
    'Country of residence is required.',
  )
  if (countryOfResidence) errors.countryOfResidence = countryOfResidence

  if (!fields.consent) {
    errors.consent = 'You must agree before submitting.'
  }

  return errors
}
