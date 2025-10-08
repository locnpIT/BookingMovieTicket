import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { accountApi } from '../services/api'
import PasswordField from '../components/ui/PasswordField'

type AlertState = { type: 'success' | 'error'; message: string } | null

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '' })
  const [profileStatus, setProfileStatus] = useState<AlertState>(null)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordStatus, setPasswordStatus] = useState<AlertState>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [confirmMismatch, setConfirmMismatch] = useState(false)

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    })
  }, [user?.firstName, user?.lastName])

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const firstName = profileForm.firstName.trim()
    const lastName = profileForm.lastName.trim()

    if (!firstName || !lastName) {
      setProfileStatus({ type: 'error', message: 'Vui lòng nhập đầy đủ họ và tên' })
      return
    }

    setSavingProfile(true)
    setProfileStatus(null)
    try {
      const updated = await accountApi.updateProfile({ firstName, lastName })
      updateUser({ firstName: updated.firstName, lastName: updated.lastName })
      setProfileStatus({ type: 'success', message: 'Cập nhật thông tin thành công' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật thông tin'
      setProfileStatus({ type: 'error', message })
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (!currentPassword.trim()) {
      setPasswordStatus({ type: 'error', message: 'Vui lòng nhập mật khẩu hiện tại' })
      return
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Mật khẩu phải từ 6 ký tự trở lên' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Mật khẩu xác nhận không khớp' })
      setConfirmMismatch(true)
      return
    }

    const shouldChange = window.confirm('Bạn có chắc chắn muốn đổi mật khẩu?')
    if (!shouldChange) {
      return
    }

    setChangingPassword(true)
    setPasswordStatus(null)
    setConfirmMismatch(false)
    try {
      await accountApi.changePassword({ currentPassword, newPassword, confirmPassword })
      setPasswordStatus({ type: 'success', message: 'Đổi mật khẩu thành công' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      window.alert('Bạn đã đổi mật khẩu thành công')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể đổi mật khẩu'
      setPasswordStatus({ type: 'error', message })
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Thông tin cá nhân</h1>
      <p className="mt-2 text-sm text-slate-600">Quản lý thông tin và bảo mật tài khoản của bạn.</p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Chỉnh sửa thông tin</h2>
        <p className="mt-1 text-sm text-slate-500">Email sử dụng để đăng nhập và không thể thay đổi.</p>

        {profileStatus ? (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              profileStatus.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {profileStatus.message}
          </div>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={handleProfileSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Họ
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={profileForm.lastName}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))}
                placeholder="Nhập họ"
                autoComplete="family-name"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Tên
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={profileForm.firstName}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))}
                placeholder="Nhập tên"
                autoComplete="given-name"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
              value={user?.email ?? ''}
              readOnly
              disabled
            />
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
              disabled={savingProfile}
            >
              {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Đổi mật khẩu</h2>
        <p className="mt-1 text-sm text-slate-500">Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>

        {passwordStatus ? (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              passwordStatus.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {passwordStatus.message}
          </div>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={handlePasswordSubmit}>
          <PasswordField
            label="Mật khẩu hiện tại"
            value={passwordForm.currentPassword}
            onChange={(value) => setPasswordForm((prev) => ({ ...prev, currentPassword: value }))}
            required
            autoComplete="current-password"
            disabled={changingPassword}
          />

          <PasswordField
            label="Mật khẩu mới"
            value={passwordForm.newPassword}
            onChange={(value) => {
              setPasswordForm((prev) => {
                const next = { ...prev, newPassword: value }
                setConfirmMismatch(next.confirmPassword.length > 0 && next.confirmPassword !== value)
                return next
              })
            }}
            required
            autoComplete="new-password"
            disabled={changingPassword}
          />

          <div>
            <PasswordField
              label="Xác nhận mật khẩu"
              value={passwordForm.confirmPassword}
              onChange={(value) => {
                setPasswordForm((prev) => {
                  const next = { ...prev, confirmPassword: value }
                  setConfirmMismatch(value.length > 0 && next.newPassword !== value)
                  return next
                })
              }}
              required
              autoComplete="new-password"
              disabled={changingPassword}
              className={confirmMismatch ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : undefined}
            />
            {confirmMismatch ? (
              <p className="mt-1 text-sm text-rose-600">Mật khẩu xác nhận không khớp</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={changingPassword}
            >
              {changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
