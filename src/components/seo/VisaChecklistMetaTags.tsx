import { Helmet } from 'react-helmet-async'
import {
  VISA_CHECKLIST_CANONICAL_URL,
  VISA_CHECKLIST_META_DESCRIPTION,
  VISA_CHECKLIST_OG_DESCRIPTION,
  VISA_CHECKLIST_OG_TITLE,
  VISA_CHECKLIST_PAGE_TITLE,
} from '@/lib/visa-checklist-seo'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site'

export function VisaChecklistMetaTags() {
  return (
    <Helmet>
      <title>{VISA_CHECKLIST_PAGE_TITLE}</title>
      <meta name="description" content={VISA_CHECKLIST_META_DESCRIPTION} />
      <link rel="canonical" href={VISA_CHECKLIST_CANONICAL_URL} />
      <meta property="og:title" content={VISA_CHECKLIST_OG_TITLE} />
      <meta property="og:description" content={VISA_CHECKLIST_OG_DESCRIPTION} />
      <meta property="og:url" content={VISA_CHECKLIST_CANONICAL_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={VISA_CHECKLIST_OG_TITLE} />
      <meta name="twitter:description" content={VISA_CHECKLIST_OG_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  )
}
