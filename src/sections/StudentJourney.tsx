import { studentJourneyContent, studentJourneySteps } from '@/content/student-journey'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

function StepConnector({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center text-accent-primary ${className ?? ''}`}
    >
      <span className="text-2xl font-bold leading-none lg:hidden">↓</span>
      <span className="hidden text-xl font-bold leading-none lg:inline">→</span>
    </div>
  )
}

export function StudentJourney() {
  return (
    <Section id="student-journey" variant="primary">
      <SectionHeader
        title={studentJourneyContent.heading}
        intro={studentJourneyContent.intro}
      />

      <ol className="flex list-none flex-col gap-0 p-0 lg:flex-row lg:items-stretch lg:gap-3">
        {studentJourneySteps.map((step, index) => (
          <li key={step.id} className="contents">
            <div className="flex flex-1 flex-col rounded-card border-2 border-accent-primary border-l-[6px] border-l-accent-mint bg-background-primary p-5 shadow-hard-accent lg:border-l-2">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent-primary bg-accent-mint/30">
                <Icon name={step.icon} className="h-5 w-5 text-accent-primary" />
              </span>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                <span className="sr-only">Step {index + 1}: </span>
                Step {index + 1}
              </p>
              <h3 className="mb-2 font-display text-lg font-semibold text-text-secondary">
                {step.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed text-text-primary">{step.description}</p>
            </div>
            {index < studentJourneySteps.length - 1 ? (
              <StepConnector className="py-2 lg:px-1 lg:py-0 lg:self-center" />
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  )
}
