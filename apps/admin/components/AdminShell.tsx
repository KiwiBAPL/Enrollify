'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { clearToken, isAuthenticated } from '@/lib/auth'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/settings/ai-providers', label: 'AI Providers' },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-gray-200 bg-white p-4">
        <h1 className="mb-6 text-lg font-bold text-[var(--color-brand)]">Enrollify Admin</h1>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] ${
                pathname === item.href
                  ? 'bg-[var(--color-mint)] font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            clearToken()
            router.push('/login')
          }}
          className="mt-8 rounded px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        >
          Sign out
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
