import { Link, useSearchParams } from 'react-router-dom'

interface BlogCategorySidebarProps {
  categories: string[]
}

export function BlogCategorySidebar({ categories }: BlogCategorySidebarProps) {
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') ?? ''

  const buildCategoryHref = (category: string) => {
    const next = new URLSearchParams(searchParams)
    if (category) next.set('category', category)
    else next.delete('category')
    const query = next.toString()
    return query ? `/blog?${query}` : '/blog'
  }

  if (categories.length === 0) return null

  return (
    <nav aria-labelledby="blog-categories-heading">
      <h2
        id="blog-categories-heading"
        className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text-primary"
      >
        All Categories
      </h2>
      <ul className="space-y-2">
        <li>
          <Link
            to={buildCategoryHref('')}
            className={`flex items-center gap-2 font-body text-sm transition-colors ${
              !activeCategory
                ? 'font-semibold text-accent-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {!activeCategory && (
              <span className="text-accent-primary" aria-hidden>
                ›
              </span>
            )}
            <span className={!activeCategory ? '' : 'pl-4'}>All categories</span>
          </Link>
        </li>
        {categories.map((category) => {
          const isActive = activeCategory === category
          return (
            <li key={category}>
              <Link
                to={buildCategoryHref(category)}
                className={`flex items-center gap-2 font-body text-sm transition-colors ${
                  isActive
                    ? 'font-semibold text-accent-primary'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <span className="text-accent-primary" aria-hidden>
                    ›
                  </span>
                )}
                <span className={isActive ? '' : 'pl-4'}>{category}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
