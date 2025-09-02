import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { token, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow ring-1 ring-white/60">🎬</span>
            <span className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent text-lg md:text-xl">PhuocLocCine</span>
          </Link>
        </div>

        {/* Center: Main nav */}
        <div className="hidden md:flex items-center justify-center gap-6 text-base text-gray-700">
          <Link
            to="/movies"
            className="relative pb-1 transition-colors hover:text-sky-700 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Phim
          </Link>
          <Link
            to="/directors"
            className="relative pb-1 transition-colors hover:text-sky-700 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Đạo diễn
          </Link>
          <Link
            to="/genres"
            className="relative pb-1 transition-colors hover:text-sky-700 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Thể loại
          </Link>
        </div>

        {/* Right: Auth */}
        <nav className="ml-auto flex items-center justify-end gap-3 text-sm">
          {!token ? (
            !isAuthPage && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-sky-700">Đăng nhập</Link>
                <Link to="/register" className="rounded bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700">Đăng ký</Link>
              </>
            )
          ) : (
            <>
              <span className="hidden sm:inline text-gray-600">{
                (() => {
                  const display = user?.firstName || user?.email
                  return display ? `Xin chào, ${display}` : 'Xin chào'
                })()
              }</span>
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800"
              >
                Đăng xuất
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
