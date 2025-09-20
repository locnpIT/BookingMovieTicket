import { useEffect, useMemo, useState } from 'react'
import Table, { type Column } from '../components/Table'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { showtimeApi } from '../../services/showtimeApi'
import type { ShowtimeDTO, ShowtimeCreate, ShowtimeUpdate } from '../../services/showtimeApi'
import { movieApi } from '../../services/movieApi'
import type { MovieDTO } from '../../services/movieApi'

function pad2(n: number) { return n.toString().padStart(2, '0') }
function toLocalInputValue(offsetIso: string) {
  // Convert OffsetDateTime string to local datetime-local value (yyyy-MM-ddThh:mm)
  const d = new Date(offsetIso)
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}
function toOffsetISO(local: string) {
  // local like yyyy-MM-ddThh:mm -> generate ISO with local timezone offset
  const d = new Date(local)
  return d.toISOString()
}

function CreateShowtimeModal({ open, date, onClose, onCreated }: { open: boolean; date: string; onClose: () => void; onCreated: (s: ShowtimeDTO) => void }) {
  const { token } = useAuth()
  const [movies, setMovies] = useState<MovieDTO[]>([])
  const [movieId, setMovieId] = useState<number | ''>('')
  const [roomId, setRoomId] = useState<number | ''>('')
  const [start, setStart] = useState('')
  const [price, setPrice] = useState<number>(75000)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try { setMovies(await movieApi.list()) } catch {}
    })()
  }, [open])

  useEffect(() => {
    if (open && date) {
      // default to date at 10:00
      setStart(`${date}T10:00`)
    }
  }, [open, date])

  async function create() {
    if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!movieId || !roomId || !start) { setError('Vui lòng chọn phim/phòng/giờ bắt đầu'); return }
    setLoading(true); setError(null)
    try {
      const payload: ShowtimeCreate = { movieId: Number(movieId), roomId: Number(roomId), startTime: toOffsetISO(start), basePrice: Number(price) }
      const res = await showtimeApi.create(payload, token)
      onCreated(res.data)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tạo suất chiếu thất bại')
    } finally { setLoading(false) }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tạo suất chiếu</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Phim</label>
            <select value={movieId} onChange={(e) => setMovieId(e.target.value ? Number(e.target.value) : '')} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
              <option value="">-- Chọn phim --</option>
              {(movies ?? []).map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Phòng</label>
              <input value={roomId} onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : '')} placeholder="Nhập roomId" className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Giá cơ bản</label>
              <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Bắt đầu</label>
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button>
          <Button onClick={create} loading={loading}>Tạo</Button>
        </div>
      </div>
    </div>
  )
}

function EditShowtimeModal({ open, item, onClose, onUpdated }: { open: boolean; item?: ShowtimeDTO; onClose: () => void; onUpdated: (s: ShowtimeDTO) => void }) {
  const { token } = useAuth()
  const [roomId, setRoomId] = useState<number | ''>('')
  const [start, setStart] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && item) {
      setRoomId(item.roomId)
      setStart(toLocalInputValue(item.startTime))
      setPrice(Number(item.basePrice))
      setError(null); setLoading(false)
    }
  }, [open, item])

  async function save() {
    if (!token || !item) { setError('Bạn cần đăng nhập ADMIN'); return }
    const payload: ShowtimeUpdate = {
      roomId: roomId ? Number(roomId) : undefined,
      startTime: start ? toOffsetISO(start) : undefined,
      basePrice: Number(price),
    }
    setLoading(true); setError(null)
    try {
      const res = await showtimeApi.update(item.id, payload, token)
      onUpdated(res.data)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cập nhật suất chiếu thất bại')
    } finally { setLoading(false) }
  }

  if (!open || !item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Sửa suất chiếu</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Phòng</label>
              <input value={roomId} onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : '')} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Giá cơ bản</label>
              <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Bắt đầu</label>
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button>
          <button onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Showtimes() {
  const { token } = useAuth()
  const [date, setDate] = useState<string | ''>(() => new Date().toISOString().slice(0,10))
  const [allDates, setAllDates] = useState(false)
  const [movieFilter, setMovieFilter] = useState<number | ''>('')
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<ShowtimeDTO[]>([])
  const [movies, setMovies] = useState<MovieDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [edit, setEdit] = useState<{ open: boolean; item?: ShowtimeDTO }>({ open: false })
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false })

  useEffect(() => { (async () => { try { setMovies(await movieApi.list()) } catch {} })() }, [])

  async function load() {
    setLoading(true); setError(null)
    try {
      const data = await showtimeApi.list(allDates ? undefined : date || undefined, movieFilter ? Number(movieFilter) : undefined, undefined, q || undefined)
      setRows(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được danh sách')
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [date, movieFilter, allDates, q])

  const columns: Column<ShowtimeDTO>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'movieTitle', header: 'Phim' },
    { key: 'roomNumber', header: 'Phòng' },
    { key: 'startTime', header: 'Bắt đầu', render: (r) => new Date(r.startTime).toLocaleString() },
    { key: 'endTime', header: 'Kết thúc', render: (r) => new Date(r.endTime).toLocaleString() },
    { key: 'basePrice', header: 'Giá (đ)' },
    { key: 'status', header: 'Trạng thái' },
    { key: 'roomId', header: 'Hành động', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => setEdit({ open: true, item: r })} className="inline-flex items-center rounded-md bg-indigo-600/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-indigo-400/30 hover:bg-indigo-700 shadow-sm">✏️ Sửa</button>
        <button onClick={() => setConfirm({ open: true, id: r.id })} className="inline-flex items-center rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-red-400/30 hover:bg-red-600 shadow-sm">🗑️ Xoá</button>
      </div>
    ) },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Showtimes</h3>
        <div className="flex items-center gap-2">
          <select value={movieFilter} onChange={(e) => setMovieFilter(e.target.value ? Number(e.target.value) : '')} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Tất cả phim</option>
            {(movies ?? []).map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <div className="inline-flex items-center gap-2">
            <input type="date" value={allDates ? '' : (date || '')} onChange={(e) => setDate(e.target.value)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50" disabled={allDates} />
            <label className="text-sm inline-flex items-center gap-1">
              <input type="checkbox" checked={allDates} onChange={(e) => setAllDates(e.target.checked)} />
              Tất cả ngày
            </label>
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm phim/phòng..." className="rounded-lg border px-3 py-2 text-sm" />
          <Button onClick={() => setCreateOpen(true)}>Thêm suất chiếu</Button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
      {loading ? (
        <div className="text-sm text-gray-600">Đang tải...</div>
      ) : (
        <Table columns={columns} rows={rows} bordered={false} />
      )}

      <CreateShowtimeModal open={createOpen} date={date} onClose={() => setCreateOpen(false)} onCreated={() => load()} />
      <EditShowtimeModal open={edit.open} item={edit.item} onClose={() => setEdit({ open: false })} onUpdated={() => load()} />
      <ConfirmDialog open={confirm.open} title="Xoá suất chiếu" message="Bạn có chắc chắn muốn xoá suất chiếu này?" onClose={() => setConfirm({ open: false })} onConfirm={async () => {
        if (!confirm.id) return
        try {
          await showtimeApi.remove(confirm.id, token || undefined)
          setConfirm({ open: false })
          load()
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Xoá thất bại')
        }
      }} />
    </div>
  )
}
