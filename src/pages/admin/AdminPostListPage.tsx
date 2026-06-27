import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { ADMIN_BASE } from '@/lib/admin/constants'
import { formatDate } from '@/lib/format-date'
import { getArticleTemplateLabel } from '@/components/blog/templates/registry'
import { useAdminPosts, useBlogMutations } from '@/hooks/useBlog'
import type { BlogPost, BlogPostStatus } from '@/types/database'
import { Button } from '@/components/ui/Button'

export function AdminPostListPage() {
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const {
    data: posts = [],
    isLoading,
    error: loadError,
    refetch,
  } = useAdminPosts({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search || undefined,
  })
  const { remove, update } = useBlogMutations()
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleFeaturedToggle = async (post: BlogPost, checked: boolean) => {
    setTogglingId(post.id)
    setError('')
    setMessage('')
    try {
      await update.mutateAsync({ id: post.id, input: { is_featured: checked } })
      setMessage(
        checked ? `"${post.title}" marked as featured` : `"${post.title}" removed from featured`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update featured status')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return

    setDeletingId(id)
    setError('')
    setMessage('')
    try {
      await remove.mutateAsync(id)
      setMessage(`Deleted "${title}"`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'rounded-lg border-2 border-stroke-primary px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary'

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-display text-2xl font-bold text-accent-primary">Blog posts</h1>
        <Link to={`${ADMIN_BASE}/posts/new`}>
          <Button variant="primary" size="sm">
            New post
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} max-w-xs`}
          aria-label="Search posts by title"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BlogPostStatus | 'all')}
          className={inputClass}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {loadError && (
        <ErrorBanner
          message={loadError instanceof Error ? loadError.message : 'Failed to load posts'}
          onRetry={() => refetch()}
        />
      )}
      {error && <ErrorBanner message={error} />}
      {message && (
        <div
          role="status"
          className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {message}
        </div>
      )}

      {isLoading ? (
        <p className="font-body text-text-muted">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="font-body text-text-muted">No posts found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border-2 border-stroke-primary bg-white">
          <table className="w-full min-w-[800px] border-collapse font-body text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-[var(--bg-primary)] text-left">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Series</th>
                <th className="px-4 py-3 font-semibold">Layout</th>
                <th className="px-4 py-3 font-semibold">Published</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 last:border-0">
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                        post.status === 'published'
                          ? 'bg-accent-mint text-stroke-primary'
                          : 'border border-gray-300 text-text-muted'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={post.is_featured ?? false}
                      onChange={(e) => handleFeaturedToggle(post, e.target.checked)}
                      disabled={togglingId === post.id}
                      aria-label={`${post.is_featured ? 'Remove' : 'Mark'} "${post.title}" as featured`}
                      className="h-4 w-4 accent-[var(--accent-primary)]"
                    />
                  </td>
                  <td className="px-4 py-3">{post.category || '—'}</td>
                  <td className="px-4 py-3">{post.series_collection || '—'}</td>
                  <td className="px-4 py-3">
                    {getArticleTemplateLabel(post.article_template ?? 'classic')}
                  </td>
                  <td className="px-4 py-3">
                    {post.published_at ? formatDate(post.published_at, 'short') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`${ADMIN_BASE}/posts/${post.id}`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={deletingId === post.id}
                        onClick={() => handleDelete(post.id, post.title)}
                        className="!border-red-600 !text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
