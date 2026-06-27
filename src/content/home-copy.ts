import { aboutEnrollifyNzContent } from '@/content/about-enrollify-nz'
import { courseCategoriesSectionContent } from '@/content/course-categories'
import { finalCtaContent } from '@/content/final-cta'
import { studentJourneyContent, studentJourneySteps } from '@/content/student-journey'
import {
  benefitItems,
  exploreCards,
  exploreSectionContent,
  heroContent,
  processSteps,
  supportingContent,
  trustBarItems,
  whyEnrollifyContent,
} from '@/content/site'

function joinParts(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** All homepage copy strings used for SEO keyword regression checks. */
export function getHomeVisibleCopy(): string {
  const heroHeadline = heroContent.headline.replace(/\n/g, ' ')

  const exploreCardText = exploreCards.flatMap((card) => [
    card.title,
    card.subtitle,
    card.ariaLabel,
  ])

  const processText = processSteps.flatMap((step) => [step.title, step.description])
  const benefitText = benefitItems.flatMap((item) => [item.title, item.description])
  const journeyText = studentJourneySteps.flatMap((step) => [step.title, step.description])
  const aboutLinkLabels = Object.values(aboutEnrollifyNzContent.linkLabels)
  const aboutParagraphs = Object.values(aboutEnrollifyNzContent.paragraphs)

  return joinParts([
    heroHeadline,
    heroContent.body,
    heroContent.primaryCta.label,
    heroContent.secondaryCta?.label,
    ...trustBarItems.map((item) => item.label),
    exploreSectionContent.heading,
    exploreSectionContent.intro,
    ...exploreCardText,
    'How it works',
    'A clear path from exploring your options to applying with confidence — with free guidance from local New Zealand experts.',
    ...processText,
    whyEnrollifyContent.heading,
    whyEnrollifyContent.intro,
    ...benefitText,
    supportingContent.heading,
    supportingContent.body,
    ...supportingContent.stats.flatMap((stat) => [stat.value, stat.label]),
    ...supportingContent.highlights,
    studentJourneyContent.heading,
    studentJourneyContent.intro,
    ...journeyText,
    courseCategoriesSectionContent.heading,
    courseCategoriesSectionContent.intro,
    aboutEnrollifyNzContent.heading,
    ...aboutLinkLabels,
    ...aboutParagraphs,
    finalCtaContent.heading,
    finalCtaContent.body,
    finalCtaContent.primaryLabel,
    finalCtaContent.secondaryLabel,
  ])
}

/** H1 and H2 heading text from the homepage (for primary keyword placement checks). */
export function getHomeHeadingCopy(): string {
  const heroHeadline = heroContent.headline.replace(/\n/g, ' ')

  return joinParts([
    heroHeadline,
    exploreSectionContent.heading,
    'How it works',
    whyEnrollifyContent.heading,
    supportingContent.heading,
    studentJourneyContent.heading,
    courseCategoriesSectionContent.heading,
    aboutEnrollifyNzContent.heading,
    finalCtaContent.heading,
    ...exploreCards.map((card) => card.title),
    ...processSteps.map((step) => step.title),
    ...benefitItems.map((item) => item.title),
    ...studentJourneySteps.map((step) => step.title),
  ])
}
