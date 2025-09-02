import { useState, useMemo } from 'react'
import { heroSlides, movies } from '../data/movies'
import HomeHeader from '../components/home/HomeHeader'
import HeroCarousel from '../components/home/HeroCarousel'
import MovieSection from '../components/home/MovieSection'

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

  return (
    <>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <HeroCarousel slides={heroSlides} />
      </div>
      <div className="mx-auto max-w-6xl p-4 md:p-6 mt-6">
        <HomeHeader location={location} onLocationChange={setLocation} search={search} onSearchChange={setSearch} />
        <MovieSection title="Đang chiếu" movies={nowShowing} />
        <MovieSection title="Sắp chiếu" movies={comingSoon} />
      </div>
    </>
  )
}
