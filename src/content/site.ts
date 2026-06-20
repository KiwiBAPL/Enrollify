import type {
  AudienceCard,
  BenefitItem,
  FooterContent,
  HeroContent,
  NavLink,
  ProcessStep,
  SiteMeta,
  SupportingContent,
} from '@/types/content'

export const siteMeta: SiteMeta = {
  title: 'EnRollifyEdu — International Student Recruitment for Education Providers',
  description:
    'Technology-enabled international student recruitment for New Zealand and global education providers. Better-qualified students, lower costs, smoother admissions.',
}

export const navLinks: NavLink[] = []

export const footerContent: FooterContent = {
  contactEmail: 'hello@enrollifyedu.com',
  privacyHref: '#privacy',
  copyright: `© ${new Date().getFullYear()} EnRollifyEdu. All rights reserved.`,
}

export const heroContent: HeroContent = {
  headline: 'Recruiting qualified international students with confidence',
  body:
    'EnRollifyEdu is a technology-enabled recruitment service for New Zealand and colleges in New Zealand — delivering better-matched students, lower recruitment costs, and smoother admissions workflows.',
  primaryCta: { label: 'Contact us', href: '/contact' },
  secondaryCta: { label: 'How it works', href: '#how-it-works' },
}

export const audienceContent: AudienceCard[] = [
  {
    id: 'providers',
    title: 'Colleges in New Zealand',
    description:
      'Directors and managers of international recruitment, marketing, and admissions who need reliable, qualified enrolments — not raw enquiry volume.',
    emphasis: 'primary',
  },
  {
    id: 'students',
    title: 'International students',
    description:
      'Students researching study options in New Zealand who want a clear path to connect with suitable providers.',
    emphasis: 'secondary',
  },
]

export const processSteps: ProcessStep[] = [
  {
    id: 'attraction',
    title: 'Attraction',
    description: 'Reach prospective students through targeted, provider-aligned channels.',
  },
  {
    id: 'qualification',
    title: 'Qualification',
    description: 'Filter enquiries early so only relevant candidates enter your pipeline.',
  },
  {
    id: 'assessment',
    title: 'Assessment',
    description: 'Evaluate readiness and fit against your programme requirements.',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Present qualified candidates for provider review and decision-making.',
  },
  {
    id: 'delivery',
    title: 'Delivery',
    description: 'Support enrolment handoff so admissions teams receive prepared applicants.',
  },
]

export const benefitItems: BenefitItem[] = [
  {
    id: 'quality',
    title: 'Better-qualified students',
    description:
      'End-to-end qualification means your team spends time on applicants who match your programmes — not chasing unqualified leads.',
  },
  {
    id: 'cost',
    title: 'Lower recruitment costs',
    description:
      'A structured process reduces wasted spend on low-intent enquiries and unpredictable agent outcomes.',
  },
  {
    id: 'workflow',
    title: 'Smoother admissions workflows',
    description:
      'Prepared candidates and clearer handoffs reduce manual follow-up and speed up admissions decisions.',
  },
]

export const supportingContent: SupportingContent = {
  heading: 'More than a lead generator',
  body:
    'Generic recruitment agents and lead generators optimise for volume. EnRollifyEdu optimises for fit — with a transparent process from first contact through to enrolment handoff.',
  stats: [
    { id: 'process', value: '5 steps', label: 'End-to-end recruitment process' },
    { id: 'focus', value: 'Provider-first', label: 'Partnership model built for fit' },
    { id: 'tech', value: 'Tech-enabled', label: 'Qualification and assessment support' },
  ],
  highlights: [
    'End-to-end process, not disconnected referrals',
    'Provider-first partnership model',
    'Technology-enabled qualification and assessment',
  ],
}
