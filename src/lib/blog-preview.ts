import type { BlogPostFormValues } from '@/components/admin/blog/BlogPostForm'
import { DEFAULT_ARTICLE_TEMPLATE } from '@/components/blog/templates/registry'
import { DEFAULT_AUTHOR_NAME } from '@/lib/site'
import type { BlogPost } from '@/types/database'

const PREVIEW_POST_ID = '00000000-0000-0000-0000-000000000000'

export function formValuesToPreviewPost(
  values: BlogPostFormValues,
  authorName?: string,
): BlogPost {
  const now = new Date().toISOString()

  return {
    id: PREVIEW_POST_ID,
    title: values.title.trim() || 'Post title',
    slug: values.slug.trim() || 'preview',
    body: values.body,
    summary: values.summary.trim() || null,
    status: 'draft',
    category: values.category.trim(),
    series_collection: values.series_collection.trim() || null,
    featured_image_url: values.featured_image_url.trim() || null,
    featured_image_alt: values.featured_image_alt.trim() || null,
    meta_title: values.meta_title.trim() || values.title.trim() || 'Post title',
    meta_description: values.meta_description.trim(),
    author_name: authorName?.trim() || DEFAULT_AUTHOR_NAME,
    article_template: values.article_template ?? DEFAULT_ARTICLE_TEMPLATE,
    related_post_slugs: values.related_post_slugs ?? [],
    is_featured: false,
    faq_text: values.faq_text.trim() || null,
    published_at: now,
    created_at: now,
    updated_at: now,
  }
}
