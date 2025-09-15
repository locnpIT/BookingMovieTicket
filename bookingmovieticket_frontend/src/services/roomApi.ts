import { apiFetch } from './api'
import type { ApiResponse } from './api'

export type RoomDTO = {
  id: number
  roomNumber: string
  capacity: number
  type: 'STANDAR' | 'VIP' | 'IMAX'
  theaterId: number
  theaterName: string
}

export type RoomCreate = {
  roomNumber: string
  capacity: number
  type: RoomDTO['type']
  theaterId: number
}

export type RoomUpdate = Partial<RoomCreate>

export const roomApi = {
  async list(theaterId?: number): Promise<RoomDTO[]> {
    const sp = new URLSearchParams()
    if (theaterId) sp.set('theaterId', String(theaterId))
    const qs = sp.toString()
    return await apiFetch<RoomDTO[]>(`/api/rooms${qs ? `?${qs}` : ''}`)
  },
  async create(payload: RoomCreate, token?: string): Promise<ApiResponse<RoomDTO>> {
    return await apiFetch<ApiResponse<RoomDTO>>('/api/rooms', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async update(id: number, payload: RoomUpdate, token?: string): Promise<ApiResponse<RoomDTO>> {
    return await apiFetch<ApiResponse<RoomDTO>>(`/api/rooms/${id}`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async remove(id: number, token?: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/rooms/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
}

