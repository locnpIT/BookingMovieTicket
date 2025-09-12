import { NavLink } from 'react-router-dom'

const base = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium'

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white/90 p-4 backdrop-blur md:sticky md:top-14 md:h-[calc(100vh-56px)] md:overflow-y-auto shadow-sm">
      <div className="mb-6 inline-flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow ring-1 ring-white/60">🎬</span>
        <span className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-lg font-semibold text-transparent">Admin</span>
      </div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Management</div>
      <nav className="space-y-1">
        <NavLink to="/admin" end className={({isActive}) => `${base} ${isActive ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-800 ring-1 ring-sky-100' : 'text-gray-700 hover:bg-gray-100'}`}><span>📊</span>Dashboard</NavLink>
        <NavLink to="/admin/movies" className={({isActive}) => `${base} ${isActive ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-800 ring-1 ring-sky-100' : 'text-gray-700 hover:bg-gray-100'}`}><span>🎞️</span>Movies</NavLink>
        <NavLink to="/admin/users" className={({isActive}) => `${base} ${isActive ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-800 ring-1 ring-sky-100' : 'text-gray-700 hover:bg-gray-100'}`}><span>👤</span>Users</NavLink>
        <NavLink to="/admin/directors" className={({isActive}) => `${base} ${isActive ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-800 ring-1 ring-sky-100' : 'text-gray-700 hover:bg-gray-100'}`}><span>🎬</span>Directors</NavLink>
        <NavLink to="/admin/authors" className={({isActive}) => `${base} ${isActive ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-800 ring-1 ring-sky-100' : 'text-gray-700 hover:bg-gray-100'}`}><span>✍️</span>Authors</NavLink>
        <NavLink to="/admin/theaters" className={({isActive}) => `${base} ${isActive ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-800 ring-1 ring-sky-100' : 'text-gray-700 hover:bg-gray-100'}`}><span>🏢</span>Theaters</NavLink>
        <NavLink to="/admin/settings" className={({isActive}) => `${base} ${isActive ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-sky-800 ring-1 ring-sky-100' : 'text-gray-700 hover:bg-gray-100'}`}><span>⚙️</span>Settings</NavLink>
      </nav>
    </aside>
  )
}
