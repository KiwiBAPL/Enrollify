import { Helmet } from 'react-helmet-async'
import { SITE_OWNERSHIP_META } from '@/lib/site'

/** Head-only ownership tags — not rendered in page body. */
export function SiteOwnershipMetaTags() {
  return (
    <Helmet>
      <meta name="copyright" content={SITE_OWNERSHIP_META} />
      <meta name="site-owner" content={SITE_OWNERSHIP_META} />
    </Helmet>
  )
}
