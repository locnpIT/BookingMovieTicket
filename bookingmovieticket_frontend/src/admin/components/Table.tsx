import type { ReactNode } from 'react'

export type Column<T> = { key: keyof T; header: string; render?: (row: T) => ReactNode }

export default function Table<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const rowClass = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            return (
              <tr key={idx} className={`${rowClass} hover:bg-gray-100`}>
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-2 text-sm text-gray-800">
                    {c.render ? c.render(r) : String((r as any)[c.key])}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
