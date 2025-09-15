import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { showtimeApi } from '../services/showtimeApi'
import type { ShowSeatDTO } from '../services/showtimeApi'
import { bookingApi } from '../services/bookingApi'

type SeatCell = ShowSeatDTO & { row: string; col: number }

function parseSeatNumber(seatNumber: string): { row: string; col: number } {
  const m = seatNumber.match(/([A-Za-z]+)(\d+)/)
  if (!m) return { row: 'Z', col: 0 }
  return { row: m[1].toUpperCase(), col: Number(m[2]) }
}

export default function SeatSelectionPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { showtimeId } = useParams()
  const stId = Number(showtimeId)
  const [seats, setSeats] = useState<SeatCell[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<number, boolean>>({}) // key: showSeatId
  const [holding, setHolding] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [booking, setBooking] = useState<{ code: string; total: string } | null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const data = await showtimeApi.listSeats(stId)
      const enriched: SeatCell[] = data.map(s => ({ ...s, ...parseSeatNumber(s.seatNumber) }))
      enriched.sort((a,b)=> a.row === b.row ? a.col - b.col : a.row.localeCompare(b.row))
      setSeats(enriched)
    } catch (e) { setError(e instanceof Error ? e.message : 'Không tải được ghế') } finally { setLoading(false) }
  }
  useEffect(() => { if (!Number.isNaN(stId)) load() }, [stId])

  const byRow = useMemo(() => {
    const map: Record<string, SeatCell[]> = {}
    for (const s of seats) { if (!map[s.row]) map[s.row] = []; map[s.row].push(s) }
    Object.keys(map).forEach(k => map[k].sort((a,b)=> a.col - b.col))
    return map
  }, [seats])

  const totalPrice = useMemo(() => {
    return Object.values(selected).filter(Boolean).reduce((sum, _v, _i) => sum, 0)
  }, [selected])

  function currency(v: string | number) {
    const num = typeof v === 'string' ? Number(v) : v
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  async function toggleSeat(s: SeatCell) {
    if (s.status === 'SOLD' || s.status === 'BLOCKED') return
    if (!token) { setError('Bạn cần đăng nhập để giữ ghế'); return }
    try {
      setHolding(true)
      if (!selected[s.showSeatId]) {
        // hold by seatId
        await showtimeApi.holdSeats(stId, [s.seatId], token, 300)
      } else {
        await showtimeApi.releaseSeats(stId, [s.showSeatId], token)
      }
      await load()
      setSelected(prev => ({ ...prev, [s.showSeatId]: !prev[s.showSeatId] }))
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể giữ/huỷ ghế'); }
    finally { setHolding(false) }
  }

  async function confirmBooking() {
    if (!token) { setError('Bạn cần đăng nhập để đặt vé'); return }
    const showSeatIds = seats.filter(s => selected[s.showSeatId]).map(s => s.showSeatId)
    if (showSeatIds.length === 0) { setError('Vui lòng chọn ít nhất 1 ghế'); return }
    setConfirming(true); setError(null)
    try {
      const res = await bookingApi.confirm(showSeatIds, token)
      setBooking({ code: res.data.bookingCode, total: res.data.totalPrice })
    } catch (e) { setError(e instanceof Error ? e.message : 'Đặt vé thất bại') }
    finally { setConfirming(false) }
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Chọn ghế</h1>
          <div className="text-sm text-gray-600">Suất chiếu #{stId}</div>
        </div>
        <button onClick={() => navigate(-1)} className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Quay lại</button>
      </div>

      {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
      {loading ? (
        <div className="text-sm text-gray-600">Đang tải ghế...</div>
      ) : (
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-gray-100">
          {/* Legend */}
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-emerald-500" /> Trống</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-amber-500" /> Đang giữ</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-gray-400" /> Hết</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-sky-600" /> Đã chọn</span>
          </div>
          {/* Screen */}
          <div className="mx-auto mb-4 h-2 w-1/2 rounded-full bg-gradient-to-r from-gray-200 to-gray-300" />

          {/* Grid */}
          <div className="space-y-3">
            {Object.keys(byRow).sort().map(row => (
              <div key={row} className="flex items-center gap-2">
                <div className="w-8 text-center text-xs text-gray-500">{row}</div>
                <div className="flex flex-wrap gap-2">
                  {byRow[row].map(s => {
                    const isSelected = !!selected[s.showSeatId]
                    const bg = s.status === 'SOLD' || s.status === 'BLOCKED' ? 'bg-gray-400' : isSelected ? 'bg-sky-600' : s.status === 'HOLD' ? 'bg-amber-500' : 'bg-emerald-500'
                    const cursor = s.status === 'SOLD' || s.status === 'BLOCKED' ? 'cursor-not-allowed' : 'cursor-pointer'
                    const extra = s.seatType === 'VIP' ? 'ring-2 ring-yellow-400' : s.seatType === 'COUPLE' ? 'ring-2 ring-pink-400' : ''
                    return (
                      <button key={s.showSeatId}
                        onClick={() => toggleSeat(s)}
                        disabled={s.status === 'SOLD' || s.status === 'BLOCKED' || holding}
                        className={`relative inline-flex h-8 w-8 items-center justify-center rounded ${bg} ${cursor} text-white shadow-sm transition hover:brightness-110 ${extra}`}
                        title={`${s.seatNumber} • ${currency(s.effectivePrice)}đ`}>
                        <span className="text-[11px] font-semibold">{s.col}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="sticky bottom-4 mt-6 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-gray-100 backdrop-blur">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="text-sm text-gray-700">
            Đã chọn: {seats.filter(s => selected[s.showSeatId]).map(s => s.seatNumber).join(', ') || '—'}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={confirmBooking} loading={confirming}>Xác nhận đặt vé</Button>
          </div>
        </div>
      </div>

      {/* Booking success */}
      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">✓</div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Đặt vé thành công</h3>
            <p className="text-sm text-gray-600">Mã đặt chỗ: <span className="font-mono font-semibold">{booking.code}</span></p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={() => navigate('/')}>Về trang chủ</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

