import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/format-date'
import type { BlogPost } from '@/types/database'

interface BlogFeaturedSidebarProps {
  posts: BlogPost[]
}

export function BlogFeaturedSidebar({ posts }: BlogFeaturedSidebarProps) {
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="featured-blogs-heading">
      <h2
        id="featured-blogs-heading"
        className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text-primary"
      >
        Featured Blogs
      </h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/blog/${post.slug}`} className="group flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-primary)]">
                {post.featured_image_url ? (
                  <img
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="h-full w-full bg-accent-mint/40"
                    aria-hidden
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {post.published_at && (
                  <time
                    dateTime={post.published_at}
                    className="mb-1 block font-body text-xs text-text-muted"
                  >
                    {formatDate(post.published_at, 'long')}
                  </time>
                )}
                <p className="line-clamp-2 font-display text-sm font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                  {post.title}
                </p>
                <p className="mt-1 font-body text-xs text-text-muted">by {post.author_name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
