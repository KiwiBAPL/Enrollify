export function AdminConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="max-w-md rounded-lg border border-amber-300 bg-amber-50 p-6 text-sm text-amber-950">
        <h1 className="mb-2 text-lg font-bold">Admin configuration missing</h1>
        <p className="mb-3">
          This build is missing <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-xs">VITE_SUPABASE_PUBLISHABLE_KEY</code>. Set them in Netlify
          environment variables and redeploy.
        </p>
        <p className="text-xs text-amber-800">
          Site configuration → Environment variables → trigger a new deploy.
        </p>
      </div>
    </div>
  )
}
