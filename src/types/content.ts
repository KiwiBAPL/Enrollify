export type NavLink = {
  label: string
  href: string
}

export type SiteMeta = {
  title: string
  description: string
}

export type FooterContent = {
  tagline: string
  contactEmail: string
  privacyHref: string
  termsHref: string
  copyright: string
}

export type FooterSocialLink = {
  platform: 'facebook' | 'linkedin' | 'instagram'
  href: string
  label: string
}

export type JourneyStep = {
  id: string
  title: string
  description: string
  icon: 'compass' | 'search' | 'path' | 'calendar' | 'document'
}

export type CourseCategory = {
  label: string
  slug: string
}

export type ProcessStep = {
  id: string
  title: string
  description: string
}

export type BenefitItem = {
  id: string
  title: string
  description: string
}

export type ExploreCard = {
  id: string
  title: string
  subtitle: string
  href: string
  ariaLabel: string
  imageAlt: string
  imageSrc?: string
  accent: 'mint' | 'lavender' | 'purple'
}

export type HeroContent = {
  headline: string
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export type TrustSignal = {
  id: string
  label: string
  icon: 'globe' | 'users' | 'shield' | 'spark'
}

export type WhyEnrollifyContent = {
  heading: string
  intro: string
}

export type SupportingContent = {
  heading: string
  body: string
  highlights: string[]
  stats: TrustStat[]
}

export type TrustStat = {
  id: string
  value: string
  label: string
}

export type GuideTextSegment =
  | string
  | { type: 'strong'; text: string }
  | { type: 'em'; text: string }
  | { type: 'link'; label: string; href: string; external?: boolean }

export type GuideBlock =
  | { type: 'paragraph'; content: GuideTextSegment[] }
  | { type: 'list'; items: GuideTextSegment[][] }
  | { type: 'subsection'; id: string; title: string; blocks: GuideBlock[] }
  | { type: 'image'; src: string; alt: string }

export type GuideSection = {
  id: string
  title: string
  blocks: GuideBlock[]
}

export type GuidePageContent = {
  meta: {
    title: string
    description: string
  }
  hero: {
    title: string
    subtitle: string
    intro: GuideTextSegment[][]
    imageAlt: string
  }
  tableOfContents: { id: string; label: string }[]
  sections: GuideSection[]
  cta: {
    heading: string
    body: string
    primaryLabel: string
    secondaryLabel: string
  }
}
