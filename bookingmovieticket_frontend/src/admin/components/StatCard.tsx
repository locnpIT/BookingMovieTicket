export default function StatCard({ title, value, delta }: { title: string; value: string; delta?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-transparent p-6 text-white shadow-[0_25px_45px_-20px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -top-14 -right-16 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl transition-transform duration-300 group-hover:-translate-y-2" />
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">{title}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
      {delta && <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">⬆ {delta}</div>}
    </div>
  )
}
