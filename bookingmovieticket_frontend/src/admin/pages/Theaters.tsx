import { useEffect, useMemo, useState } from 'react'
import Table, { type Column } from '../components/Table'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { theaterApi } from '../../services/theaterApi'
import type { TheaterDTO, TheaterCreate, TheaterUpdate } from '../../services/theaterApi'
import { provinceApi } from '../../services/provinceApi'
import type { ProvinceDTO } from '../../services/provinceApi'

function CreateTheaterModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (t: TheaterDTO) => void }) {
  const { token } = useAuth()
  const [provinces, setProvinces] = useState<ProvinceDTO[]>([])
  const [form, setForm] = useState<TheaterCreate>({ name: '', provinceId: 0, address: '', phoneNumber: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (open) (async () => { try { setProvinces(await provinceApi.list()) } catch {} })() }, [open])
  useEffect(() => { if (!open) { setForm({ name: '', provinceId: 0, address: '', phoneNumber: '' }); setError(null); setLoading(false) } }, [open])

  async function create() {
    if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!form.name.trim() || !form.address.trim() || !form.provinceId) { setError('Vui lòng điền đủ tên/địa chỉ/tỉnh'); return }
    setLoading(true); setError(null)
    try {
      const res = await theaterApi.create(form, token)
      onCreated(res.data)
      onClose()
    } catch (e) { setError(e instanceof Error ? e.message : 'Tạo rạp thất bại') } finally { setLoading(false) }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Thêm rạp</h3><button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button></div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-3">
          <div><label className="text-sm font-medium text-gray-700">Tên rạp</label><input value={form.name} onChange={(e)=>setForm(p=>({...p,name:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
          <div><label className="text-sm font-medium text-gray-700">Tỉnh/Thành</label>
            <select value={form.provinceId || ''} onChange={(e)=>setForm(p=>({...p, provinceId: Number(e.target.value)}))} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="">-- Chọn --</option>
              {(provinces ?? []).map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium text-gray-700">Địa chỉ</label><input value={form.address} onChange={(e)=>setForm(p=>({...p,address:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
          <div><label className="text-sm font-medium text-gray-700">Số điện thoại</label><input value={form.phoneNumber || ''} onChange={(e)=>setForm(p=>({...p,phoneNumber:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
        </div>
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button><Button onClick={create} loading={loading}>Tạo</Button></div>
      </div>
    </div>
  )
}

function EditTheaterModal({ open, item, onClose, onUpdated }: { open: boolean; item?: TheaterDTO; onClose: () => void; onUpdated: (t: TheaterDTO) => void }) {
  const { token } = useAuth()
  const [provinces, setProvinces] = useState<ProvinceDTO[]>([])
  const [form, setForm] = useState<TheaterUpdate>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (open) (async () => { try { setProvinces(await provinceApi.list()) } catch {} })() }, [open])
  useEffect(() => { if (open && item) setForm({ name: item.name, provinceId: item.provinceId, address: item.address, phoneNumber: item.phoneNumber }) }, [open, item])

  async function save() {
    if (!token || !item) { setError('Bạn cần đăng nhập ADMIN'); return }
    setLoading(true); setError(null)
    try { const res = await theaterApi.update(item.id, form, token); onUpdated(res.data); onClose() } catch (e) { setError(e instanceof Error ? e.message : 'Cập nhật thất bại') } finally { setLoading(false) }
  }

  if (!open || !item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Sửa rạp</h3><button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button></div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-3">
          <div><label className="text-sm font-medium text-gray-700">Tên rạp</label><input value={form.name || ''} onChange={(e)=>setForm(p=>({...p,name:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
          <div><label className="text-sm font-medium text-gray-700">Tỉnh/Thành</label>
            <select value={form.provinceId || ''} onChange={(e)=>setForm(p=>({...p, provinceId: Number(e.target.value)}))} className="w-full rounded-lg border px-3 py-2 text-sm">
              <option value="">-- Chọn --</option>
              {(provinces ?? []).map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium text-gray-700">Địa chỉ</label><input value={form.address || ''} onChange={(e)=>setForm(p=>({...p,address:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
          <div><label className="text-sm font-medium text-gray-700">Số điện thoại</label><input value={form.phoneNumber || ''} onChange={(e)=>setForm(p=>({...p,phoneNumber:e.target.value}))} className="w-full rounded-lg border px-3 py-2 text-sm"/></div>
        </div>
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button><button onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button></div>
      </div>
    </div>
  )
}

export default function Theaters() {
  const { token } = useAuth()
  const [rows, setRows] = useState<TheaterDTO[]>([])
  const [provinces, setProvinces] = useState<ProvinceDTO[]>([])
  const [provinceFilter, setProvinceFilter] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [edit, setEdit] = useState<{ open: boolean; item?: TheaterDTO }>({ open: false })
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false })

  async function load() {
    setLoading(true); setError(null)
    try {
      const ths = await theaterApi.list(provinceFilter ? Number(provinceFilter) : undefined)
      setRows(ths)
    } catch (e) { setError(e instanceof Error ? e.message : 'Không tải được danh sách') } finally { setLoading(false) }
  }
  useEffect(() => { (async () => { try { setProvinces(await provinceApi.list()) } catch {} })() }, [])
  useEffect(() => { load() }, [provinceFilter])

  const columns: Column<TheaterDTO>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Tên rạp' },
    { key: 'provinceName', header: 'Tỉnh/Thành' },
    { key: 'address', header: 'Địa chỉ' },
    { key: 'phoneNumber', header: 'SĐT' },
    { key: 'provinceId', header: 'Hành động', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => setEdit({ open: true, item: r })} className="inline-flex items-center rounded-md bg-indigo-600/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-indigo-400/30 hover:bg-indigo-700 shadow-sm">✏️ Sửa</button>
        <button onClick={() => setConfirm({ open: true, id: r.id })} className="inline-flex items-center rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-red-400/30 hover:bg-red-600 shadow-sm">🗑️ Xoá</button>
      </div>
    ) },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Theaters</h3>
        <div className="flex items-center gap-2">
          <select value={provinceFilter} onChange={(e)=>setProvinceFilter(e.target.value ? Number(e.target.value) : '')} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Tất cả tỉnh</option>
            {(provinces ?? []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Button onClick={() => setCreateOpen(true)}>Thêm rạp</Button>
        </div>
      </div>
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
      {loading ? <div className="text-sm text-gray-600">Đang tải...</div> : <Table columns={columns} rows={rows} bordered={false} />}
      <CreateTheaterModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => load()} />
      <EditTheaterModal open={edit.open} item={edit.item} onClose={() => setEdit({ open: false })} onUpdated={() => load()} />
      <ConfirmDialog open={confirm.open} title="Xoá rạp" message="Bạn có chắc chắn muốn xoá rạp này?" onClose={() => setConfirm({ open: false })} onConfirm={async () => {
        if (!confirm.id) return
        if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
        try { await theaterApi.remove(confirm.id, token); setConfirm({ open: false }); load() } catch (e) { setError(e instanceof Error ? e.message : 'Xoá thất bại') }
      }} />
    </div>
  )
}
