import { clearToken, getToken } from './auth'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, { ...options, headers })

  if (response.status === 401) {
    clearToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError('Unauthorized', 401)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError((body as { error?: string }).error ?? 'Request failed', response.status)
  }

  if (response.headers.get('content-type')?.includes('text/csv')) {
    return (await response.text()) as T
  }

  return response.json() as Promise<T>
}

export async function login(email: string, password: string): Promise<string> {
  const data = await apiFetch<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return data.token
}
