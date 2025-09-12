import { apiFetch } from './api'
import type { ApiResponse, PageResult } from './api'

export type DirectorDTO = {
  id: number
  name: string
  birthDate?: string
  bio?: string
  imageUrl?: string
  imagePublicId?: string
}

export const directorApi = {
  async list(): Promise<DirectorDTO[]> {
    return await apiFetch<DirectorDTO[]>('/api/directors')
  },
  async listPaged(page = 0, size = 10): Promise<PageResult<DirectorDTO>> {
    return await apiFetch<PageResult<DirectorDTO>>(`/api/directors/paged?page=${page}&size=${size}`)
  },
  async create(form: FormData, token: string): Promise<ApiResponse<DirectorDTO>> {
    return await apiFetch<ApiResponse<DirectorDTO>>('/api/directors', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
  },
  async update(id: number, payload: Partial<Pick<DirectorDTO, 'name' | 'birthDate' | 'bio'>>, token: string): Promise<ApiResponse<DirectorDTO>> {
    return await apiFetch<ApiResponse<DirectorDTO>>(`/api/directors/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
  },
  async remove(id: number, token: string): Promise<ApiResponse<void>> {
    return await apiFetch<ApiResponse<void>>(`/api/directors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
  async uploadImage(id: number, file: File, token: string): Promise<ApiResponse<DirectorDTO>> {
    const fd = new FormData()
    fd.append('file', file)
    return await apiFetch<ApiResponse<DirectorDTO>>(`/api/directors/${id}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
  },
}
