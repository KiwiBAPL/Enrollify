import { Helmet } from 'react-helmet-async'
import {
  buildOrganizationJsonLd,
  HOME_CANONICAL_URL,
  HOME_KEYWORDS,
  HOME_META_DESCRIPTION,
  HOME_OG_DESCRIPTION,
  HOME_OG_TITLE,
  HOME_PAGE_TITLE,
} from '@/lib/home-seo'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site'

export function HomeMetaTags() {
  const jsonLd = buildOrganizationJsonLd()

  return (
    <Helmet>
      <title>{HOME_PAGE_TITLE}</title>
      <meta name="description" content={HOME_META_DESCRIPTION} />
      <meta name="keywords" content={HOME_KEYWORDS} />
      <link rel="canonical" href={HOME_CANONICAL_URL} />
      <meta property="og:title" content={HOME_OG_TITLE} />
      <meta property="og:description" content={HOME_OG_DESCRIPTION} />
      <meta property="og:url" content={HOME_CANONICAL_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={HOME_OG_TITLE} />
      <meta name="twitter:description" content={HOME_OG_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
