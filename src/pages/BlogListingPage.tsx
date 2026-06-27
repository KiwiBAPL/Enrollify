import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BlogListingMetaTags } from '@/components/blog/BlogMetaTags'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogListingToolbar } from '@/components/blog/BlogListingToolbar'
import { BlogCategorySidebar } from '@/components/blog/BlogCategorySidebar'
import { BlogFeaturedSidebar } from '@/components/blog/BlogFeaturedSidebar'
import { usePublishedPosts } from '@/hooks/useBlog'
import {
  applyBlogListingFilters,
  getFeaturedPosts,
  type BlogSort,
} from '@/lib/blog-search'

export function BlogListingPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') ?? undefined
  const series = searchParams.get('series') ?? undefined
  const search = searchParams.get('search') ?? undefined
  const sort = (searchParams.get('sort') as BlogSort) || 'newest'

  const { data: allPosts = [], isLoading } = usePublishedPosts({})

  const categories = useMemo(
    () => [...new Set(allPosts.map((p) => p.category).filter(Boolean))].sort(),
    [allPosts],
  )
  const seriesList = useMemo(
    () =>
      [...new Set(allPosts.map((p) => p.series_collection).filter(Boolean))].sort() as string[],
    [allPosts],
  )

  const posts = useMemo(
    () =>
      applyBlogListingFilters(allPosts, {
        category,
        series,
        search,
        sort,
      }),
    [allPosts, category, series, search, sort],
  )

  const featuredPosts = useMemo(() => getFeaturedPosts(allPosts), [allPosts])

  const hasFilters = Boolean(category || series || search || sort !== 'newest')

  return (
    <>
      <BlogListingMetaTags />
      <div className="bg-background-primary py-16">
        <div className="container">
          <nav className="mb-6 font-body text-sm uppercase tracking-wide" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="text-accent-primary hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-text-muted">
                /
              </li>
              <li className="text-text-muted">Blog</li>
            </ol>
          </nav>

          <div className="mb-12 max-w-3xl">
            <h1 className="mb-4 font-display text-4xl font-bold text-text-primary">Blog</h1>
            <p className="font-body text-lg text-text-muted">
              Insights on international student recruitment, admissions workflows, and
              technology-enabled enrolment for education providers.
            </p>
          </div>

          {isLoading ? (
            <p className="font-body text-text-muted">Loading posts…</p>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-2">
                <BlogListingToolbar resultCount={posts.length} series={seriesList} />

                {posts.length === 0 ? (
                  <p className="py-12 text-center font-body text-text-muted">
                    {hasFilters
                      ? 'No posts match your filters.'
                      : 'No posts published yet. Check back soon.'}
                  </p>
                ) : (
                  <div className="grid gap-8 sm:grid-cols-2">
                    {posts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>

              <aside className="mt-12 space-y-10 lg:mt-0">
                <BlogCategorySidebar categories={categories} />
                <BlogFeaturedSidebar posts={featuredPosts} />
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
