import { FEED_SITE_URL } from '@/lib/feeds'
import { SITE_NAME } from '@/lib/site'
import { routes } from '@/lib/routes'

export const VISA_CHECKLIST_CANONICAL_URL = `${FEED_SITE_URL}${routes.visaChecklist}`

export const VISA_CHECKLIST_PAGE_TITLE = `New Zealand Student Visa Checklist | ${SITE_NAME}`

export const VISA_CHECKLIST_META_DESCRIPTION =
  'Download the free Enrollify New Zealand student visa checklist — identity documents, Offer of Place, funds, insurance, health and character checks, and common mistakes to avoid.'

export const VISA_CHECKLIST_OG_TITLE = 'New Zealand Student Visa Checklist'

export const VISA_CHECKLIST_OG_DESCRIPTION = VISA_CHECKLIST_META_DESCRIPTION
