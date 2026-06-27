import { Link, useParams } from 'react-router-dom'
import { BlogMetaTags } from '@/components/blog/BlogMetaTags'
import { getArticleTemplate } from '@/components/blog/templates/registry'
import { usePublishedPost, useRelatedPosts } from '@/hooks/useBlog'
import { estimateReadTime, formatReadTime } from '@/lib/read-time'

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading } = usePublishedPost(slug ?? '')
  const { data: related = [] } = useRelatedPosts(post?.id ?? '', post ?? null)

  if (isLoading) {
    return (
      <div className="container py-16">
        <p className="font-body text-text-muted">Loading…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="mb-4 font-display text-3xl font-bold text-text-primary">Post not found</h1>
        <p className="mb-8 font-body text-text-muted">
          This article may have been removed or is not yet published.
        </p>
        <Link
          to="/blog"
          className="font-body font-semibold text-accent-primary underline-offset-2 hover:underline"
        >
          Back to blog
        </Link>
      </div>
    )
  }

  const readTime = formatReadTime(estimateReadTime(post.body))
  const Template = getArticleTemplate(post.article_template)

  return (
    <>
      <BlogMetaTags post={post} />
      <div className="bg-background-primary">
        <Template post={post} related={related} readTime={readTime} />
      </div>
    </>
  )
}
