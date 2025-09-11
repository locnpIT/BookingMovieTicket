import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth()
  const display = user?.firstName ?? user?.email ?? 'User'
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white/90 px-3 md:px-4 backdrop-blur shadow-sm">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50" aria-label="Open menu">
          ☰
        </button>
        <h1 className="text-base md:text-lg font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <input placeholder="Search…" className="hidden md:block w-64 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow ring-1 ring-gray-100">
          <span className="text-sm text-gray-700">{display}</span>
          <img src="https://i.pravatar.cc/40" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  )
}
