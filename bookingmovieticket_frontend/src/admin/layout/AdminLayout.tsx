import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
        <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-sky-500/40 blur-3xl" />
        <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/40 blur-[100px]" />
      </div>
      <div className="relative z-10 admin-surface">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 backdrop-blur-sm bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="relative z-10 h-full w-72 bg-slate-900/80 backdrop-blur shadow-2xl ring-1 ring-slate-700/60">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
        <div className="mx-auto flex w-full max-w-screen-2xl px-3 pb-10 md:px-6">
          <div className="hidden md:block md:pt-16">
            <Sidebar />
          </div>
          <main className="min-h-[calc(100vh-3.5rem)] flex-1 pt-20 md:pl-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_45px_-30px_rgba(15,23,42,1)] backdrop-blur-xl md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
