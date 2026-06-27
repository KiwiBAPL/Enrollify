import { describe, expect, it } from 'vitest'
import type { BlogPostFormValues } from '@/components/admin/blog/BlogPostForm'
import { formValuesToPreviewPost } from '@/lib/blog-preview'
import { DEFAULT_AUTHOR_NAME } from '@/lib/site'

const baseValues: BlogPostFormValues = {
  title: 'Test Title',
  slug: 'test-title',
  summary: 'A short summary',
  body: '<p>Hello world</p>',
  category: 'Strategy',
  series_collection: '',
  article_template: 'classic',
  meta_title: 'Meta Title',
  meta_description: 'Meta description',
  featured_image_url: '',
  featured_image_alt: '',
  related_post_slugs: [],
  faq_text: '',
}

describe('formValuesToPreviewPost', () => {
  it('uses explicit author name when provided', () => {
    const post = formValuesToPreviewPost(baseValues, 'Jack Smith')

    expect(post.author_name).toBe('Jack Smith')
  })

  it('maps form values to a synthetic BlogPost', () => {
    const post = formValuesToPreviewPost(baseValues)

    expect(post.title).toBe('Test Title')
    expect(post.slug).toBe('test-title')
    expect(post.summary).toBe('A short summary')
    expect(post.body).toBe('<p>Hello world</p>')
    expect(post.category).toBe('Strategy')
    expect(post.author_name).toBe(DEFAULT_AUTHOR_NAME)
    expect(post.article_template).toBe('classic')
    expect(post.status).toBe('draft')
    expect(post.published_at).toBeTruthy()
  })

  it('uses placeholders for empty title and slug', () => {
    const post = formValuesToPreviewPost({ ...baseValues, title: '', slug: '' })

    expect(post.title).toBe('Post title')
    expect(post.slug).toBe('preview')
  })

  it('maps null summary when empty', () => {
    const post = formValuesToPreviewPost({ ...baseValues, summary: '  ' })

    expect(post.summary).toBeNull()
  })
})
