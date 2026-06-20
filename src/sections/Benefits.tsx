import { benefitItems } from '@/content/benefits'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function Benefits() {
  return (
    <Section id="benefits">
      <SectionHeader
        title="Outcomes for education providers"
        intro="Measure EnRollifyEdu by the operational and enrolment outcomes it creates — not enquiry volume alone."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {benefitItems.map((benefit) => (
          <article
            key={benefit.id}
            className="flex h-full flex-col rounded-card border-2 border-accent-primary bg-background-secondary p-6 shadow-hard-accent"
          >
            <h3 className="mb-3 font-display text-xl font-semibold text-text-secondary">{benefit.title}</h3>
            <p className="m-0 flex-1 text-base leading-relaxed text-text-primary">{benefit.description}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
