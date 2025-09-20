import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useModal } from '../../context/ModalContext'
import { useState } from 'react'

export default function Navbar() {
  const { token, logout, user } = useAuth()
  const { showLogin } = useModal()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur shadow-sm">
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
            <button onClick={showLogin} className="rounded bg-gradient-to-r from-sky-600 to-indigo-600 px-3 py-1.5 text-white hover:from-sky-700 hover:to-indigo-700 cursor-pointer">Đăng nhập</button>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-base text-white">
                  👤
                </span>
                <span className="hidden md:inline">
                  {user?.firstName || user?.email || 'Tài khoản'}
                </span>
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 text-left text-sm shadow-lg transition ${
                  menuOpen ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-95'
                }`}
              >
                <Link
                  to="/account/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  Thông tin cá nhân
                </Link>
                <Link
                  to="/account/bookings"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  Lịch sử đặt vé
                </Link>
                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                    setMenuOpen(false)
                  }}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
