import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { LeadNotesModal } from '@/components/admin/LeadNotesModal'
import { ADMIN_BASE, LEAD_BANDS, LEAD_CHANNELS, channelLabel, type LeadBand, type LeadChannel } from '@/lib/admin/constants'
import { apiFetch } from '@/lib/admin/api'
import { getStaffProfile } from '@/lib/admin/profile'

interface Analytics {
  totalConversations: number | string
  averageFirstResponseTimeSeconds: number | string
  leadCaptureRate: number | string
  conversionRate: number | string
}

interface LatestNote {
  id: string
  content: string
  created_at: string
}

interface StudentRow {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  country: string | null
  channel: string
  enrolment_status: string
  last_activity_at: string | null
  overall_score: number
  latest_note: LatestNote | null
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
    case 'nurture':
      return `${base} bg-yellow-100 text-yellow-900 ring-2 ring-yellow-300`
    case 'cold':
      return `${base} bg-blue-100 text-blue-800 ring-2 ring-blue-300`
    default:
      return `${base} bg-[var(--accent-mint)] text-gray-900 ring-2 ring-[var(--accent-primary)]`
  }
}

function truncateNote(text: string, max = 60): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`
}

export function AdminDashboardPage() {
  const [leadBand, setLeadBand] = useState<LeadBand>('all')
  const [channel, setChannel] = useState<LeadChannel | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [result, setResult] = useState<StudentsResponse | null>(null)
  const [error, setError] = useState('')
  const [notesModal, setNotesModal] = useState<{ studentId: string; studentName: string | null } | null>(
    null,
  )
  const [welcomeName, setWelcomeName] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [archiving, setArchiving] = useState(false)

  useEffect(() => {
    getStaffProfile()
      .then((profile) => setWelcomeName(`${profile.first_name} ${profile.last_name}`.trim()))
      .catch(() => setWelcomeName(null))
  }, [])

  const load = useCallback(async () => {
    setError('')
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '25' })
      if (search) params.set('search', search)
      if (leadBand !== 'all') params.set('leadBand', leadBand)
      if (channel !== 'all') params.set('channel', channel)

      const [analyticsData, studentsData] = await Promise.all([
        apiFetch<Analytics>('/api/admin/analytics'),
        apiFetch<StudentsResponse>(`/api/admin/students?${params}`),
      ])
      setAnalytics(analyticsData)
      setResult(studentsData)
    } catch {
      setError('Failed to load dashboard')
    }
  }, [page, search, leadBand, channel])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setSelectedIds(new Set())
  }, [page, search, leadBand, channel])

  const pageIds = result?.data.map((s) => s.id) ?? []
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))
  const someOnPageSelected = pageIds.some((id) => selectedIds.has(id))

  function toggleRowSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allOnPageSelected) {
        for (const id of pageIds) next.delete(id)
      } else {
        for (const id of pageIds) next.add(id)
      }
      return next
    })
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return

    const confirmed = window.confirm(
      `Delete ${selectedIds.size} selected lead${selectedIds.size === 1 ? '' : 's'}? They will be removed from this dashboard and permanently deleted from the system after 90 days.`,
    )
    if (!confirmed) return

    setArchiving(true)
    setError('')
    try {
      await apiFetch<{ archived: number }>('/api/admin/students/archive', {
        method: 'POST',
        body: JSON.stringify({ ids: [...selectedIds] }),
      })
      setSelectedIds(new Set())

      const params = new URLSearchParams({ page: String(page), pageSize: '25' })
      if (search) params.set('search', search)
      if (leadBand !== 'all') params.set('leadBand', leadBand)
      if (channel !== 'all') params.set('channel', channel)

      const studentsData = await apiFetch<StudentsResponse>(`/api/admin/students?${params}`)
      if (studentsData.data.length === 0 && page > 1 && studentsData.total > 0) {
        setPage(1)
        return
      }

      await load()
    } catch {
      setError('Failed to delete selected leads')
    } finally {
      setArchiving(false)
    }
  }

  function selectBand(band: LeadBand) {
    setLeadBand(band)
    setPage(1)
  }

  function selectChannel(next: LeadChannel | 'all') {
    setChannel(next)
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
      {welcomeName && (
        <p className="mb-2 text-gray-600">Welcome, {welcomeName}</p>
      )}
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

      <div className="mb-4 flex flex-wrap gap-2">
        {LEAD_CHANNELS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectChannel(c.id)}
            className={bandClass('all', channel === c.id)}
          >
            {c.label}
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

      {selectedIds.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <span className="text-sm text-red-900">
            {selectedIds.size} selected on this page
          </span>
          <button
            type="button"
            onClick={() => void handleBulkDelete()}
            disabled={archiving}
            className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
          >
            {archiving ? 'Deleting…' : `Delete selected (${selectedIds.size})`}
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            disabled={archiving}
            className="text-sm text-red-800 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Clear selection
          </button>
        </div>
      )}

      {!result?.data.length ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          No leads match this filter — consultation form submissions will appear here once students book through the Lead Bot.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someOnPageSelected && !allOnPageSelected
                    }}
                    onChange={toggleSelectAllOnPage}
                    aria-label="Select all leads on this page"
                    className="h-4 w-4 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={() => toggleRowSelection(s.id)}
                      aria-label={`Select ${s.name ?? 'lead'}`}
                      className="h-4 w-4 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`${ADMIN_BASE}/leads/${s.id}`}
                      className="font-medium text-[var(--accent-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    >
                      {s.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{channelLabel(s.channel)}</td>
                  <td className="px-4 py-3">{s.email ?? '—'}</td>
                  <td className="px-4 py-3">{s.phone ?? '—'}</td>
                  <td className="px-4 py-3">{s.country ?? '—'}</td>
                  <td className="px-4 py-3">{s.overall_score}</td>
                  <td className="px-4 py-3 capitalize">{s.enrolment_status.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    {s.latest_note ? (
                      <div className="max-w-[200px]">
                        <p className="truncate text-gray-900" title={s.latest_note.content}>
                          {truncateNote(s.latest_note.content)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(s.latest_note.created_at).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setNotesModal({ studentId: s.id, studentName: s.name })
                      }
                      className="mt-1 text-xs text-[var(--accent-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    >
                      View all
                    </button>
                  </td>
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

      {notesModal && (
        <LeadNotesModal
          studentId={notesModal.studentId}
          studentName={notesModal.studentName}
          onClose={() => setNotesModal(null)}
          onNotesChanged={load}
        />
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
