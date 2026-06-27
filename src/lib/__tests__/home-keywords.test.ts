import { describe, expect, it } from 'vitest'
import { getHomeHeadingCopy, getHomeVisibleCopy } from '@/content/home-copy'
import { HOME_HEADING_KEYWORDS, HOME_VISIBLE_KEYWORDS } from '@/content/home-keywords'

describe('homepage SEO keyword coverage', () => {
  const visibleCopy = getHomeVisibleCopy().toLowerCase()
  const headingCopy = getHomeHeadingCopy().toLowerCase()

  it('includes all required visible keywords at least once', () => {
    const missing = HOME_VISIBLE_KEYWORDS.filter(
      (keyword) => !visibleCopy.includes(keyword.toLowerCase()),
    )

    expect(missing, `Missing homepage keywords: ${missing.join(', ')}`).toEqual([])
  })

  it('places primary keywords in H1 or H2 headings', () => {
    const missing = HOME_HEADING_KEYWORDS.filter(
      (keyword) => !headingCopy.includes(keyword.toLowerCase()),
    )

    expect(missing, `Missing primary keywords in headings: ${missing.join(', ')}`).toEqual([])
  })
})
