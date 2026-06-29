import { AccommodationTipsMetaTags } from '@/components/seo/AccommodationTipsMetaTags'
import { accommodationTipsContent } from '@/content/accommodation-tips'
import { footerContent } from '@/content/site'
import { submitAccommodationTipsLead } from '@/lib/resource-leads'
import { routes } from '@/lib/routes'
import { ResourceDownloadGatePage } from '@/pages/ResourceDownloadGatePage'

export function AccommodationTipsPage() {
  return (
    <ResourceDownloadGatePage
      sectionId="accommodation-tips"
      content={accommodationTipsContent}
      metaTags={<AccommodationTipsMetaTags />}
      ariaLabel="Accommodation tips download form"
      consentText={
        <>
          I agree to Enrollify storing my details to share the accommodation guide and connect me
          with relevant study and housing guidance, in line with the{' '}
          <a href={footerContent.privacyHref} className="text-text-secondary underline">
            privacy policy
          </a>
          .
        </>
      }
      submitLabel="Get the accommodation guide"
      submittingLabel="Opening accommodation guide…"
      viewRoute={routes.accommodationTipsView}
      onSubmitLead={submitAccommodationTipsLead}
    />
  )
}
