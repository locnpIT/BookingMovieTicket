import { useEffect, useMemo, useState } from 'react'
import Table, { type Column } from '../components/Table'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { roomApi } from '../../services/roomApi'
import type { RoomDTO, RoomCreate, RoomUpdate } from '../../services/roomApi'
import { theaterApi } from '../../services/theaterApi'
import type { TheaterDTO } from '../../services/theaterApi'

const roomTypes: Array<RoomDTO['type']> = ['STANDAR', 'VIP', 'IMAX']

function CreateRoomModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (r: RoomDTO) => void }) {
  const { token } = useAuth()
  const [theaters, setTheaters] = useState<TheaterDTO[]>([])
  const [form, setForm] = useState<RoomCreate>({ roomNumber: '', capacity: 100, type: 'STANDAR', theaterId: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (open) (async () => { try { setTheaters(await theaterApi.list()) } catch {} })() }, [open])
  useEffect(() => { if (!open) { setForm({ roomNumber: '', capacity: 100, type: 'STANDAR', theaterId: 0 }); setError(null); setLoading(false) } }, [open])

  async function create() {
    if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!form.roomNumber.trim() || !form.theaterId) { setError('Vui lòng nhập số phòng và chọn rạp'); return }
    setLoading(true); setError(null)
    try { const res = await roomApi.create(form, token); onCreated(res.data); onClose() } catch (e) { setError(e instanceof Error ? e.message : 'Tạo phòng thất bại') } finally { setLoading(false) }
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Thêm phòng chiếu</h3><button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button></div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-3">
          <div><label className="text-sm font-medium text-gray-700">Rạp</label>
            <select value={form.theaterId || ''} onChange={(e)=>setForm(p=>({...p, theaterId: Number(e.target.value)}))} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="">-- Chọn rạp --</option>
              {(theaters ?? []).map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-gray-700">Số phòng</label><input value={form.roomNumber} onChange={(e)=>setForm(p=>({...p, roomNumber:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
            <div><label className="text-sm font-medium text-gray-700">Sức chứa</label><input type="number" min={1} value={form.capacity} onChange={(e)=>setForm(p=>({...p, capacity:Number(e.target.value)}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700">Loại phòng</label>
            <select value={form.type} onChange={(e)=>setForm(p=>({...p, type: e.target.value as any}))} className="w-full rounded-lg border px-3 py-2 text-sm">
              {roomTypes.map(rt=> <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button><Button onClick={create} loading={loading}>Tạo</Button></div>
      </div>
    </div>
  )
}

function EditRoomModal({ open, item, onClose, onUpdated }: { open: boolean; item?: RoomDTO; onClose: () => void; onUpdated: (r: RoomDTO) => void }) {
  const { token } = useAuth()
  const [theaters, setTheaters] = useState<TheaterDTO[]>([])
  const [form, setForm] = useState<RoomUpdate>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (open) (async () => { try { setTheaters(await theaterApi.list()) } catch {} })() }, [open])
  useEffect(() => { if (open && item) setForm({ roomNumber: item.roomNumber, capacity: item.capacity, type: item.type, theaterId: item.theaterId }) }, [open, item])

  async function save() {
    if (!token || !item) { setError('Bạn cần đăng nhập ADMIN'); return }
    setLoading(true); setError(null)
    try { const res = await roomApi.update(item.id, form, token); onUpdated(res.data); onClose() } catch (e) { setError(e instanceof Error ? e.message : 'Cập nhật thất bại') } finally { setLoading(false) }
  }
  if (!open || !item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Sửa phòng chiếu</h3><button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button></div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-3">
          <div><label className="text-sm font-medium text-gray-700">Rạp</label>
            <select value={form.theaterId || ''} onChange={(e)=>setForm(p=>({...p, theaterId: Number(e.target.value)}))} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="">-- Chọn rạp --</option>
              {(theaters ?? []).map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-gray-700">Số phòng</label><input value={form.roomNumber || ''} onChange={(e)=>setForm(p=>({...p, roomNumber:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
            <div><label className="text-sm font-medium text-gray-700">Sức chứa</label><input type="number" min={1} value={form.capacity ?? 0} onChange={(e)=>setForm(p=>({...p, capacity:Number(e.target.value)}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700">Loại phòng</label>
            <select value={form.type || 'STANDAR'} onChange={(e)=>setForm(p=>({...p, type: e.target.value as any}))} className="w-full rounded-lg border px-3 py-2 text-sm">
              {roomTypes.map(rt=> <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button><button onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button></div>
      </div>
    </div>
  )
}

export default function Rooms() {
  const { token } = useAuth()
  const [rows, setRows] = useState<RoomDTO[]>([])
  const [theaters, setTheaters] = useState<TheaterDTO[]>([])
  const [theaterFilter, setTheaterFilter] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [edit, setEdit] = useState<{ open: boolean; item?: RoomDTO }>({ open: false })
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false })

  async function load() { setLoading(true); setError(null); try { setRows(await roomApi.list(theaterFilter ? Number(theaterFilter) : undefined)) } catch (e) { setError(e instanceof Error ? e.message : 'Không tải được danh sách') } finally { setLoading(false) } }
  useEffect(() => { (async ()=>{ try { setTheaters(await theaterApi.list()) } catch {} })() }, [])
  useEffect(() => { load() }, [theaterFilter])

  const columns: Column<RoomDTO>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'roomNumber', header: 'Số phòng' },
    { key: 'capacity', header: 'Sức chứa' },
    { key: 'type', header: 'Loại' },
    { key: 'theaterName', header: 'Rạp' },
    { key: 'theaterId', header: 'Hành động', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => setEdit({ open: true, item: r })} className="inline-flex items-center rounded-md bg-indigo-600/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-indigo-400/30 hover:bg-indigo-700 shadow-sm">✏️ Sửa</button>
        <button onClick={() => setConfirm({ open: true, id: r.id })} className="inline-flex items-center rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-red-400/30 hover:bg-red-600 shadow-sm">🗑️ Xoá</button>
      </div>
    ) },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
        <div className="flex items-center gap-2">
          <select value={theaterFilter} onChange={(e)=>setTheaterFilter(e.target.value ? Number(e.target.value) : '')} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Tất cả rạp</option>
            {(theaters ?? []).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <Button onClick={() => setCreateOpen(true)}>Thêm phòng</Button>
        </div>
      </div>
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
      {loading ? <div className="text-sm text-gray-600">Đang tải...</div> : <Table columns={columns} rows={rows} bordered={false} />}
      <CreateRoomModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => load()} />
      <EditRoomModal open={edit.open} item={edit.item} onClose={() => setEdit({ open: false })} onUpdated={() => load()} />
      <ConfirmDialog open={confirm.open} title="Xoá phòng chiếu" message="Bạn có chắc chắn muốn xoá phòng này?" onClose={() => setConfirm({ open: false })} onConfirm={async () => {
        if (!confirm.id) return
        if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
        try { await roomApi.remove(confirm.id, token); setConfirm({ open: false }); load() } catch (e) { setError(e instanceof Error ? e.message : 'Xoá thất bại') }
      }} />
    </div>
  )
}

