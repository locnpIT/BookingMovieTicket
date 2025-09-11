import { apiFetch } from './api'
import type { ApiResponse } from './api'

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

export type PageResult<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
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
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const body = (await res.json()) as Partial<ApiResponse<unknown>>
        if (body?.message) msg = body.message
      } catch {}
      throw new Error(msg)
    }
    return (await res.json()) as ApiResponse<MovieDTO>
  },
  async update(id: number, payload: MovieUpdate, token: string): Promise<ApiResponse<MovieDTO>> {
    const res = await fetch(`/api/movies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const body = (await res.json()) as Partial<ApiResponse<unknown>>
        if (body?.message) msg = body.message
      } catch {}
      throw new Error(msg)
    }
    return (await res.json()) as ApiResponse<MovieDTO>
  },
}
