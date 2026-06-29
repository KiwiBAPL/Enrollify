import { Helmet } from 'react-helmet-async'
import { StudentResourceCard } from '@/components/pages/StudentResourceCard'
import { Section } from '@/components/ui/Section'
import {
  studentResourceItems,
  studentResourcesHubContent,
} from '@/content/student-resources'
import { SITE_NAME } from '@/lib/site'

export function StudentResourcesPage() {
  const { title, description, sectionTitle } = studentResourcesHubContent

  return (
    <>
      <Helmet>
        <title>{`${title} | ${SITE_NAME}`}</title>
        <meta name="description" content={description} />
      </Helmet>

      <Section id="student-resources">
        <header className="mb-10 max-w-3xl">
          <h1 className="mb-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold text-text-secondary">
            {title}
          </h1>
          <p className="m-0 font-body text-lg text-text-primary">{description}</p>
        </header>

        <section aria-labelledby="student-resources-grid-heading">
          <h2
            id="student-resources-grid-heading"
            className="mb-6 font-display text-2xl font-semibold text-text-secondary"
          >
            {sectionTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:max-w-4xl">
            {studentResourceItems.map((resource) => (
              <StudentResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      </Section>
    </>
  )
}
