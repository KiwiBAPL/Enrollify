import { describe, expect, it } from 'vitest'
import {
  FOUNDER_BIO_CANONICAL_URL,
  FOUNDER_BIO_META_DESCRIPTION,
  FOUNDER_BIO_PAGE_TITLE,
} from '@/lib/founder-bio-seo'
import { FEED_SITE_URL, SITEMAP_STATIC_ROUTES } from '@/lib/feeds'
import { routes } from '@/lib/routes'

describe('founder-bio-seo', () => {
  it('exports expected page title and description', () => {
    expect(FOUNDER_BIO_PAGE_TITLE).toContain('Paul Benn')
    expect(FOUNDER_BIO_PAGE_TITLE).toContain('Founder')
    expect(FOUNDER_BIO_META_DESCRIPTION).toContain('Enrollify')
    expect(FOUNDER_BIO_META_DESCRIPTION).toContain('Wellington')
  })

  it('uses production feed URL and canonical for founder bio page', () => {
    expect(FEED_SITE_URL).toBe('https://www.enrollifyedu.com')
    expect(FOUNDER_BIO_CANONICAL_URL).toBe(`${FEED_SITE_URL}${routes.aboutPaulBenn}`)
  })

  it('includes founder bio route in sitemap', () => {
    expect(SITEMAP_STATIC_ROUTES).toContain(routes.aboutPaulBenn)
  })

  it('repoints aboutEnrollify route to founder bio page', () => {
    expect(routes.aboutEnrollify).toBe(routes.aboutPaulBenn)
  })
})
