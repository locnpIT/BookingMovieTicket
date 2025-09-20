import { useEffect, useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import { adminApi, type RevenueSummary } from '../../services/adminApi'
import { useAuth } from '../../context/AuthContext'

function formatCurrency(value?: number | string | null) {
  if (value == null) return '0đ'
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return '0đ'
  return `${num.toLocaleString('vi-VN')}đ`
}

export default function Dashboard() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<RevenueSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await adminApi.getRevenueSummary(token)
        if (!cancelled) setSummary(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Không tải được báo cáo doanh thu')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [token])

  const daily = summary?.dailyRevenue ?? []
  const topMovies = summary?.topMovies ?? []

  const todayRevenue = useMemo(() => {
    if (!daily.length) return 0
    const last = daily[daily.length - 1]
    return last.revenue ?? 0
  }, [daily])

  return (
    <div className="space-y-8 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-transparent p-8 shadow-[0_30px_50px_-25px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-indigo-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-52 w-52 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl font-semibold tracking-tight">Báo cáo doanh thu</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-200/80">
            Tổng quan doanh thu và vé bán ra. Cập nhật theo thời gian thực.
          </p>
        </div>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Doanh thu toàn hệ thống" value={loading ? '...' : formatCurrency(summary?.totalRevenue)} />
        <StatCard title="Doanh thu 30 ngày" value={loading ? '...' : formatCurrency(summary?.revenueLast30Days)} />
        <StatCard title="Đơn đặt vé" value={loading ? '...' : String(summary?.totalBookings ?? 0)} />
        <StatCard title="Vé đã bán" value={loading ? '...' : String(summary?.totalTickets ?? 0)} delta={loading ? undefined : `${daily.reduce((sum, d) => sum + (d.ticketCount || 0), 0)} vé/7 ngày`} />
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_45px_-25px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <h3 className="text-lg font-semibold text-white">Doanh thu 7 ngày qua</h3>
          {loading ? (
            <div className="mt-4 text-sm text-slate-200/80">Đang tải...</div>
          ) : daily.length === 0 ? (
            <div className="mt-4 text-sm text-slate-200/80">Chưa có dữ liệu.</div>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-slate-200/80">
              {daily.map((item) => (
                <li key={item.date} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                  <span>{item.date}</span>
                  <span className="font-semibold text-white">{formatCurrency(item.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_45px_-25px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <h3 className="text-lg font-semibold text-white">Top phim theo doanh thu (30 ngày)</h3>
          {loading ? (
            <div className="mt-4 text-sm text-slate-200/80">Đang tải...</div>
          ) : topMovies.length === 0 ? (
            <div className="mt-4 text-sm text-slate-200/80">Chưa có phim nào.</div>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-slate-200/80">
              {topMovies.map((movie) => (
                <li key={movie.movieId} className="rounded-xl bg-white/10 px-3 py-2">
                  <div className="font-semibold text-white">{movie.movieTitle}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span>{movie.bookingCount} đơn</span>
                    <span className="text-white/90">{formatCurrency(movie.revenue)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_45px_-25px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          <h3 className="text-lg font-semibold text-white">Chỉ số nhanh</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-200/80">
            <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
              <span>Doanh thu hôm nay</span>
              <span className="font-semibold text-white">{formatCurrency(todayRevenue)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
              <span>Vé bán trong 7 ngày</span>
              <span className="font-semibold text-white">{daily.reduce((sum, item) => sum + (item.ticketCount || 0), 0)} vé</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
              <span>Đơn đặt trong 7 ngày</span>
              <span className="font-semibold text-white">{daily.reduce((sum, item) => sum + (item.bookingCount || 0), 0)} đơn</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
