import { Link } from 'react-router-dom'
import careerGuidesHeroImage from '@/assets/card 3.jpeg'
import { CareerGuideCard } from '@/components/pages/CareerGuideCard'
import { CareerGuidesFaq } from '@/components/pages/CareerGuidesFaq'
import { GuideParagraph } from '@/components/pages/GuideContent'
import { CareerGuidesMetaTags } from '@/components/seo/CareerGuidesMetaTags'
import { ConsultationCta } from '@/components/lead-bot/ConsultationCta'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { careerGuidesContent } from '@/content/career-guides'
import { routes } from '@/lib/routes'

export function CareerGuidesPage() {
  const {
    hero,
    whyPlanning,
    guidesSectionTitle,
    guides,
    advisoryCta,
    howToUse,
    faq,
    closingCta,
  } = careerGuidesContent

  return (
    <>
      <CareerGuidesMetaTags />

      <Section id="career-guides-hero" variant="secondary" className="py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <header className="space-y-4">
            <h1 className="m-0 font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-text-secondary">
              {hero.title}
            </h1>
            <p className="m-0 font-display text-lg italic text-text-muted">{hero.subtitle}</p>
            <div className="blog-body space-y-4">
              {hero.intro.map((paragraph, index) => (
                <GuideParagraph key={index} segments={paragraph} />
              ))}
            </div>
          </header>

          <figure className="m-0">
            <img
              src={careerGuidesHeroImage}
              alt={hero.imageAlt}
              loading="eager"
              className="aspect-[4/3] w-full rounded-card border-2 border-accent-primary object-cover shadow-hard-accent"
            />
          </figure>
        </div>
      </Section>

      <Section id="career-guides-body" variant="primary" className="py-12">
        <div className="mx-auto max-w-5xl space-y-12 blog-body">
          <section id="why-career-planning" className="scroll-mt-24 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-text-secondary">
              {whyPlanning.title}
            </h2>
            <p>{whyPlanning.intro}</p>
            <p>
              <strong>{whyPlanning.question}</strong>
            </p>
            <p>The right study choice should consider:</p>
            <ul>
              {whyPlanning.considerations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{whyPlanning.closing}</p>
          </section>

          <section id="explore-career-guides" className="scroll-mt-24">
            <h2 className="mb-6 font-display text-2xl font-semibold text-text-secondary">
              {guidesSectionTitle}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {guides.map((guide) => (
                <CareerGuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>

          <section
            id="not-sure"
            className="scroll-mt-24 space-y-4 rounded-card border-2 border-stroke-primary bg-accent-mint/30 p-8"
          >
            <h2 className="m-0 font-display text-2xl font-semibold text-text-secondary">
              {advisoryCta.title}
            </h2>
            {advisoryCta.body.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
            <p className="m-0">We can help you with:</p>
            <ul className="m-0">
              {advisoryCta.helpItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="m-0">{advisoryCta.closing}</p>
            <ConsultationCta>{advisoryCta.buttonLabel}</ConsultationCta>
          </section>

          <section id="how-to-use" className="scroll-mt-24 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-text-secondary">
              {howToUse.title}
            </h2>
            <ol className="space-y-4">
              {howToUse.steps.map((step, index) => (
                <li key={step.title}>
                  <h3 className="font-display text-lg font-semibold text-text-secondary">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="m-0 mt-1">{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <CareerGuidesFaq title={faq.title} items={faq.items} />

          <section
            id="start-planning"
            className="scroll-mt-24 space-y-4 rounded-card border-2 border-stroke-primary bg-background-secondary p-8 text-center"
          >
            <h2 className="m-0 font-display text-2xl font-semibold text-text-secondary">
              {closingCta.title}
            </h2>
            <p className="m-0 text-text-primary">{closingCta.body}</p>
            <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
              <ConsultationCta className="w-full sm:w-auto">{closingCta.primaryLabel}</ConsultationCta>
              <Link to={routes.findCourse} className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  {closingCta.secondaryLabel}
                </Button>
              </Link>
              <Link to={routes.contact} className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  {closingCta.tertiaryLabel}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </Section>
    </>
  )
}
