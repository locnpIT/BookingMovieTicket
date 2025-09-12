export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  statusCode: number
  timestamp: string
}

export type PageResult<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export type AuthResponse = {
  accessToken: string
}

export type RegisterRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  dateOfBirth?: string // ISO yyyy-MM-dd
}

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData
  const defaultHeaders: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' }
  const url = typeof input === 'string' ? input : input instanceof Request ? input.url : ''
  const headersObj: Record<string, string> = { ...defaultHeaders, ...(init?.headers as Record<string, string> | undefined) }
  // Auto attach Authorization if missing and token exists
  const hasAuthHeader = Object.keys(headersObj).some((k) => k.toLowerCase() === 'authorization')
  const token = localStorage.getItem('accessToken')
  if (!hasAuthHeader && token && url.startsWith('/api') && !url.startsWith('/api/oauth')) {
    headersObj['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(input, { ...(init || {}), headers: headersObj as HeadersInit })

  const contentType = (res.headers.get('content-type') || '').toLowerCase()

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    if (contentType.includes('application/json')) {
      try {
        const body = (await res.json()) as Partial<ApiResponse<unknown>>
        if (body?.message) msg = body.message
      } catch {
        // ignore JSON parse error
      }
    } else {
      try {
        const text = await res.text()
        if (text && text.trim()) msg = text
      } catch {
        // ignore
      }
    }
    throw new Error(msg)
  }

  if (res.status === 204) {
    return undefined as T
  }

  if (contentType.includes('application/json')) {
    return (await res.json()) as T
  }

  // Fallback: handle empty or non-JSON success bodies gracefully
  const text = await res.text()
  if (!text || !text.trim()) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    // As a last resort, return undefined to avoid crashing callers
    return undefined as T
  }
}

export const authApi = {
  async login(email: string, password: string) {
    const body = JSON.stringify({ email, password })
    const data = await apiFetch<AuthResponse>('/api/oauth/login', { method: 'POST', body })
    return data
  },
  async register(payload: RegisterRequest) {
    const body = JSON.stringify(payload)
    const data = await apiFetch<ApiResponse<unknown>>('/api/oauth/register', { method: 'POST', body })
    return data
  },
}
