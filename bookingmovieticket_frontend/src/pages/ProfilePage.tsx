import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Thông tin cá nhân</h1>
      <p className="mt-2 text-sm text-slate-600">Thông tin cơ bản của tài khoản.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="space-y-4 text-sm text-slate-700">
          <div className="grid grid-cols-3 gap-4">
            <dt className="font-medium text-slate-500">Họ</dt>
            <dd className="col-span-2">{user?.lastName || '—'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="font-medium text-slate-500">Tên</dt>
            <dd className="col-span-2">{user?.firstName || '—'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="font-medium text-slate-500">Email</dt>
            <dd className="col-span-2">{user?.email || '—'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="font-medium text-slate-500">Vai trò</dt>
            <dd className="col-span-2">{user?.role || 'USER'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
