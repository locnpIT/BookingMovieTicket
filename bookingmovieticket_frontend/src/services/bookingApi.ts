import { apiFetch } from './api'
import type { ApiResponse } from './api'

export type BookingDTO = {
  id: number
  bookingCode: string
  totalPrice: string
  bookingTime: string
  tickets: Array<{
    id: number
    ticketCode: string
    seatNumber: string
    price: string
  }>
}

export const bookingApi = {
  async checkout(showSeatIds: number[], token: string): Promise<string> {
    const res = await apiFetch<ApiResponse<string>>('/api/bookings/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ showSeatIds }),
    })
    return res.data // paymentUrl
  },
  async confirm(showSeatIds: number[], token: string): Promise<ApiResponse<BookingDTO>> {
    return await apiFetch<ApiResponse<BookingDTO>>('/api/bookings/confirm', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ showSeatIds }),
    })
  },
  async history(token: string): Promise<ApiResponse<BookingDTO[]>> {
    return await apiFetch<ApiResponse<BookingDTO[]>>('/api/bookings/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
