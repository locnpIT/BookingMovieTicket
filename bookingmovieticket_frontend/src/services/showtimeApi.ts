import { apiFetch } from './api'
import type { ApiResponse } from './api'

export type ShowtimeDTO = {
  id: number
  movieId: number
  movieTitle: string
  roomId: number
  roomNumber: string
  startTime: string
  endTime: string
  basePrice: string
  status?: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED'
}

export type ShowSeatDTO = {
  showSeatId: number
  seatId: number
  seatNumber: string
  seatType?: 'NORMAL' | 'VIP' | 'COUPLE'
  status: 'AVAILABLE' | 'HOLD' | 'SOLD' | 'BLOCKED'
  effectivePrice: string
}

export type ShowtimeCreate = {
  movieId: number
  roomId: number
  startTime: string // ISO OffsetDateTime
  basePrice: number
}

export type ShowtimeUpdate = Partial<{
  roomId: number
  startTime: string
  basePrice: number
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED'
}>

export const showtimeApi = {
  async list(date?: string, movieId?: number, roomId?: number): Promise<ShowtimeDTO[]> {
    const sp = new URLSearchParams()
    if (date) sp.set('date', date)
    if (movieId) sp.set('movieId', String(movieId))
    if (roomId) sp.set('roomId', String(roomId))
    return await apiFetch<ShowtimeDTO[]>(`/api/showtimes?${sp.toString()}`)
  },
  async create(payload: ShowtimeCreate, token?: string): Promise<ApiResponse<ShowtimeDTO>> {
    return await apiFetch<ApiResponse<ShowtimeDTO>>('/api/showtimes', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async update(id: number, payload: ShowtimeUpdate, token?: string): Promise<ApiResponse<ShowtimeDTO>> {
    return await apiFetch<ApiResponse<ShowtimeDTO>>(`/api/showtimes/${id}`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload),
    })
  },
  async remove(id: number, token?: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/showtimes/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  async listSeats(showtimeId: number): Promise<ShowSeatDTO[]> {
    return await apiFetch<ShowSeatDTO[]>(`/api/showtimes/${showtimeId}/seats`)
  },
  async holdSeats(showtimeId: number, seatIds: number[], token: string, ttlSeconds = 300): Promise<ApiResponse<ShowSeatDTO[]>> {
    return await apiFetch<ApiResponse<ShowSeatDTO[]>>(`/api/showtimes/${showtimeId}/hold`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ seatIds, ttlSeconds }),
    })
  },
  async releaseSeats(showtimeId: number, showSeatIds: number[], token: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/showtimes/${showtimeId}/hold`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ showSeatIds }),
    })
  },
}
