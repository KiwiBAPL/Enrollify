import type { CourseCategory } from '@/types/content'
import { routes } from '@/lib/routes'

export const courseCategories: CourseCategory[] = [
  { label: 'Business', slug: 'business' },
  { label: 'Construction', slug: 'construction' },
  { label: 'Healthcare', slug: 'healthcare' },
  { label: 'Nursing', slug: 'nursing' },
  { label: 'Engineering', slug: 'engineering' },
  { label: 'Information Technology', slug: 'information-technology' },
  { label: 'Hospitality', slug: 'hospitality' },
  { label: 'English Language', slug: 'english-language' },
  { label: 'Trades', slug: 'trades' },
  { label: 'Early Childhood', slug: 'early-childhood' },
  { label: 'Agriculture', slug: 'agriculture' },
  { label: 'Automotive', slug: 'automotive' },
]

export function getCourseCategoryHref(slug: string): string {
  return routes.findCourseCategory(slug)
}

export function getCourseCategoryBySlug(slug: string): CourseCategory | undefined {
  return courseCategories.find((category) => category.slug === slug)
}

export const courseCategoriesSectionContent = {
  heading: 'Popular Courses for international students New Zealand',
  intro:
    'Explore the best courses in New Zealand for international students — from nursing courses New Zealand and business courses New Zealand to IT diploma New Zealand and construction courses New Zealand. Our guides to courses in New Zealand cover career outcomes, entry requirements, tuition expectations and future opportunities.',
}
