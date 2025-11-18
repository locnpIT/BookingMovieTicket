import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useModal } from '../../context/ModalContext'
import { useState, useRef, useEffect } from 'react'
import { gameApi } from '../../services/gameApi'

export default function Navbar() {
  const { token, logout, user } = useAuth()
  const { showLogin } = useModal()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [points, setPoints] = useState<number | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Load user points
  useEffect(() => {
    if (token) {
      gameApi.getPoints(token).then(setPoints).catch(() => setPoints(0))
    } else {
      setPoints(null)
    }
  }, [token])

  // Listen for points update event (from check-in)
  useEffect(() => {
    const handlePointsUpdate = () => {
      if (token) {
        gameApi.getPoints(token).then(setPoints).catch(() => setPoints(0))
      }
    }
    window.addEventListener('points-updated', handlePointsUpdate)
    return () => window.removeEventListener('points-updated', handlePointsUpdate)
  }, [token])

  const handleMouseEnter = () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setMenuOpen(true)
  }

  const handleMouseLeave = () => {
    // Delay closing to allow user to move mouse to menu
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false)
    }, 150) // 150ms delay before starting fade out
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-cinema border-b border-red-500/30 shadow-2xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-4 md:px-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="group inline-flex items-center gap-2 font-semibold transition-transform hover:scale-105">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-600 via-red-500 to-amber-500 shadow-lg ring-2 ring-amber-500/50 transition-all group-hover:shadow-xl group-hover:ring-amber-400 group-hover:animate-pulse-glow">
              <span className="text-xl drop-shadow-lg">🎬</span>
            </span>
            <span className="gradient-text-cinema text-lg font-bold md:text-xl">PhuocLocCine</span>
          </Link>
        </div>

        {/* Center: Main nav */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-base">
          <Link
            to="/movies"
            className="group relative px-3 py-2 font-medium text-slate-200 transition-all hover:text-amber-400 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-red-500 after:to-amber-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Phim
            <span className="absolute inset-0 rounded-lg bg-red-500/10 opacity-0 transition-opacity group-hover:opacity-100 -z-10" />
          </Link>
          <Link
            to="/directors"
            className="group relative px-3 py-2 font-medium text-slate-200 transition-all hover:text-amber-400 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-red-500 after:to-amber-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Đạo diễn
            <span className="absolute inset-0 rounded-lg bg-red-500/10 opacity-0 transition-opacity group-hover:opacity-100 -z-10" />
          </Link>
          <Link
            to="/genres"
            className="group relative px-3 py-2 font-medium text-slate-200 transition-all hover:text-amber-400 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-red-500 after:to-amber-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Thể loại
            <span className="absolute inset-0 rounded-lg bg-red-500/10 opacity-0 transition-opacity group-hover:opacity-100 -z-10" />
          </Link>
          {token && (
            <Link
              to="/games"
              className="group relative px-3 py-2 font-medium text-slate-200 transition-all hover:text-amber-400 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-red-500 after:to-amber-500 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Mini Game
              <span className="absolute inset-0 rounded-lg bg-red-500/10 opacity-0 transition-opacity group-hover:opacity-100 -z-10" />
            </Link>
          )}
        </nav>

        {/* Right: Auth */}
        <nav className="ml-auto flex items-center justify-end gap-3 text-sm">
          {token && points !== null && (
            <Link
              to="/games"
              className="group hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 font-bold text-slate-900 shadow-lg transition-all hover:shadow-xl hover:scale-105 hover:from-amber-400 hover:to-amber-500 animate-pulse-glow"
            >
              <span className="text-lg drop-shadow-md">💰</span>
              <span>{Math.floor(points)} điểm</span>
            </Link>
          )}
          {!token ? (
            <button 
              onClick={showLogin} 
              className="group relative overflow-hidden rounded-lg btn-cinema px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Đăng nhập</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          ) : (
            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="group inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-slate-200 shadow-md transition-all hover:border-amber-400 hover:bg-slate-700/90 hover:shadow-lg hover:scale-105"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-amber-500 text-base text-white shadow-md ring-2 ring-amber-500/50 transition-transform group-hover:scale-110 group-hover:ring-amber-400">
                  👤
                </span>
                <span className="hidden md:inline font-medium">
                  {user?.firstName || user?.email || 'Tài khoản'}
                </span>
              </button>
              <div
                className={`absolute right-0 mt-2 w-56 rounded-2xl border border-red-500/30 bg-slate-800/95 backdrop-blur-md p-2 text-left text-sm shadow-2xl transition-all duration-300 ease-out pointer-events-auto ${
                  menuOpen 
                    ? 'visible opacity-100 scale-100 translate-y-0' 
                    : 'invisible opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/account/profile"
                  onClick={() => {
                    setMenuOpen(false)
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                    }
                  }}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-200 transition-all hover:bg-gradient-to-r hover:from-red-500/20 hover:to-amber-500/20 hover:text-amber-400"
                >
                  <span className="text-lg transition-transform group-hover:scale-110">👤</span>
                  <span className="font-semibold">Thông tin cá nhân</span>
                </Link>
                <Link
                  to="/account/bookings"
                  onClick={() => {
                    setMenuOpen(false)
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                    }
                  }}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-200 transition-all hover:bg-gradient-to-r hover:from-red-500/20 hover:to-amber-500/20 hover:text-amber-400"
                >
                  <span className="text-lg transition-transform group-hover:scale-110">🎫</span>
                  <span className="font-semibold">Lịch sử đặt vé</span>
                </Link>
                <Link
                  to="/games"
                  onClick={() => {
                    setMenuOpen(false)
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                    }
                  }}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-slate-200 transition-all hover:bg-gradient-to-r hover:from-red-500/20 hover:to-amber-500/20 hover:text-amber-400"
                >
                  <span className="text-lg transition-transform group-hover:scale-110">🎮</span>
                  <span className="font-semibold">Mini Game</span>
                </Link>
                <div className="my-1.5 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                <button
                  onClick={() => {
                    logout()
                    navigate('/')
                    setMenuOpen(false)
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                    }
                  }}
                  className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                >
                  <span className="text-lg transition-transform group-hover:scale-110">🚪</span>
                  <span className="font-semibold">Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
