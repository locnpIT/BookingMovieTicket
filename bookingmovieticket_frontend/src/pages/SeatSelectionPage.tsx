import { Fragment, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { showtimeApi } from '../services/showtimeApi'
import type { ShowSeatDTO } from '../services/showtimeApi'
import { bookingApi } from '../services/bookingApi'
import { gameApi } from '../services/gameApi'

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
  const [userPoints, setUserPoints] = useState<number>(0)
  const [usePoints, setUsePoints] = useState(false)
  const [pointsToUse, setPointsToUse] = useState<number>(0)

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
  
  useEffect(() => {
    if (token) {
      gameApi.getPoints(token).then(setUserPoints).catch(() => setUserPoints(0))
    }
  }, [token])

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

  const discountAmount = useMemo(() => {
    if (!usePoints || pointsToUse <= 0) return 0
    const discount = gameApi.pointsToVnd(pointsToUse)
    return Math.min(discount, totalPrice) // Discount cannot exceed total
  }, [usePoints, pointsToUse, totalPrice])

  const finalPrice = useMemo(() => {
    return Math.max(0, totalPrice - discountAmount)
  }, [totalPrice, discountAmount])

  useEffect(() => {
    if (usePoints && userPoints > 0) {
      const maxPointsToUse = Math.min(userPoints, gameApi.vndToPoints(totalPrice))
      setPointsToUse(maxPointsToUse)
    } else {
      setPointsToUse(0)
    }
  }, [usePoints, userPoints, totalPrice])

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
      const points = usePoints ? pointsToUse : 0
      const payUrl = await bookingApi.checkout(showSeatIds, token, points)
      window.location.href = payUrl
    } catch (e) { setError(e instanceof Error ? e.message : 'Đặt vé thất bại') }
    finally { setConfirming(false) }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 animate-fadeIn">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">Chọn ghế</h1>
          <div className="text-sm font-medium text-gray-600">Suất chiếu #{stId}</div>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="group inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Quay lại
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200/50 shadow-sm animate-slideIn">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600 mb-3" />
            <div className="text-sm font-medium text-gray-600">Đang tải ghế...</div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl ring-1 ring-slate-200/60">
          {/* Legend */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-slate-50 to-sky-50 p-4 text-xs font-medium">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              <span className="inline-block h-4 w-4 rounded bg-emerald-500 shadow-sm" /> 
              <span className="text-slate-700">Trống</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              <span className="inline-block h-4 w-4 rounded bg-amber-500 shadow-sm" /> 
              <span className="text-slate-700">Đang giữ</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              <span className="inline-block h-4 w-4 rounded bg-gray-400 shadow-sm" /> 
              <span className="text-slate-700">Hết</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              <span className="inline-block h-4 w-4 rounded bg-sky-600 shadow-sm" /> 
              <span className="text-slate-700">Đã chọn</span>
            </span>
          </div>
          {/* Screen */}
          <div className="relative mx-auto mb-8">
            <div className="mx-auto h-3 w-3/4 rounded-full bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 shadow-inner" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
              <span className="rounded-full bg-white px-4 py-1 text-xs font-bold text-slate-600 shadow-md ring-2 ring-slate-200">MÀN HÌNH</span>
            </div>
          </div>

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
                          className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${cursor} text-white shadow-md transition-all hover:brightness-110 hover:scale-110 active:scale-95 ${extra} ${
                            isSelected ? 'ring-2 ring-sky-400 ring-offset-2' : ''
                          }`}
                          title={`${s.seatNumber} • ${currency(s.effectivePrice)}đ`}
                        >
                          <span className="text-[11px] font-bold">{s.col}</span>
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[8px] text-white shadow-lg">
                              ✓
                            </span>
                          )}
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
      <div className="sticky bottom-4 mt-8 rounded-2xl glass border border-white/60 p-4 shadow-2xl backdrop-blur-md">
        <div className="space-y-4">
          {/* Points discount section */}
          {token && userPoints > 0 && totalPrice > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Sử dụng điểm thưởng ({Math.floor(userPoints)} điểm)
                  </span>
                </label>
                {usePoints && (
                  <span className="text-xs font-medium text-amber-700">
                    Giảm: {currency(discountAmount)}đ
                  </span>
                )}
              </div>
              {usePoints && (
                <div className="text-xs text-gray-600">
                  1 điểm = 10 VND. Bạn có thể dùng tối đa {Math.min(Math.floor(userPoints), gameApi.vndToPoints(totalPrice))} điểm
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm font-medium text-gray-700">
              <span className="font-semibold text-sky-600">Đã chọn:</span>{' '}
              {selectedSeats.length > 0 ? (
                <span className="inline-flex flex-wrap gap-1">
                  {selectedSeats.map((s) => (
                    <span key={s.showSeatId} className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-200">
                      {s.seatNumber}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Tổng tiền: <span className="font-semibold">{currency(totalPrice)}đ</span>
              </div>
              {discountAmount > 0 && (
                <div className="text-sm text-emerald-600">
                  Giảm giá: <span className="font-semibold">-{currency(discountAmount)}đ</span>
                </div>
              )}
              <div className="text-lg font-bold gradient-text">
                Thành tiền: <span className="text-2xl">{currency(finalPrice)}đ</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={confirmBooking} 
                loading={confirming}
                className="rounded-xl px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {confirming ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
