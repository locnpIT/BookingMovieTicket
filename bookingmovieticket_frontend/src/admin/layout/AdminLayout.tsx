import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="flex max-w-7xl">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
