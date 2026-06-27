import { isKnownArticleTemplate } from '@/components/blog/templates/registry'
import type { BlogPost } from '@/types/database'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export interface PublishValidationInput {
  title: string
  slug: string
  meta_title: string
  meta_description: string
  category: string
  body: string
  featured_image_url: string | null
  featured_image_alt: string | null
  article_template: string
  summary?: string | null
}

export interface ValidationIssue {
  field: string
  message: string
}

function findImagesMissingAlt(html: string): string[] {
  const issues: string[] = []
  const imgRegex = /<img[^>]*>/gi
  const matches = html.match(imgRegex) ?? []

  matches.forEach((tag, index) => {
    const altMatch = tag.match(/alt=["']([^"']*)["']/i)
    const alt = altMatch?.[1]?.trim()
    if (!alt) {
      issues.push(`Inline image ${index + 1} is missing alt text`)
    }
  })

  return issues
}

function validateArticleTemplate(article_template: string): ValidationIssue[] {
  if (isKnownArticleTemplate(article_template)) return []
  return [{ field: 'article_template', message: 'Unknown article layout' }]
}

export function validateDraftSave(input: {
  title: string
  slug: string
  article_template: string
}): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!input.title.trim()) {
    issues.push({ field: 'title', message: 'Title is required' })
  }
  if (!input.slug.trim()) {
    issues.push({ field: 'slug', message: 'Slug is required' })
  } else if (!SLUG_REGEX.test(input.slug.trim())) {
    issues.push({
      field: 'slug',
      message: 'Slug must be lowercase letters, numbers, and hyphens',
    })
  }

  return [...issues, ...validateArticleTemplate(input.article_template)]
}

export function validatePublish(input: PublishValidationInput): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!input.title.trim()) issues.push({ field: 'title', message: 'Title is required' })
  if (!input.slug.trim()) issues.push({ field: 'slug', message: 'Slug is required' })
  if (!input.meta_title.trim())
    issues.push({ field: 'meta_title', message: 'Meta title is required' })
  if (!input.meta_description.trim())
    issues.push({ field: 'meta_description', message: 'Meta description is required' })
  if (!input.category.trim()) issues.push({ field: 'category', message: 'Category is required' })

  if (input.featured_image_url && !input.featured_image_alt?.trim()) {
    issues.push({
      field: 'featured_image_alt',
      message: 'Featured image alt text is required',
    })
  }

  findImagesMissingAlt(input.body).forEach((msg) => {
    issues.push({ field: 'body', message: msg })
  })

  issues.push(...validateArticleTemplate(input.article_template))

  return issues
}

export function postToPublishInput(post: BlogPost): PublishValidationInput {
  return {
    title: post.title,
    slug: post.slug,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    category: post.category,
    body: post.body,
    featured_image_url: post.featured_image_url,
    featured_image_alt: post.featured_image_alt,
    article_template: post.article_template,
    summary: post.summary,
  }
}
