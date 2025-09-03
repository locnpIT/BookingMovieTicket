import { useState, useMemo } from 'react'
import { heroSlides, movies } from '../data/movies'
import HomeHeader from '../components/home/HomeHeader'
import HeroCarousel from '../components/home/HeroCarousel'
import MovieGridSection from '../components/home/MovieGridSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import CategoryTabs from '../components/home/CategoryTabs'

export default function HomePage() {
  const [location, setLocation] = useState('Hà Nội')
  const [search, setSearch] = useState('')

  const nowShowing = useMemo(
    () =>
      movies.filter(
        (m) =>
          m.status === 'NOW_SHOWING' &&
          (!search || m.title.toLowerCase().includes(search.toLowerCase()) || m.genres.join(' ').toLowerCase().includes(search.toLowerCase()))
      ),
    [search]
  )
  const comingSoon = useMemo(
    () =>
      movies.filter(
        (m) =>
          m.status === 'COMING_SOON' &&
          (!search || m.title.toLowerCase().includes(search.toLowerCase()) || m.genres.join(' ').toLowerCase().includes(search.toLowerCase()))
      ),
    [search]
  )

  const imax = useMemo(
    () =>
      movies.filter(
        (m) => m.format === 'IMAX' && (!search || m.title.toLowerCase().includes(search.toLowerCase()) || m.genres.join(' ').toLowerCase().includes(search.toLowerCase()))
      ),
    [search]
  )

  const [tab, setTab] = useState<'NOW_SHOWING' | 'COMING_SOON' | 'IMAX'>('NOW_SHOWING')

  return (
    <>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <HeroCarousel slides={heroSlides} />
      </div>
      <div className="mx-auto max-w-6xl p-4 md:p-6 mt-6">
        <HomeHeader location={location} onLocationChange={setLocation} search={search} onSearchChange={setSearch} />
        <CategoryTabs value={tab} onChange={setTab} />
        {tab === 'NOW_SHOWING' && <MovieGridSection title="Đang chiếu" movies={nowShowing} />}
        {tab === 'COMING_SOON' && <MovieGridSection title="Sắp chiếu" movies={comingSoon} />}
        {tab === 'IMAX' && <MovieGridSection title="IMAX" movies={imax} />}
        <TestimonialsSection />
      </div>
    </>
  )
}
