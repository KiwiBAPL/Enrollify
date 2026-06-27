import { Link } from 'react-router-dom'
import { usePublishedPosts } from '@/hooks/useBlog'
import { routes } from '@/lib/routes'

export function FooterLatestArticles() {
  const { data: posts, isLoading } = usePublishedPosts({})
  const latestPosts = posts?.slice(0, 3) ?? []

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-text-secondary">Latest Articles</p>
      {isLoading ? (
        <ul className="flex flex-col gap-2 p-0">
          {[0, 1, 2].map((index) => (
            <li key={index} className="list-none">
              <span className="block h-4 w-full animate-pulse rounded bg-accent-primary/10" />
            </li>
          ))}
        </ul>
      ) : latestPosts.length > 0 ? (
        <ul className="flex flex-col gap-2 p-0">
          {latestPosts.map((post) => (
            <li key={post.id} className="list-none">
              <Link
                to={`${routes.blog}/${post.slug}`}
                className="text-sm text-text-muted hover:text-text-secondary hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Link
          to={routes.blog}
          className="text-sm text-text-muted hover:text-text-secondary hover:underline"
        >
          View all articles →
        </Link>
      )}
    </div>
  )
}
