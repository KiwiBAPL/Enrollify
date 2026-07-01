import { Link } from 'react-router-dom'
import { FounderBioMetaTags } from '@/components/seo/FounderBioMetaTags'
import { ConsultationCta } from '@/components/lead-bot/ConsultationCta'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { founderBioContent } from '@/content/founder-bio'
import { routes } from '@/lib/routes'

export function FounderBioPage() {
  const { sections, closingCta } = founderBioContent
  const section = sections[0]

  return (
    <>
      <FounderBioMetaTags />

      <Section id="founder-bio-body" variant="primary" className="py-12">
        <div className="mx-auto max-w-3xl space-y-12 blog-body">
          <section id={section.id} className="scroll-mt-24 space-y-4">
            <h1 className="m-0 font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-text-secondary">
              {section.title}
            </h1>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="m-0">
                {paragraph}
              </p>
            ))}
          </section>

          <section
            id="founder-bio-cta"
            className="scroll-mt-24 space-y-4 rounded-card border-2 border-stroke-primary bg-background-secondary p-8 text-center"
          >
            <h2 className="m-0 font-display text-2xl font-semibold text-text-secondary">
              {closingCta.title}
            </h2>
            <p className="m-0 text-text-primary">{closingCta.body}</p>
            <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
              <ConsultationCta className="w-full sm:w-auto">{closingCta.primaryLabel}</ConsultationCta>
              <Link to={routes.contact} className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  {closingCta.secondaryLabel}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </Section>
    </>
  )
}
