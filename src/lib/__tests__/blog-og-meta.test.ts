import { describe, expect, it } from 'vitest'
import {
  buildBlogPostHeadTags,
  buildFaqPageJsonLd,
  escapeHtmlAttr,
  injectBlogPostHeadTags,
  resolveBlogPostOgMeta,
  type BlogPostOgInput,
} from '@/lib/blog-og-meta'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site'

const samplePost = (overrides: Partial<BlogPostOgInput> = {}): BlogPostOgInput => ({
  slug: 'test-post',
  title: 'Post Title',
  meta_title: 'Meta Title',
  meta_description: 'Meta description for social sharing.',
  summary: 'Summary fallback',
  featured_image_url:
    'https://example.supabase.co/storage/v1/object/public/blog-images/hero.jpg',
  author_name: 'EnRollify',
  published_at: '2026-06-01T10:00:00.000Z',
  updated_at: '2026-06-02T10:00:00.000Z',
  ...overrides,
})

describe('escapeHtmlAttr', () => {
  it('escapes quotes and ampersands in attribute values', () => {
    expect(escapeHtmlAttr('Say "hello" & goodbye')).toBe('Say &quot;hello&quot; &amp; goodbye')
  })
})

describe('resolveBlogPostOgMeta', () => {
  it('uses meta_title over title for OG title', () => {
    const meta = resolveBlogPostOgMeta(samplePost())
    expect(meta.title).toBe('Meta Title')
    expect(meta.pageTitle).toBe(`Meta Title | ${SITE_NAME}`)
  })

  it('falls back to title when meta_title is empty', () => {
    const meta = resolveBlogPostOgMeta(samplePost({ meta_title: '' }))
    expect(meta.title).toBe('Post Title')
  })

  it('uses meta_description over summary', () => {
    const meta = resolveBlogPostOgMeta(samplePost())
    expect(meta.description).toBe('Meta description for social sharing.')
  })

  it('falls back to summary when meta_description is empty', () => {
    const meta = resolveBlogPostOgMeta(
      samplePost({ meta_description: '', summary: 'Summary fallback' }),
    )
    expect(meta.description).toBe('Summary fallback')
  })

  it('uses absolute featured image URL when provided', () => {
    const meta = resolveBlogPostOgMeta(samplePost())
    expect(meta.image).toBe(
      'https://example.supabase.co/storage/v1/object/public/blog-images/hero.jpg',
    )
  })

  it('falls back to default OG image as absolute URL', () => {
    const meta = resolveBlogPostOgMeta(samplePost({ featured_image_url: null }))
    expect(meta.image).toBe(DEFAULT_OG_IMAGE)
  })

  it('resolves relative featured image to absolute URL', () => {
    const meta = resolveBlogPostOgMeta(
      samplePost({ featured_image_url: '/lovable-uploads/hero.png' }),
    )
    expect(meta.image).toBe(`${SITE_URL}/lovable-uploads/hero.png`)
  })

  it('builds canonical post URL', () => {
    const meta = resolveBlogPostOgMeta(samplePost({ slug: 'my-slug' }))
    expect(meta.url).toBe(`${SITE_URL}/blog/my-slug`)
  })
})

describe('buildFaqPageJsonLd', () => {
  it('builds FAQPage schema with Question and Answer entities', () => {
    const jsonLd = buildFaqPageJsonLd([
      { question: 'What is X?', answer: 'X is an example.' },
      { question: 'Why use it?', answer: 'Because it helps.' },
    ])

    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is X?',
          acceptedAnswer: { '@type': 'Answer', text: 'X is an example.' },
        },
        {
          '@type': 'Question',
          name: 'Why use it?',
          acceptedAnswer: { '@type': 'Answer', text: 'Because it helps.' },
        },
      ],
    })
  })
})

describe('buildBlogPostHeadTags', () => {
  it('includes OG and Twitter tags with escaped description', () => {
    const meta = resolveBlogPostOgMeta(
      samplePost({ meta_description: 'Learn "best practices" & more' }),
    )
    const html = buildBlogPostHeadTags(meta)

    expect(html).toContain('<meta property="og:title" content="Meta Title" />')
    expect(html).toContain(
      '<meta property="og:description" content="Learn &quot;best practices&quot; &amp; more" />',
    )
    expect(html).toContain('<meta property="og:type" content="article" />')
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
    expect(html).toContain('<meta name="twitter:image"')
    expect(html).toContain('application/ld+json')
  })
})

describe('injectBlogPostHeadTags', () => {
  it('replaces title and injects OG tags into HTML shell', () => {
    const shell = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>EnRollifyEdu</title>
  </head>
  <body><div id="root"></div></body>
</html>`

    const meta = resolveBlogPostOgMeta(samplePost())
    const result = injectBlogPostHeadTags(shell, meta)

    expect(result).not.toContain('<title>EnRollifyEdu</title>')
    expect(result).toContain(`<title>Meta Title | ${SITE_NAME}</title>`)
    expect(result).toContain('property="og:image"')
    expect(result).toContain(`${SITE_URL}/blog/test-post`)
  })
})
