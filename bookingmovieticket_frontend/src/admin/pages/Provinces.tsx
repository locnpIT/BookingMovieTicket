import { useEffect, useMemo, useState } from 'react'
import Table, { type Column } from '../components/Table'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { provinceApi } from '../../services/provinceApi'
import type { ProvinceDTO } from '../../services/provinceApi'

function CreateProvinceModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (p: ProvinceDTO) => void }) {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (!open) { setName(''); setError(null); setLoading(false) } }, [open])

  async function create() {
    if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!name.trim()) { setError('Vui lòng nhập tên tỉnh/thành'); return }
    setLoading(true); setError(null)
    try { const res = await provinceApi.create({ name }, token); onCreated(res.data); onClose() } catch (e) { setError(e instanceof Error ? e.message : 'Tạo thất bại') } finally { setLoading(false) }
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Thêm tỉnh/thành</h3><button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button></div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <label className="text-sm font-medium text-gray-700">Tên</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button><Button onClick={create} loading={loading}>Tạo</Button></div>
      </div>
    </div>
  )
}

function EditProvinceModal({ open, item, onClose, onUpdated }: { open: boolean; item?: ProvinceDTO; onClose: () => void; onUpdated: (p: ProvinceDTO) => void }) {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { if (open && item) { setName(item.name) } }, [open, item])
  async function save() {
    if (!token || !item) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!name.trim()) { setError('Vui lòng nhập tên'); return }
    setLoading(true); setError(null)
    try { const res = await provinceApi.update(item.id, { name }, token); onUpdated(res.data); onClose() } catch (e) { setError(e instanceof Error ? e.message : 'Cập nhật thất bại') } finally { setLoading(false) }
  }
  if (!open || !item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Sửa tỉnh/thành</h3><button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button></div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <label className="text-sm font-medium text-gray-700">Tên</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" />
        <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button><button onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button></div>
      </div>
    </div>
  )
}

export default function Provinces() {
  const { token } = useAuth()
  const [rows, setRows] = useState<ProvinceDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [edit, setEdit] = useState<{ open: boolean; item?: ProvinceDTO }>({ open: false })
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false })

  async function load() { setLoading(true); setError(null); try { setRows(await provinceApi.list()) } catch (e) { setError(e instanceof Error ? e.message : 'Không tải được danh sách') } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const columns: Column<ProvinceDTO>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Tên' },
    { key: 'id', header: 'Hành động', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => setEdit({ open: true, item: r })} className="inline-flex items-center rounded-md bg-indigo-600/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-indigo-400/30 hover:bg-indigo-700 shadow-sm">✏️ Sửa</button>
        <button onClick={() => setConfirm({ open: true, id: r.id })} className="inline-flex items-center rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-red-400/30 hover:bg-red-600 shadow-sm">🗑️ Xoá</button>
      </div>
    ) },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Provinces</h3>
        <Button onClick={() => setCreateOpen(true)}>Thêm tỉnh/thành</Button>
      </div>
      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
      {loading ? <div className="text-sm text-gray-600">Đang tải...</div> : <Table columns={columns} rows={rows} bordered={false} />}
      <CreateProvinceModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => load()} />
      <EditProvinceModal open={edit.open} item={edit.item} onClose={() => setEdit({ open: false })} onUpdated={() => load()} />
      <ConfirmDialog open={confirm.open} title="Xoá tỉnh/thành" message="Bạn có chắc chắn muốn xoá?" onClose={() => setConfirm({ open: false })} onConfirm={async () => {
        if (!confirm.id) return
        if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
        try { await provinceApi.remove(confirm.id, token); setConfirm({ open: false }); load() } catch (e) { setError(e instanceof Error ? e.message : 'Xoá thất bại') }
      }} />
    </div>
  )
}

