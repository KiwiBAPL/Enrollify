import { ProviderContactForm } from '@/components/forms/ProviderContactForm'

export function ProviderContact() {
  return (
    <section id="provider-contact" className="scroll-mt-24 py-16">
      <div className="container mx-auto max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">Primary action</p>
        <h2 className="mb-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight text-text-secondary">
          Contact EnRollifyEdu
        </h2>
        <p className="mb-8 max-w-[50ch] text-text-primary">
          Tell us about your institution and recruitment goals. We&apos;ll follow up to explore whether
          EnRollifyEdu is a fit.
        </p>

        <div className="rounded-card border-2 border-accent-primary bg-background-secondary p-6 shadow-hard-accent md:p-8">
          <ProviderContactForm />
        </div>
      </div>
    </section>
  )
}
