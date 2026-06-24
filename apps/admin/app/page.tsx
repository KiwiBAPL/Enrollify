'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminShell } from '@/components/AdminShell'
import { ErrorBanner } from '@/components/ErrorBanner'
import { apiFetch } from '@/lib/api'

interface Analytics {
  totalConversations: number | string
  averageFirstResponseTimeSeconds: number | string
  leadCaptureRate: number | string
  conversionRate: number | string
}

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const result = await apiFetch<Analytics>('/api/admin/analytics')
      setData(result)
    } catch {
      setError('Failed to load analytics')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const metrics = [
    { label: 'Total conversations', value: data?.totalConversations ?? '—' },
    { label: 'Avg first response (sec)', value: data?.averageFirstResponseTimeSeconds ?? '—' },
    { label: 'Lead capture rate', value: data?.leadCaptureRate ?? '—' },
    { label: 'Conversion rate', value: data?.conversionRate ?? '—' },
  ]

  return (
    <AdminShell>
      <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>
      {error && <ErrorBanner message={error} onRetry={load} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-600">{m.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--color-brand)]">{m.value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
