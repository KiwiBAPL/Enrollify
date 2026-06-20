export const ANALYTICS_EVENTS = {
  pageview: 'pageview',
  providerContactSubmit: 'provider_contact_submit',
  studentInterestSubmit: 'student_interest_submit',
  providerContactSubmitError: 'provider_contact_submit_error',
  studentInterestSubmitError: 'student_interest_submit_error',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

export type AnalyticsProvider = 'plausible' | 'ga4'

export type FormAnalyticsContext = 'provider_contact' | 'student_interest'

export const FORM_SUBMIT_ERROR_EVENTS: Record<FormAnalyticsContext, AnalyticsEvent> = {
  provider_contact: ANALYTICS_EVENTS.providerContactSubmitError,
  student_interest: ANALYTICS_EVENTS.studentInterestSubmitError,
}
