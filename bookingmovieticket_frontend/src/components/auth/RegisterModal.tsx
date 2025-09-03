import { useState, FormEvent } from 'react'
import Modal from '../ui/Modal'
import TextField from '../ui/TextField'
import PasswordField from '../ui/PasswordField'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import { authApi } from '../../services/api'

export default function RegisterModal({ open, onClose, onSwitchLogin }: { open: boolean; onClose: () => void; onSwitchLogin: () => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', dateOfBirth: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const payload: any = { ...form }
      if (!payload.dateOfBirth) delete payload.dateOfBirth
      const res = await authApi.register(payload)
      setMessage(res.message || 'Đăng ký thành công. Vui lòng kiểm tra email để xác minh.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="mb-3 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-100">🎬</span>
        <div>
          <h3 className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent text-xl font-semibold">Tạo tài khoản</h3>
          <p className="text-xs text-gray-500">Tham gia PhuocLocCine để đặt vé nhanh chóng</p>
        </div>
      </div>
      {message && (
        <div className="mb-3"><Alert kind="success">{message}</Alert></div>
      )}
      {error && (
        <div className="mb-3"><Alert kind="error">{error}</Alert></div>
      )}

      {!message && (
        <>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Họ" value={form.lastName} onChange={(v) => update('lastName', v)} required placeholder="Nguyễn" autoComplete="family-name" />
              <TextField label="Tên" value={form.firstName} onChange={(v) => update('firstName', v)} required placeholder="An" autoComplete="given-name" />
            </div>
            <TextField label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} required placeholder="you@example.com" autoComplete="email" />
            <PasswordField label="Mật khẩu" value={form.password} onChange={(v) => update('password', v)} required autoComplete="new-password" />
            <TextField label="Số điện thoại" value={form.phone} onChange={(v) => update('phone', v)} required placeholder="09xxxxxxxx" autoComplete="tel" />
            <TextField label="Ngày sinh (tuỳ chọn)" type="date" value={form.dateOfBirth} onChange={(v) => update('dateOfBirth', v)} />
            <div className="flex justify-end">
              <Button type="submit" loading={loading}>Đăng ký</Button>
            </div>
          </form>
          <p className="mt-3 text-sm text-gray-600">
            Bạn đã có tài khoản?{' '}
            <button type="button" onClick={onSwitchLogin} className="text-sky-700 hover:underline">Đăng nhập</button>
          </p>
        </>
      )}
      {message && (
        <div className="mt-3 flex justify-end">
          <button onClick={onSwitchLogin} className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Đăng nhập</button>
        </div>
      )}
    </Modal>
  )
}
