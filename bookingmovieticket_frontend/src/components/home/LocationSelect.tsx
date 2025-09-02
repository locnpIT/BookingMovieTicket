import { locations } from '../../data/movies'

export default function LocationSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative inline-flex items-center">
      <span className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-lg">📍</span>
      <select
        aria-label="Chọn địa điểm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2 text-sm text-gray-700 shadow-sm backdrop-blur focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
      <span className="pointer-events-none -ml-6 text-gray-400">▾</span>
    </div>
  )
}
