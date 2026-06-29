import { describe, expect, it } from 'vitest'
import {
  ACCOMMODATION_TIPS_CANONICAL_URL,
  ACCOMMODATION_TIPS_META_DESCRIPTION,
  ACCOMMODATION_TIPS_PAGE_TITLE,
} from '@/lib/accommodation-tips-seo'
import { FEED_SITE_URL, SITEMAP_STATIC_ROUTES } from '@/lib/feeds'
import { routes } from '@/lib/routes'

describe('accommodation-tips-seo', () => {
  it('exports expected page title and description', () => {
    expect(ACCOMMODATION_TIPS_PAGE_TITLE).toContain('Accommodation Tips')
    expect(ACCOMMODATION_TIPS_META_DESCRIPTION).toContain('accommodation')
    expect(ACCOMMODATION_TIPS_META_DESCRIPTION).toContain('New Zealand')
  })

  it('uses production feed URL and canonical for accommodation tips page', () => {
    expect(FEED_SITE_URL).toBe('https://www.enrollifyedu.com')
    expect(ACCOMMODATION_TIPS_CANONICAL_URL).toBe(`${FEED_SITE_URL}${routes.accommodationTips}`)
  })

  it('includes accommodation tips route in sitemap but not the token view route', () => {
    expect(SITEMAP_STATIC_ROUTES).toContain(routes.accommodationTips)
    expect(SITEMAP_STATIC_ROUTES).not.toContain(routes.accommodationTipsView)
  })
})
