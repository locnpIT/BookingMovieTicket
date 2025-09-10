import { apiFetch } from './api'
import type { ApiResponse } from './api'

export type DirectorDTO = {
  id: number
  name: string
  birthDate?: string
  bio?: string
  imageUrl?: string
  imagePublicId?: string
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

export const directorApi = {
  async list(): Promise<DirectorDTO[]> {
    return await apiFetch<DirectorDTO[]>('/api/directors')
  },
  async listPaged(page = 0, size = 10): Promise<PageResult<DirectorDTO>> {
    return await apiFetch<PageResult<DirectorDTO>>(`/api/directors/paged?page=${page}&size=${size}`)
  },
  async create(form: FormData, token: string): Promise<ApiResponse<DirectorDTO>> {
    const res = await fetch('/api/directors', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const body = (await res.json()) as Partial<ApiResponse<unknown>>
        if (body?.message) msg = body.message
      } catch {}
      throw new Error(msg)
    }
    return (await res.json()) as ApiResponse<DirectorDTO>
  },
  async update(id: number, payload: Partial<Pick<DirectorDTO, 'name' | 'birthDate' | 'bio'>>, token: string): Promise<ApiResponse<DirectorDTO>> {
    const res = await fetch(`/api/directors/${id}`, {
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
    return (await res.json()) as ApiResponse<DirectorDTO>
  },
  async remove(id: number, token: string): Promise<ApiResponse<void>> {
    const res = await fetch(`/api/directors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const body = (await res.json()) as Partial<ApiResponse<unknown>>
        if (body?.message) msg = body.message
      } catch {}
      throw new Error(msg)
    }
    return (await res.json()) as ApiResponse<void>
  },
  async uploadImage(id: number, file: File, token: string): Promise<ApiResponse<DirectorDTO>> {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`/api/directors/${id}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const body = (await res.json()) as Partial<ApiResponse<unknown>>
        if (body?.message) msg = body.message
      } catch {}
      throw new Error(msg)
    }
    return (await res.json()) as ApiResponse<DirectorDTO>
  },
}

