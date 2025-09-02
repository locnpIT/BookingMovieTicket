import { FormEvent, useState } from 'react'
import { authApi } from '../services/api'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Card from '../components/ui/Card'
import TextField from '../components/ui/TextField'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.dateOfBirth) delete (payload as any).dateOfBirth
      const res = await authApi.register(payload)
      setMessage(res.message || 'Đăng ký thành công. Vui lòng kiểm tra email để xác minh.')
      setForm({ firstName: '', lastName: '', email: '', password: '', phone: '', dateOfBirth: '' })
      setShowSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Tham gia PhuocLoc Cinema để đặt vé nhanh chóng">
      <Card>
        <div className="mb-4 space-y-2">
          {error && (
            <Alert kind="error">{error}</Alert>
          )}
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Họ"
              value={form.lastName}
              onChange={(v) => update('lastName', v)}
              required
              placeholder="Nguyễn"
              autoComplete="family-name"
            />
            <TextField
              label="Tên"
              value={form.firstName}
              onChange={(v) => update('firstName', v)}
              required
              placeholder="An"
              autoComplete="given-name"
            />
          </div>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update('email', v)}
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
          <PasswordField
            label="Mật khẩu"
            value={form.password}
            onChange={(v) => update('password', v)}
            required
            autoComplete="new-password"
          />
          <TextField
            label="Số điện thoại"
            value={form.phone}
            onChange={(v) => update('phone', v)}
            required
            placeholder="09xxxxxxxx"
            autoComplete="tel"
          />
          <TextField
            label="Ngày sinh (tuỳ chọn)"
            type="date"
            value={form.dateOfBirth}
            onChange={(v) => update('dateOfBirth', v)}
          />
          <Button type="submit" loading={loading} fullWidth>
            Đăng ký
          </Button>
          <p className="text-xs text-gray-500">Bằng việc tiếp tục, bạn đồng ý với Điều khoản & Chính sách bảo mật của chúng tôi.</p>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-sky-700 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </Card>

      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Đăng ký thành công"
        primaryAction={{
          label: 'Về đăng nhập',
          onClick: () => {
            setShowSuccess(false)
            navigate('/login')
          },
        }}
        secondaryAction={{ label: 'Để sau', onClick: () => setShowSuccess(false) }}
      >
        <p>
          {message || 'Tài khoản đã được tạo. Vui lòng kiểm tra email và bấm vào liên kết để xác minh tài khoản của bạn.'}
        </p>
      </Modal>
    </AuthLayout>
  )
}
