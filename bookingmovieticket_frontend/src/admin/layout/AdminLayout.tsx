import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar onMenuClick={() => setMobileOpen(true)} />
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full w-64 bg-white shadow-xl ring-1 ring-gray-100">
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex w-full max-w-screen-2xl mx-auto">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
