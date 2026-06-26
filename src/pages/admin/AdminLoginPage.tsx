import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ADMIN_BASE } from '@/lib/admin/constants'
import { isAdminAuthenticated } from '@/lib/admin/auth'
import { isAdminUser, supabase } from '@/lib/supabase'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [alreadyAuthed, setAlreadyAuthed] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      const authed = await isAdminAuthenticated()
      if (!cancelled) {
        setAlreadyAuthed(authed)
        setCheckingSession(false)
      }
    }

    void checkSession()
    return () => {
      cancelled = true
    }
  }, [])

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    )
  }

  if (alreadyAuthed) {
    return <Navigate to={ADMIN_BASE} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut()
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    navigate(ADMIN_BASE)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-xl font-bold text-[var(--accent-primary)]">Enrollify Admin</h1>
        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[var(--accent-primary)] px-4 py-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
