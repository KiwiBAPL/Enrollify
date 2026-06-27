import { FEED_SITE_URL } from './feeds'

export const HOME_PAGE_TITLE =
  'Study in New Zealand | Find Your Course, Career & Visa Guide | Enrollify'

export const HOME_META_DESCRIPTION =
  'Enrollify helps international students find the right study pathway in New Zealand. Explore courses, career guides, visa requirements, costs and student life. Book a free consultation today.'

export const HOME_OG_TITLE = 'Study in New Zealand — Find Your Study Pathway | Enrollify'

export const HOME_OG_DESCRIPTION =
  "New Zealand's trusted student advisory platform. Explore courses, careers, visas and student life. Book a free consultation with our local experts."

export const HOME_KEYWORDS =
  'study in New Zealand, international students New Zealand, best courses New Zealand, student visa New Zealand, nursing courses New Zealand, business diploma New Zealand, IT courses New Zealand, cost of living New Zealand, study abroad New Zealand, New Zealand qualifications'

export const HOME_CANONICAL_URL = `${FEED_SITE_URL}/`

export const ORGANIZATION_NAME = 'Enrollify'

export const ORGANIZATION_DESCRIPTION =
  'New Zealand student advisory platform helping international students find courses, career pathways, visas and study guidance in New Zealand.'

export const ORGANIZATION_KNOWS_ABOUT = [
  'Study in New Zealand',
  'International student visa New Zealand',
  'Best courses in New Zealand',
  'New Zealand qualifications',
  'Student life New Zealand',
  'Cost of studying in New Zealand',
] as const

export interface OrganizationJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  description: string
  url: string
  areaServed: string
  knowsAbout: readonly string[]
}

export function buildOrganizationJsonLd(): OrganizationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    description: ORGANIZATION_DESCRIPTION,
    url: FEED_SITE_URL,
    areaServed: 'NZ',
    knowsAbout: ORGANIZATION_KNOWS_ABOUT,
  }
}
