function resolveSiteUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://enrollifyedu.com'
  }
  return import.meta.env.PROD ? 'https://enrollifyedu.com' : 'http://localhost:5180'
}

export const SITE_URL = resolveSiteUrl()

export const SITE_NAME = 'EnRollifyEdu'
export const DEFAULT_AUTHOR_NAME = 'EnRollify'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`

export function toAbsoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith('http') ? pathOrUrl : `${SITE_URL}${pathOrUrl}`
}
