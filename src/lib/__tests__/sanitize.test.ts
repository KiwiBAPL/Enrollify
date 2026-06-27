import { describe, expect, it } from 'vitest'
import { sanitizeBlogHtml } from '@/lib/sanitize'

describe('sanitizeBlogHtml', () => {
  it('removes script tags', () => {
    const result = sanitizeBlogHtml('<p>Safe</p><script>alert("x")</script>')
    expect(result).not.toContain('<script')
    expect(result).toContain('<p>Safe</p>')
  })

  it('preserves allowed tags', () => {
    const html = '<h2>Heading</h2><p>Paragraph with <strong>bold</strong></p>'
    expect(sanitizeBlogHtml(html)).toContain('<h2>')
    expect(sanitizeBlogHtml(html)).toContain('<strong>')
  })

  it('strips event handler attributes', () => {
    const result = sanitizeBlogHtml('<p onclick="evil()">Click</p>')
    expect(result).not.toContain('onclick')
    expect(result).toContain('<p>')
  })

  it('allows iframe for embeds', () => {
    const html =
      '<div class="blog-embed"><iframe src="https://youtube.com/embed/x" title="Video"></iframe></div>'
    const result = sanitizeBlogHtml(html)
    expect(result).toContain('<iframe')
    expect(result).toContain('youtube.com')
  })

  it('allows inline image figures', () => {
    const html =
      '<figure class="blog-inline-image blog-inline-image--below" data-width="100" data-padding="16"><img src="https://example.com/a.jpg" alt="Photo" /></figure>'
    const result = sanitizeBlogHtml(html)
    expect(result).toContain('<figure')
    expect(result).toContain('blog-inline-image--below')
    expect(result).toContain('data-width="100"')
  })

  it('allows anchor inside inline image figures', () => {
    const html =
      '<figure class="blog-inline-image blog-inline-image--below" data-width="100" data-padding="16"><a href="https://example.com/page" target="_blank" rel="noopener noreferrer"><img src="https://example.com/a.jpg" alt="Photo" /></a></figure>'
    const result = sanitizeBlogHtml(html)
    expect(result).toContain('<a href="https://example.com/page"')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it('preserves text alignment classes on paragraphs', () => {
    const html =
      '<p class="ql-align-right">Right aligned</p><p class="ql-align-justify">Justified</p>'
    const result = sanitizeBlogHtml(html)
    expect(result).toContain('class="ql-align-right"')
    expect(result).toContain('class="ql-align-justify"')
  })

  it('strips unknown classes from paragraphs', () => {
    const result = sanitizeBlogHtml('<p class="ql-align-right evil">Text</p>')
    expect(result).toContain('ql-align-right')
    expect(result).not.toContain('evil')
  })
})
