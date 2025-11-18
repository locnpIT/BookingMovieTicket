import { useState } from 'react'

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false)
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-md backdrop-blur transition ${
        focus 
          ? 'border-amber-500/60 ring-2 ring-amber-500/30 bg-slate-800/95' 
          : 'border-red-500/30 bg-slate-800/90'
      }`}
    >
      <span className="text-amber-400">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Tìm phim, đạo diễn, thể loại..."
        aria-label="Tìm kiếm phim"
        className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-400 focus:outline-none"
      />
    </div>
  )
}
