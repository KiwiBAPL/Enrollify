import type { ComponentType } from 'react'
import type { BlogPost } from '@/types/database'

export type BlogArticleTemplateId = 'classic'

export interface BlogArticleTemplateProps {
  post: BlogPost
  related: BlogPost[]
  readTime: string
  preview?: boolean
}

export type BlogArticleTemplateComponent = ComponentType<BlogArticleTemplateProps>
