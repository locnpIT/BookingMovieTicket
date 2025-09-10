import { apiFetch } from './api'

export type AuthorStats = {
  totalAuthors: number
  authorsWithImage: number
  authorsWithoutImage: number
}

export const authorApi = {
  async stats(): Promise<AuthorStats> {
    return await apiFetch<AuthorStats>('/api/authors/stats')
  },
}

