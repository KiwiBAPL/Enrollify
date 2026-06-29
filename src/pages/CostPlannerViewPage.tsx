import { COST_PLANNER_PDF_PATH, costPlannerContent } from '@/content/cost-planner'
import { validateCostPlannerAccess } from '@/lib/resource-leads'
import { routes } from '@/lib/routes'
import { ResourceDownloadViewPage } from '@/pages/ResourceDownloadViewPage'

export function CostPlannerViewPage() {
  return (
    <ResourceDownloadViewPage
      sectionId="cost-planner-view"
      content={costPlannerContent}
      pdfPath={COST_PLANNER_PDF_PATH}
      formRoute={routes.costPlanner}
      validateAccess={validateCostPlannerAccess}
    />
  )
}
