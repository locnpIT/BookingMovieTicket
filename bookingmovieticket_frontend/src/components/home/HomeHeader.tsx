import LocationSelect from './LocationSelect'
import SearchBar from './SearchBar'

export default function HomeHeader({
  location,
  onLocationChange,
  search,
  onSearchChange,
}: {
  location: string
  onLocationChange: (v: string) => void
  search: string
  onSearchChange: (v: string) => void
}) {
  return (
    <div className="mb-6 rounded-2xl border border-white/60 bg-gradient-to-r from-sky-50 to-indigo-50 p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-white/60">
            <span className="text-xl">🎬</span>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-2xl font-bold text-transparent">
              PhuocLocCine
            </h1>
            <p className="text-sm text-gray-600">Đặt vé nhanh – xem phim hay, ưu đãi ngập tràn</p>
          </div>
        </div>
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
          <LocationSelect value={location} onChange={onLocationChange} />
          <div className="w-full sm:w-80">
            <SearchBar value={search} onChange={onSearchChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
