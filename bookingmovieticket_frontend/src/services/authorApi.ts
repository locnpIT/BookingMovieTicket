import { apiFetch } from './api'
import type { ApiResponse, PageResult } from './api'

export type AuthorDTO = {
  id: number
  name: string
  birthDate?: string
  bio?: string
  imageUrl?: string
  imagePublicId?: string
}

export type AuthorStats = {
  totalAuthors: number
  authorsWithImage: number
  authorsWithoutImage: number
}

export const authorApi = {
  async stats(): Promise<AuthorStats> {
    return await apiFetch<AuthorStats>('/api/authors/stats')
  },
  async get(id: number): Promise<AuthorDTO> {
    return await apiFetch<AuthorDTO>(`/api/authors/${id}`)
  },
  async list(): Promise<AuthorDTO[]> {
    return await apiFetch<AuthorDTO[]>('/api/authors')
  },
  async listPaged(page = 0, size = 10): Promise<PageResult<AuthorDTO>> {
    return await apiFetch<PageResult<AuthorDTO>>(`/api/authors/paged?page=${page}&size=${size}`)
  },
  async create(form: FormData, token: string): Promise<ApiResponse<AuthorDTO>> {
    return await apiFetch<ApiResponse<AuthorDTO>>('/api/authors', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
  },
  async update(id: number, payload: Partial<Pick<AuthorDTO, 'name' | 'birthDate' | 'bio'>>, token: string): Promise<ApiResponse<AuthorDTO>> {
    return await apiFetch<ApiResponse<AuthorDTO>>(`/api/authors/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
  },
  async remove(id: number, token: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/authors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
  async uploadImage(id: number, file: File, token: string): Promise<ApiResponse<AuthorDTO>> {
    const fd = new FormData()
    fd.append('file', file)
    return await apiFetch<ApiResponse<AuthorDTO>>(`/api/authors/${id}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
  },
}
