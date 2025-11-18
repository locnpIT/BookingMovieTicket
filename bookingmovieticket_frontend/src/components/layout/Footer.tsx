export default function Footer() {
  return (
    <footer className="relative mt-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-t border-red-500/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-1">
            <div className="inline-flex items-center gap-2 font-bold">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-600 via-red-500 to-amber-500 shadow-lg ring-2 ring-amber-500/50">
                <span className="text-xl drop-shadow-lg">🎬</span>
              </span>
              <span className="gradient-text-cinema text-xl">PhuocLocCine</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-300">
              Trải nghiệm xem phim đỉnh cao: màn hình lớn, âm thanh sống động và dịch vụ tận tâm.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/80 backdrop-blur-sm shadow-md transition-all hover:scale-110 hover:bg-red-600/80 hover:shadow-lg border border-red-500/30" 
                href="#" 
                aria-label="Facebook"
              >
                <span className="text-lg transition-transform group-hover:scale-110">📘</span>
              </a>
              <a 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/80 backdrop-blur-sm shadow-md transition-all hover:scale-110 hover:bg-amber-500/80 hover:shadow-lg border border-amber-500/30" 
                href="#" 
                aria-label="Instagram"
              >
                <span className="text-lg transition-transform group-hover:scale-110">📸</span>
              </a>
              <a 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/80 backdrop-blur-sm shadow-md transition-all hover:scale-110 hover:bg-red-600/80 hover:shadow-lg border border-red-500/30" 
                href="#" 
                aria-label="YouTube"
              >
                <span className="text-lg transition-transform group-hover:scale-110">▶️</span>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-6 md:col-span-3 md:grid-cols-3">
            <div>
              <h4 className="mb-4 text-base font-bold text-amber-400">Khám phá</h4>
              <ul className="space-y-2.5">
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Phim đang chiếu
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Phim sắp chiếu
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Ưu đãi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-base font-bold text-amber-400">Về chúng tôi</h4>
              <ul className="space-y-2.5">
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Tuyển dụng
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-base font-bold text-amber-400">Hỗ trợ</h4>
              <ul className="space-y-2.5">
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Điều khoản
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-amber-400" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-amber-400">→</span>
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-red-500/30 pt-6 md:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} PhuocLocCine. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Made with</span>
            <span className="animate-pulse text-red-500">❤️</span>
            <span>in Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
