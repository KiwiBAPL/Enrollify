import { describe, expect, it } from 'vitest'
import type { BlogPost } from '@/types/database'
import {
  applyBlogListingFilters,
  extractHeadingsFromHtml,
  getFeaturedPosts,
  searchPosts,
  sortPosts,
} from '@/lib/blog-search'

const basePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: '1',
  title: 'Artificial intelligence in business',
  slug: 'ai-in-business',
  body: '<h2>Machine learning basics</h2><p>Content</p><h3>Data strategy</h3>',
  summary: 'How AI transforms enterprise operations',
  status: 'published',
  category: 'Business Analysis and AI',
  series_collection: null,
  featured_image_url: null,
  featured_image_alt: null,
  meta_title: 'AI in business',
  meta_description: 'Meta',
  author_name: 'EnRollify',
  article_template: 'classic',
  related_post_slugs: [],
  is_featured: false,
  faq_text: null,
  published_at: '2026-06-08T10:00:00.000Z',
  created_at: '2026-06-01T10:00:00.000Z',
  updated_at: '2026-06-08T10:00:00.000Z',
  ...overrides,
})

describe('extractHeadingsFromHtml', () => {
  it('extracts h2, h3, and h4 text', () => {
    const html = '<h2>First heading</h2><p>x</p><h3>Second heading</h3><h4>Third</h4>'
    expect(extractHeadingsFromHtml(html)).toBe('First heading Second heading Third')
  })

  it('strips nested tags from headings', () => {
    expect(extractHeadingsFromHtml('<h2><strong>Bold</strong> title</h2>')).toBe('Bold title')
  })
})

describe('searchPosts', () => {
  const posts = [
    basePost(),
    basePost({
      id: '2',
      title: 'Digital transformation guide',
      slug: 'digital-transformation',
      summary: 'Modernising legacy systems',
      body: '<h2>Cloud migration</h2>',
    }),
  ]

  it('returns all posts for empty query', () => {
    expect(searchPosts(posts, '')).toHaveLength(2)
    expect(searchPosts(posts, '   ')).toHaveLength(2)
  })

  it('matches title with fuzzy tolerance', () => {
    const results = searchPosts(posts, 'inteligence')
    expect(results[0]?.title).toBe('Artificial intelligence in business')
  })

  it('matches summary and headings', () => {
    expect(searchPosts(posts, 'machine learning')).toHaveLength(1)
    expect(searchPosts(posts, 'cloud migration')).toHaveLength(1)
  })

  it('ranks title matches above heading-only matches', () => {
    const mixed = [
      basePost({
        id: 'a',
        title: 'Unrelated topic',
        body: '<h2>Artificial intelligence overview</h2>',
      }),
      basePost({ id: 'b', title: 'Artificial intelligence in business' }),
    ]
    const results = searchPosts(mixed, 'artificial intelligence')
    expect(results[0]?.id).toBe('b')
  })
})

describe('sortPosts', () => {
  const posts = [
    basePost({
      id: '1',
      title: 'B post',
      published_at: '2026-06-01T10:00:00.000Z',
    }),
    basePost({
      id: '2',
      title: 'A post',
      published_at: '2026-06-08T10:00:00.000Z',
    }),
  ]

  it('sorts by newest by default', () => {
    expect(sortPosts(posts)[0]?.id).toBe('2')
  })

  it('sorts by oldest', () => {
    expect(sortPosts(posts, 'oldest')[0]?.id).toBe('1')
  })

  it('sorts by title', () => {
    expect(sortPosts(posts, 'title')[0]?.title).toBe('A post')
  })
})

describe('getFeaturedPosts', () => {
  it('returns only featured published posts up to limit', () => {
    const posts = [
      basePost({ id: '1', is_featured: true }),
      basePost({ id: '2', is_featured: false }),
      basePost({
        id: '3',
        is_featured: true,
        published_at: '2026-06-07T10:00:00.000Z',
      }),
    ]
    const featured = getFeaturedPosts(posts, 5)
    expect(featured).toHaveLength(2)
    expect(featured[0]?.id).toBe('1')
  })
})

describe('applyBlogListingFilters', () => {
  const posts = [
    basePost({ id: '1', category: 'AI', series_collection: 'Series A' }),
    basePost({
      id: '2',
      title: 'Other',
      category: 'Strategy',
      series_collection: null,
    }),
  ]

  it('filters by category and series', () => {
    expect(applyBlogListingFilters(posts, { category: 'AI' })).toHaveLength(1)
    expect(applyBlogListingFilters(posts, { series: 'Series A' })).toHaveLength(1)
  })

  it('searches with relevance ordering', () => {
    const results = applyBlogListingFilters(posts, { search: 'artificial' })
    expect(results).toHaveLength(1)
    expect(results[0]?.id).toBe('1')
  })
})
