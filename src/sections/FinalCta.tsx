import { Link } from 'react-router-dom'
import { finalCtaContent } from '@/content/final-cta'
import { ConsultationCta } from '@/components/lead-bot/ConsultationCta'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { routes } from '@/lib/routes'

export function FinalCta() {
  return (
    <Section id="cta" variant="primary" className="bg-accent-mint/30">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h2 className="m-0 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-text-secondary">
          {finalCtaContent.heading}
        </h2>
        <p className="m-0 text-text-primary">{finalCtaContent.body}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <ConsultationCta>{finalCtaContent.primaryLabel}</ConsultationCta>
          <Link to={routes.studyInNz}>
            <Button variant="secondary">{finalCtaContent.secondaryLabel}</Button>
          </Link>
        </div>
      </div>
    </Section>
  )
}
