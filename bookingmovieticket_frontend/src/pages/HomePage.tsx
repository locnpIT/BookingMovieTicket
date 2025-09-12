import { useEffect, useMemo, useState } from 'react'
import { heroSlides } from '../data/movies'
import HomeHeader from '../components/home/HomeHeader'
import HeroCarousel from '../components/home/HeroCarousel'
import MovieGridSection from '../components/home/MovieGridSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import CategoryTabs from '../components/home/CategoryTabs'
import { movieApi } from '../services/movieApi'
import type { MovieDTO } from '../services/movieApi'
import type { Movie } from '../data/movies'

export default function HomePage() {
  const [location, setLocation] = useState('Hà Nội')
  const [search, setSearch] = useState('')
  const [all, setAll] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function mapDtoToUi(m: MovieDTO): Movie {
    return {
      id: m.id,
      title: m.title,
      posterUrl: m.imageUrl || 'https://via.placeholder.com/320x480?text=No+Image',
      rating: typeof m.avgRating === 'number' ? m.avgRating : undefined,
      duration: m.duration,
      genres: Array.isArray(m.genreNames) ? m.genreNames : [],
      status: m.status === 'NOW_SHOWING' ? 'NOW_SHOWING' : m.status === 'UPCOMING' ? 'COMING_SOON' : 'COMING_SOON',
      releaseDate: m.releaseDate,
      language: m.language,
      ageRating: m.ageRating,
    }
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const items = await movieApi.list()
        if (!alive) return
        setAll(items.map(mapDtoToUi))
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Không tải được phim')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const nowShowing = useMemo(() => {
    const q = search.trim().toLowerCase()
    return all.filter((m) => m.status === 'NOW_SHOWING' && (!q || m.title.toLowerCase().includes(q) || m.genres.join(' ').toLowerCase().includes(q)))
  }, [all, search])

  const comingSoon = useMemo(() => {
    const q = search.trim().toLowerCase()
    return all.filter((m) => m.status === 'COMING_SOON' && (!q || m.title.toLowerCase().includes(q) || m.genres.join(' ').toLowerCase().includes(q)))
  }, [all, search])

  const imax = useMemo(() => {
    // Backend chưa có trường format; tạm thời trả rỗng
    return [] as Movie[]
  }, [])

  const [tab, setTab] = useState<'NOW_SHOWING' | 'COMING_SOON' | 'IMAX'>('NOW_SHOWING')

  return (
    <>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <HeroCarousel slides={heroSlides} />
      </div>
      <div className="mx-auto max-w-6xl p-4 md:p-6 mt-6">
        <HomeHeader location={location} onLocationChange={setLocation} search={search} onSearchChange={setSearch} />
        <CategoryTabs value={tab} onChange={setTab} />
        {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        {loading ? (
          <div className="text-sm text-gray-600">Đang tải phim...</div>
        ) : (
          <>
            {tab === 'NOW_SHOWING' && <MovieGridSection title="Đang chiếu" movies={nowShowing} />} 
            {tab === 'COMING_SOON' && <MovieGridSection title="Sắp chiếu" movies={comingSoon} />} 
            {tab === 'IMAX' && <MovieGridSection title="IMAX" movies={imax} />} 
          </>
        )}
        <TestimonialsSection />
      </div>
    </>
  )
}
