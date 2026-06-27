import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BLOG_IMAGES_BUCKET,
  deleteBodyImageIfOrphaned,
  extractBlogImageStoragePath,
  inlineBodyImagePathForPost,
} from '@/lib/blog'
import { getSupabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
  getSupabase: vi.fn(),
  isSupabaseConfigured: true,
}))

describe('extractBlogImageStoragePath', () => {
  it('parses Supabase public blog-images URLs', () => {
    const url = `https://example.supabase.co/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/abc-123/inline/1739-photo.webp`
    expect(extractBlogImageStoragePath(url)).toBe('abc-123/inline/1739-photo.webp')
  })

  it('returns null for external URLs', () => {
    expect(extractBlogImageStoragePath('https://example.com/photo.jpg')).toBeNull()
  })

  it('returns null for invalid URLs', () => {
    expect(extractBlogImageStoragePath('not-a-url')).toBeNull()
  })
})

describe('inlineBodyImagePathForPost', () => {
  const postId = 'abc-123'
  const inlineUrl = `https://example.supabase.co/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/${postId}/inline/1739-photo.webp`
  const featuredUrl = `https://example.supabase.co/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/${postId}/1739-photo.webp`
  const otherPostUrl = `https://example.supabase.co/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/other-post/inline/1739-photo.webp`

  it('returns inline path for matching post uploads', () => {
    expect(inlineBodyImagePathForPost(postId, inlineUrl)).toBe(`${postId}/inline/1739-photo.webp`)
  })

  it('returns null for featured image paths', () => {
    expect(inlineBodyImagePathForPost(postId, featuredUrl)).toBeNull()
  })

  it('returns null for another post inline path', () => {
    expect(inlineBodyImagePathForPost(postId, otherPostUrl)).toBeNull()
  })

  it('returns null for external URLs', () => {
    expect(inlineBodyImagePathForPost(postId, 'https://example.com/photo.jpg')).toBeNull()
  })
})

describe('deleteBodyImageIfOrphaned', () => {
  const postId = 'abc-123'
  const imageUrl = `https://example.supabase.co/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/${postId}/inline/1739-photo.webp`
  const removeMock = vi.fn()

  beforeEach(() => {
    removeMock.mockReset()
    vi.mocked(getSupabase).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          remove: removeMock,
        })),
      },
    } as never)
  })

  it('skips storage delete when URL is still referenced in body HTML', async () => {
    const bodyHtml = `<figure><img src="${imageUrl}" /></figure><p>More text</p>`

    const result = await deleteBodyImageIfOrphaned(postId, imageUrl, bodyHtml)

    expect(result.error).toBeNull()
    expect(removeMock).not.toHaveBeenCalled()
  })

  it('skips storage delete for external URLs', async () => {
    const externalUrl = 'https://example.com/photo.jpg'

    const result = await deleteBodyImageIfOrphaned(postId, externalUrl, '<p>No image</p>')

    expect(result.error).toBeNull()
    expect(removeMock).not.toHaveBeenCalled()
  })

  it('deletes orphaned inline uploads from storage', async () => {
    removeMock.mockResolvedValue({ error: null })

    const result = await deleteBodyImageIfOrphaned(postId, imageUrl, '<p>Image removed</p>')

    expect(result.error).toBeNull()
    expect(getSupabase().storage.from).toHaveBeenCalledWith(BLOG_IMAGES_BUCKET)
    expect(removeMock).toHaveBeenCalledWith([`${postId}/inline/1739-photo.webp`])
  })

  it('returns an error when storage delete fails', async () => {
    removeMock.mockResolvedValue({ error: { message: 'Delete failed', code: '500' } })

    const result = await deleteBodyImageIfOrphaned(postId, imageUrl, '<p>Image removed</p>')

    expect(result.error?.message).toBe('Delete failed')
  })
})
