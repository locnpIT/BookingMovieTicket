import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import PublicLayout from './layout/PublicLayout'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AdminLayout from './admin/layout/AdminLayout'
import ProtectedAdminRoute from './components/routing/ProtectedAdminRoute'
import ProtectedRoute from './components/routing/ProtectedRoute'
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
import MovieBookingPage from './pages/MovieBookingPage'
import PaymentResultPage from './pages/PaymentResultPage'
import BookingHistoryPage from './pages/BookingHistoryPage'
import ProfilePage from './pages/ProfilePage'
import MiniGamePage from './pages/MiniGamePage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/movies/:movieId/book" element={<MovieBookingPage />} />
        <Route path="/book/:showtimeId" element={<SeatSelectionPage />} />
        <Route path="/payment/result" element={<PaymentResultPage />} />
        <Route path="/games" element={<ProtectedRoute><MiniGamePage /></ProtectedRoute>} />
        <Route path="/account/bookings" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
        <Route path="/account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
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
