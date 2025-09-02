import { useState } from 'react'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  autoComplete?: string
}

export default function PasswordField({ label, value, onChange, required, autoComplete }: Props) {
  const [show, setShow] = useState(false)
  const id = label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  )
}

