import { describe, expect, it } from 'vitest'
import {
  buildOrganizationJsonLd,
  HOME_CANONICAL_URL,
  HOME_META_DESCRIPTION,
  HOME_PAGE_TITLE,
  ORGANIZATION_KNOWS_ABOUT,
  ORGANIZATION_NAME,
} from '@/lib/home-seo'
import { FEED_SITE_URL } from '@/lib/feeds'

describe('home-seo', () => {
  it('exports expected page title and description', () => {
    expect(HOME_PAGE_TITLE).toBe(
      'Study in New Zealand | Find Your Course, Career & Visa Guide | Enrollify',
    )
    expect(HOME_META_DESCRIPTION).toContain('international students')
    expect(HOME_META_DESCRIPTION).toContain('free consultation')
  })

  it('uses www in production feed URL and canonical', () => {
    expect(FEED_SITE_URL).toBe('https://www.enrollifyedu.com')
    expect(HOME_CANONICAL_URL).toBe('https://www.enrollifyedu.com/')
  })

  it('builds Organization JSON-LD with knowsAbout topics', () => {
    const jsonLd = buildOrganizationJsonLd()

    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('Organization')
    expect(jsonLd.name).toBe(ORGANIZATION_NAME)
    expect(jsonLd.areaServed).toBe('NZ')
    expect(jsonLd.url).toBe('https://www.enrollifyedu.com')
    expect(jsonLd.knowsAbout).toEqual([...ORGANIZATION_KNOWS_ABOUT])
    expect(jsonLd.knowsAbout).toContain('Study in New Zealand')
  })
})
