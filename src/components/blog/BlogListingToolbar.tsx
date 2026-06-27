import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import type { BlogSort } from '@/lib/blog-search'

interface BlogListingToolbarProps {
  resultCount: number
  series: string[]
}

const selectClass =
  'rounded-lg border-2 border-stroke-primary px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary'

const inputClass =
  'w-full rounded-lg border-2 border-stroke-primary px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary'

export function BlogListingToolbar({ resultCount, series }: BlogListingToolbarProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const seriesFilter = searchParams.get('series') ?? ''
  const sort = (searchParams.get('sort') as BlogSort) || 'newest'
  const searchParam = searchParams.get('search') ?? ''

  const [searchInput, setSearchInput] = useState(searchParam)

  useEffect(() => {
    setSearchInput(searchParam)
  }, [searchParam])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = searchInput.trim()
      setSearchParams(
        (prev) => {
          const current = prev.get('search') ?? ''
          if (trimmed === current) return prev
          const next = new URLSearchParams(prev)
          if (trimmed) next.set('search', trimmed)
          else next.delete('search')
          return next
        },
        { replace: true },
      )
    }, 300)
    return () => window.clearTimeout(timer)
  }, [searchInput, setSearchParams])

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams({})
  }

  const hasFilters =
    seriesFilter || searchParam || sort !== 'newest' || searchParams.get('category')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', searchInput.trim())
  }

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm text-text-muted">
          Showing{' '}
          <span className="font-semibold text-accent-primary">{resultCount}</span>{' '}
          {resultCount === 1 ? 'result' : 'results'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="blog-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="blog-sort"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value === 'newest' ? '' : e.target.value)}
            className={selectClass}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A–Z</option>
          </select>

          {series.length > 0 && (
            <>
              <label htmlFor="blog-series" className="sr-only">
                Series
              </label>
              <select
                id="blog-series"
                value={seriesFilter || 'all'}
                onChange={(e) => updateParam('series', e.target.value === 'all' ? '' : e.target.value)}
                className={selectClass}
              >
                <option value="all">All series</option>
                {series.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex gap-2"
        role="search"
        aria-label="Search blog posts"
      >
        <label htmlFor="blog-search" className="sr-only">
          Search posts
        </label>
        <input
          id="blog-search"
          placeholder="Search by title or summary…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={inputClass}
        />
        <Button type="submit" variant="primary" size="sm" aria-label="Search">
          Search
        </Button>
      </form>

      {hasFilters && (
        <div>
          <Button type="button" variant="secondary" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
