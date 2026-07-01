import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { ADMIN_BASE, channelLabel } from '@/lib/admin/constants'
import { apiFetch } from '@/lib/admin/api'

const STATUSES = [
  'enquiry',
  'qualified_lead',
  'appointment_booked',
  'application_submitted',
  'enrolled',
  'not_qualified',
] as const

interface Message {
  id: string
  message_type: 'user' | 'assistant'
  content: string
  created_at: string
}

interface StudentDetail {
  student: {
    id: string
    name: string | null
    email: string | null
    channel: string
    enrolment_status: string
  }
  leadScore: { overall_score: number } | null
}

export function AdminLeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [detail, setDetail] = useState<StudentDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!id) return
    setError('')
    try {
      const [studentData, msgData] = await Promise.all([
        apiFetch<StudentDetail>(`/api/admin/students/${id}`),
        apiFetch<{ messages: Message[]; limit: number; offset: number }>(
          `/api/admin/students/${id}/messages?limit=50&offset=${offset}`,
        ),
      ])
      setDetail(studentData)
      if (offset === 0) {
        setMessages(msgData.messages)
      } else {
        setMessages((prev) => [...msgData.messages, ...prev])
      }
      setHasMore(msgData.messages.length === 50)
    } catch {
      setError('Failed to load conversation')
    }
  }, [id, offset])

  useEffect(() => {
    load()
  }, [load])

  async function updateStatus(status: string) {
    if (!id) return
    try {
      await apiFetch(`/api/admin/students/${id}/enrolment-status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      load()
    } catch {
      setError('Failed to update status')
    }
  }

  return (
    <>
      <Link
        to={ADMIN_BASE}
        className="mb-4 inline-block text-sm text-[var(--accent-primary)] hover:underline"
      >
        ← Back to dashboard
      </Link>

      <h2 className="mb-2 text-2xl font-bold">{detail?.student.name ?? 'Student'}</h2>
      <p className="mb-4 text-sm text-gray-600">
        <span className="mr-2 inline-block rounded-full bg-[var(--accent-mint)] px-2 py-0.5 text-xs font-medium text-gray-900">
          {channelLabel(detail?.student.channel ?? 'webchat')}
        </span>
        Score: {detail?.leadScore?.overall_score ?? 0} · {detail?.student.email ?? 'No email'}
      </p>

      <label className="mb-6 block max-w-xs">
        <span className="mb-1 block text-sm font-medium">Enrolment status</span>
        <select
          value={detail?.student.enrolment_status ?? 'enquiry'}
          onChange={(e) => updateStatus(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </label>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.message_type === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                title={new Date(m.created_at).toLocaleString()}
                className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                  m.message_type === 'user'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-[var(--accent-mint)] text-gray-900'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setOffset((o) => o + 50)}
          className="mt-4 rounded border px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        >
          Load more
        </button>
      )}
    </>
  )
}
