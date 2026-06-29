import { FEED_SITE_URL } from '@/lib/feeds'
import { SITE_NAME } from '@/lib/site'
import { routes } from '@/lib/routes'

export const ACCOMMODATION_TIPS_CANONICAL_URL = `${FEED_SITE_URL}${routes.accommodationTips}`

export const ACCOMMODATION_TIPS_PAGE_TITLE = `Accommodation Tips in New Zealand | ${SITE_NAME}`

export const ACCOMMODATION_TIPS_META_DESCRIPTION =
  'Download the free Enrollify accommodation guide for international students — halls, homestay, flatting, weekly costs, tenancy basics and tips for finding a place in New Zealand.'

export const ACCOMMODATION_TIPS_OG_TITLE = 'Accommodation Tips in New Zealand'

export const ACCOMMODATION_TIPS_OG_DESCRIPTION = ACCOMMODATION_TIPS_META_DESCRIPTION
