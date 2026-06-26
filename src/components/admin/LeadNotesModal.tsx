import { useCallback, useEffect, useState } from 'react'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { apiFetch } from '@/lib/admin/api'

interface StudentNote {
  id: string
  student_id: string
  content: string
  author_email: string
  created_at: string
  updated_at: string
}

interface LeadNotesModalProps {
  studentId: string
  studentName: string | null
  onClose: () => void
  onNotesChanged: () => void
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function LeadNotesModal({
  studentId,
  studentName,
  onClose,
  onNotesChanged,
}: LeadNotesModalProps) {
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      const data = await apiFetch<{ notes: StudentNote[] }>(
        `/api/admin/students/${studentId}/notes`,
      )
      setNotes(data.notes)
    } catch {
      setError('Failed to load notes')
    }
  }, [studentId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const content = newContent.trim()
    if (!content) return

    setSaving(true)
    setError('')
    try {
      await apiFetch(`/api/admin/students/${studentId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      setNewContent('')
      await load()
      onNotesChanged()
    } catch {
      setError('Failed to add note')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(note: StudentNote) {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditContent('')
  }

  async function handleSaveEdit(noteId: string) {
    const content = editContent.trim()
    if (!content) return

    setSaving(true)
    setError('')
    try {
      await apiFetch(`/api/admin/students/${studentId}/notes/${noteId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      })
      setEditingId(null)
      setEditContent('')
      await load()
      onNotesChanged()
    } catch {
      setError('Failed to update note')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(noteId: string) {
    if (!window.confirm('Delete this note?')) return

    setSaving(true)
    setError('')
    try {
      await apiFetch(`/api/admin/students/${studentId}/notes/${noteId}`, {
        method: 'DELETE',
      })
      await load()
      onNotesChanged()
    } catch {
      setError('Failed to delete note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-notes-title"
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-lg border border-gray-200 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 id="lead-notes-title" className="text-lg font-bold">
            Notes — {studentName ?? 'Lead'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {error && <ErrorBanner message={error} onRetry={load} />}

          {notes.length === 0 ? (
            <p className="mb-4 text-center text-sm text-gray-500">No notes yet.</p>
          ) : (
            <ul className="mb-4 space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="rounded-lg border border-gray-200 p-3">
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={saving || !editContent.trim()}
                          onClick={() => handleSaveEdit(note.id)}
                          className="rounded bg-[var(--accent-primary)] px-3 py-1 text-sm text-white hover:opacity-90 disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap text-sm text-gray-900">{note.content}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {note.author_email} · {formatTimestamp(note.created_at)}
                        {note.updated_at !== note.created_at &&
                          ` (edited ${formatTimestamp(note.updated_at)})`}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(note)}
                          className="text-xs text-[var(--accent-primary)] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAdd} className="border-t border-gray-200 px-4 py-3">
          <label className="mb-1 block text-sm font-medium" htmlFor="new-note">
            Add note
          </label>
          <textarea
            id="new-note"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            placeholder="Write a note…"
            className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
          <button
            type="submit"
            disabled={saving || !newContent.trim()}
            className="rounded bg-[var(--accent-primary)] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          >
            Save note
          </button>
        </form>
      </div>
    </div>
  )
}
