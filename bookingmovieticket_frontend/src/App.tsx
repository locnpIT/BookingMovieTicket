import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import PublicLayout from './layout/PublicLayout'
import AdminLayout from './admin/layout/AdminLayout'
import ProtectedAdminRoute from './components/routing/ProtectedAdminRoute'
import Dashboard from './admin/pages/Dashboard'
import Movies from './admin/pages/Movies'
import Directors from './admin/pages/Directors'
import Users from './admin/pages/Users'
import Theaters from './admin/pages/Theaters'
import Settings from './admin/pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="movies" element={<Movies />} />
        <Route path="directors" element={<Directors />} />
        <Route path="users" element={<Users />} />
        <Route path="theaters" element={<Theaters />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
