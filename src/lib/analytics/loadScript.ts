import type { AnalyticsProvider } from '@/lib/analytics/events'

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initialized = false
let analyticsReady = false
const pendingEvents: string[] = []

function getConfig(): { provider: AnalyticsProvider; id: string } | null {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER
  const id = import.meta.env.VITE_ANALYTICS_ID

  if (provider !== 'plausible' && provider !== 'ga4') return null
  if (!id) return null

  return { provider, id }
}

function isDebugMode(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_DEBUG === 'true'
}

function flushPendingEvents(): void {
  analyticsReady = true
  while (pendingEvents.length > 0) {
    const event = pendingEvents.shift()
    if (event) dispatchAnalyticsEventNow(event)
  }
}

function loadPlausible(domain: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector('script[data-plausible="true"]')) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.defer = true
    script.dataset.plausible = 'true'
    script.dataset.domain = domain
    script.src = 'https://plausible.io/js/script.js'
    script.onload = () => resolve()
    script.onerror = () => resolve()
    document.head.appendChild(script)
  })
}

function loadGa4(measurementId: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector('script[data-ga4="true"]')) {
      resolve()
      return
    }

    window.dataLayer = window.dataLayer ?? []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId, { send_page_view: false })

    const loader = document.createElement('script')
    loader.async = true
    loader.dataset.ga4 = 'true'
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    loader.onload = () => resolve()
    loader.onerror = () => resolve()
    document.head.appendChild(loader)
  })
}

export async function initAnalytics(): Promise<void> {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/enrollify-manage')) {
    return
  }

  if (initialized) {
    flushPendingEvents()
    return
  }

  initialized = true

  if (isDebugMode()) {
    analyticsReady = true
    flushPendingEvents()
    return
  }

  const config = getConfig()
  if (!config) {
    analyticsReady = true
    return
  }

  if (config.provider === 'plausible') {
    await loadPlausible(config.id)
  } else {
    await loadGa4(config.id)
  }

  flushPendingEvents()
}

function dispatchPlausible(event: string): void {
  window.plausible?.(event)
}

function dispatchGa4(event: string): void {
  window.gtag?.('event', event, {
    event_category: 'engagement',
    non_personalized_ads: true,
  })
}

function dispatchAnalyticsEventNow(event: string): void {
  const config = getConfig()

  if (isDebugMode() || !config) {
    console.info('[analytics]', event, config ?? { provider: 'none' })
    return
  }

  if (config.provider === 'plausible') {
    dispatchPlausible(event)
    return
  }

  dispatchGa4(event)
}

export function dispatchAnalyticsEvent(event: string): void {
  if (!analyticsReady) {
    pendingEvents.push(event)
    return
  }

  dispatchAnalyticsEventNow(event)
}

export function isAnalyticsReady(): boolean {
  return analyticsReady
}
