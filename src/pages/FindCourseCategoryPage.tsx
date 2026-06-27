import { Navigate, useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/components/pages/PlaceholderPage'
import { getCourseCategoryBySlug } from '@/content/course-categories'
import { routes } from '@/lib/routes'

export function FindCourseCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const category = categorySlug ? getCourseCategoryBySlug(categorySlug) : undefined

  if (!category) {
    return <Navigate to={routes.findCourse} replace />
  }

  return (
    <PlaceholderPage
      title={`${category.label} Courses in New Zealand`}
      description={`Explore ${category.label.toLowerCase()} courses and qualifications for international students in New Zealand — career outcomes, entry requirements and tuition expectations. Full guide coming soon.`}
    />
  )
}
