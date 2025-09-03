export default function StatCard({ title, value, delta }: { title: string; value: string; delta?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/90 p-4 shadow ring-1 ring-gray-100">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      {delta && <div className="mt-1 text-xs text-emerald-600">↑ {delta}</div>}
    </div>
  )
}
