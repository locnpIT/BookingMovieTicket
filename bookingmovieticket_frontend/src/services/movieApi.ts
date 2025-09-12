import { apiFetch } from './api'
import type { ApiResponse, PageResult } from './api'

export type MovieDTO = {
  id: number
  title: string
  imageUrl?: string
  trailerUrl?: string
  releaseDate: string
  duration: number
  avgRating?: number
  language: string
  ageRating: string
  status: 'UPCOMING' | 'NOW_SHOWING' | 'ENDED'
  genreNames?: string[]
}

export type MovieCreate = {
  title: string
  duration: number
  releaseDate: string // yyyy-MM-dd
  imageUrl?: string
  trailerUrl?: string
  ageRating: string
  language: string
  description?: string
  genreIds: number[]
  directorIds: number[]
  authorIds: number[]
}

export type MovieUpdate = Partial<Omit<MovieCreate, 'genreIds' | 'directorIds' | 'authorIds'>> & {
  genreIds?: number[]
  directorIds?: number[]
  authorIds?: number[]
  status?: 'UPCOMING' | 'NOW_SHOWING' | 'ENDED'
}

export const movieApi = {
  async get(id: number): Promise<MovieDTO> {
    return await apiFetch<MovieDTO>(`/api/movies/${id}`)
  },
  async list(status?: MovieDTO['status']): Promise<MovieDTO[]> {
    const qs = status ? `?status=${status}` : ''
    return await apiFetch<MovieDTO[]>(`/api/movies${qs}`)
  },
  async listPaged(page = 0, size = 10, status?: MovieDTO['status']): Promise<PageResult<MovieDTO>> {
    const sp = new URLSearchParams()
    sp.set('page', String(page))
    sp.set('size', String(size))
    if (status) sp.set('status', status)
    return await apiFetch<PageResult<MovieDTO>>(`/api/movies/paged?${sp.toString()}`)
  },
  async create(payload: MovieCreate, token: string): Promise<ApiResponse<MovieDTO>> {
    return await apiFetch<ApiResponse<MovieDTO>>('/api/movies', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
  },
  async update(id: number, payload: MovieUpdate, token: string): Promise<ApiResponse<MovieDTO>> {
    return await apiFetch<ApiResponse<MovieDTO>>(`/api/movies/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
  },
  async remove(id: number, token: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/movies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
  async uploadImage(id: number, file: File, token: string): Promise<ApiResponse<MovieDTO>> {
    const fd = new FormData()
    fd.append('file', file)
    return await apiFetch<ApiResponse<MovieDTO>>(`/api/movies/${id}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
  },
}
