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

export type UserProfile = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
  dateOfBirth?: string
  roleName?: string
}

export type UpdateProfilePayload = {
  firstName: string
  lastName: string
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

let refreshPromise: Promise<string | null> | null = null

function clearStoredTokens(reason: string) {
  localStorage.removeItem('accessToken')
  window.dispatchEvent(new CustomEvent('auth:logout', { detail: reason }))
}

function storeAccessToken(accessToken: string) {
  localStorage.setItem('accessToken', accessToken)
  window.dispatchEvent(new CustomEvent('auth:token', { detail: { accessToken } }))
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch('/api/oauth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data = (await res.json()) as AuthResponse
        if (!data.accessToken) {
          throw new Error('Missing access token in refresh response')
        }
        storeAccessToken(data.accessToken)
        return data.accessToken
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Session expired'
        clearStoredTokens(message)
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
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
  const rawUrl = typeof input === 'string' ? input : input instanceof Request ? input.url : ''
  let path = rawUrl
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
    const parsed = new URL(rawUrl, base)
    path = parsed.pathname
  } catch {
    // Ignore invalid URLs; fall back to raw string
  }

  const headersObj: Record<string, string> = {
    ...defaultHeaders,
    ...(init?.headers as Record<string, string> | undefined),
  }

  const hasAuthHeader = Object.keys(headersObj).some((k) => k.toLowerCase() === 'authorization')
  const storedToken = localStorage.getItem('accessToken')
  const shouldAttachAuth = !hasAuthHeader && !!storedToken && path.startsWith('/api') && !path.startsWith('/api/oauth')

  const execute = (tokenOverride?: string) => {
    const finalHeaders: Record<string, string> = { ...headersObj }
    const effectiveToken = tokenOverride ?? storedToken
    if (shouldAttachAuth && effectiveToken) {
      finalHeaders['Authorization'] = `Bearer ${effectiveToken}`
    }
    const finalInit: RequestInit = {
      ...(init || {}),
      headers: finalHeaders as HeadersInit,
    }
    if (input instanceof Request) {
      return fetch(new Request(input, finalInit))
    }
    return fetch(input, finalInit)
  }

  let res = await execute()
  let triedRefresh = false
  let refreshedToken: string | null = null

  if (res.status === 401 && shouldAttachAuth) {
    triedRefresh = true
    refreshedToken = await refreshAccessToken()
    if (refreshedToken) {
      res = await execute(refreshedToken)
    }
  }

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

    if (res.status === 401) {
      if (!triedRefresh || (triedRefresh && refreshedToken)) {
        clearStoredTokens(msg)
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

  const text = await res.text()
  if (!text || !text.trim()) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined as T
  }
}

export const authApi = {
  async login(email: string, password: string) {
    const body = JSON.stringify({ email, password })
    const data = await apiFetch<AuthResponse>('/api/oauth/login', {
      method: 'POST',
      body,
      credentials: 'include',
    })
    return data
  },
  async register(payload: RegisterRequest) {
    const body = JSON.stringify(payload)
    const data = await apiFetch<ApiResponse<unknown>>('/api/oauth/register', { method: 'POST', body })
    return data
  },
  async forgotPassword(email: string) {
    const body = JSON.stringify({ email })
    const res = await apiFetch<ApiResponse<string | null>>('/api/oauth/forgot-password', {
      method: 'POST',
      body,
    })
    return res.message || 'Vui lòng kiểm tra email của bạn'
  },
  async validateResetToken(token: string) {
    const params = new URLSearchParams({ token })
    await apiFetch<ApiResponse<string>>(`/api/oauth/reset-password/validate?${params.toString()}`)
    return true
  },
  async resetPassword(payload: { token: string; newPassword: string; confirmPassword: string }) {
    const body = JSON.stringify(payload)
    const res = await apiFetch<ApiResponse<string | null>>('/api/oauth/reset-password', {
      method: 'POST',
      body,
    })
    return res.message || 'Đổi mật khẩu thành công'
  },
}

export const accountApi = {
  async updateProfile(payload: UpdateProfilePayload) {
    const body = JSON.stringify(payload)
    const res = await apiFetch<ApiResponse<UserProfile>>('/api/account/profile', { method: 'PUT', body })
    return res.data
  },
  async changePassword(payload: ChangePasswordPayload) {
    const body = JSON.stringify(payload)
    const res = await apiFetch<ApiResponse<string | null>>('/api/account/change-password', {
      method: 'POST',
      body,
    })
    return res.message || 'Đổi mật khẩu thành công'
  },
}
