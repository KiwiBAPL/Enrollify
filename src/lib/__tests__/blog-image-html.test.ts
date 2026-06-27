import { describe, expect, it } from 'vitest'
import {
  buildBlogInlineImageHtml,
  clampPadding,
  clampWidth,
  normalizeImageLinkUrl,
  parseBlogInlineImageFromHtml,
  parseLegacyInlineImageFromElement,
} from '@/lib/blog-image-html'
import { sanitizeBlogHtml } from '@/lib/sanitize'

describe('buildBlogInlineImageHtml', () => {
  it('builds below-aligned figure with data attributes', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'A chart',
      align: 'below',
      width: 80,
      padding: 12,
    })

    expect(html).toContain('class="blog-inline-image blog-inline-image--below"')
    expect(html).toContain('data-width="80"')
    expect(html).toContain('data-padding="12"')
    expect(html).toContain('src="https://example.com/photo.jpg"')
    expect(html).toContain('alt="A chart"')
  })

  it('builds left-aligned figure', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Photo',
      align: 'left',
      width: 45,
      padding: 8,
    })

    expect(html).toContain('blog-inline-image--left')
  })

  it('builds right-aligned figure', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Photo',
      align: 'right',
      width: 50,
      padding: 16,
    })

    expect(html).toContain('blog-inline-image--right')
  })

  it('escapes quotes in alt and url', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/a"b.jpg',
      alt: 'Say "hello"',
      align: 'below',
      width: 100,
      padding: 0,
    })

    expect(html).toContain('&quot;')
    expect(html).not.toContain('alt="Say "hello""')
  })

  it('wraps image in anchor when linkUrl is set', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Linked photo',
      align: 'below',
      width: 100,
      padding: 16,
      linkUrl: 'https://example.com/page',
    })

    expect(html).toContain(
      '<a href="https://example.com/page" target="_blank" rel="noopener noreferrer">',
    )
    expect(html).toContain('src="https://example.com/photo.jpg"')
  })

  it('omits anchor when linkUrl is empty', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Plain photo',
      align: 'below',
      width: 100,
      padding: 16,
      linkUrl: '',
    })

    expect(html).not.toContain('<a ')
  })
})

describe('clampWidth and clampPadding', () => {
  it('clamps width to 25–100', () => {
    expect(clampWidth(10)).toBe(25)
    expect(clampWidth(150)).toBe(100)
    expect(clampWidth(50)).toBe(50)
  })

  it('clamps padding to 0–48', () => {
    expect(clampPadding(-5)).toBe(0)
    expect(clampPadding(100)).toBe(48)
    expect(clampPadding(16)).toBe(16)
  })
})

describe('normalizeImageLinkUrl', () => {
  it('accepts empty link as no link', () => {
    expect(normalizeImageLinkUrl('')).toEqual({ ok: true, url: '' })
    expect(normalizeImageLinkUrl('   ')).toEqual({ ok: true, url: '' })
  })

  it('accepts https links', () => {
    expect(normalizeImageLinkUrl('https://example.com/page')).toEqual({
      ok: true,
      url: 'https://example.com/page',
    })
  })

  it('rejects javascript links', () => {
    const result = normalizeImageLinkUrl('javascript:alert(1)')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('http')
    }
  })

  it('rejects invalid URLs', () => {
    const result = normalizeImageLinkUrl('not-a-url')
    expect(result.ok).toBe(false)
  })
})

describe('parseBlogInlineImageFromHtml', () => {
  it('parses figure html back to options', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Diagram',
      align: 'left',
      width: 40,
      padding: 20,
    })

    const parsed = parseBlogInlineImageFromHtml(html)
    expect(parsed).toEqual({
      url: 'https://example.com/photo.jpg',
      alt: 'Diagram',
      align: 'left',
      width: 40,
      padding: 20,
      linkUrl: '',
    })
  })

  it('parses linked figure html back to options', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Linked diagram',
      align: 'right',
      width: 50,
      padding: 12,
      linkUrl: 'https://example.com/destination',
    })

    const parsed = parseBlogInlineImageFromHtml(html)
    expect(parsed).toEqual({
      url: 'https://example.com/photo.jpg',
      alt: 'Linked diagram',
      align: 'right',
      width: 50,
      padding: 12,
      linkUrl: 'https://example.com/destination',
    })
  })
})

describe('parseLegacyInlineImageFromElement', () => {
  it('parses plain img elements with defaults', () => {
    const img = document.createElement('img')
    img.src = 'https://example.com/legacy.jpg'
    img.alt = 'Legacy diagram'

    expect(parseLegacyInlineImageFromElement(img)).toEqual({
      url: 'https://example.com/legacy.jpg',
      alt: 'Legacy diagram',
      align: 'below',
      width: 100,
      padding: 16,
      linkUrl: '',
    })
  })
})

describe('sanitizeBlogHtml with inline images', () => {
  it('preserves figure with blog-inline-image classes and data attrs', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Safe image',
      align: 'right',
      width: 60,
      padding: 10,
    })

    const result = sanitizeBlogHtml(html)
    expect(result).toContain('<figure')
    expect(result).toContain('blog-inline-image--right')
    expect(result).toContain('data-width="60"')
    expect(result).toContain('data-padding="10"')
    expect(result).toContain('alt="Safe image"')
  })

  it('strips disallowed classes from figure', () => {
    const html =
      '<figure class="blog-inline-image blog-inline-image--left evil-class" data-width="50" data-padding="8"><img src="https://example.com/x.jpg" alt="Test" /></figure>'

    const result = sanitizeBlogHtml(html)
    expect(result).toContain('blog-inline-image--left')
    expect(result).not.toContain('evil-class')
  })

  it('still removes script tags', () => {
    const result = sanitizeBlogHtml(
      '<figure class="blog-inline-image"><script>alert(1)</script><img src="x" alt="y" /></figure>',
    )
    expect(result).not.toContain('<script')
  })

  it('preserves linked inline image anchor', () => {
    const html = buildBlogInlineImageHtml({
      url: 'https://example.com/photo.jpg',
      alt: 'Linked image',
      align: 'below',
      width: 100,
      padding: 16,
      linkUrl: 'https://example.com/page',
    })

    const result = sanitizeBlogHtml(html)
    expect(result).toContain('<a href="https://example.com/page"')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noopener noreferrer"')
  })
})
