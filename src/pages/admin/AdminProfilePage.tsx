import { useCallback, useEffect, useState } from 'react'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { getStaffProfile, ProfileError, updateStaffProfile, type StaffProfile } from '@/lib/admin/profile'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export function AdminProfilePage() {
  const [profile, setProfile] = useState<StaffProfile | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setError('')
    try {
      const data = await getStaffProfile()
      setProfile(data)
      setFirstName(data.first_name)
      setLastName(data.last_name)
      setEmail(data.email)
    } catch (err) {
      setError(err instanceof ProfileError ? err.message : 'Failed to load profile')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user?.email || !profile) return
      if (session.user.email.toLowerCase() !== profile.email.toLowerCase()) {
        try {
          const updated = await updateStaffProfile({ email: session.user.email })
          setProfile(updated)
          setEmail(updated.email)
        } catch {
          // Profile sync after email confirmation is best-effort
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const trimmedFirst = firstName.trim()
      const trimmedLast = lastName.trim()
      const trimmedEmail = email.trim()

      if (!trimmedFirst || !trimmedLast) {
        setError('First and last name are required')
        setSaving(false)
        return
      }

      const emailChanged =
        profile && trimmedEmail.toLowerCase() !== profile.email.toLowerCase()

      const updated = await updateStaffProfile({
        first_name: trimmedFirst,
        last_name: trimmedLast,
      })

      setProfile(updated)
      setFirstName(updated.first_name)
      setLastName(updated.last_name)

      if (emailChanged) {
        const { error: emailError } = await getSupabase().auth.updateUser({ email: trimmedEmail })
        if (emailError) {
          setError(emailError.message)
          setSaving(false)
          return
        }
        setSuccess('Profile saved. Check your inbox to confirm your new email address.')
      } else {
        setEmail(updated.email)
        setSuccess('Profile saved.')
      }
    } catch (err) {
      setError(err instanceof ProfileError ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const roleLabel = profile?.role === 'admin' ? 'Admin' : 'Consultant'

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Profile</h2>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {success && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-6"
      >
        <div>
          <span className="mb-1 block text-sm font-medium text-gray-600">Role</span>
          <span className="inline-block rounded-full bg-[var(--accent-mint)] px-3 py-1 text-sm font-medium capitalize">
            {roleLabel}
          </span>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">First name</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Last name</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
          <p className="mt-1 text-xs text-gray-500">
            Changing your email sends a confirmation link to the new address.
          </p>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-[var(--accent-primary)] px-4 py-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </>
  )
}
