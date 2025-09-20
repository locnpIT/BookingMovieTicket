import type { ReactNode } from 'react'

export type Column<T> = { key: keyof T; header: string; render?: (row: T) => ReactNode }

export default function Table<T>({ columns = [], rows = [], bordered = true }: { columns?: Column<T>[]; rows?: T[]; bordered?: boolean }) {
  return (
    <div
      className={`overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_35px_-25px_rgba(15,23,42,0.8)] backdrop-blur-xl ${
        bordered ? '' : 'border-transparent'
      }`}
    >
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
        <thead className="bg-white/10">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-200/80">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const stripe = idx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
            return (
              <tr key={idx} className={`${stripe} transition hover:bg-white/15`}>
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-5 py-3 text-sm text-slate-100">
                    {c.render ? c.render(r) : String((r as any)[c.key])}
                  </td>
                ))}
              </tr>
            )
          })}
          {!rows.length && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-sm text-slate-300">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
