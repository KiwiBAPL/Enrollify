import { Navigate, useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/components/pages/PlaceholderPage'
import { routes } from '@/lib/routes'

const topicContent: Record<string, { title: string; description: string }> = {
  visas: {
    title: 'New Zealand Student Visa Guide',
    description:
      'Understand visa types, application requirements and timelines for international students planning to study in New Zealand. Full guide coming soon.',
  },
  costs: {
    title: 'Cost of Studying in New Zealand',
    description:
      'Compare tuition fees, living costs and budgeting tips for international students across New Zealand cities. Full guide coming soon.',
  },
  accommodation: {
    title: 'Student Accommodation in New Zealand',
    description:
      'Explore homestay, flatting and on-campus housing options for international students in New Zealand. Full guide coming soon.',
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

  return <PlaceholderPage title={content.title} description={content.description} />
}
