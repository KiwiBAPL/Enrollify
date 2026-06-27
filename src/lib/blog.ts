import { prepareFeaturedImage } from '@/lib/featured-image-process'
import { getSupabase } from '@/lib/supabase'
import { DEFAULT_AUTHOR_NAME } from '@/lib/site'
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types/database'

export const BLOG_IMAGES_BUCKET = 'blog-images'
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export type BlogQueryError = {
  message: string
  code?: string
}

export type BlogResult<T> = {
  data: T | null
  error: BlogQueryError | null
}

function supabase() {
  return getSupabase()
}

function asBlogPost(data: unknown): BlogPost | null {
  return (data as BlogPost | null) ?? null
}

function asBlogPosts(data: unknown): BlogPost[] {
  return (data as BlogPost[] | null) ?? []
}

function asCategoryRows(data: unknown): { category: string }[] {
  return (data as { category: string }[] | null) ?? []
}

export interface PublishedPostsFilter {
  category?: string
  series?: string
}

export async function getPublishedPosts(
  filters: PublishedPostsFilter = {},
): Promise<BlogResult<BlogPost[]>> {
  let query = supabase()
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.series) {
    query = query.eq('series_collection', filters.series)
  }

  const { data, error } = await query
  return { data: (data as BlogPost[] | null) ?? null, error: toBlogError(error) }
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogResult<BlogPost>> {
  const { data, error } = await supabase()
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  return { data: asBlogPost(data), error: toBlogError(error) }
}

export async function getRelatedPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogResult<BlogPost[]>> {
  const curatedSlugs = (post.related_post_slugs ?? []).filter(
    (slug) => slug && slug !== post.slug,
  )

  if (curatedSlugs.length > 0) {
    const { data, error } = await supabase()
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .in('slug', curatedSlugs)

    if (error) return { data: null, error: toBlogError(error) }

    const rows = asBlogPosts(data)
    const bySlug = new Map(rows.map((row) => [row.slug, row]))
    const ordered = curatedSlugs
      .map((slug) => bySlug.get(slug))
      .filter((row): row is BlogPost => Boolean(row))

    return { data: ordered, error: null }
  }

  const related: BlogPost[] = []
  const excludeIds = new Set([post.id])

  if (post.series_collection) {
    const { data, error } = await supabase()
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('series_collection', post.series_collection)
      .neq('id', post.id)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit)

    if (error) return { data: null, error: toBlogError(error) }
    for (const row of asBlogPosts(data)) {
      if (related.length >= limit) break
      related.push(row)
      excludeIds.add(row.id)
    }
  }

  if (related.length < limit && post.category) {
    const remaining = limit - related.length
    const { data, error } = await supabase()
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('category', post.category)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(remaining)

    if (error) return { data: null, error: toBlogError(error) }

    for (const row of asBlogPosts(data)) {
      if (related.length >= limit) break
      if (!excludeIds.has(row.id)) {
        related.push(row)
      }
    }
  }

  return { data: related, error: null }
}

export async function getDistinctCategories(): Promise<BlogResult<string[]>> {
  const { data, error } = await supabase()
    .from('blog_posts')
    .select('category')
    .neq('category', '')
    .order('category')

  if (error) return { data: null, error: toBlogError(error) }

  const unique = Array.from(
    new Set(asCategoryRows(data).map((row) => row.category).filter(Boolean)),
  )
  return { data: unique, error: null }
}

export async function getPostsForRss(): Promise<BlogResult<BlogPost[]>> {
  const { data, error } = await supabase()
    .from('blog_posts')
    .select(
      'id, title, slug, summary, meta_description, featured_image_url, author_name, published_at, category',
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })

  return { data: (data as BlogPost[] | null) ?? null, error: toBlogError(error) }
}

export interface AdminPostsFilter {
  status?: BlogPost['status']
  search?: string
}

export async function listAllPosts(
  filters: AdminPostsFilter = {},
): Promise<BlogResult<BlogPost[]>> {
  let query = supabase()
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.search?.trim()) {
    query = query.ilike('title', `%${filters.search.trim()}%`)
  }

  const { data, error } = await query
  return { data: (data as BlogPost[] | null) ?? null, error: toBlogError(error) }
}

export async function getPostById(id: string): Promise<BlogResult<BlogPost>> {
  const { data, error } = await supabase()
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  return { data: asBlogPost(data), error: toBlogError(error) }
}

export async function createPost(input: BlogPostInsert): Promise<BlogResult<BlogPost>> {
  const { data, error } = await supabase()
    .from('blog_posts')
    .insert({
      ...input,
      status: input.status ?? 'draft',
      author_name: input.author_name ?? DEFAULT_AUTHOR_NAME,
    })
    .select()
    .single()

  return { data: asBlogPost(data), error: toBlogError(error) }
}

export async function updatePost(
  id: string,
  input: BlogPostUpdate,
): Promise<BlogResult<BlogPost>> {
  const { data, error } = await supabase()
    .from('blog_posts')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  return { data: asBlogPost(data), error: toBlogError(error) }
}

export async function deletePost(id: string): Promise<BlogResult<null>> {
  const { error } = await supabase().from('blog_posts').delete().eq('id', id)
  return { data: null, error: toBlogError(error) }
}

export async function publishPost(id: string): Promise<BlogResult<BlogPost>> {
  const { data, error } = await supabase()
    .from('blog_posts')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  return { data: asBlogPost(data), error: toBlogError(error) }
}

export async function isSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<BlogResult<boolean>> {
  let query = supabase().from('blog_posts').select('id').eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query
  if (error) return { data: null, error: toBlogError(error) }
  return { data: (data ?? []).length === 0, error: null }
}

function validateImageFile(file: File): BlogQueryError | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { message: 'Image must be JPEG, PNG, or WebP.' }
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { message: 'Image must be 2 MB or smaller.' }
  }
  return null
}

async function uploadBlogImageFile(
  postId: string,
  file: File,
  pathPrefix: string,
): Promise<BlogResult<string>> {
  const validationError = validateImageFile(file)
  if (validationError) {
    return { data: null, error: validationError }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = pathPrefix
    ? `${postId}/${pathPrefix}/${Date.now()}-${safeName}`
    : `${postId}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase()
    .storage.from(BLOG_IMAGES_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type })

  if (uploadError) {
    return { data: null, error: toBlogError(uploadError) }
  }

  const { data: urlData } = supabase().storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(path)

  return { data: urlData.publicUrl, error: null }
}

export async function uploadFeaturedImage(
  postId: string,
  file: File,
): Promise<BlogResult<string>> {
  const { file: processedFile, error: processError } = await prepareFeaturedImage(file)
  if (processError) {
    return { data: null, error: processError }
  }
  return uploadBlogImageFile(postId, processedFile, '')
}

export async function uploadBodyImage(postId: string, file: File): Promise<BlogResult<string>> {
  return uploadBlogImageFile(postId, file, 'inline')
}

const BLOG_IMAGE_PUBLIC_PATH_PREFIX = `/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/`

export function extractBlogImageStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl)
    const prefixIndex = url.pathname.indexOf(BLOG_IMAGE_PUBLIC_PATH_PREFIX)
    if (prefixIndex === -1) return null

    const path = decodeURIComponent(
      url.pathname.slice(prefixIndex + BLOG_IMAGE_PUBLIC_PATH_PREFIX.length),
    )
    return path || null
  } catch {
    return null
  }
}

export function inlineBodyImagePathForPost(postId: string, imageUrl: string): string | null {
  const path = extractBlogImageStoragePath(imageUrl)
  if (!path) return null

  const expectedPrefix = `${postId}/inline/`
  if (!path.startsWith(expectedPrefix)) return null

  return path
}

export async function deleteBodyImageIfOrphaned(
  postId: string,
  imageUrl: string,
  bodyHtml: string,
): Promise<BlogResult<void>> {
  if (bodyHtml.includes(imageUrl)) {
    return { data: null, error: null }
  }

  const path = inlineBodyImagePathForPost(postId, imageUrl)
  if (!path) {
    return { data: null, error: null }
  }

  const { error } = await supabase().storage.from(BLOG_IMAGES_BUCKET).remove([path])
  if (error) {
    return { data: null, error: toBlogError(error) }
  }

  return { data: null, error: null }
}

function toBlogError(error: { message: string; code?: string } | null): BlogQueryError | null {
  if (!error) return null
  return { message: error.message, code: error.code }
}
