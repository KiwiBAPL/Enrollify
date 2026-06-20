type AnalyticsEvent = 'pageview' | 'provider_contact_submit' | 'student_interest_submit'

const provider = import.meta.env.VITE_ANALYTICS_PROVIDER
const analyticsId = import.meta.env.VITE_ANALYTICS_ID

function isConfigured(): boolean {
  return Boolean(provider && analyticsId)
}

export function trackPageview(): void {
  if (!isConfigured()) return
  trackEvent('pageview')
}

export function trackProviderContactSubmit(): void {
  if (!isConfigured()) return
  trackEvent('provider_contact_submit')
}

export function trackStudentInterestSubmit(): void {
  if (!isConfigured()) return
  trackEvent('student_interest_submit')
}

function trackEvent(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    console.info('[analytics stub]', event, { provider, analyticsId })
    return
  }

  // Phase 4: wire Plausible or GA4 based on VITE_ANALYTICS_PROVIDER
  switch (provider) {
    case 'plausible':
      // window.plausible?.(event)
      break
    case 'ga4':
      // gtag('event', event)
      break
    default:
      break
  }
}
