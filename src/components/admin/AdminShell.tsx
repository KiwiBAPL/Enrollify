import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary'
import { ADMIN_BASE } from '@/lib/admin/constants'
import { signOut } from '@/lib/admin/auth'

const navItems = [
  { href: ADMIN_BASE, label: 'Dashboard', end: true },
  { href: `${ADMIN_BASE}/posts`, label: 'Blog', end: false },
  { href: `${ADMIN_BASE}/settings/ai-providers`, label: 'AI Providers', end: false },
  { href: `${ADMIN_BASE}/settings/profile`, label: 'Profile', end: false },
]

export function AdminShell() {
  const pathname = useLocation().pathname
  const navigate = useNavigate()

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex, nofollow')

    return () => {
      robots?.setAttribute('content', 'index, follow')
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <aside className="w-56 border-r border-gray-200 bg-white p-4">
        <h1 className="mb-6 text-lg font-bold text-[var(--accent-primary)]">Enrollify Admin</h1>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = item.end
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ${
                  active ? 'bg-[var(--accent-mint)] font-medium' : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <button
          type="button"
          onClick={async () => {
            await signOut()
            navigate(`${ADMIN_BASE}/login`)
          }}
          className="mt-8 rounded px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        >
          Sign out
        </button>
      </aside>
      <main className="flex-1 p-8">
        <AdminErrorBoundary>
          <Outlet />
        </AdminErrorBoundary>
      </main>
    </div>
  )
}
