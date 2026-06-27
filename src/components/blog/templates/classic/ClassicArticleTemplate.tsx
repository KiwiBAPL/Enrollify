import { BlogBody } from '@/components/blog/BlogBody'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { ArticleAuthorAside } from '@/components/blog/article/ArticleAuthorAside'
import { ArticleFaqAside } from '@/components/blog/article/ArticleFaqAside'
import { ArticleEndCta } from '@/components/blog/article/ArticleEndCta'
import { ArticleFeaturedImage } from '@/components/blog/article/ArticleFeaturedImage'
import { ArticleGoBack } from '@/components/blog/article/ArticleGoBack'
import { ArticleMetadata } from '@/components/blog/article/ArticleMetadata'
import type { BlogArticleTemplateProps } from '@/components/blog/templates/types'

export function ClassicArticleTemplate({
  post,
  related,
  readTime,
  preview = false,
}: BlogArticleTemplateProps) {
  return (
    <article className="container mx-auto px-4 py-16 md:px-6">
      {!preview && <ArticleGoBack />}

      <header className="border-b border-gray-200 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <h1 className="mb-4 hyphens-none break-normal font-display text-4xl font-bold text-text-primary md:text-5xl">
              {post.title}
            </h1>
            {post.summary && (
              <p className="max-w-3xl font-body text-lg leading-relaxed text-text-muted">
                {post.summary}
              </p>
            )}
          </div>
          <ArticleMetadata post={post} readTime={readTime} />
        </div>
      </header>

      {post.featured_image_url && (
        <ArticleFeaturedImage
          url={post.featured_image_url}
          alt={post.featured_image_alt || post.title}
        />
      )}

      <section
        className={`grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12 ${
          post.featured_image_url ? 'pt-10' : 'border-b border-gray-200 py-10'
        }`}
        aria-label="Article content"
      >
        <div className="min-w-0 overflow-hidden">
          <BlogBody html={post.body} />
        </div>
        <div className="min-w-0 shrink-0 lg:w-[280px] lg:border-l lg:border-gray-200 lg:pl-8">
          <ArticleAuthorAside authorName={post.author_name} />
          <ArticleFaqAside faq={post.faq_text} />
        </div>
      </section>

      <ArticleEndCta />

      {!preview && (
        <>
          <div className="mt-8">
            <ShareButtons slug={post.slug} title={post.title} />
          </div>

          <RelatedPosts posts={related} />
        </>
      )}
    </article>
  )
}
