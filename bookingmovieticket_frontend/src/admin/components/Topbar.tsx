import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth()
  const display = user?.firstName ?? user?.email ?? 'User'
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between rounded-b-3xl border-b border-white/10 bg-white/10 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-xl bg-white/10 p-2 text-slate-200 shadow-md shadow-slate-900/30 ring-1 ring-white/20 transition hover:bg-white/20 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-slate-300">Admin</div>
          <h1 className="text-lg font-semibold text-white">Cinema Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">🔍</span>
          <input
            placeholder="Search anything…"
            className="w-72 rounded-full bg-white/20 px-9 py-2 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:ring-offset-2 focus:ring-offset-slate-900/40"
          />
        </div>
        <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white shadow-lg shadow-slate-900/30 backdrop-blur">
          <span className="text-sm font-medium">{display}</span>
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm">
            <img src="https://i.pravatar.cc/80" className="h-full w-full object-cover" alt="avatar" />
          </span>
        </div>
      </div>
    </header>
  )
}
