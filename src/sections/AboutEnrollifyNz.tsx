import { Link } from 'react-router-dom'
import studentsSocialising from '@/assets/Students socialising.jpeg'
import { aboutEnrollifyNzContent } from '@/content/about-enrollify-nz'
import { Section } from '@/components/ui/Section'
import { routes, studentResourceTopics } from '@/lib/routes'

const linkClassName =
  'text-text-secondary underline decoration-accent-primary/50 underline-offset-2 hover:text-accent-primary'

export function AboutEnrollifyNz() {
  const { heading, imageAlt, paragraphs, linkLabels } = aboutEnrollifyNzContent

  return (
    <Section id="about-enrollify-nz" variant="secondary" className="py-12">
      <div className="space-y-4 text-text-muted">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="space-y-4">
            <h2 className="m-0 font-display text-xl font-semibold text-text-secondary">{heading}</h2>

            <p className="m-0 leading-relaxed">
              Enrollify is New Zealand&apos;s dedicated resource for international students researching
              study opportunities in New Zealand. Whether you&apos;re exploring{' '}
              <Link to={routes.findCourseCategory('business')} className={linkClassName}>
                {linkLabels.businessCourses}
              </Link>
              ,{' '}
              <Link to={routes.findCourseCategory('nursing')} className={linkClassName}>
                {linkLabels.nursingCourses}
              </Link>
              ,{' '}
              <Link
                to={routes.findCourseCategory('information-technology')}
                className={linkClassName}
              >
                {linkLabels.itDiploma}
              </Link>{' '}
              or{' '}
              <Link to={routes.findCourseCategory('construction')} className={linkClassName}>
                {linkLabels.constructionCourses}
              </Link>{' '}
              — our free guides cover everything you need to make an informed decision.
            </p>

            <p className="m-0 leading-relaxed">
              We help students understand the{' '}
              <Link
                to={routes.studentResourceTopic(studentResourceTopics.visas)}
                className={linkClassName}
              >
                {linkLabels.studentVisa}
              </Link>{' '}
              requirements, compare the{' '}
              <Link
                to={routes.studentResourceTopic(studentResourceTopics.costs)}
                className={linkClassName}
              >
                {linkLabels.costOfStudying}
              </Link>
              , explore{' '}
              <Link to={routes.careerGuides} className={linkClassName}>
                {linkLabels.careerPathways}
              </Link>{' '}
              and learn about{' '}
              <Link to={routes.studyInNz} className={linkClassName}>
                {linkLabels.studentLife}
              </Link>{' '}
              first-hand — from people who have experienced it.
            </p>
          </div>

          <figure className="m-0">
            <img
              src={studentsSocialising}
              alt={imageAlt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-card border-2 border-accent-primary object-cover shadow-hard-accent"
            />
          </figure>
        </div>

        <p className="m-0 leading-relaxed">
          From{' '}
          <Link to={routes.careerGuides} className={linkClassName}>
            {linkLabels.qualifications}
          </Link>{' '}
          and the New Zealand education system to{' '}
          <Link
            to={routes.studentResourceTopic(studentResourceTopics.working)}
            className={linkClassName}
          >
            {linkLabels.workingWhileStudying}
          </Link>
          ,{' '}
          <Link
            to={routes.studentResourceTopic(studentResourceTopics.visas)}
            className={linkClassName}
          >
            {linkLabels.postStudyWorkVisa}
          </Link>{' '}
          options and{' '}
          <Link
            to={routes.studentResourceTopic(studentResourceTopics.accommodation)}
            className={linkClassName}
          >
            {linkLabels.studentAccommodation}
          </Link>{' '}
          — we connect you with practical guidance at every stage.
        </p>

        <p className="m-0 leading-relaxed">{paragraphs.independence}</p>
      </div>
    </Section>
  )
}
