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
            <span className="text-2xl">🎬</span>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent text-3xl font-extrabold md:text-4xl">
              Trải nghiệm điện ảnh đỉnh cao
            </h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">Đặt vé chỉ trong vài giây • ưu đãi mỗi ngày</p>
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
