import { describe, expect, it } from 'vitest'
import { buildEmbedHtml, validateEmbedUrl } from '@/lib/embed-allowlist'

describe('validateEmbedUrl', () => {
  it('accepts YouTube watch URLs', () => {
    const result = validateEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    expect(result.valid).toBe(true)
    expect(result.provider).toBe('YouTube')
    expect(result.embedUrl).toContain('youtube.com/embed/')
  })

  it('accepts Vimeo URLs', () => {
    const result = validateEmbedUrl('https://vimeo.com/123456789')
    expect(result.valid).toBe(true)
    expect(result.provider).toBe('Vimeo')
  })

  it('accepts Spotify URLs', () => {
    const result = validateEmbedUrl('https://open.spotify.com/episode/abc123')
    expect(result.valid).toBe(true)
    expect(result.provider).toBe('Spotify')
  })

  it('rejects unknown providers', () => {
    const result = validateEmbedUrl('https://example.com/video')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('YouTube')
  })

  it('rejects invalid URL format', () => {
    const result = validateEmbedUrl('not-a-url')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Invalid URL')
  })

  it('rejects empty URL', () => {
    const result = validateEmbedUrl('   ')
    expect(result.valid).toBe(false)
  })
})

describe('buildEmbedHtml', () => {
  it('includes iframe with lazy loading', () => {
    const html = buildEmbedHtml('https://www.youtube.com/embed/abc')
    expect(html).toContain('src="https://www.youtube.com/embed/abc"')
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('blog-embed')
  })
})
