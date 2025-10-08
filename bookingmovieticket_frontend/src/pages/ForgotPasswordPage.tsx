import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Card from '../components/ui/Card'
import TextField from '../components/ui/TextField'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { authApi } from '../services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    try {
      const msg = await authApi.forgotPassword(email.trim())
      setMessage(msg)
      setStatus('success')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể gửi yêu cầu đặt lại mật khẩu'
      setMessage(msg)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận liên kết đặt lại mật khẩu"
    >
      <Card>
        {status !== 'idle' ? (
          <div className="mb-4">
            <Alert kind={status === 'success' ? 'success' : 'error'}>{message}</Alert>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />

          <Button type="submit" loading={loading} fullWidth>
            Gửi liên kết đặt lại
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="text-sky-700 hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
