type Tab = {
  label: string
  value: 'NOW_SHOWING' | 'COMING_SOON' | 'IMAX'
}

const TABS: Tab[] = [
  { label: 'Đang chiếu', value: 'NOW_SHOWING' },
  { label: 'Sắp chiếu', value: 'COMING_SOON' },
  { label: 'IMAX', value: 'IMAX' },
]

export default function CategoryTabs({ value, onChange }: { value: Tab['value']; onChange: (v: Tab['value']) => void }) {
  return (
    <div className="mb-4 inline-flex rounded-full bg-white p-1 shadow">
      {TABS.map((t) => {
        const active = value === t.value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
              active ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
