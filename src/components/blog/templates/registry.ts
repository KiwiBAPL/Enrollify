import { ClassicArticleTemplate } from './classic/ClassicArticleTemplate'
import type {
  BlogArticleTemplateComponent,
  BlogArticleTemplateId,
} from './types'

export const DEFAULT_ARTICLE_TEMPLATE: BlogArticleTemplateId = 'classic'

export const ARTICLE_TEMPLATE_OPTIONS: {
  id: BlogArticleTemplateId
  label: string
}[] = [{ id: 'classic', label: 'Classic' }]

const BLOG_ARTICLE_TEMPLATES: Record<
  BlogArticleTemplateId,
  BlogArticleTemplateComponent
> = {
  classic: ClassicArticleTemplate,
}

export function isKnownArticleTemplate(id: string): id is BlogArticleTemplateId {
  return id in BLOG_ARTICLE_TEMPLATES
}

export function getArticleTemplate(
  id?: string | null,
): BlogArticleTemplateComponent {
  if (id && isKnownArticleTemplate(id)) {
    return BLOG_ARTICLE_TEMPLATES[id]
  }
  return BLOG_ARTICLE_TEMPLATES[DEFAULT_ARTICLE_TEMPLATE]
}

export function getArticleTemplateLabel(id: string): string {
  return ARTICLE_TEMPLATE_OPTIONS.find((option) => option.id === id)?.label ?? id
}
