import type { ReactNode } from 'react'

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur ${className}`}>
      {children}
    </div>
  )
}
