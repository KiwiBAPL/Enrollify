import { ProviderContactForm } from '@/components/forms/ProviderContactForm'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function ProviderContact() {
  return (
    <Section id="provider-contact">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Primary action"
          title="Contact Enrollify"
          intro="Tell us about your institution and recruitment goals. We'll follow up to explore whether Enrollify is a fit."
          className="mb-8"
        />

        <div className="rounded-card border-2 border-accent-primary bg-background-secondary p-6 shadow-hard-accent sm:p-8">
          <ProviderContactForm />
        </div>
      </div>
    </Section>
  )
}
