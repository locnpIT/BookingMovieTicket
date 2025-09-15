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
import Authors from './admin/pages/Authors'
import Users from './admin/pages/Users'
import Theaters from './admin/pages/Theaters'
import Settings from './admin/pages/Settings'
import Showtimes from './admin/pages/Showtimes'
import Provinces from './admin/pages/Provinces'
import Rooms from './admin/pages/Rooms'
import SeatSelectionPage from './pages/SeatSelectionPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/book/:showtimeId" element={<SeatSelectionPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="movies" element={<Movies />} />
        <Route path="directors" element={<Directors />} />
        <Route path="provinces" element={<Provinces />} />
        <Route path="showtimes" element={<Showtimes />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="authors" element={<Authors />} />
        <Route path="users" element={<Users />} />
        <Route path="theaters" element={<Theaters />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
