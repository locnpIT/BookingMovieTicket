import { useEffect } from 'react'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ open, onClose, title, children, primaryAction, secondaryAction, size = 'md' }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const maxW = size === 'lg' ? 'max-w-lg' : size === 'sm' ? 'max-w-sm' : 'max-w-md'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${maxW} rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          title="Đóng"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100 hover:bg-red-100"
        >
          ×
        </button>
        {title && <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>}
        <div className="text-sm text-gray-700">{children}</div>
        {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex justify-end gap-3">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
        )}
      </div>
    </div>
  )
}
