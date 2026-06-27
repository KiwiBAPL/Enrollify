import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const TITLE = `Contact ${SITE_NAME} — Education Provider Partnerships`
const DESCRIPTION =
  'Get in touch with Enrollify about international student recruitment partnerships for New Zealand education providers.'

export function ContactMetaTags() {
  const url = `${SITE_URL}/contact`

  return (
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
