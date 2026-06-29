import { CostPlannerMetaTags } from '@/components/seo/CostPlannerMetaTags'
import { costPlannerContent } from '@/content/cost-planner'
import { footerContent } from '@/content/site'
import { submitCostPlannerLead } from '@/lib/resource-leads'
import { routes } from '@/lib/routes'
import { ResourceDownloadGatePage } from '@/pages/ResourceDownloadGatePage'

export function CostPlannerPage() {
  return (
    <ResourceDownloadGatePage
      sectionId="cost-planner"
      content={costPlannerContent}
      metaTags={<CostPlannerMetaTags />}
      ariaLabel="Student cost planner download form"
      consentText={
        <>
          I agree to Enrollify storing my details to share the cost planner and connect me with
          relevant study and budgeting guidance, in line with the{' '}
          <a href={footerContent.privacyHref} className="text-text-secondary underline">
            privacy policy
          </a>
          .
        </>
      }
      submitLabel="Get the cost planner"
      submittingLabel="Opening cost planner…"
      viewRoute={routes.costPlannerView}
      onSubmitLead={submitCostPlannerLead}
    />
  )
}
