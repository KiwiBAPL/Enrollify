import { DEFAULT_AUTHOR_NAME, SITE_NAME } from './site'

/** Production URL for RSS/sitemap (build scripts always emit production URLs). */
export const FEED_SITE_URL = 'https://enrollifyedu.com'

export interface FeedPost {
  title: string
  slug: string
  summary: string | null
  meta_title: string
  meta_description: string
  featured_image_url: string | null
  author_name: string
  published_at: string | null
  updated_at: string
}

export const BLOG_DESCRIPTION =
  'Insights on international student recruitment, admissions workflows, and technology-enabled enrolment for education providers.'

export const SITEMAP_STATIC_ROUTES = ['/', '/contact', '/blog'] as const

function feedAbsoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith('http') ? pathOrUrl : `${FEED_SITE_URL}${pathOrUrl}`
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(isoDate: string | null): string {
  if (!isoDate) return new Date().toUTCString()
  return new Date(isoDate).toUTCString()
}

function toIsoDate(isoDate: string | null): string {
  if (!isoDate) return new Date().toISOString().slice(0, 10)
  return isoDate.slice(0, 10)
}

export function buildRssFeed(posts: FeedPost[]): string {
  const defaultImage = `${FEED_SITE_URL}/og-default.png`

  const items = posts
    .map((post) => {
      const link = `${FEED_SITE_URL}/blog/${post.slug}`
      const description = post.summary || post.meta_description || ''
      const author = post.author_name || DEFAULT_AUTHOR_NAME
      const imageUrl = post.featured_image_url ? feedAbsoluteUrl(post.featured_image_url) : null
      const enclosure = imageUrl
        ? `\n      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" />`
        : ''

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${toRfc822(post.published_at)}</pubDate>
      <author>${escapeXml(author)}</author>${enclosure}
    </item>`
    })
    .join('\n')

  const lastBuild =
    posts.length > 0 ? toRfc822(posts[0].published_at) : new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} Blog</title>
    <link>${FEED_SITE_URL}/blog</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en-nz</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${FEED_SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${defaultImage}</url>
      <title>${escapeXml(SITE_NAME)} Blog</title>
      <link>${FEED_SITE_URL}/blog</link>
    </image>
${items}
  </channel>
</rss>
`
}

export function buildSitemap(
  posts: FeedPost[],
  staticRoutes: readonly string[] = SITEMAP_STATIC_ROUTES,
): string {
  const staticUrls = staticRoutes
    .map(
      (path) => `  <url>
    <loc>${FEED_SITE_URL}${path === '/' ? '' : path}</loc>
  </url>`,
    )
    .join('\n')

  const postUrls = posts
    .map((post) => {
      const lastmod = toIsoDate(post.updated_at || post.published_at)
      return `  <url>
    <loc>${FEED_SITE_URL}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>
`
}
