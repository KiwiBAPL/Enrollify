import { useCallback, useEffect, useState } from 'react'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { apiFetch } from '@/lib/admin/api'

interface CategorySummary {
  slug: string
  label: string
  count: number
}

interface InsightsSummary {
  categories: CategorySummary[]
  totalQuestions: number
  dateRange: { from?: string; to?: string }
}

interface QuestionRow {
  id: string
  content: string
  category: string | null
  createdAt: string
}

interface QuestionsResponse {
  data: QuestionRow[]
  total: number
  page: number
  pageSize: number
}

function formatDateRange(range: InsightsSummary['dateRange']): string {
  if (range.from && range.to) {
    const from = new Date(range.from).toLocaleDateString()
    const to = new Date(range.to).toLocaleDateString()
    return `${from} – ${to}`
  }
  return 'Last 30 days'
}

export function AdminChatInsightsPage() {
  const [summary, setSummary] = useState<InsightsSummary | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuestionsResponse | null>(null)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')

  const loadSummary = useCallback(async () => {
    setError('')
    try {
      const data = await apiFetch<InsightsSummary>('/api/admin/chat-insights/summary')
      setSummary(data)
    } catch {
      setError('Failed to load chat insights')
    }
  }, [])

  const loadQuestions = useCallback(async () => {
    if (!selectedCategory || !summary) return
    setError('')
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        page: String(page),
      })
      if (summary.dateRange.from) params.set('from', summary.dateRange.from)
      if (summary.dateRange.to) params.set('to', summary.dateRange.to)

      const data = await apiFetch<QuestionsResponse>(
        `/api/admin/chat-insights/questions?${params}`,
      )
      setQuestions(data)
    } catch {
      setError('Failed to load questions')
    }
  }, [selectedCategory, page, summary])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  useEffect(() => {
    if (selectedCategory) {
      void loadQuestions()
    } else {
      setQuestions(null)
    }
  }, [selectedCategory, loadQuestions])

  function selectCategory(slug: string) {
    setSelectedCategory(slug)
    setPage(1)
  }

  const maxCount = summary?.categories.reduce((max, c) => Math.max(max, c.count), 0) ?? 0
  const totalPages = questions ? Math.ceil(questions.total / questions.pageSize) : 0
  const selectedLabel = summary?.categories.find((c) => c.slug === selectedCategory)?.label

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Chat Insights</h2>
        <p className="mt-1 text-sm text-gray-600">
          Website AI chat questions — not consultation form leads.
        </p>
      </div>

      {error && (
        <ErrorBanner
          message={error}
          onRetry={() => {
            void loadSummary()
            if (selectedCategory) void loadQuestions()
          }}
        />
      )}

      {summary && (
        <>
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Total questions ({formatDateRange(summary.dateRange)})</p>
            <p className="mt-1 text-3xl font-bold text-[var(--accent-primary)]">
              {summary.totalQuestions}
            </p>
          </div>

          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-lg font-semibold">Questions by category</h3>
            {summary.categories.every((c) => c.count === 0) ? (
              <p className="text-gray-600">
                No categorized questions yet — they appear after visitors use the website chat.
              </p>
            ) : (
              <ul className="space-y-3">
                {summary.categories.map((category) => {
                  const widthPercent =
                    maxCount > 0 ? Math.max(4, Math.round((category.count / maxCount) * 100)) : 0
                  const active = selectedCategory === category.slug
                  return (
                    <li key={category.slug}>
                      <button
                        type="button"
                        onClick={() => selectCategory(category.slug)}
                        className={`w-full rounded-lg border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ${
                          active
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-mint)]'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                          <span className="font-medium">{category.label}</span>
                          <span className="tabular-nums text-gray-600">{category.count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[var(--accent-primary)]"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {selectedCategory && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-4 text-lg font-semibold">{selectedLabel ?? selectedCategory}</h3>
          {!questions?.data.length ? (
            <p className="text-gray-600">No questions in this category for the selected period.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Question</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.data.map((q) => (
                    <tr key={q.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">{q.content}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {new Date(q.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              >
                Previous
              </button>
              <span className="px-2 py-1 text-sm">
                Page {page} of {totalPages} ({questions?.total ?? 0} total)
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border px-3 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
