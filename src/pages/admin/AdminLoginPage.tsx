import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AdminConfigError } from '@/components/admin/AdminConfigError'
import { ADMIN_BASE } from '@/lib/admin/constants'
import { AuthError, isAdminAuthenticated, requestPasswordReset, signInAsAdmin } from '@/lib/admin/auth'
import { ProfileError } from '@/lib/admin/profile'
import { isSupabaseConfigured } from '@/lib/supabase'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const submittingRef = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
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

  if (!isSupabaseConfigured) {
    return <AdminConfigError />
  }

  if (alreadyAuthed) {
    return <Navigate to={ADMIN_BASE} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submittingRef.current) return

    submittingRef.current = true
    setLoading(true)
    setError('')
    setNotice('')

    try {
      await signInAsAdmin(email, password)
      navigate(ADMIN_BASE)
    } catch (err) {
      if (err instanceof AuthError || err instanceof ProfileError) {
        setError(err.message)
      } else {
        setError('Sign in failed')
      }
    } finally {
      submittingRef.current = false
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    setResetting(true)
    setError('')
    setNotice('')

    try {
      await requestPasswordReset(email)
      setNotice('Password reset email sent. Check your inbox, then sign in with the new password.')
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not send reset email')
    } finally {
      setResetting(false)
    }
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
        {notice && (
          <p className="mb-4 text-sm text-green-800">{notice}</p>
        )}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
            autoComplete="current-password"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </label>
        <button
          type="submit"
          disabled={loading || resetting}
          className="w-full rounded bg-[var(--accent-primary)] px-4 py-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <button
          type="button"
          disabled={loading || resetting || !email.trim()}
          onClick={() => void handleForgotPassword()}
          className="mt-3 w-full text-sm text-[var(--accent-primary)] underline hover:opacity-80 disabled:opacity-50"
        >
          {resetting ? 'Sending reset email…' : 'Forgot password?'}
        </button>
      </form>
    </div>
  )
}
