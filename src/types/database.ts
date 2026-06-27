import type { BlogArticleTemplateId } from '@/components/blog/templates/types'

export type BlogPostStatus = 'draft' | 'published'

export interface BlogPost {
  id: string
  title: string
  slug: string
  body: string
  summary: string | null
  status: BlogPostStatus
  category: string
  series_collection: string | null
  featured_image_url: string | null
  featured_image_alt: string | null
  meta_title: string
  meta_description: string
  author_name: string
  article_template: BlogArticleTemplateId
  related_post_slugs: string[]
  is_featured: boolean
  faq_text: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export type BlogPostInsert = {
  title: string
  slug: string
  body?: string
  summary?: string | null
  status?: BlogPostStatus
  category?: string
  series_collection?: string | null
  featured_image_url?: string | null
  featured_image_alt?: string | null
  meta_title?: string
  meta_description?: string
  author_name?: string
  article_template?: BlogArticleTemplateId
  related_post_slugs?: string[]
  is_featured?: boolean
  faq_text?: string | null
  published_at?: string | null
}

export type BlogPostUpdate = Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPost
        Insert: BlogPostInsert & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: BlogPostUpdate
      }
      staff_profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
        }
        Update: {
          first_name?: string
          last_name?: string
          email?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
  }
}
