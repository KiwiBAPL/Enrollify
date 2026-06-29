import { Helmet } from 'react-helmet-async'
import {
  FOUNDER_BIO_CANONICAL_URL,
  FOUNDER_BIO_META_DESCRIPTION,
  FOUNDER_BIO_OG_DESCRIPTION,
  FOUNDER_BIO_OG_TITLE,
  FOUNDER_BIO_PAGE_TITLE,
} from '@/lib/founder-bio-seo'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Paul Benn',
  jobTitle: 'Founder',
  worksFor: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: 'https://www.enrollifyedu.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Wellington',
    addressCountry: 'NZ',
  },
}

export function FounderBioMetaTags() {
  return (
    <Helmet>
      <title>{FOUNDER_BIO_PAGE_TITLE}</title>
      <meta name="description" content={FOUNDER_BIO_META_DESCRIPTION} />
      <link rel="canonical" href={FOUNDER_BIO_CANONICAL_URL} />
      <meta property="og:title" content={FOUNDER_BIO_OG_TITLE} />
      <meta property="og:description" content={FOUNDER_BIO_OG_DESCRIPTION} />
      <meta property="og:url" content={FOUNDER_BIO_CANONICAL_URL} />
      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={FOUNDER_BIO_OG_TITLE} />
      <meta name="twitter:description" content={FOUNDER_BIO_OG_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
    </Helmet>
  )
}
