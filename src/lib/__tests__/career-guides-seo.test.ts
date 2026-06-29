import { describe, expect, it } from 'vitest'
import { CAREER_GUIDE_SLUGS } from '@/content/career-guides'
import {
  CAREER_GUIDES_CANONICAL_URL,
  CAREER_GUIDES_META_DESCRIPTION,
  CAREER_GUIDES_PAGE_TITLE,
  careerGuideDetailCanonicalUrl,
} from '@/lib/career-guides-seo'
import { FEED_SITE_URL, SITEMAP_STATIC_ROUTES } from '@/lib/feeds'
import { routes } from '@/lib/routes'

describe('career-guides-seo', () => {
  it('exports expected hub page title and description', () => {
    expect(CAREER_GUIDES_PAGE_TITLE).toContain('Career Guides')
    expect(CAREER_GUIDES_META_DESCRIPTION).toContain('international students')
    expect(CAREER_GUIDES_META_DESCRIPTION).toContain('New Zealand')
  })

  it('uses production feed URL and canonical for career guides hub', () => {
    expect(FEED_SITE_URL).toBe('https://www.enrollifyedu.com')
    expect(CAREER_GUIDES_CANONICAL_URL).toBe(`${FEED_SITE_URL}${routes.careerGuides}`)
  })

  it('builds detail canonical URLs from slugs', () => {
    expect(careerGuideDetailCanonicalUrl('choose-right-course')).toBe(
      `${FEED_SITE_URL}/career-guides/choose-right-course`,
    )
  })

  it('includes hub and all guide slugs in sitemap static routes', () => {
    expect(CAREER_GUIDE_SLUGS).toHaveLength(10)
    expect(SITEMAP_STATIC_ROUTES).toContain('/career-guides')
    for (const slug of CAREER_GUIDE_SLUGS) {
      expect(SITEMAP_STATIC_ROUTES).toContain(routes.careerGuide(slug))
    }
  })
})
