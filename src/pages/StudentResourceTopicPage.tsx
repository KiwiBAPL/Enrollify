import { Link, Navigate, useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/components/pages/PlaceholderPage'
import { Button } from '@/components/ui/Button'
import { routes } from '@/lib/routes'

const topicContent: Record<string, { title: string; description: string }> = {
  visas: {
    title: 'New Zealand Student Visa Guide',
    description:
      'Understand visa types, application requirements and timelines for international students planning to study in New Zealand.',
  },
  costs: {
    title: 'Cost of Studying in New Zealand',
    description:
      'Compare tuition fees, living costs and budgeting tips for international students across New Zealand cities.',
  },
  accommodation: {
    title: 'Student Accommodation in New Zealand',
    description:
      'Explore homestay, flatting and on-campus housing options for international students in New Zealand.',
  },
  working: {
    title: 'Working While Studying in New Zealand',
    description:
      'Learn about work rights, part-time job options and income expectations for international students on a New Zealand student visa. Full guide coming soon.',
  },
  scholarships: {
    title: 'Scholarships for International Students',
    description:
      'Discover scholarship and financial aid options for international students studying in New Zealand. Full guide coming soon.',
  },
}

export function StudentResourceTopicPage() {
  const { topic } = useParams<{ topic: string }>()
  const content = topic ? topicContent[topic] : undefined

  if (!content) {
    return <Navigate to={routes.studentResources} replace />
  }

  if (topic === 'visas') {
    return (
      <PlaceholderPage title={content.title} description={content.description} showConsultationLink={false}>
        <div className="max-w-2xl rounded-card border-2 border-accent-lavender bg-background-primary p-6 sm:p-8">
          <h2 className="mb-3 font-display text-xl font-bold text-text-secondary">
            Free Student Visa Checklist
          </h2>
          <p className="mb-6 font-body text-base text-text-primary">
            Download our step-by-step checklist covering documents, proof of funds, health requirements,
            and application timelines — everything you need before applying for your New Zealand
            student visa.
          </p>
          <Link to={routes.visaChecklist}>
            <Button>Get the free checklist</Button>
          </Link>
        </div>
      </PlaceholderPage>
    )
  }

  if (topic === 'costs') {
    return (
      <PlaceholderPage title={content.title} description={content.description} showConsultationLink={false}>
        <div className="max-w-2xl rounded-card border-2 border-accent-lavender bg-background-primary p-6 sm:p-8">
          <h2 className="mb-3 font-display text-xl font-bold text-text-secondary">
            Free Student Cost Planner
          </h2>
          <p className="mb-6 font-body text-base text-text-primary">
            Estimate your course fees, visa costs, travel, arrival setup and monthly living expenses
            with our student cost planner — a simple worksheet before you apply or pay major fees.
          </p>
          <Link to={routes.costPlanner}>
            <Button>Get the free cost planner</Button>
          </Link>
        </div>
      </PlaceholderPage>
    )
  }

  if (topic === 'accommodation') {
    return (
      <PlaceholderPage title={content.title} description={content.description} showConsultationLink={false}>
        <div className="max-w-2xl rounded-card border-2 border-accent-lavender bg-background-primary p-6 sm:p-8">
          <h2 className="mb-3 font-display text-xl font-bold text-text-secondary">
            Free Accommodation Tips Guide
          </h2>
          <p className="mb-6 font-body text-base text-text-primary">
            Compare halls, homestay and flatting options, understand typical weekly costs and learn
            practical tips for finding a safe place before you arrive in New Zealand.
          </p>
          <Link to={routes.accommodationTips}>
            <Button>Get the free accommodation guide</Button>
          </Link>
        </div>
      </PlaceholderPage>
    )
  }

  return <PlaceholderPage title={content.title} description={content.description} />
}
