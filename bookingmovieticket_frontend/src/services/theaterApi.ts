import { apiFetch } from './api'
import type { ApiResponse } from './api'

export type TheaterDTO = {
  id: number
  name: string
  provinceId: number
  provinceName: string
  address: string
  phoneNumber?: string
  latitude?: number
  longitude?: number
  imageUrl?: string
}

export type TheaterCreate = {
  name: string
  provinceId: number
  address: string
  phoneNumber?: string
  latitude?: number
  longitude?: number
  imageUrl?: string
}

export type TheaterUpdate = Partial<TheaterCreate>

export const theaterApi = {
  async list(provinceId?: number): Promise<TheaterDTO[]> {
    const sp = new URLSearchParams()
    if (provinceId) sp.set('provinceId', String(provinceId))
    const qs = sp.toString()
    return await apiFetch<TheaterDTO[]>(`/api/theaters${qs ? `?${qs}` : ''}`)
  },
  async create(payload: TheaterCreate, token?: string): Promise<ApiResponse<TheaterDTO>> {
    return await apiFetch<ApiResponse<TheaterDTO>>('/api/theaters', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async update(id: number, payload: TheaterUpdate, token?: string): Promise<ApiResponse<TheaterDTO>> {
    return await apiFetch<ApiResponse<TheaterDTO>>(`/api/theaters/${id}`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async remove(id: number, token?: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/theaters/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
}

