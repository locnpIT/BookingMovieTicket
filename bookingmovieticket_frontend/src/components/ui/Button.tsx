import type { ButtonHTMLAttributes, ReactNode } from 'react'

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ')
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  fullWidth?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  children?: ReactNode
}

export default function Button({
  loading,
  fullWidth,
  className,
  variant = 'primary',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-700 hover:to-indigo-700 focus:ring-sky-500',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
  } as const
  return (
    <button
      className={cn(base, styles[variant], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
      )}
      {children}
    </button>
  )
}
