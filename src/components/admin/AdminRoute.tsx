import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AdminConfigError } from '@/components/admin/AdminConfigError'
import { ADMIN_BASE } from '@/lib/admin/constants'
import { isAdminAuthenticated } from '@/lib/admin/auth'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export function AdminRoute() {
  const [state, setState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    async function checkAuth() {
      const authed = await isAdminAuthenticated()
      if (!cancelled) {
        setState(authed ? 'authenticated' : 'unauthenticated')
      }
    }

    void checkAuth()

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(() => {
      void checkAuth()
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  if (!isSupabaseConfigured) {
    return <AdminConfigError />
  }

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    )
  }

  if (state === 'unauthenticated') {
    return <Navigate to={`${ADMIN_BASE}/login`} replace />
  }

  return <Outlet />
}
