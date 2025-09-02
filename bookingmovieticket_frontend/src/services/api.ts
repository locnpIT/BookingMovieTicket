export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  statusCode: number
  timestamp: string
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
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })

  if (!res.ok) {
    // Try parse ApiResponse error
    let msg = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as Partial<ApiResponse<unknown>>
      if (body?.message) msg = body.message
    } catch {
      // ignore
    }
    throw new Error(msg)
  }

  return (await res.json()) as T
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

