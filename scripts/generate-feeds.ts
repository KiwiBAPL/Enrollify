/**
 * Build-time RSS feed and sitemap generator.
 *
 * Usage:
 *   npm run generate:feeds
 *
 * Requires in .env.local (or Netlify env, scope All):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 *
 * Writes:
 *   dist/blog/rss.xml
 *   dist/sitemap.xml
 *   dist/blog/{slug}/index.html  (OG meta shells for social crawlers)
 *
 * Run after `vite build` so dist/ exists.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildRssFeed, buildSitemap, type FeedPost } from '../src/lib/feeds.ts'
import { injectBlogPostHeadTags, resolveBlogPostOgMeta } from '../src/lib/blog-og-meta.ts'
import { createNodeSupabaseClient } from './supabase-node-client.ts'

function loadEnvLocal(): Record<string, string> {
  const envPath = resolve(process.cwd(), '.env.local')
  const vars: Record<string, string> = {}

  if (!existsSync(envPath)) return vars

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    vars[key] = value
  }
  return vars
}

function isValidSupabaseUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed || trimmed.includes('${')) return false
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function resolveSupabaseEnv(envLocal: Record<string, string>) {
  const url = (
    process.env.VITE_SUPABASE_URL ??
    envLocal.VITE_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    ''
  ).trim()
  const publishableKey = (
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    envLocal.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    envLocal.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ''
  ).trim()
  return { url, publishableKey }
}

async function run() {
  const envLocal = loadEnvLocal()
  const { url, publishableKey } = resolveSupabaseEnv(envLocal)

  const distDir = resolve(process.cwd(), 'dist')
  if (!existsSync(distDir)) {
    console.error('generate-feeds: dist/ not found — run vite build first')
    process.exit(1)
  }

  const rssDir = resolve(distDir, 'blog')
  mkdirSync(rssDir, { recursive: true })
  const rssPath = resolve(rssDir, 'rss.xml')
  const sitemapPath = resolve(distDir, 'sitemap.xml')

  const urlValid = isValidSupabaseUrl(url)
  const hasKey = publishableKey.length > 0

  if (!urlValid || !hasKey) {
    console.warn(
      'generate-feeds: Skipping Supabase query — VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set.',
    )
    console.warn(
      'generate-feeds: Writing empty RSS/sitemap only. Social OG previews use the blog-og edge function at runtime.',
    )
    writeFileSync(rssPath, buildRssFeed([]), 'utf8')
    writeFileSync(sitemapPath, buildSitemap([]), 'utf8')
    console.log(`generate-feeds: wrote ${rssPath}`)
    console.log(`generate-feeds: wrote ${sitemapPath}`)
    return
  }

  const client = createNodeSupabaseClient(url, publishableKey)

  const { data, error } = await client
    .from('blog_posts')
    .select(
      'title, slug, summary, meta_title, meta_description, featured_image_url, author_name, published_at, updated_at',
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('generate-feeds: Supabase query failed:', error.message)
    process.exit(1)
  }

  const posts = (data ?? []) as FeedPost[]
  console.log(`generate-feeds: ${posts.length} published post(s) found`)

  writeFileSync(rssPath, buildRssFeed(posts), 'utf8')
  writeFileSync(sitemapPath, buildSitemap(posts), 'utf8')

  console.log(`generate-feeds: wrote ${rssPath}`)
  console.log(`generate-feeds: wrote ${sitemapPath}`)

  const indexTemplatePath = resolve(distDir, 'index.html')
  if (!existsSync(indexTemplatePath)) {
    console.error('generate-feeds: dist/index.html not found')
    process.exit(1)
  }
  const indexTemplate = readFileSync(indexTemplatePath, 'utf8')

  for (const post of posts) {
    const meta = resolveBlogPostOgMeta(post)
    const html = injectBlogPostHeadTags(indexTemplate, meta)
    const postDir = resolve(rssDir, post.slug)
    mkdirSync(postDir, { recursive: true })
    const postHtmlPath = resolve(postDir, 'index.html')
    writeFileSync(postHtmlPath, html, 'utf8')
    console.log(`generate-feeds: wrote ${postHtmlPath}`)
  }
}

run().catch((err) => {
  console.error('generate-feeds:', err)
  process.exit(1)
})
