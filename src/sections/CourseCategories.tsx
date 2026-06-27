import { Link } from 'react-router-dom'
import { courseCategories, courseCategoriesSectionContent } from '@/content/course-categories'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { routes } from '@/lib/routes'

export function CourseCategories() {
  return (
    <Section id="courses" variant="secondary">
      <SectionHeader
        title={courseCategoriesSectionContent.heading}
        intro={courseCategoriesSectionContent.intro}
      />

      <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courseCategories.map((category) => (
          <li key={category.slug}>
            <Link
              to={routes.findCourseCategory(category.slug)}
              className="block rounded-card border-2 border-accent-primary bg-background-primary px-4 py-3 text-center text-sm font-semibold text-text-secondary shadow-hard-accent transition-colors hover:border-accent-mint hover:bg-accent-mint/10 hover:underline"
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center">
        <Link
          to={routes.findCourse}
          className="text-sm font-semibold text-text-secondary underline decoration-accent-primary underline-offset-4 hover:text-accent-primary"
        >
          Browse All Courses →
        </Link>
      </p>
    </Section>
  )
}
