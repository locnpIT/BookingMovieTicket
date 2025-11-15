export default function Footer() {
  return (
    <footer className="relative mt-16 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-1">
            <div className="inline-flex items-center gap-2 font-bold">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg ring-2 ring-white/50">
                <span className="text-xl">🎬</span>
              </span>
              <span className="gradient-text text-xl">PhuocLocCine</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-600">
              Trải nghiệm xem phim đỉnh cao: màn hình lớn, âm thanh sống động và dịch vụ tận tâm.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110 hover:bg-sky-50 hover:shadow-lg" 
                href="#" 
                aria-label="Facebook"
              >
                <span className="text-lg transition-transform group-hover:scale-110">📘</span>
              </a>
              <a 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110 hover:bg-pink-50 hover:shadow-lg" 
                href="#" 
                aria-label="Instagram"
              >
                <span className="text-lg transition-transform group-hover:scale-110">📸</span>
              </a>
              <a 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110 hover:bg-red-50 hover:shadow-lg" 
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
              <h4 className="mb-4 text-base font-bold text-gray-900">Khám phá</h4>
              <ul className="space-y-2.5">
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Phim đang chiếu
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Phim sắp chiếu
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Ưu đãi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-base font-bold text-gray-900">Về chúng tôi</h4>
              <ul className="space-y-2.5">
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Tuyển dụng
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-base font-bold text-gray-900">Hỗ trợ</h4>
              <ul className="space-y-2.5">
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Điều khoản
                  </a>
                </li>
                <li>
                  <a className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-sky-600" href="#">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 md:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PhuocLocCine. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Made with</span>
            <span className="animate-pulse">❤️</span>
            <span>in Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
