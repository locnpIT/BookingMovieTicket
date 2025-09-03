export default function Footer() {
  return (
    <footer className="bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-semibold text-sky-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow ring-1 ring-white/60">🎬</span>
              <span className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">PhuocLocCine</span>
            </div>
            <p className="max-w-sm text-gray-600">
              Trải nghiệm xem phim đỉnh cao: màn hình lớn, âm thanh sống động và dịch vụ tận tâm.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-3">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">Khám phá</h4>
              <ul className="space-y-1">
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Phim đang chiếu</a></li>
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Phim sắp chiếu</a></li>
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Ưu đãi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">Về chúng tôi</h4>
              <ul className="space-y-1">
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Giới thiệu</a></li>
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Liên hệ</a></li>
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Tuyển dụng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">Hỗ trợ</h4>
              <ul className="space-y-1">
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Trung tâm trợ giúp</a></li>
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Điều khoản</a></li>
                <li><a className="hover:text-sky-700 cursor-pointer" href="#">Chính sách bảo mật</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t pt-4 text-xs text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} PhuocLocCine. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a className="hover:text-sky-700 cursor-pointer" href="#" aria-label="Facebook">📘</a>
            <a className="hover:text-sky-700 cursor-pointer" href="#" aria-label="Instagram">📸</a>
            <a className="hover:text-sky-700 cursor-pointer" href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
