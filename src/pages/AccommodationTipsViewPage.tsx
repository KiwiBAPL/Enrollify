import {
  ACCOMMODATION_TIPS_PDF_PATH,
  accommodationTipsContent,
} from '@/content/accommodation-tips'
import { validateAccommodationTipsAccess } from '@/lib/resource-leads'
import { routes } from '@/lib/routes'
import { ResourceDownloadViewPage } from '@/pages/ResourceDownloadViewPage'

export function AccommodationTipsViewPage() {
  return (
    <ResourceDownloadViewPage
      sectionId="accommodation-tips-view"
      content={accommodationTipsContent}
      pdfPath={ACCOMMODATION_TIPS_PDF_PATH}
      formRoute={routes.accommodationTips}
      validateAccess={validateAccommodationTipsAccess}
    />
  )
}
