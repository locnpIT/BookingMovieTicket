import StatCard from '../components/StatCard'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="New Users" value="128" delta="12%" />
        <StatCard title="Tickets Sold" value="1,245" delta="8%" />
        <StatCard title="Revenue" value="$24,560" delta="5%" />
        <StatCard title="Movies Active" value="32" />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-gray-100">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <button className="rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 text-white">Add Movie</button>
          <button className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">Manage Users</button>
          <button className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">Theater Settings</button>
        </div>
      </div>
    </div>
  )
}
