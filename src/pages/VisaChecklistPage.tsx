import { VisaChecklistMetaTags } from '@/components/seo/VisaChecklistMetaTags'
import { visaChecklistContent } from '@/content/visa-checklist'
import { footerContent } from '@/content/site'
import { submitVisaChecklistLead } from '@/lib/resource-leads'
import { routes } from '@/lib/routes'
import { ResourceDownloadGatePage } from '@/pages/ResourceDownloadGatePage'

export function VisaChecklistPage() {
  return (
    <ResourceDownloadGatePage
      sectionId="visa-checklist"
      content={visaChecklistContent}
      metaTags={<VisaChecklistMetaTags />}
      ariaLabel="Student visa checklist download form"
      consentText={
        <>
          I agree to Enrollify storing my details to share the checklist and connect me with relevant
          study and visa guidance, in line with the{' '}
          <a href={footerContent.privacyHref} className="text-text-secondary underline">
            privacy policy
          </a>
          .
        </>
      }
      submitLabel="Get the checklist"
      submittingLabel="Opening checklist…"
      viewRoute={routes.visaChecklistView}
      onSubmitLead={submitVisaChecklistLead}
    />
  )
}
