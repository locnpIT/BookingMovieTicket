import { apiFetch } from './api'
import type { ApiResponse } from './api'

export type ProvinceDTO = {
  id: number
  name: string
}

export type ProvinceCreate = { name: string }
export type ProvinceUpdate = Partial<ProvinceCreate>

export const provinceApi = {
  async list(): Promise<ProvinceDTO[]> {
    return await apiFetch<ProvinceDTO[]>('/api/provinces')
  },
  async create(payload: ProvinceCreate, token?: string): Promise<ApiResponse<ProvinceDTO>> {
    return await apiFetch<ApiResponse<ProvinceDTO>>('/api/provinces', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async update(id: number, payload: ProvinceUpdate, token?: string): Promise<ApiResponse<ProvinceDTO>> {
    return await apiFetch<ApiResponse<ProvinceDTO>>(`/api/provinces/${id}`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async remove(id: number, token?: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/provinces/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
}

