import { locations } from '../../data/movies'

export default function LocationSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative inline-flex items-center">
      <span className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-lg">📍</span>
      <select
        aria-label="Chọn địa điểm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-red-500/30 bg-slate-800/90 pl-10 pr-10 py-2 text-sm text-slate-200 shadow-sm backdrop-blur focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
      >
        {locations.map((loc) => (
          <option key={loc} value={loc} className="bg-slate-800 text-slate-200">
            {loc}
          </option>
        ))}
      </select>
      <span className="pointer-events-none -ml-6 text-slate-400">▾</span>
    </div>
  )
}
