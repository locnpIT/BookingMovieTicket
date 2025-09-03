import MovieCard from './MovieCard'
import type { Movie } from '../../data/movies'
import { useState } from 'react'

export default function MovieGridSection({ title, movies }: { title: string; movies: Movie[] }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? movies : movies.slice(0, 8)
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="relative pl-3 text-xl font-semibold text-gray-900 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1.5 before:rounded-full before:bg-gradient-to-b before:from-sky-500 before:to-indigo-500">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((m) => (
          <MovieCard key={m.id} movie={m} className="w-full" />
        ))}
      </div>
      {movies.length > 8 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-sky-700 shadow hover:bg-gray-50 cursor-pointer"
          >
            {showAll ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </section>
  )
}
