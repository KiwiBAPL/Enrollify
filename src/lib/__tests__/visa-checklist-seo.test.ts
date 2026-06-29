import { describe, expect, it } from 'vitest'
import {
  VISA_CHECKLIST_CANONICAL_URL,
  VISA_CHECKLIST_META_DESCRIPTION,
  VISA_CHECKLIST_PAGE_TITLE,
} from '@/lib/visa-checklist-seo'
import { FEED_SITE_URL, SITEMAP_STATIC_ROUTES } from '@/lib/feeds'
import { routes } from '@/lib/routes'

describe('visa-checklist-seo', () => {
  it('exports expected page title and description', () => {
    expect(VISA_CHECKLIST_PAGE_TITLE).toContain('Student Visa Checklist')
    expect(VISA_CHECKLIST_META_DESCRIPTION).toContain('visa checklist')
    expect(VISA_CHECKLIST_META_DESCRIPTION).toContain('New Zealand')
  })

  it('uses production feed URL and canonical for checklist page', () => {
    expect(FEED_SITE_URL).toBe('https://www.enrollifyedu.com')
    expect(VISA_CHECKLIST_CANONICAL_URL).toBe(`${FEED_SITE_URL}${routes.visaChecklist}`)
  })

  it('includes checklist route in sitemap but not the token view route', () => {
    expect(SITEMAP_STATIC_ROUTES).toContain(routes.visaChecklist)
    expect(SITEMAP_STATIC_ROUTES).not.toContain(routes.visaChecklistView)
  })
})
