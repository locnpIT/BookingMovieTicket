import { apiFetch, type ApiResponse } from './api'

export type DailyRevenue = {
  date: string
  revenue: number
  bookingCount: number
  ticketCount: number
}

export type MovieRevenue = {
  movieId: number
  movieTitle: string
  revenue: number
  bookingCount: number
}

export type RevenueSummary = {
  totalRevenue: number
  revenueLast30Days: number
  totalBookings: number
  totalTickets: number
  dailyRevenue: DailyRevenue[]
  topMovies: MovieRevenue[]
}

export const adminApi = {
  async getRevenueSummary(token: string): Promise<RevenueSummary> {
    const res = await apiFetch<ApiResponse<RevenueSummary>>('/api/admin/revenue/summary', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },
}
