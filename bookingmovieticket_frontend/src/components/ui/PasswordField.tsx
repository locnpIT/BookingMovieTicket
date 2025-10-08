import { useState } from 'react'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  autoComplete?: string
  disabled?: boolean
  className?: string
}

export default function PasswordField({
  label,
  value,
  onChange,
  required,
  autoComplete,
  disabled,
  className,
}: Props) {
  const [show, setShow] = useState(false)
  const id = label.replace(/\s+/g, '-').toLowerCase()
  const inputClasses = [
    'w-full rounded-lg border px-3 py-2 pr-10 shadow-sm focus:ring-2',
    disabled ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
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
          disabled={disabled}
          className={inputClasses}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
          disabled={disabled}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  )
}
