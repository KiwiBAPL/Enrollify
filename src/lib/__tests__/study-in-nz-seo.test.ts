import { describe, expect, it } from 'vitest'
import { routes } from '@/lib/routes'
import {
  STUDY_IN_NZ_CANONICAL_URL,
  STUDY_IN_NZ_META_DESCRIPTION,
  STUDY_IN_NZ_PAGE_TITLE,
} from '@/lib/study-in-nz-seo'
import { FEED_SITE_URL } from '@/lib/feeds'

describe('study-in-nz-seo', () => {
  it('exports expected page title and description', () => {
    expect(STUDY_IN_NZ_PAGE_TITLE).toBe(
      'Study in New Zealand — Guide for International Students | Enrollify',
    )
    expect(STUDY_IN_NZ_META_DESCRIPTION).toContain('international students')
    expect(STUDY_IN_NZ_META_DESCRIPTION).toContain('New Zealand')
  })

  it('uses production feed URL and canonical for study in NZ route', () => {
    expect(FEED_SITE_URL).toBe('https://www.enrollifyedu.com')
    expect(STUDY_IN_NZ_CANONICAL_URL).toBe(`${FEED_SITE_URL}${routes.studyInNz}`)
  })
})
