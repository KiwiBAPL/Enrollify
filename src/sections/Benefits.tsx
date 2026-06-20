import { benefitItems } from '@/content/benefits'

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-24 py-16">
      <div className="container mx-auto">
        <h2 className="mb-10 max-w-[18ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-text-secondary">
          Outcomes for education providers
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {benefitItems.map((benefit) => (
            <article
              key={benefit.id}
              className="rounded-card border-2 border-accent-primary bg-background-secondary p-6 shadow-hard-accent"
            >
              <h3 className="mb-3 font-display text-xl font-semibold text-text-secondary">{benefit.title}</h3>
              <p className="m-0 text-base leading-relaxed text-text-primary">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
