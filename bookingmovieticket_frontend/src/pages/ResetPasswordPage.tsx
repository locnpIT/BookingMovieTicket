import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Card from '../components/ui/Card'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { authApi } from '../services/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [validationStatus, setValidationStatus] = useState<Status>('loading')
  const [validationMessage, setValidationMessage] = useState<string>('Đang kiểm tra token...')
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [mismatch, setMismatch] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<Status>('idle')
  const [submitMessage, setSubmitMessage] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function validate() {
      if (!token) {
        setValidationStatus('error')
        setValidationMessage('Liên kết đặt lại mật khẩu không hợp lệ')
        return
      }
      try {
        await authApi.validateResetToken(token)
        setValidationStatus('success')
        setValidationMessage('Token hợp lệ. Vui lòng nhập mật khẩu mới.')
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Token không hợp lệ hoặc đã hết hạn'
        setValidationStatus('error')
        setValidationMessage(msg)
      }
    }

    validate()
  }, [token])

  function handleChange(field: 'newPassword' | 'confirmPassword', value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      setMismatch(next.confirmPassword.length > 0 && next.newPassword !== next.confirmPassword)
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (validationStatus !== 'success') return
    if (form.newPassword.length < 6) {
      setSubmitStatus('error')
      setSubmitMessage('Mật khẩu phải từ 6 ký tự trở lên')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setMismatch(true)
      setSubmitStatus('error')
      setSubmitMessage('Mật khẩu xác nhận không khớp')
      return
    }

    setSubmitting(true)
    setSubmitStatus('idle')

    try {
      const msg = await authApi.resetPassword({
        token,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })
      setSubmitStatus('success')
      setSubmitMessage(msg)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể đổi mật khẩu'
      setSubmitStatus('error')
      setSubmitMessage(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const isTokenInvalid = validationStatus === 'error'

  return (
    <AuthLayout title="Đặt lại mật khẩu" subtitle="Tạo mật khẩu mới cho tài khoản của bạn">
      <Card>
        <div className="mb-4">
          <Alert kind={validationStatus === 'error' ? 'error' : 'info'}>{validationMessage}</Alert>
        </div>

        {submitStatus !== 'idle' ? (
          <div className="mb-4">
            <Alert kind={submitStatus === 'success' ? 'success' : 'error'}>{submitMessage}</Alert>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <PasswordField
            label="Mật khẩu mới"
            value={form.newPassword}
            onChange={(value) => handleChange('newPassword', value)}
            required
            autoComplete="new-password"
            disabled={isTokenInvalid || submitting}
          />
          <div>
            <PasswordField
              label="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              required
              autoComplete="new-password"
              disabled={isTokenInvalid || submitting}
              className={mismatch ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : undefined}
            />
            {mismatch ? (
              <p className="mt-1 text-sm text-rose-600">Mật khẩu xác nhận không khớp</p>
            ) : null}
          </div>
          <Button type="submit" loading={submitting} fullWidth disabled={isTokenInvalid || submitting}>
            Đổi mật khẩu
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
