import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/format-date'
import type { BlogPost } from '@/types/database'

interface ArticleMetadataProps {
  post: BlogPost
  readTime: string
}

function MetadataItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mb-1 font-display text-xs font-medium uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="font-body text-text-primary">{children}</dd>
    </div>
  )
}

export function ArticleMetadata({ post, readTime }: ArticleMetadataProps) {
  return (
    <dl className="grid gap-6 lg:min-w-[200px] lg:gap-8 lg:border-l lg:border-gray-200 lg:pl-8">
      {post.published_at && (
        <MetadataItem label="Date">
          <time dateTime={post.published_at}>
            {formatDate(post.published_at, 'uppercase')}
          </time>
        </MetadataItem>
      )}

      {post.category && (
        <MetadataItem label="Category">
          <Link
            to={`/blog?category=${encodeURIComponent(post.category)}`}
            className="transition-colors hover:text-accent-primary"
          >
            {post.category.toUpperCase()}
          </Link>
        </MetadataItem>
      )}

      {post.series_collection && (
        <MetadataItem label="Series">
          <Link
            to={`/blog?series=${encodeURIComponent(post.series_collection)}`}
            className="transition-colors hover:text-accent-primary"
          >
            {post.series_collection.toUpperCase()}
          </Link>
        </MetadataItem>
      )}

      <MetadataItem label="Reading time">{readTime.toUpperCase()}</MetadataItem>
    </dl>
  )
}
