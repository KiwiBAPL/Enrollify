import { Link } from 'react-router-dom'
import type { BlogPost } from '@/types/database'

interface RelatedPostsProps {
  posts: BlogPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section
      className="mt-16 border-t border-gray-200 pt-12"
      aria-labelledby="related-posts-heading"
    >
      <h2 id="related-posts-heading" className="mb-6 font-display text-2xl font-semibold">
        Related blogs
      </h2>
      <ul className="space-y-3 font-body">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              to={`/blog/${post.slug}`}
              className="text-lg text-accent-primary underline-offset-2 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
