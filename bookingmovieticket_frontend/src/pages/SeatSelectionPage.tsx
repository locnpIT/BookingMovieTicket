import { Fragment, useEffect, useMemo, useState } from 'react'
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

  const selectedSeats = useMemo(
    () => seats.filter((s) => selected[s.showSeatId]),
    [seats, selected]
  )

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, item) => sum + Number(item.effectivePrice || 0), 0)
  }, [selectedSeats])

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
      const payUrl = await bookingApi.checkout(showSeatIds, token)
      window.location.href = payUrl
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
      <div className="flex justify-center">
        <div className="space-y-4">
        {Object.keys(byRow).sort().map((row, rowIdx, arr) => {
          const seatsInRow = byRow[row]
          const addVerticalAisle = seatsInRow.length >= 8
          const aisleIndex = addVerticalAisle ? Math.floor(seatsInRow.length / 2) - 1 : -1
          const addHorizontalAisle = arr.length >= 6 && rowIdx === Math.floor(arr.length / 2) - 1

          return (
            <Fragment key={row}>
              <div className="flex items-center gap-2">
                <div className="w-8 text-center text-xs text-gray-500">{row}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {seatsInRow.map((s, idx) => {
                    const isSelected = !!selected[s.showSeatId]
                    const bg =
                      s.status === 'SOLD' || s.status === 'BLOCKED'
                        ? 'bg-gray-400'
                        : isSelected
                        ? 'bg-sky-600'
                        : s.status === 'HOLD'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    const cursor = s.status === 'SOLD' || s.status === 'BLOCKED' ? 'cursor-not-allowed' : 'cursor-pointer'
                    const extra = s.seatType === 'VIP' ? 'ring-2 ring-yellow-400' : s.seatType === 'COUPLE' ? 'ring-2 ring-pink-400' : ''

                    return (
                      <Fragment key={s.showSeatId}>
                        <button
                          onClick={() => toggleSeat(s)}
                          disabled={s.status === 'SOLD' || s.status === 'BLOCKED' || holding}
                          className={`relative inline-flex h-8 w-8 items-center justify-center rounded ${bg} ${cursor} text-white shadow-sm transition hover:brightness-110 ${extra}`}
                          title={`${s.seatNumber} • ${currency(s.effectivePrice)}đ`}
                        >
                          <span className="text-[11px] font-semibold">{s.col}</span>
                        </button>
                        {addVerticalAisle && idx === aisleIndex && (
                          <div className="mx-1 h-9 w-6 rounded-sm bg-gray-200" aria-hidden="true">
                            <span className="sr-only">Lối đi</span>
                          </div>
                        )}
                      </Fragment>
                    )
                  })}
                </div>
              </div>
              {addHorizontalAisle && (
                <div className="mx-auto h-6 w-4/5 rounded bg-gray-200" aria-hidden="true" />
              )}
            </Fragment>
          )
        })}
        </div>
      </div>
        </div>
      )}

      {/* Footer */}
      <div className="sticky bottom-4 mt-6 rounded-2xl bg-white/90 p-3 shadow-lg ring-1 ring-gray-100 backdrop-blur">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="text-sm text-gray-700">
            Đã chọn: {selectedSeats.map((s) => s.seatNumber).join(', ') || '—'}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            Tổng tiền: {totalPrice > 0 ? `${currency(totalPrice)}đ` : '0đ'}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={confirmBooking} loading={confirming}>Xác nhận đặt vé</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
