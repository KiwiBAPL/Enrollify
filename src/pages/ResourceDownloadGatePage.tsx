import type { ReactNode } from 'react'
import { ResourceLeadForm } from '@/components/forms/ResourceLeadForm'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { ResourceDownloadGateContent } from '@/types/resource-download'

type ResourceDownloadGatePageProps = {
  sectionId: string
  content: ResourceDownloadGateContent
  metaTags: ReactNode
  ariaLabel: string
  consentText: ReactNode
  submitLabel: string
  submittingLabel: string
  viewRoute: string
  onSubmitLead: (fields: {
    firstName: string
    lastName: string
    email: string
    linkedinUrl?: string
  }) => Promise<string>
}

export function ResourceDownloadGatePage({
  sectionId,
  content,
  metaTags,
  ariaLabel,
  consentText,
  submitLabel,
  submittingLabel,
  viewRoute,
  onSubmitLead,
}: ResourceDownloadGatePageProps) {
  return (
    <>
      {metaTags}
      <Section id={sectionId}>
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            intro={content.intro}
            className="mb-8"
          />

          <div className="mb-8 space-y-4 font-body text-base text-text-primary">
            <p className="m-0">{content.coverage}</p>
            <p className="m-0">{content.closing}</p>
          </div>

          <p className="mb-6 font-body text-base text-text-primary">{content.formIntro}</p>

          <div className="rounded-card border-2 border-accent-lavender bg-background-primary p-6 sm:p-8">
            <ResourceLeadForm
              ariaLabel={ariaLabel}
              consentText={consentText}
              submitLabel={submitLabel}
              submittingLabel={submittingLabel}
              viewRoute={viewRoute}
              onSubmitLead={onSubmitLead}
            />
          </div>

          <p className="mt-6 text-sm text-text-primary/80">{content.privacyNote}</p>
        </div>
      </Section>
    </>
  )
}
