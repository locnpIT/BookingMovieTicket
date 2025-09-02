import { FormEvent, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Card from '../components/ui/Card'
import TextField from '../components/ui/TextField'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng bạn trở lại với PhuocLoc Cinema">
      <Card>
        {error && (
          <div className="mb-4">
            <Alert kind="error">{error}</Alert>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          <PasswordField
            label="Mật khẩu"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} fullWidth>
            Đăng nhập
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-sky-700 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
