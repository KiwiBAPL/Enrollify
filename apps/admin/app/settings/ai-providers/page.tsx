'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminShell } from '@/components/AdminShell'
import { ErrorBanner } from '@/components/ErrorBanner'
import { apiFetch } from '@/lib/api'

type ProviderType = 'perplexity' | 'claude'

interface AIProvider {
  id: string
  name: string
  provider_type: ProviderType
  model: string
  masked_api_key: string
  enabled: boolean
  priority: number
}

interface ProvidersResponse {
  providers: AIProvider[]
}

const EMPTY_FORM = {
  name: '',
  provider_type: 'perplexity' as ProviderType,
  model: 'sonar-pro',
  api_key: '',
  priority: 100,
  enabled: true,
}

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError('')
    try {
      const data = await apiFetch<ProvidersResponse>('/api/admin/ai-providers')
      setProviders(data.providers)
    } catch {
      setError('Failed to load AI providers')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
    setSuccess('')
  }

  function openEdit(provider: AIProvider) {
    setEditingId(provider.id)
    setForm({
      name: provider.name,
      provider_type: provider.provider_type,
      model: provider.model,
      api_key: '',
      priority: provider.priority,
      enabled: provider.enabled,
    })
    setShowForm(true)
    setSuccess('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingId) {
        const body: Record<string, unknown> = {
          name: form.name,
          model: form.model,
          priority: form.priority,
          enabled: form.enabled,
        }
        if (form.api_key.trim()) body.api_key = form.api_key.trim()

        await apiFetch(`/api/admin/ai-providers/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
        setSuccess('Provider updated')
      } else {
        if (!form.api_key.trim()) {
          setError('API key is required for new providers')
          setSaving(false)
          return
        }
        await apiFetch('/api/admin/ai-providers', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        setSuccess('Provider created')
      }
      closeForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function toggleEnabled(provider: AIProvider) {
    setError('')
    try {
      await apiFetch(`/api/admin/ai-providers/${provider.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled: !provider.enabled }),
      })
      await load()
    } catch {
      setError('Failed to update provider')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this AI provider?')) return
    setError('')
    try {
      await apiFetch(`/api/admin/ai-providers/${id}`, { method: 'DELETE' })
      setSuccess('Provider deleted')
      await load()
    } catch {
      setError('Failed to delete provider')
    }
  }

  async function handleTest(id: string) {
    setTestingId(id)
    setError('')
    setSuccess('')
    try {
      const result = await apiFetch<{ ok: boolean; error?: string }>(
        `/api/admin/ai-providers/${id}/test`,
        { method: 'POST' },
      )
      if (result.ok) {
        setSuccess('Connection test passed')
      } else {
        setError(result.error ?? 'Connection test failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed')
    } finally {
      setTestingId(null)
    }
  }

  async function updatePriority(id: string, priority: number) {
    setError('')
    try {
      await apiFetch(`/api/admin/ai-providers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ priority }),
      })
      await load()
    } catch {
      setError('Failed to update priority')
    }
  }

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Providers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage AI providers and failover order. Lower priority numbers are tried first.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        >
          Add provider
        </button>
      </div>

      {error && <ErrorBanner message={error} />}
      {success && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          {success}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? 'Edit provider' : 'Add provider'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Provider type</span>
              <select
                value={form.provider_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    provider_type: e.target.value as ProviderType,
                    model: e.target.value === 'claude' ? 'claude-sonnet-4-20250514' : 'sonar-pro',
                  })
                }
                disabled={!!editingId}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)] disabled:bg-gray-100"
              >
                <option value="perplexity">Perplexity</option>
                <option value="claude">Claude</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Model</span>
              <input
                type="text"
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-gray-700">Priority</span>
              <input
                type="number"
                required
                min={1}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-gray-700">API key</span>
              <input
                type="password"
                required={!editingId}
                placeholder={editingId ? 'Leave blank to keep current key' : 'pplx-...'}
                value={form.api_key}
                onChange={(e) => setForm({ ...form, api_key: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="font-medium text-gray-700">Enabled</span>
            </label>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Model</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Key</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Enabled</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {providers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No providers configured. Add one or set PERPLEXITY_API_KEY in backend env to
                  auto-seed on startup.
                </td>
              </tr>
            ) : (
              providers.map((provider) => (
                <tr key={provider.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{provider.name}</td>
                  <td className="px-4 py-3 capitalize text-gray-700">{provider.provider_type}</td>
                  <td className="px-4 py-3 text-gray-700">{provider.model}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      defaultValue={provider.priority}
                      onBlur={(e) => {
                        const next = Number(e.target.value)
                        if (next !== provider.priority && next >= 1) {
                          updatePriority(provider.id, next)
                        }
                      }}
                      className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {provider.masked_api_key}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleEnabled(provider)}
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        provider.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {provider.enabled ? 'On' : 'Off'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleTest(provider.id)}
                        disabled={testingId === provider.id}
                        className="text-[var(--color-brand)] hover:underline disabled:opacity-50"
                      >
                        {testingId === provider.id ? 'Testing…' : 'Test'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(provider)}
                        className="text-gray-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(provider.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
