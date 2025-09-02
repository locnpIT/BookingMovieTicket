import { InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
}

export default function TextField({ label, value, onChange, error, id, ...rest }: Props) {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

