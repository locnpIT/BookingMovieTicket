import { NavLink } from 'react-router-dom'

const base =
  'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition duration-150 text-white/85'

type SidebarProps = {
  onNavigate?: () => void
}

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: '📊' },
  { to: '/admin/movies', label: 'Movies', icon: '🎞️' },
  { to: '/admin/showtimes', label: 'Showtimes', icon: '🕒' },
  { to: '/admin/provinces', label: 'Provinces', icon: '🗺️' },
  { to: '/admin/users', label: 'Users', icon: '👤' },
  { to: '/admin/directors', label: 'Directors', icon: '🎬' },
  { to: '/admin/authors', label: 'Authors', icon: '✍️' },
  { to: '/admin/theaters', label: 'Theaters', icon: '🏢' },
  { to: '/admin/rooms', label: 'Rooms', icon: '🛋️' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  return (
    <aside className="w-72 shrink-0 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_50px_-25px_rgba(0,0,0,0.65)] backdrop-blur-xl md:sticky md:top-20 md:h-[calc(100vh-5.5rem)] md:overflow-y-auto">
      <div className="mb-8 inline-flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-lg text-white shadow-lg shadow-sky-900/30">
          🎬
        </span>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-slate-300">Booking</div>
          <div className="text-lg font-semibold text-white/90">Control Center</div>
        </div>
      </div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</div>
      <nav className="space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `${base} ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/80 to-indigo-500/80 text-white shadow-lg shadow-slate-900/40 ring-1 ring-white/20'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
