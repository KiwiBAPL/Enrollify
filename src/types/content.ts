export type NavLink = {
  label: string
  href: string
}

export type SiteMeta = {
  title: string
  description: string
}

export type FooterContent = {
  contactEmail: string
  privacyHref: string
  copyright: string
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

export type AudienceCard = {
  id: string
  title: string
  description: string
  emphasis: 'primary' | 'secondary'
}

export type HeroContent = {
  headline: string
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
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
