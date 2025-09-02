type Props = {
  kind?: 'error' | 'success' | 'info'
  children: React.ReactNode
}

export default function Alert({ kind = 'info', children }: Props) {
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  } as const
  return <div className={`rounded-md border px-3 py-2 text-sm ${styles[kind]}`}>{children}</div>
}

