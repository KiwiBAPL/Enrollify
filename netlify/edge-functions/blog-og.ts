import type { Context } from '@netlify/edge-functions'

const SITE_URL = 'https://enrollifyedu.com'
const SITE_NAME = 'EnRollifyEdu'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`

interface SupabasePostRow {
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

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function toAbsoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith('http') ? pathOrUrl : `${SITE_URL}${pathOrUrl}`
}

function resolveMeta(post: SupabasePostRow) {
  const url = `${SITE_URL}/blog/${post.slug}`
  const title = post.meta_title || post.title
  const description = post.meta_description || post.summary || ''
  const image = post.featured_image_url
    ? toAbsoluteUrl(post.featured_image_url)
    : DEFAULT_OG_IMAGE

  return {
    pageTitle: `${title} | ${SITE_NAME}`,
    title,
    description,
    image,
    url,
    author: post.author_name,
    datePublished: post.published_at,
    headline: post.title,
  }
}

function buildHeadTags(meta: ReturnType<typeof resolveMeta>): string {
  const e = escapeHtmlAttr
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.headline,
    description: meta.description,
    image: meta.image,
    author: { '@type': 'Person', name: meta.author },
    datePublished: meta.datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': meta.url },
    publisher: { '@type': 'Organization', name: SITE_NAME },
  }

  return [
    `<title>${e(meta.pageTitle)}</title>`,
    `<meta name="description" content="${e(meta.description)}" />`,
    `<link rel="canonical" href="${e(meta.url)}" />`,
    `<meta property="og:title" content="${e(meta.title)}" />`,
    `<meta property="og:description" content="${e(meta.description)}" />`,
    `<meta property="og:image" content="${e(meta.image)}" />`,
    `<meta property="og:url" content="${e(meta.url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${e(SITE_NAME)}" />`,
    meta.datePublished
      ? `<meta property="article:published_time" content="${e(meta.datePublished)}" />`
      : '',
    `<meta property="article:author" content="${e(meta.author)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(meta.title)}" />`,
    `<meta name="twitter:description" content="${e(meta.description)}" />`,
    `<meta name="twitter:image" content="${e(meta.image)}" />`,
    `<meta name="author" content="${e(meta.author)}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}

function injectHeadTags(html: string, meta: ReturnType<typeof resolveMeta>): string {
  return html.replace(/<title>[\s\S]*?<\/title>/, buildHeadTags(meta))
}

function getSupabaseEnv(): { url: string; key: string } | null {
  const url = Deno.env.get('VITE_SUPABASE_URL') ?? Deno.env.get('SUPABASE_URL') ?? ''
  const key =
    Deno.env.get('VITE_SUPABASE_PUBLISHABLE_KEY') ??
    Deno.env.get('VITE_SUPABASE_ANON_KEY') ??
    Deno.env.get('SUPABASE_ANON_KEY') ??
    ''
  if (!url || !key) return null
  return { url, key }
}

async function fetchPublishedPost(
  slug: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<SupabasePostRow | null> {
  const query = new URLSearchParams({
    slug: `eq.${slug}`,
    status: 'eq.published',
    select:
      'title,slug,summary,meta_title,meta_description,featured_image_url,author_name,published_at,updated_at',
  })

  const res = await fetch(`${supabaseUrl}/rest/v1/blog_posts?${query}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!res.ok) return null
  const rows = (await res.json()) as SupabasePostRow[]
  return rows[0] ?? null
}

export default async function handler(request: Request, context: Context) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return context.next()
  }

  const url = new URL(request.url)
  const slugMatch = url.pathname.match(/^\/blog\/([^/.]+)\/?$/)
  if (!slugMatch) {
    return context.next()
  }

  const slug = decodeURIComponent(slugMatch[1])
  const supabaseEnv = getSupabaseEnv()

  if (!supabaseEnv) {
    return context.next()
  }

  const post = await fetchPublishedPost(slug, supabaseEnv.url, supabaseEnv.key)

  if (!post) {
    return context.next()
  }

  const indexRes = await fetch(new URL('/index.html', url.origin).toString(), {
    headers: { Accept: 'text/html' },
  })

  if (!indexRes.ok) {
    return context.next()
  }

  const shell = await indexRes.text()
  const html = injectHeadTags(shell, resolveMeta(post))

  return new Response(request.method === 'HEAD' ? null : html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, stale-while-revalidate=600',
    },
  })
}
