import { Helmet } from 'react-helmet-async'
import {
  CAREER_GUIDES_CANONICAL_URL,
  CAREER_GUIDES_META_DESCRIPTION,
  CAREER_GUIDES_OG_DESCRIPTION,
  CAREER_GUIDES_OG_TITLE,
  CAREER_GUIDES_PAGE_TITLE,
} from '@/lib/career-guides-seo'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site'

export function CareerGuidesMetaTags() {
  return (
    <Helmet>
      <title>{CAREER_GUIDES_PAGE_TITLE}</title>
      <meta name="description" content={CAREER_GUIDES_META_DESCRIPTION} />
      <link rel="canonical" href={CAREER_GUIDES_CANONICAL_URL} />
      <meta property="og:title" content={CAREER_GUIDES_OG_TITLE} />
      <meta property="og:description" content={CAREER_GUIDES_OG_DESCRIPTION} />
      <meta property="og:url" content={CAREER_GUIDES_CANONICAL_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={CAREER_GUIDES_OG_TITLE} />
      <meta name="twitter:description" content={CAREER_GUIDES_OG_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </Helmet>
  )
}
