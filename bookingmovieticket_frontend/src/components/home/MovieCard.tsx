import type { Movie } from '../../data/movies'
import { formatDateDisplay } from '../../utils/date'
import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie, className }: { movie: Movie; className?: string }) {
  const navigate = useNavigate()
  const topGenres = movie.genres.slice(0, 3)
  const ratingLabel = typeof movie.rating === 'number' ? movie.rating.toFixed(1) : null

  function handleBookClick() {
    navigate(`/movies/${movie.id}/book`)
  }

  return (
    <article
      className={`group relative flex h-full min-h-[22rem] w-full flex-col overflow-hidden rounded-2xl border border-slate-100/80 bg-white shadow-lg shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_25px_45px_-25px_rgba(14,116,144,0.55)] ${
        className ?? 'w-56'
      }`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent transition-opacity duration-300 group-hover:opacity-100" />

        {ratingLabel && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-amber-300 shadow">
            ★ {ratingLabel}
          </div>
        )}
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
          {movie.ageRating}
        </div>

        <div className="absolute inset-x-3 bottom-3 hidden items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white drop-shadow group-hover:flex">
          <button
            className="flex-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-2 shadow-lg shadow-sky-900/40 transition hover:from-sky-400 hover:to-indigo-400"
            aria-label="Đặt vé"
            onClick={handleBookClick}
          >
            Đặt vé
          </button>
          <button
            className="flex-1 rounded-full border border-white/40 bg-white/15 px-3 py-2 transition hover:bg-white/25"
            aria-label="Xem trailer"
          >
            Trailer
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-slate-900">{movie.title}</h3>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{movie.language}</span>
            <span>{movie.duration} phút</span>
          </div>
        </div>

        {topGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topGenres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600"
              >
                🎞 {genre}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            📅
            {formatDateDisplay(movie.releaseDate)}
          </span>
          <span className="inline-flex items-center gap-1">
            ⏱
            {movie.status === 'NOW_SHOWING' ? 'Đang chiếu' : movie.status === 'UPCOMING' ? 'Sắp chiếu' : 'Đã kết thúc'}
          </span>
        </div>
      </div>
    </article>
  )
}
