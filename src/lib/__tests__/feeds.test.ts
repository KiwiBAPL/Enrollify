import { describe, expect, it } from 'vitest'
import {
  buildRssFeed,
  buildSitemap,
  escapeXml,
  FEED_SITE_URL,
  SITEMAP_STATIC_ROUTES,
  type FeedPost,
} from '@/lib/feeds'

const samplePost = (overrides: Partial<FeedPost> = {}): FeedPost => ({
  title: 'Test Post',
  slug: 'test-post',
  summary: 'A summary',
  meta_title: 'Meta Title',
  meta_description: 'Meta desc',
  featured_image_url: '/img.jpg',
  author_name: 'EnRollify',
  published_at: '2026-06-01T10:00:00.000Z',
  updated_at: '2026-06-02T10:00:00.000Z',
  ...overrides,
})

describe('escapeXml', () => {
  it('escapes special characters', () => {
    expect(escapeXml('Tom & Jerry "quotes"')).toBe('Tom &amp; Jerry &quot;quotes&quot;')
  })
})

describe('buildRssFeed', () => {
  it('includes only provided posts in items', () => {
    const rss = buildRssFeed([samplePost()])
    expect(rss).toContain('<title>Test Post</title>')
    expect(rss).toContain(`${FEED_SITE_URL}/blog/test-post`)
    expect(rss).toContain('<description>A summary</description>')
    expect(rss).toContain('<author>EnRollify</author>')
  })

  it('XML-escapes ampersands in titles', () => {
    const rss = buildRssFeed([samplePost({ title: 'A & B' })])
    expect(rss).toContain('<title>A &amp; B</title>')
    expect(rss).not.toContain('<title>A & B</title>')
  })

  it('includes enclosure for featured image', () => {
    const rss = buildRssFeed([samplePost()])
    expect(rss).toContain('<enclosure')
    expect(rss).toContain(`${FEED_SITE_URL}/img.jpg`)
  })

  it('returns valid channel with no items when empty', () => {
    const rss = buildRssFeed([])
    expect(rss).toContain('<rss version="2.0"')
    expect(rss).not.toContain('<item>')
  })
})

describe('buildSitemap', () => {
  it('includes static routes', () => {
    const sitemap = buildSitemap([])
    for (const route of SITEMAP_STATIC_ROUTES) {
      const loc = route === '/' ? FEED_SITE_URL : `${FEED_SITE_URL}${route}`
      expect(sitemap).toContain(`<loc>${loc}</loc>`)
    }
  })

  it('includes published post URLs with lastmod', () => {
    const sitemap = buildSitemap([samplePost()])
    expect(sitemap).toContain(`${FEED_SITE_URL}/blog/test-post`)
    expect(sitemap).toContain('<lastmod>2026-06-02</lastmod>')
  })

  it('excludes admin routes', () => {
    const sitemap = buildSitemap([samplePost()])
    expect(sitemap).not.toContain('/enrollify-manage')
  })
})
