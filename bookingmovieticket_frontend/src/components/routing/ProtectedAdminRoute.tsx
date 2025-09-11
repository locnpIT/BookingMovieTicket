import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

function NoAccess() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white p-6">
      {/* Background animated blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-tr from-sky-300 to-indigo-300 opacity-40 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/90 p-8 text-center shadow-2xl ring-1 ring-gray-100">
        {/* Icon */}
        <div className="mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-rose-50 text-red-600 ring-1 ring-rose-100">
          <svg className="h-10 w-10 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 10V7a4 4 0 10-8 0v3"/>
            <rect x="4" y="10" width="16" height="10" rx="2"/>
            <circle cx="12" cy="15" r="1.75"/>
          </svg>
        </div>

        <h2 className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
          Bạn không có quyền truy cập
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
          Khu vực này chỉ dành cho quản trị viên (ADMIN). Vui lòng đăng nhập bằng tài khoản có quyền phù hợp
          hoặc quay về trang chủ để tiếp tục trải nghiệm.
        </p>

        <div className="mt-6 inline-flex gap-3">
          <a href="/" className="rounded-xl border px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50">Về trang chủ</a>
          <a href="/login" className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-700 hover:to-indigo-700">Đăng nhập</a>
        </div>

        {/* Decorative underline */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500" />
      </div>
    </div>
  )
}

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { token, user } = useAuth()
  const isAdmin = Boolean(token) && (user?.role === 'ADMIN')
  if (!isAdmin) return <NoAccess />
  return <>{children}</>
}
