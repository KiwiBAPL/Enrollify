import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/format-date'
import { estimateReadTime, formatReadTime } from '@/lib/read-time'
import type { BlogPost } from '@/types/database'

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const readTime = formatReadTime(estimateReadTime(post.body))

  return (
    <article className="h-full overflow-hidden rounded-card border-2 border-stroke-primary bg-white shadow-hard transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#111111]">
      <Link to={`/blog/${post.slug}`} className="block h-full">
        {post.featured_image_url && (
          <div className="aspect-[16/9] overflow-hidden bg-[var(--bg-primary)]">
            <img
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="space-y-3 p-6">
          <div className="flex flex-wrap gap-2">
            {post.category && (
              <span className="rounded-full bg-accent-mint px-3 py-0.5 font-body text-xs font-semibold text-stroke-primary">
                {post.category}
              </span>
            )}
            {post.series_collection && (
              <span className="rounded-full border-2 border-accent-primary px-3 py-0.5 font-body text-xs font-semibold text-accent-primary">
                {post.series_collection}
              </span>
            )}
          </div>
          <h2 className="line-clamp-2 font-display text-xl font-semibold text-text-primary">
            {post.title}
          </h2>
          {post.summary && (
            <p className="line-clamp-3 font-body text-sm text-text-muted">{post.summary}</p>
          )}
          <div className="flex items-center gap-3 pt-2 font-body text-sm text-text-muted">
            {post.published_at && (
              <time dateTime={post.published_at}>{formatDate(post.published_at, 'long')}</time>
            )}
            <span aria-hidden="true">·</span>
            <span>{readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
