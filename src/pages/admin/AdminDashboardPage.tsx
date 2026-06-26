import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { ADMIN_BASE, LEAD_BANDS, type LeadBand } from '@/lib/admin/constants'
import { apiFetch } from '@/lib/admin/api'

interface Analytics {
  totalConversations: number | string
  averageFirstResponseTimeSeconds: number | string
  leadCaptureRate: number | string
  conversionRate: number | string
}

interface StudentRow {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  country: string | null
  enrolment_status: string
  last_activity_at: string | null
  overall_score: number
}

interface StudentsResponse {
  data: StudentRow[]
  total: number
  page: number
  pageSize: number
}

function bandClass(band: LeadBand, active: boolean): string {
  const base = 'rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]'
  if (!active) return `${base} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`
  switch (band) {
    case 'hot':
      return `${base} bg-red-100 text-red-800 ring-2 ring-red-300`
    case 'warm':
      return `${base} bg-amber-100 text-amber-800 ring-2 ring-amber-300`
    case 'cold':
      return `${base} bg-blue-100 text-blue-800 ring-2 ring-blue-300`
    default:
      return `${base} bg-[var(--accent-mint)] text-gray-900 ring-2 ring-[var(--accent-primary)]`
  }
}

export function AdminDashboardPage() {
  const [leadBand, setLeadBand] = useState<LeadBand>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [result, setResult] = useState<StudentsResponse | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '25' })
      if (search) params.set('search', search)
      if (leadBand !== 'all') params.set('leadBand', leadBand)

      const [analyticsData, studentsData] = await Promise.all([
        apiFetch<Analytics>('/api/admin/analytics'),
        apiFetch<StudentsResponse>(`/api/admin/students?${params}`),
      ])
      setAnalytics(analyticsData)
      setResult(studentsData)
    } catch {
      setError('Failed to load dashboard')
    }
  }, [page, search, leadBand])

  useEffect(() => {
    load()
  }, [load])

  function selectBand(band: LeadBand) {
    setLeadBand(band)
    setPage(1)
  }

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
  const metrics = [
    { label: 'Conversations', value: analytics?.totalConversations ?? '—' },
    { label: 'Lead capture', value: analytics?.leadCaptureRate ?? '—' },
    { label: 'Conversion', value: analytics?.conversionRate ?? '—' },
    { label: 'Avg response', value: analytics?.averageFirstResponseTimeSeconds ?? '—' },
  ]

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Leads Dashboard</h2>
        <button
          type="button"
          onClick={handleExport}
          className="rounded border border-[var(--accent-primary)] px-4 py-2 text-sm text-[var(--accent-primary)] hover:bg-[var(--accent-mint)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        >
          Export CSV
        </button>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">{m.label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--accent-primary)]">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {LEAD_BANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => selectBand(b.id)}
            className={bandClass(b.id, leadBand === b.id)}
            title={b.description}
          >
            {b.label}
          </button>
        ))}
      </div>

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
          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        />
        <button
          type="submit"
          className="rounded bg-[var(--accent-primary)] px-4 py-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        >
          Search
        </button>
      </form>

      {!result?.data.length ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          No leads match this filter — conversations will appear once students message on Facebook.
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
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`${ADMIN_BASE}/leads/${s.id}`}
                      className="font-medium text-[var(--accent-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    >
                      {s.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{s.email ?? '—'}</td>
                  <td className="px-4 py-3">{s.phone ?? '—'}</td>
                  <td className="px-4 py-3">{s.country ?? '—'}</td>
                  <td className="px-4 py-3">{s.overall_score}</td>
                  <td className="px-4 py-3 capitalize">{s.enrolment_status.replace(/_/g, ' ')}</td>
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
            className="rounded border px-3 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            Previous
          </button>
          <span className="px-2 py-1 text-sm">
            Page {page} of {totalPages} ({result?.total ?? 0} total)
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
    </>
  )
}
