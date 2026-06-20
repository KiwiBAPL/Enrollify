import {
  ANALYTICS_EVENTS,
  FORM_SUBMIT_ERROR_EVENTS,
  type FormAnalyticsContext,
} from '@/lib/analytics/events'
import { dispatchAnalyticsEvent } from '@/lib/analytics/loadScript'

export { initAnalytics, isAnalyticsReady } from '@/lib/analytics/loadScript'

export function trackPageview(): void {
  dispatchAnalyticsEvent(ANALYTICS_EVENTS.pageview)
}

export function trackProviderContactSubmit(): void {
  dispatchAnalyticsEvent(ANALYTICS_EVENTS.providerContactSubmit)
}

export function trackStudentInterestSubmit(): void {
  dispatchAnalyticsEvent(ANALYTICS_EVENTS.studentInterestSubmit)
}

export function trackFormSubmitError(form: FormAnalyticsContext, reason: FormSubmitErrorReason): void {
  dispatchAnalyticsEvent(FORM_SUBMIT_ERROR_EVENTS[form])
  if (import.meta.env.DEV) {
    console.warn('[form-error]', form, reason)
  }
}

export type FormSubmitErrorReason = 'network' | 'server' | 'unknown'

export function formNameToAnalyticsContext(formName: string): FormAnalyticsContext | null {
  if (formName === 'provider-contact') return 'provider_contact'
  if (formName === 'student-interest') return 'student_interest'
  return null
}
