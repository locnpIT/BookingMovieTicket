import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '../services/api'

type JwtPayload = { email?: string; firstName?: string; lastName?: string; role?: string; [k: string]: unknown }
type UserInfo = { email?: string; firstName?: string; lastName?: string; role?: string } | null
type AuthState = {
  token: string | null
  user: UserInfo
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'))
  const [user, setUser] = useState<UserInfo>(null)

  function parseJwt(t: string): JwtPayload | null {
    try {
      const parts = t.split('.')
      if (parts.length !== 3) return null
      const base64Url = parts[1]
      // Convert base64url -> base64 and decode to bytes
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const padLen = (4 - (base64.length % 4)) % 4
      const padded = base64 + '='.repeat(padLen)
      const binary = atob(padded)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const json = new TextDecoder('utf-8').decode(bytes)
      return JSON.parse(json)
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (token) localStorage.setItem('accessToken', token)
    else localStorage.removeItem('accessToken')
    if (token) {
      const payload = parseJwt(token)
      setUser(payload ? {
        email: payload.email as string | undefined,
        firstName: payload.firstName as string | undefined,
        lastName: payload.lastName as string | undefined,
        role: (payload.role as string | undefined) || (payload.roleName as string | undefined),
      } : null)
    } else {
      setUser(null)
    }
  }, [token])

  const value = useMemo<AuthState>(() => ({
    token,
    user,
    async login(email, password) {
      const { accessToken } = await authApi.login(email, password)
      setToken(accessToken)
      const payload = parseJwt(accessToken)
      setUser(payload ? {
        email: payload.email as string | undefined,
        firstName: payload.firstName as string | undefined,
        lastName: payload.lastName as string | undefined,
        role: (payload.role as string | undefined) || (payload.roleName as string | undefined),
      } : null)
    },
    logout() {
      setToken(null)
    },
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
