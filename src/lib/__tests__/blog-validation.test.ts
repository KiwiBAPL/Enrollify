import { describe, expect, it } from 'vitest'
import { validateDraftSave, validatePublish } from '@/lib/blog-validation'

describe('validateDraftSave', () => {
  it('accepts valid title and slug', () => {
    expect(
      validateDraftSave({ title: 'Hello', slug: 'hello-world', article_template: 'classic' }),
    ).toEqual([])
  })

  it('rejects empty title', () => {
    const issues = validateDraftSave({
      title: '',
      slug: 'valid-slug',
      article_template: 'classic',
    })
    expect(issues.some((i) => i.field === 'title')).toBe(true)
  })

  it('rejects invalid slug format', () => {
    const issues = validateDraftSave({
      title: 'Hello',
      slug: 'Hello World',
      article_template: 'classic',
    })
    expect(issues.some((i) => i.field === 'slug')).toBe(true)
  })

  it('rejects uppercase slug', () => {
    const issues = validateDraftSave({
      title: 'Hello',
      slug: 'Hello-World',
      article_template: 'classic',
    })
    expect(issues.length).toBeGreaterThan(0)
  })

  it('rejects unknown article template', () => {
    const issues = validateDraftSave({
      title: 'Hello',
      slug: 'hello',
      article_template: 'unknown-layout',
    })
    expect(issues.some((i) => i.field === 'article_template')).toBe(true)
  })
})

describe('validatePublish', () => {
  const validBase = {
    title: 'Title',
    slug: 'title',
    meta_title: 'Meta',
    meta_description: 'Description',
    category: 'Strategy',
    body: '<p>Content</p>',
    featured_image_url: null,
    featured_image_alt: null,
    article_template: 'classic',
  }

  it('passes with required fields only', () => {
    expect(validatePublish(validBase)).toEqual([])
  })

  it('requires meta_title and meta_description', () => {
    const issues = validatePublish({
      ...validBase,
      meta_title: '',
      meta_description: '  ',
    })
    expect(issues.map((i) => i.field)).toContain('meta_title')
    expect(issues.map((i) => i.field)).toContain('meta_description')
  })

  it('requires featured image alt when image is set', () => {
    const issues = validatePublish({
      ...validBase,
      featured_image_url: 'https://example.com/img.jpg',
      featured_image_alt: '',
    })
    expect(issues.some((i) => i.field === 'featured_image_alt')).toBe(true)
  })

  it('detects inline images missing alt text', () => {
    const issues = validatePublish({
      ...validBase,
      body: '<p>Text</p><img src="/img.jpg" />',
    })
    expect(issues.some((i) => i.message.includes('missing alt text'))).toBe(true)
  })

  it('allows inline images with alt text', () => {
    const issues = validatePublish({
      ...validBase,
      body: '<p>Text</p><img src="/img.jpg" alt="Diagram" />',
    })
    expect(issues.filter((i) => i.field === 'body')).toEqual([])
  })

  it('rejects unknown article template', () => {
    const issues = validatePublish({
      ...validBase,
      article_template: 'unknown-layout',
    })
    expect(issues.some((i) => i.field === 'article_template')).toBe(true)
  })
})
