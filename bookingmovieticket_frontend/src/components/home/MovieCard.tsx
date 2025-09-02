import type { Movie } from '../../data/movies'

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="group relative w-56 shrink-0 snap-start overflow-hidden rounded-xl bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-80 w-full overflow-hidden">
        <img src={movie.posterUrl} alt={movie.title} className="h-full w-full origin-center transform object-cover transition-transform duration-500 group-hover:scale-105" />
        {movie.rating && (
          <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-yellow-300">★ {movie.rating}</div>
        )}
        <div className="absolute right-2 top-2 rounded-md bg-white/85 px-2 py-0.5 text-xs font-semibold text-gray-800">{movie.ageRating}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
        <button className="absolute bottom-2 left-2 right-2 hidden rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-700 group-hover:block">
          Đặt vé
        </button>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 h-14 text-lg font-semibold text-gray-900">{movie.title}</h3>
        <div className="mt-1 flex items-center justify-between text-base text-gray-600">
          <span>{movie.ageRating}</span>
          <span>{movie.duration}p</span>
        </div>
        <div className="mt-1 line-clamp-1 text-base text-gray-500">{movie.genres.join(', ')}</div>
      </div>
    </div>
  )
}
