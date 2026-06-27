import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPublishedPosts } from '@/lib/blog'
import { useAdminPosts } from '@/hooks/useBlog'
import type { BlogPost } from '@/types/database'

type FilterMode = 'category' | 'series'

interface RelatedPostsPickerProps {
  currentSlug: string
  selectedSlugs: string[]
  onChange: (slugs: string[]) => void
}

const selectClass =
  'w-full rounded-lg border-2 border-stroke-primary px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary'

export function RelatedPostsPicker({
  currentSlug,
  selectedSlugs,
  onChange,
}: RelatedPostsPickerProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('category')
  const [filterValue, setFilterValue] = useState('')

  const { data: allPosts = [] } = useAdminPosts()

  const filterOptions = useMemo(() => {
    const source = allPosts.filter((post) => post.status === 'published')
    if (filterMode === 'category') {
      return [...new Set(source.map((post) => post.category).filter(Boolean))].sort()
    }
    return [
      ...new Set(source.map((post) => post.series_collection).filter(Boolean)),
    ].sort() as string[]
  }, [allPosts, filterMode])

  const activeFilterValue = filterValue || filterOptions[0] || ''

  const { data: matchingPosts = [], isLoading } = useQuery({
    queryKey: ['blog', 'related-picker', filterMode, activeFilterValue],
    queryFn: async () => {
      if (!activeFilterValue) return []
      const filters =
        filterMode === 'category'
          ? { category: activeFilterValue }
          : { series: activeFilterValue }
      const { data, error } = await getPublishedPosts(filters)
      if (error) throw new Error(error.message)
      return (data ?? []).filter((post) => post.slug !== currentSlug)
    },
    enabled: Boolean(activeFilterValue),
  })

  const visibleSlugs = matchingPosts.map((post) => post.slug)
  const allVisibleSelected =
    visibleSlugs.length > 0 && visibleSlugs.every((slug) => selectedSlugs.includes(slug))
  const someVisibleSelected = visibleSlugs.some((slug) => selectedSlugs.includes(slug))

  const toggleSlug = (slug: string, checked: boolean) => {
    if (checked) {
      onChange(selectedSlugs.includes(slug) ? selectedSlugs : [...selectedSlugs, slug])
      return
    }
    onChange(selectedSlugs.filter((s) => s !== slug))
  }

  const toggleAllVisible = (checked: boolean) => {
    if (checked) {
      onChange([...new Set([...selectedSlugs, ...visibleSlugs])])
      return
    }
    onChange(selectedSlugs.filter((slug) => !visibleSlugs.includes(slug)))
  }

  return (
    <div className="space-y-4 rounded-lg border-2 border-stroke-primary bg-[var(--bg-primary)] p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="related-filter-mode" className="block text-sm font-semibold font-body">
            Filter by
          </label>
          <select
            id="related-filter-mode"
            value={filterMode}
            onChange={(e) => {
              setFilterMode(e.target.value as FilterMode)
              setFilterValue('')
            }}
            className={selectClass}
          >
            <option value="category">Category</option>
            <option value="series">Series / collection</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="related-filter-value" className="block text-sm font-semibold font-body">
            {filterMode === 'category' ? 'Category' : 'Series / collection'}
          </label>
          <select
            id="related-filter-value"
            value={activeFilterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={filterOptions.length === 0}
            className={selectClass}
          >
            {filterOptions.length === 0 ? (
              <option value="">
                No published {filterMode === 'category' ? 'categories' : 'series'}
              </option>
            ) : (
              filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {activeFilterValue && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <input
              id="related-select-all"
              type="checkbox"
              checked={allVisibleSelected}
              ref={(el) => {
                if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected
              }}
              onChange={(e) => toggleAllVisible(e.target.checked)}
              disabled={matchingPosts.length === 0}
              className="h-4 w-4 accent-[var(--accent-primary)]"
            />
            <label htmlFor="related-select-all" className="cursor-pointer font-body text-sm">
              Select all ({matchingPosts.length} post{matchingPosts.length === 1 ? '' : 's'})
            </label>
          </div>

          {isLoading ? (
            <p className="font-body text-sm text-text-muted">Loading posts…</p>
          ) : matchingPosts.length === 0 ? (
            <p className="font-body text-sm text-text-muted">
              No other published posts in this group.
            </p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {matchingPosts.map((post) => (
                <RelatedPostRow
                  key={post.id}
                  post={post}
                  checked={selectedSlugs.includes(post.slug)}
                  onCheckedChange={(checked) => toggleSlug(post.slug, checked)}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedSlugs.length > 0 && (
        <p className="font-body text-sm text-text-muted">
          {selectedSlugs.length} post{selectedSlugs.length === 1 ? '' : 's'} selected for the
          Related blogs section.
        </p>
      )}
    </div>
  )
}

function RelatedPostRow({
  post,
  checked,
  onCheckedChange,
}: {
  post: BlogPost
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const id = `related-post-${post.slug}`

  return (
    <li className="flex items-start gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[var(--accent-primary)]"
      />
      <label htmlFor={id} className="cursor-pointer font-body text-sm leading-snug">
        <span className="font-semibold">{post.title}</span>
        <span className="block text-xs text-text-muted">/blog/{post.slug}</span>
      </label>
    </li>
  )
}
