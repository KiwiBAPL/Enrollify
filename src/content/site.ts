import type {
  BenefitItem,
  ExploreCard,
  FooterContent,
  HeroContent,
  NavLink,
  ProcessStep,
  SiteMeta,
  SupportingContent,
  TrustSignal,
  WhyEnrollifyContent,
} from '@/types/content'
import studyInNzCardImage from '@/assets/card 1.jpeg'
import findCourseCardImage from '@/assets/card 2.jpeg'
import careerGuidesCardImage from '@/assets/card 3.jpeg'
import studentResourcesCardImage from '@/assets/card 4.jpeg'
import cityGuidesCardImage from '@/assets/card 5.jpeg'
import latestArticlesCardImage from '@/assets/card 6.jpeg'

export const siteMeta: SiteMeta = {
  title: 'Study in New Zealand | Find Your Course, Career & Visa Guide | Enrollify',
  description:
    'Enrollify helps international students find the right study pathway in New Zealand. Explore courses, career guides, visa requirements, costs and student life. Book a free consultation today.',
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Study in New Zealand', href: '/study-in-new-zealand' },
  { label: 'Find a Course', href: '/find-a-course' },
  { label: 'Career Guides', href: '/career-guides' },
  { label: 'Student Resources', href: '/student-resources' },
  { label: 'Blog', href: '/blog' },
]

export const footerContent: FooterContent = {
  tagline: "New Zealand's trusted student advisory platform.",
  contactEmail: 'hello@enrollifyedu.com',
  privacyHref: '#privacy',
  termsHref: '#terms',
  copyright: `© ${new Date().getFullYear()} Enrollify. All rights reserved.`,
}

export const heroContent: HeroContent = {
  headline: 'Find the Right\nStudy Pathway\nfor Your Future\nin New Zealand',
  body:
    "Explore courses, understand career pathways, compare qualifications, learn about visas and receive trusted guidance from people who have experienced New Zealand's education system first-hand.",
  primaryCta: { label: 'Book a Free Consultation', href: '/book-consultation' },
  secondaryCta: { label: 'Explore Study Options', href: '/study-in-new-zealand' },
}

export const trustBarItems: TrustSignal[] = [
  { id: 'nz-founded', label: 'Founded & operated in New Zealand', icon: 'globe' },
  { id: 'studied-here', label: 'Built by people who studied here', icon: 'users' },
  { id: 'student-first', label: 'Independent student-first guidance', icon: 'shield' },
  { id: 'countries', label: 'Trusted by students from 20+ countries', icon: 'spark' },
]

export const exploreSectionContent = {
  heading: 'Everything You Need to Plan Your Studies in New Zealand',
  intro:
    'From understanding the education system to finding the right course and navigating your student visa — explore our guides and resources below.',
}

export const exploreCards: ExploreCard[] = [
  {
    id: 'study-in-nz',
    title: 'Study in New Zealand',
    subtitle: 'Why NZ, education system, student life, working while studying New Zealand',
    href: '/study-in-new-zealand',
    ariaLabel: 'Study in New Zealand — Why NZ, education system, student life, working rights',
    imageAlt: 'Students studying in New Zealand and having fun',
    imageSrc: studyInNzCardImage,
    accent: 'mint',
  },
  {
    id: 'find-course',
    title: 'Find a Course',
    subtitle: 'Business, IT, Nursing, Construction, Hospitality and more',
    href: '/find-a-course',
    ariaLabel: 'Find a Course — Business, IT, Nursing, Construction, Hospitality and more',
    imageAlt: 'Students enjoying themselves finding their course to study in New Zealand',
    imageSrc: findCourseCardImage,
    accent: 'lavender',
  },
  {
    id: 'career-guides',
    title: 'Career Guides',
    subtitle: 'Explore salaries, demand and recommended qualifications',
    href: '/career-guides',
    ariaLabel: 'Career Guides — Explore salaries, demand and recommended qualifications',
    imageAlt: 'Student being guided in their studies in New Zealand',
    imageSrc: careerGuidesCardImage,
    accent: 'purple',
  },
  {
    id: 'student-resources',
    title: 'Student Resources',
    subtitle: 'Student visa New Zealand, costs, student accommodation New Zealand, city guides',
    href: '/student-resources',
    ariaLabel: 'Student Resources — Visas, costs, accommodation, banking, city guides',
    imageAlt: 'International New Zealand student filling in their visa application',
    imageSrc: studentResourcesCardImage,
    accent: 'mint',
  },
  {
    id: 'city-guides',
    title: 'City Guides',
    subtitle: 'Auckland, Christchurch, Wellington, Hamilton, Dunedin',
    href: '/city-guides',
    ariaLabel: 'City Guides — Auckland, Christchurch, Wellington, Hamilton, Dunedin',
    imageAlt: 'Students enjoying the city life with a view of the Auckland Sky Tower in the background',
    imageSrc: cityGuidesCardImage,
    accent: 'lavender',
  },
  {
    id: 'latest-articles',
    title: 'Latest Articles',
    subtitle: 'Tips, guides and advice from our student blog',
    href: '/blog',
    ariaLabel: 'Latest Articles — Tips, guides and advice from our student blog',
    imageAlt: 'International NZ student reading Enrollify Articles and blogs',
    imageSrc: latestArticlesCardImage,
    accent: 'purple',
  },
]

export const processSteps: ProcessStep[] = [
  {
    id: 'explore',
    title: 'Explore your options',
    description:
      'Browse courses, careers and visa basics to understand what studying in New Zealand could look like for you.',
  },
  {
    id: 'guidance',
    title: 'Get personalised guidance',
    description:
      'Share your goals and background so we can point you toward pathways that fit your qualifications and budget.',
  },
  {
    id: 'consultation',
    title: 'Free consultation',
    description:
      'Talk with our local experts — no obligation — to clarify choices, requirements and next steps.',
  },
  {
    id: 'apply',
    title: 'Apply with confidence',
    description:
      'Move forward knowing your course, visa and cost plan are aligned before you commit to an application.',
  },
]

export const whyEnrollifyContent: WhyEnrollifyContent = {
  heading: 'Why Students Choose Enrollify',
  intro:
    "We're not a traditional education agency. We're a trusted student advisory platform built to help you make informed decisions about studying in New Zealand.",
}

export const benefitItems: BenefitItem[] = [
  {
    id: 'local-advice',
    title: 'Trusted Local Advice',
    description:
      "Founded and operated in New Zealand by people with first-hand experience of studying and living here. We know the system because we've lived it.",
  },
  {
    id: 'student-first',
    title: 'Student-First Guidance',
    description:
      'Independent advice focused entirely on helping you make the right decision for your goals — not on pushing you toward any particular provider.',
  },
  {
    id: 'study-pathways',
    title: 'Clear Study Pathways',
    description:
      'Understand qualifications, explore career opportunities and compare your options before you apply. No pressure, no rush.',
  },
  {
    id: 'consultation',
    title: 'Personalised Consultation',
    description:
      'Book a free consultation and receive tailored guidance based on your career goals, academic background and budget.',
  },
]

export const supportingContent: SupportingContent = {
  heading: 'Trusted guidance to study in New Zealand',
  body:
    'Enrollify is a New Zealand student advisory platform — not a course catalogue. We help international students navigate courses, careers, visas and costs with local expertise and a free consultation to start.',
  stats: [
    { id: 'focus', value: 'NZ-focused', label: 'Local experts who know the system' },
    { id: 'consultation', value: 'Free', label: 'No-obligation consultation' },
    { id: 'pathways', value: 'Full pathway', label: 'Courses, careers, visas and costs' },
  ],
  highlights: [
    'Personalised course and career guidance',
    'Student visa requirements explained clearly',
    'Free consultation with local New Zealand experts',
  ],
}
