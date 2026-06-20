export type StudyLevel = 'undergraduate' | 'postgraduate' | 'pathway' | 'other'

export type FormName = 'provider-contact' | 'student-interest'

export type ProviderContactFields = {
  organisationName: string
  contactName: string
  role: string
  workEmail: string
  phone?: string
  countryRegion: string
  needsDescription: string
  consent: boolean
}

export type StudentInterestFields = {
  fullName: string
  email: string
  countryOfResidence: string
  studyLevel: StudyLevel
  areaOfStudy?: string
  consent: boolean
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export type FieldErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>
