import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import TextField from '../ui/TextField'
import PasswordField from '../ui/PasswordField'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import { useAuth } from '../../context/AuthContext'

export default function LoginModal({ open, onClose, onSwitchRegister }: { open: boolean; onClose: () => void; onSwitchRegister: () => void }) {
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
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  function handleForgotPassword() {
    onClose()
    navigate('/forgot-password')
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="mb-3 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-100">🎬</span>
        <div>
          <h3 className="bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent text-xl font-semibold">Chào mừng trở lại</h3>
          <p className="text-xs text-gray-500">Đăng nhập để đặt vé nhanh tại PhuocLocCine</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert kind="error">{error}</Alert>}
        <TextField label="Email" value={email} onChange={setEmail} type="email" required autoComplete="email" placeholder="you@example.com" />
        <PasswordField label="Mật khẩu" value={password} onChange={setPassword} required autoComplete="current-password" />
        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={onSwitchRegister} className="text-sky-700 hover:underline">Chưa có tài khoản? Đăng ký</button>
          <button type="button" onClick={handleForgotPassword} className="text-sky-700 hover:underline">Quên mật khẩu?</button>
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={loading}>Đăng nhập</Button>
        </div>
      </form>
    </Modal>
  )
}
