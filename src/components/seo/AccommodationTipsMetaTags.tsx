import { Helmet } from 'react-helmet-async'
import {
  ACCOMMODATION_TIPS_CANONICAL_URL,
  ACCOMMODATION_TIPS_META_DESCRIPTION,
  ACCOMMODATION_TIPS_OG_DESCRIPTION,
  ACCOMMODATION_TIPS_OG_TITLE,
  ACCOMMODATION_TIPS_PAGE_TITLE,
} from '@/lib/accommodation-tips-seo'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site'

export function AccommodationTipsMetaTags() {
  return (
    <Helmet>
      <title>{ACCOMMODATION_TIPS_PAGE_TITLE}</title>
      <meta name="description" content={ACCOMMODATION_TIPS_META_DESCRIPTION} />
      <link rel="canonical" href={ACCOMMODATION_TIPS_CANONICAL_URL} />
      <meta property="og:title" content={ACCOMMODATION_TIPS_OG_TITLE} />
      <meta property="og:description" content={ACCOMMODATION_TIPS_OG_DESCRIPTION} />
      <meta property="og:url" content={ACCOMMODATION_TIPS_CANONICAL_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ACCOMMODATION_TIPS_OG_TITLE} />
      <meta name="twitter:description" content={ACCOMMODATION_TIPS_OG_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  )
}
