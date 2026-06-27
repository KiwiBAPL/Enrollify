import type { FooterSocialLink, NavLink } from '@/types/content'
import { routes } from '@/lib/routes'

export const footerQuickLinks: NavLink[] = [
  { label: 'Home', href: routes.home },
  { label: 'Study in New Zealand', href: routes.studyInNz },
  { label: 'Find a Course', href: routes.findCourse },
  { label: 'Career Guides', href: routes.careerGuides },
  { label: 'Student Resources', href: routes.studentResources },
  { label: 'Blog', href: routes.blog },
  { label: 'About Enrollify', href: routes.aboutEnrollify },
]

export const footerStudentResourceLinks: NavLink[] = [
  { label: 'Student Visa Guide', href: routes.studentResourceTopic('visas') },
  { label: 'Cost of Living', href: routes.studentResourceTopic('costs') },
  { label: 'Accommodation', href: routes.studentResourceTopic('accommodation') },
  { label: 'City Guides', href: routes.cityGuides },
  { label: 'Working While Studying', href: routes.studentResourceTopic('working') },
  { label: 'Scholarships', href: routes.studentResourceTopic('scholarships') },
]

export const footerSocialLinks: FooterSocialLink[] = []
