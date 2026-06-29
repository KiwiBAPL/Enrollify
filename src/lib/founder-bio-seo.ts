import { FEED_SITE_URL } from '@/lib/feeds'
import { SITE_NAME } from '@/lib/site'
import { routes } from '@/lib/routes'

export const FOUNDER_BIO_CANONICAL_URL = `${FEED_SITE_URL}${routes.aboutPaulBenn}`

export const FOUNDER_BIO_PAGE_TITLE = `Paul Benn — Founder of Enrollify | ${SITE_NAME}`

export const FOUNDER_BIO_META_DESCRIPTION =
  'Founder Paul Benn on why he built Enrollify — a modern admissions platform and AI assistant helping education providers manage enquiries, qualify leads, and deliver human enrolment experiences from Wellington, New Zealand.'

export const FOUNDER_BIO_OG_TITLE = 'Paul Benn — Founder of Enrollify'

export const FOUNDER_BIO_OG_DESCRIPTION = FOUNDER_BIO_META_DESCRIPTION
