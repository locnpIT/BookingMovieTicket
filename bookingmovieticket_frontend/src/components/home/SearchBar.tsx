import { useState } from 'react'

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false)
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border bg-white/90 px-4 py-2.5 shadow-md backdrop-blur transition ${
        focus ? 'border-sky-400 ring-2 ring-sky-300' : 'border-gray-300'
      }`}
    >
      <span className="text-sky-600">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Tìm phim, đạo diễn, thể loại..."
        aria-label="Tìm kiếm phim"
        className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />
    </div>
  )
}
