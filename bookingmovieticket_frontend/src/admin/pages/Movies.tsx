import Table from '../components/Table'
import type { Column } from '../components/Table'

type Row = { id: number; title: string; status: string; duration: number }

const columns: Column<Row>[] = [
  { key: 'id', header: 'ID' },
  { key: 'title', header: 'Title' },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          r.status === 'NOW_SHOWING'
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
        }`}
      >
        {r.status}
      </span>
    ),
  },
  { key: 'duration', header: 'Duration (min)' },
]

const rows: Row[] = [
  { id: 1, title: 'Hành Trình Cuối Cùng', status: 'NOW_SHOWING', duration: 126 },
  { id: 2, title: 'Bí Ẩn Trong Bóng Đêm', status: 'NOW_SHOWING', duration: 112 },
  { id: 3, title: 'Ngày Em Đến', status: 'COMING_SOON', duration: 104 },
]

export default function Movies() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Movies</h3>
        <button className="rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 text-white">New Movie</button>
      </div>
      <Table columns={columns} rows={rows} />
    </div>
  )
}
