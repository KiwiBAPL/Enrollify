import { VISA_CHECKLIST_PDF_PATH, visaChecklistContent } from '@/content/visa-checklist'
import { validateVisaChecklistAccess } from '@/lib/resource-leads'
import { routes } from '@/lib/routes'
import { ResourceDownloadViewPage } from '@/pages/ResourceDownloadViewPage'

export function VisaChecklistViewPage() {
  return (
    <ResourceDownloadViewPage
      sectionId="visa-checklist-view"
      content={visaChecklistContent}
      pdfPath={VISA_CHECKLIST_PDF_PATH}
      formRoute={routes.visaChecklist}
      validateAccess={validateVisaChecklistAccess}
    />
  )
}
