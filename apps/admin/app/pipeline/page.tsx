'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { AdminShell } from '@/components/AdminShell'
import { ErrorBanner } from '@/components/ErrorBanner'
import { apiFetch } from '@/lib/api'

interface PipelineEntry {
  studentId: string
  name: string
  overallScore: number
  lastActivity: string | null
}

interface Pipeline {
  hot: PipelineEntry[]
  warm: PipelineEntry[]
  cold: PipelineEntry[]
}

function PipelineColumn({
  title,
  entries,
  color,
}: {
  title: string
  entries: PipelineEntry[]
  color: string
}) {
  return (
    <div className="flex-1 rounded-lg border border-gray-200 bg-white">
      <h3 className={`border-b border-gray-200 px-4 py-3 font-semibold ${color}`}>{title}</h3>
      <ul className="divide-y divide-gray-100">
        {entries.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-gray-500">No leads</li>
        ) : (
          entries.map((e) => (
            <li key={e.studentId} className="px-4 py-3">
              <Link
                href={`/students/${e.studentId}`}
                className="font-medium text-[var(--color-brand)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
              >
                {e.name}
              </Link>
              <p className="text-sm text-gray-600">
                Score {e.overallScore}
                {e.lastActivity && ` · ${new Date(e.lastActivity).toLocaleDateString()}`}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const data = await apiFetch<Pipeline>('/api/admin/pipeline')
      setPipeline(data)
    } catch {
      setError('Failed to load pipeline')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const empty =
    !pipeline?.hot.length && !pipeline?.warm.length && !pipeline?.cold.length

  return (
    <AdminShell>
      <h2 className="mb-6 text-2xl font-bold">Lead Pipeline</h2>
      {error && <ErrorBanner message={error} onRetry={load} />}
      {empty ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          No leads yet — conversations will appear here once students message on Facebook.
        </p>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row">
          <PipelineColumn title="Hot (≥70)" entries={pipeline?.hot ?? []} color="text-red-700" />
          <PipelineColumn title="Warm (40–69)" entries={pipeline?.warm ?? []} color="text-amber-700" />
          <PipelineColumn title="Cold (<40)" entries={pipeline?.cold ?? []} color="text-blue-700" />
        </div>
      )}
    </AdminShell>
  )
}
