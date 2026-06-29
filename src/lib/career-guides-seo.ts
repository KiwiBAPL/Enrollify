import { FEED_SITE_URL } from '@/lib/feeds'
import { routes } from '@/lib/routes'
import { careerGuidesContent } from '@/content/career-guides'

export const CAREER_GUIDES_PAGE_TITLE = careerGuidesContent.meta.title

export const CAREER_GUIDES_META_DESCRIPTION = careerGuidesContent.meta.description

export const CAREER_GUIDES_OG_TITLE = 'Career Guides — Study Pathways in New Zealand'

export const CAREER_GUIDES_OG_DESCRIPTION = CAREER_GUIDES_META_DESCRIPTION

export const CAREER_GUIDES_CANONICAL_URL = `${FEED_SITE_URL}${routes.careerGuides}`

export function careerGuideDetailCanonicalUrl(slug: string): string {
  return `${FEED_SITE_URL}${routes.careerGuide(slug)}`
}
