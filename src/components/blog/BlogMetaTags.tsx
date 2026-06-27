import { Helmet } from 'react-helmet-async'
import type { BlogPost } from '@/types/database'
import {
  buildBlogPostJsonLd,
  buildFaqPageJsonLd,
  resolveBlogPostOgMeta,
} from '@/lib/blog-og-meta'
import { parseFaqText } from '@/lib/parse-faq'
import { SITE_NAME, SITE_URL } from '@/lib/site'

interface BlogMetaTagsProps {
  post: BlogPost
}

export function BlogMetaTags({ post }: BlogMetaTagsProps) {
  const meta = resolveBlogPostOgMeta(post)
  const jsonLd = buildBlogPostJsonLd(meta)
  const faqItems = parseFaqText(post.faq_text)
  const faqJsonLd = faqItems.length > 0 ? buildFaqPageJsonLd(faqItems) : null

  return (
    <Helmet>
      <title>{meta.pageTitle}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <meta name="author" content={meta.author} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      {faqJsonLd && (
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      )}
    </Helmet>
  )
}

interface BlogListingMetaTagsProps {
  title?: string
  description?: string
}

export function BlogListingMetaTags({
  title = 'Blog',
  description = 'Insights on international student recruitment, admissions workflows, and technology-enabled enrolment for education providers.',
}: BlogListingMetaTagsProps) {
  const path = '/blog'
  const fullUrl = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{`${title} | ${SITE_NAME}`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${SITE_NAME} Blog`}
        href={`${SITE_URL}/blog/rss.xml`}
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
