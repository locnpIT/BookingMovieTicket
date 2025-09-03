import Table from '../components/Table'
import type { Column } from '../components/Table'

type Row = { id: number; name: string; email: string; role: string }

const columns: Column<Row>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (r) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        r.role === 'ADMIN' ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
      }`}>{r.role}</span>
    ),
  },
]

const rows: Row[] = [
  { id: 1, name: 'Nguyễn Minh Anh', email: 'anh@example.com', role: 'USER' },
  { id: 2, name: 'Admin', email: 'admin@example.com', role: 'ADMIN' },
]

export default function Users() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Users</h3>
        <button className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">Invite User</button>
      </div>
      <Table columns={columns} rows={rows} />
    </div>
  )
}
