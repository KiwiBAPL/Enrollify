import type { FormName } from '@/types/forms'
import { NetlifyFormSubmitError } from '@/lib/forms/submitNetlifyForm'
import {
  formNameToAnalyticsContext,
  trackFormSubmitError,
  type FormSubmitErrorReason,
} from '@/lib/analytics'

export function reportFormSubmitError(formName: FormName, reason: FormSubmitErrorReason): void {
  const context = formNameToAnalyticsContext(formName)
  if (!context) return

  trackFormSubmitError(context, reason)

  if (import.meta.env.PROD) {
    console.error(`[EnRollifyEdu] Form submission failed (${formName}, ${reason})`)
  }
}

export function classifySubmitError(error: unknown): FormSubmitErrorReason {
  if (error instanceof NetlifyFormSubmitError) return 'server'
  if (error instanceof TypeError) return 'network'
  return 'unknown'
}
