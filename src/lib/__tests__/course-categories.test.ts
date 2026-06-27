import { describe, expect, it } from 'vitest'
import {
  courseCategories,
  getCourseCategoryBySlug,
  getCourseCategoryHref,
} from '@/content/course-categories'
import { routes } from '@/lib/routes'

describe('courseCategories', () => {
  it('defines 12 categories with unique slugs', () => {
    expect(courseCategories).toHaveLength(12)

    const slugs = courseCategories.map((category) => category.slug)
    expect(new Set(slugs).size).toBe(12)
  })

  it('includes expected slugs from the homepage spec', () => {
    const slugs = courseCategories.map((category) => category.slug)

    expect(slugs).toEqual([
      'business',
      'construction',
      'healthcare',
      'nursing',
      'engineering',
      'information-technology',
      'hospitality',
      'english-language',
      'trades',
      'early-childhood',
      'agriculture',
      'automotive',
    ])
  })

  it('builds category hrefs under /find-a-course', () => {
    expect(getCourseCategoryHref('nursing')).toBe('/find-a-course/nursing')
    expect(routes.findCourseCategory('information-technology')).toBe(
      '/find-a-course/information-technology',
    )
  })

  it('looks up categories by slug', () => {
    expect(getCourseCategoryBySlug('business')?.label).toBe('Business')
    expect(getCourseCategoryBySlug('unknown')).toBeUndefined()
  })
})
