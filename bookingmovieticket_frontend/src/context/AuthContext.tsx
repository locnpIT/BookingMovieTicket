import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '../services/api'
import type { AuthResponse } from '../services/api'

type JwtPayload = { email?: string; firstName?: string; lastName?: string; role?: string; roleName?: string; [k: string]: unknown }
type UserInfoData = { email?: string; firstName?: string; lastName?: string; role?: string }
type UserInfo = UserInfoData | null
type AuthState = {
  token: string | null
  user: UserInfo
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (patch: Partial<UserInfoData>) => void
}

function decodeJwt(t: string): JwtPayload | null {
  try {
    const parts = t.split('.')
    if (parts.length !== 3) return null
    const base64Url = parts[1]
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

function mapPayloadToUser(payload: JwtPayload | null): UserInfo {
  if (!payload) return null
  return {
    email: payload.email as string | undefined,
    firstName: payload.firstName as string | undefined,
    lastName: payload.lastName as string | undefined,
    role: (payload.role as string | undefined) || (payload.roleName as string | undefined),
  }
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null))
  const [user, setUser] = useState<UserInfo>(null)

  const updateUserInfo = useCallback((patch: Partial<UserInfoData>) => {
    setUser((prev) => {
      if (!prev) {
        const next = { ...patch } as UserInfoData
        return Object.keys(next).length === 0 ? null : next
      }
      return { ...prev, ...patch }
    })
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token)
      setUser(mapPayloadToUser(decodeJwt(token)))
    } else {
      localStorage.removeItem('accessToken')
      setUser(null)
    }
  }, [token])

  useEffect(() => {
    const handleForcedLogout = () => {
      setToken(null)
    }
    const handleTokenUpdate = (event: Event) => {
      const detail = (event as CustomEvent<AuthResponse>).detail
      if (!detail) return
      setToken(detail.accessToken)
    }

    window.addEventListener('auth:logout', handleForcedLogout)
    window.addEventListener('auth:token', handleTokenUpdate)
    return () => {
      window.removeEventListener('auth:logout', handleForcedLogout)
      window.removeEventListener('auth:token', handleTokenUpdate)
    }
  }, [])

  const value = useMemo<AuthState>(() => ({
    token,
    user,
    async login(email, password) {
      const { accessToken } = await authApi.login(email, password)
      setToken(accessToken)
      setUser(mapPayloadToUser(decodeJwt(accessToken)))
    },
    logout() {
      setToken(null)
      setUser(null)
    },
    updateUser: updateUserInfo,
  }), [token, user, updateUserInfo])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
