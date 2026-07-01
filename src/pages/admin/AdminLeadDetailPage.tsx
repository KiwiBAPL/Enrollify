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

interface StudentRecord {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  country: string | null
  field_of_study: string | null
  preferred_intake: string | null
  funding_source: string | null
  funds_available: string | null
  english_test_completed: string | null
  visa_refusal_history: string | null
  channel: string
  enrolment_status: string
}

interface StudentDetail {
  student: StudentRecord
  leadScore: { overall_score: number } | null
}

const QUALIFICATION_FIELDS: { key: keyof StudentRecord; label: string }[] = [
  { key: 'country', label: 'Country' },
  { key: 'field_of_study', label: 'Field of study' },
  { key: 'preferred_intake', label: 'Preferred intake' },
  { key: 'funding_source', label: 'Funding source' },
  { key: 'funds_available', label: 'Funds available' },
  { key: 'english_test_completed', label: 'English test' },
  { key: 'visa_refusal_history', label: 'Visa refusal history' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
]

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

  const student = detail?.student

  return (
    <>
      <Link
        to={ADMIN_BASE}
        className="mb-4 inline-block text-sm text-[var(--accent-primary)] hover:underline"
      >
        ← Back to dashboard
      </Link>

      <h2 className="mb-2 text-2xl font-bold">{student?.name ?? 'Student'}</h2>
      <p className="mb-4 text-sm text-gray-600">
        <span className="mr-2 inline-block rounded-full bg-[var(--accent-mint)] px-2 py-0.5 text-xs font-medium text-gray-900">
          {channelLabel(student?.channel ?? 'webchat')}
        </span>
        Score: {detail?.leadScore?.overall_score ?? 0} · {student?.email ?? 'No email'}
      </p>

      {student && (
        <div className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2">
          {QUALIFICATION_FIELDS.map(({ key, label }) => {
            const value = student[key]
            if (typeof value !== 'string' || !value) return null
            return (
              <div key={key}>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
                <p className="text-sm text-gray-900">{value}</p>
              </div>
            )
          })}
        </div>
      )}

      <label className="mb-6 block max-w-xs">
        <span className="mb-1 block text-sm font-medium">Enrolment status</span>
        <select
          value={student?.enrolment_status ?? 'enquiry'}
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
