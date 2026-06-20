import { processSteps } from '@/content/process'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-background-secondary py-16">
      <div className="container mx-auto">
        <h2 className="mb-4 max-w-[20ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-text-secondary">
          How it works
        </h2>
        <p className="mb-10 max-w-[50ch] text-text-muted">
          A structured, end-to-end recruitment process — from first contact through to enrolment
          handoff.
        </p>

        <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {processSteps.map((step, index) => (
            <li
              key={step.id}
              className="rounded-card border-2 border-accent-primary bg-background-primary p-5 shadow-hard-accent"
            >
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent-primary bg-accent-mint text-sm font-bold text-accent-primary">
                {index + 1}
              </span>
              <h3 className="mb-2 font-display text-lg font-semibold text-text-secondary">{step.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-text-primary">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
