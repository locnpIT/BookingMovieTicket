import type { Movie } from '../../data/movies'
import MovieCard from './MovieCard'
import { useRef } from 'react'

export default function MovieSection({ title, movies }: { title: string; movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null)
  function scrollByDir(dir: -1 | 1) {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth - 80), behavior: 'smooth' })
  }
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="relative pl-3 text-xl font-semibold text-gray-900 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-sky-500 before:to-indigo-500">
          {title}
        </h2>
        <div className="hidden gap-2 md:flex">
          <button onClick={() => scrollByDir(-1)} className="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm hover:bg-white hover:shadow">‹</button>
          <button onClick={() => scrollByDir(1)} className="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm hover:bg-white hover:shadow">›</button>
        </div>
      </div>
      <div ref={ref} className="scrollbar-none flex snap-x gap-6 overflow-x-auto rounded-2xl p-1">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  )
}
