import { useEffect, useState } from 'react'
import { bookingApi, type BookingDTO } from '../services/bookingApi'
import { useAuth } from '../context/AuthContext'

export default function BookingHistoryPage() {
  const { token } = useAuth()
  const [items, setItems] = useState<BookingDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await bookingApi.history(token)
        if (!alive) return
        setItems(res.data ?? [])
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Không tải được lịch sử đặt vé')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [token])

  if (!token) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Lịch sử đặt vé</h1>
      <p className="mt-2 text-sm text-slate-600">Xem lại các giao dịch bạn đã thực hiện tại PhuocLocCine.</p>

      {loading ? (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">Đang tải...</div>
      ) : error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
          Bạn chưa có giao dịch nào.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((booking) => (
            <div key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Mã đặt vé: {booking.bookingCode}</h2>
                  <div className="text-sm text-slate-600">Ngày đặt: {booking.bookingTime ? new Date(booking.bookingTime).toLocaleString('vi-VN') : '—'}</div>
                </div>
                <div className="text-sm font-semibold text-slate-800">Tổng tiền: {Number(booking.totalPrice ?? 0).toLocaleString('vi-VN')}đ</div>
              </div>
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="font-medium text-slate-700">Danh sách vé</div>
                <ul className="mt-2 space-y-1">
                  {booking.tickets?.map((ticket) => (
                    <li key={ticket.id} className="flex items-center justify-between">
                      <span>Ghế {ticket.seatNumber}</span>
                      <span className="text-slate-800">{Number(ticket.price ?? 0).toLocaleString('vi-VN')}đ</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
