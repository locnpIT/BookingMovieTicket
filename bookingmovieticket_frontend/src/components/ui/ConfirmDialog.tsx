export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  onClose,
  onConfirm,
}: {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  onClose: () => void
  onConfirm: () => void
}) {
  if (!open) return null
  const confirmBtn =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-indigo-600 hover:bg-indigo-700'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">{cancelText}</button>
          <button onClick={onConfirm} className={`rounded-lg px-4 py-2 text-white ${confirmBtn}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

