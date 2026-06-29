import { routes } from '@/lib/routes'

export type StudentResourceItem = {
  id: string
  title: string
  summary: string
  eyebrow: string
  href: string
  ctaLabel: string
}

export const studentResourcesHubContent = {
  title: 'Student Resources',
  description:
    'Practical resources for international students — visa checklists, cost planners, accommodation tips and more.',
  sectionTitle: 'Downloads & guides',
} as const

export const studentResourceItems: StudentResourceItem[] = [
  {
    id: 'visa-checklist',
    title: 'New Zealand Student Visa Checklist',
    summary:
      'Identity documents, Offer of Place, funds, insurance, health and character checks, and common mistakes to avoid — a simple preparation guide before you apply.',
    eyebrow: 'Free download',
    href: routes.visaChecklist,
    ctaLabel: 'Get the checklist',
  },
  {
    id: 'cost-planner',
    title: 'New Zealand Student Cost Planner',
    summary:
      'One-off cost planning, weekly-to-monthly living budget, final funds summary and common budget risks — estimate course fees, visa costs, travel and monthly living expenses before you apply.',
    eyebrow: 'Free download',
    href: routes.costPlanner,
    ctaLabel: 'Get the cost planner',
  },
  {
    id: 'accommodation-tips',
    title: 'Accommodation Tips in New Zealand',
    summary:
      'Halls, homestay, flatting and private rentals — weekly costs, how to search safely, tenancy basics and tips for settling in during your first weeks in New Zealand.',
    eyebrow: 'Free download',
    href: routes.accommodationTips,
    ctaLabel: 'Get the accommodation guide',
  },
]
