import type { JourneyStep } from '@/types/content'

export const studentJourneySteps: JourneyStep[] = [
  {
    id: 'discover',
    title: 'Discover',
    description:
      'Learn about studying in New Zealand. Explore career opportunities. Understand the education system and what to expect as an international student.',
    icon: 'compass',
  },
  {
    id: 'explore',
    title: 'Explore',
    description:
      'Compare qualifications, study areas and cities. Research visas, costs and student life. Read our free guides and resources.',
    icon: 'search',
  },
  {
    id: 'choose-pathway',
    title: 'Choose Your Study Pathway',
    description:
      'Identify the course and career pathway best suited to your goals, experience and budget.',
    icon: 'path',
  },
  {
    id: 'consultation',
    title: 'Book a Free Consultation',
    description:
      'Speak with an Enrollify advisor. Receive personalised, independent guidance. Be matched with the most suitable study option for your situation.',
    icon: 'calendar',
  },
  {
    id: 'apply',
    title: 'Apply',
    description:
      'Receive application guidance, prepare your documentation and begin your journey to studying in New Zealand.',
    icon: 'document',
  },
]

export const studentJourneyContent = {
  heading: 'Your Step-by-Step Study Journey',
  intro:
    "From your first search to your first day of class — here's how Enrollify supports you every step of the way.",
}
