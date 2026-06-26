'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { AdminShell } from '@/components/AdminShell'
import { ErrorBanner } from '@/components/ErrorBanner'
import { apiFetch } from '@/lib/api'

interface StudentRow {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  country: string | null
  last_activity_at: string | null
  overall_score: number
}

interface StudentsResponse {
  data: StudentRow[]
  total: number
  page: number
  pageSize: number
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<StudentsResponse | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '25' })
      if (search) params.set('search', search)
      const data = await apiFetch<StudentsResponse>(`/api/admin/students?${params}`)
      setResult(data)
    } catch {
      setError('Failed to load students')
    }
  }, [page, search])

  useEffect(() => {
    load()
  }, [load])

  async function handleExport() {
    try {
      const csv = await apiFetch<string>('/api/admin/students/export')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'leads-export.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Export failed')
    }
  }

  const totalPages = result ? Math.ceil(result.total / result.pageSize) : 0

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Students</h2>
        <button
          type="button"
          onClick={handleExport}
          className="rounded border border-[var(--color-brand)] px-4 py-2 text-sm text-[var(--color-brand)] hover:bg-[var(--color-mint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        >
          Export CSV
        </button>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          setPage(1)
          load()
        }}
      >
        <input
          type="search"
          placeholder="Search name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        />
        <button
          type="submit"
          className="rounded bg-[var(--color-brand)] px-4 py-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        >
          Search
        </button>
      </form>

      {!result?.data.length ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          No leads yet — conversations will appear here once students message on Facebook.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/students/${s.id}`}
                      className="text-[var(--color-brand)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    >
                      {s.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{s.email ?? '—'}</td>
                  <td className="px-4 py-3">{s.phone ?? '—'}</td>
                  <td className="px-4 py-3">{s.country ?? '—'}</td>
                  <td className="px-4 py-3">{s.overall_score}</td>
                  <td className="px-4 py-3">
                    {s.last_activity_at
                      ? new Date(s.last_activity_at).toLocaleString()
                      : '—'}
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
            className="rounded border px-3 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
          >
            Previous
          </button>
          <span className="px-2 py-1 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
          >
            Next
          </button>
        </div>
      )}
    </AdminShell>
  )
}
