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
      className={`group relative flex h-full min-h-[22rem] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:border-sky-300/60 hover:shadow-[0_25px_50px_-12px_rgba(14,116,144,0.4)] ${
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
          <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/90 to-amber-600/90 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm ring-2 ring-white/30 transition-transform group-hover:scale-110">
            <span className="text-amber-200">★</span> {ratingLabel}
          </div>
        )}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow-lg backdrop-blur-sm ring-2 ring-white/30 transition-transform group-hover:scale-110">
          {movie.ageRating}
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10 hidden items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-white drop-shadow-lg group-hover:flex animate-fadeIn">
          <button
            className="group/btn flex-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 shadow-xl shadow-sky-900/50 transition-all hover:from-sky-400 hover:to-indigo-400 hover:scale-105 active:scale-95"
            aria-label="Đặt vé"
            onClick={handleBookClick}
          >
            <span className="relative z-10">Đặt vé</span>
          </button>
          <button
            className="flex-1 rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm px-4 py-2.5 transition-all hover:bg-white/30 hover:scale-105 active:scale-95"
            aria-label="Xem trailer"
          >
            Trailer
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">{movie.title}</h3>
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-sky-500">🎭</span>
              {movie.language}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-indigo-500">⏰</span>
              {movie.duration} phút
            </span>
          </div>
        </div>

        {topGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topGenres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200/60 transition-all group-hover:from-sky-50 group-hover:to-indigo-50 group-hover:text-sky-700 group-hover:ring-sky-200"
              >
                🎞 {genre}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-200/60 pt-3 text-sm font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-sky-600">
            <span className="text-base">📅</span>
            {formatDateDisplay(movie.releaseDate)}
          </span>
          <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-indigo-600">
            <span className="text-base">⏱</span>
            {movie.status === 'NOW_SHOWING' ? 'Đang chiếu' : movie.status === 'UPCOMING' ? 'Sắp chiếu' : 'Đã kết thúc'}
          </span>
        </div>
      </div>
    </article>
  )
}
