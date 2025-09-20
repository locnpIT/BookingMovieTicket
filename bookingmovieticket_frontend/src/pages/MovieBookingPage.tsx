import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { movieApi, type MovieDTO } from '../services/movieApi'
import { showtimeApi, type ShowtimeDTO } from '../services/showtimeApi'
import { formatDateDisplay } from '../utils/date'

function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function extractDateKey(value: string) {
  const part = value.split('T')[0]
  return part ?? value
}

export default function MovieBookingPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const parsedMovieId = Number(movieId)
  const [movie, setMovie] = useState<MovieDTO | null>(null)
  const [showtimes, setShowtimes] = useState<ShowtimeDTO[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!parsedMovieId || Number.isNaN(parsedMovieId)) {
      setError('Phim không hợp lệ')
      setLoading(false)
      return
    }
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [movieDetail, showtimeItems] = await Promise.all([
          movieApi.get(parsedMovieId),
          showtimeApi.list(undefined, parsedMovieId),
        ])
        if (!alive) return
        setMovie(movieDetail)
        setShowtimes(showtimeItems)
        if (showtimeItems.length) {
          const firstDate = extractDateKey(showtimeItems[0].startTime)
          setSelectedDate(firstDate)
        }
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Không tải được dữ liệu đặt vé')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [parsedMovieId])

  const dates = useMemo(() => {
    const unique = new Map<string, string>()
    for (const st of showtimes) {
      const key = extractDateKey(st.startTime)
      if (!unique.has(key)) {
        unique.set(key, formatDateDisplay(key))
      }
    }
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }))
  }, [showtimes])

  const filteredShowtimes = useMemo(() => {
    if (!selectedDate) return showtimes
    return showtimes.filter((st) => extractDateKey(st.startTime) === selectedDate)
  }, [showtimes, selectedDate])

  function handleSelectShowtime(st: ShowtimeDTO) {
    navigate(`/book/${st.id}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        ← Quay lại
      </button>

      {loading ? (
        <div className="text-sm text-slate-500">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : !movie ? (
        <div className="text-sm text-slate-500">Không tìm thấy phim.</div>
      ) : (
        <div className="space-y-8">
          <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:gap-6">
            <img src={movie.imageUrl || 'https://via.placeholder.com/160x240?text=No+Image'} alt={movie.title} className="h-44 w-28 rounded-lg object-cover shadow" />
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                {movie.status}
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span>🌐 {movie.language}</span>
                <span>⏱ {movie.duration} phút</span>
                <span>🔖 {movie.ageRating}</span>
              </div>
              {(movie.directorNames?.length ?? 0) > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Đạo diễn:</span>
                  <span>{movie.directorNames?.join(', ')}</span>
                </div>
              )}
              {(movie.authorNames?.length ?? 0) > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Biên kịch:</span>
                  <span>{movie.authorNames?.join(', ')}</span>
                </div>
              )}
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Chọn ngày chiếu</h2>
            {dates.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Hiện chưa có suất chiếu nào cho phim này.
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      selectedDate === d.value
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          {dates.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Chọn suất chiếu</h2>
              {filteredShowtimes.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Không có suất chiếu trong ngày đã chọn.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredShowtimes.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleSelectShowtime(st)}
                      className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-300 hover:shadow"
                    >
                      <span className="text-base font-semibold text-slate-800">{formatTime(st.startTime)}</span>
                      <span className="text-xs text-slate-500">Phòng {st.roomNumber}</span>
                      <span className="text-xs text-slate-500">Giá từ {Number(st.basePrice).toLocaleString('vi-VN')}₫</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
