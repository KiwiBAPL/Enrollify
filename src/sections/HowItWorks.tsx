import { processSteps } from '@/content/process'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function HowItWorks() {
  return (
    <Section id="how-it-works" variant="secondary">
      <SectionHeader
        title="How it works"
        intro="A clear path from exploring your options to applying with confidence — with free guidance from local New Zealand experts."
      />

      <ol className="grid list-none gap-5 p-0 md:grid-cols-2 xl:grid-cols-4">
        {processSteps.map((step, index) => (
          <li
            key={step.id}
            className="rounded-card border-2 border-accent-primary border-l-[6px] border-l-accent-mint bg-background-primary p-5 shadow-hard-accent xl:border-l-2"
          >
            <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent-primary bg-accent-mint text-sm font-bold text-accent-primary">
              <span className="sr-only">Step {index + 1}: </span>
              {index + 1}
            </span>
            <h3 className="mb-2 font-display text-lg font-semibold text-text-secondary">{step.title}</h3>
            <p className="m-0 text-sm leading-relaxed text-text-primary">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
