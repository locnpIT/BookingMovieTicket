import { useEffect, useMemo, useState } from 'react'
import Table, { type Column } from '../components/Table'
import { directorApi } from '../../services/directorApi'
import type { DirectorDTO, PageResult } from '../../services/directorApi'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

function CreateDirectorModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (d: DirectorDTO) => void }) {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [bio, setBio] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setName(''); setBirthDate(''); setBio(''); setFile(null); setPreview(null); setError(null); setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  async function handleCreate() {
    if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!name.trim()) { setError('Tên đạo diễn là bắt buộc'); return }
    setError(null); setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', name)
      if (birthDate) fd.append('birthDate', birthDate)
      if (bio) fd.append('bio', bio)
      if (file) fd.append('file', file)
      const res = await directorApi.create(fd, token)
      onCreated(res.data)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tạo đạo diễn thất bại')
    } finally { setLoading(false) }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tạo đạo diễn</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tên</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Ví dụ: Christopher Nolan" />
            <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <label className="text-sm font-medium text-gray-700">Tiểu sử</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={6} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Mô tả ngắn..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-sky-700 hover:file:bg-sky-100" />
            {preview && (
              <div className="overflow-hidden rounded-lg border">
                <img src={preview} alt="preview" className="h-48 w-full object-cover" />
              </div>
            )}
            <p className="text-xs text-gray-500">Hỗ trợ ảnh JPG/PNG, tối đa 10MB.</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button>
          <Button onClick={handleCreate} loading={loading}>Tạo</Button>
        </div>
      </div>
    </div>
  )
}

function EditDirectorModal({ open, director, onClose, onUpdated }: { open: boolean; director?: DirectorDTO; onClose: () => void; onUpdated: (d: DirectorDTO) => void }) {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [bio, setBio] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && director) {
      setName(director.name || '')
      setBirthDate(director.birthDate || '')
      setBio(director.bio || '')
      setFile(null)
      setPreview(null)
      setError(null)
      setLoading(false)
    }
  }, [open, director])

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  async function save() {
    if (!open || !director) return
    if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
    setLoading(true)
    setError(null)
    try {
      const payload: any = { name, bio }
      if (birthDate) payload.birthDate = birthDate
      const res = await directorApi.update(director.id, payload, token)
      if (file) {
        try { await directorApi.uploadImage(director.id, file, token) } catch {}
      }
      onUpdated(res.data)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cập nhật thất bại')
    } finally { setLoading(false) }
  }

  if (!open || !director) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Sửa đạo diễn</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tên</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tiểu sử</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={6} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            <label className="text-sm font-medium text-gray-700">Ảnh đại diện (tuỳ chọn)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-amber-700 hover:file:bg-amber-100" />
            {preview && (
              <div className="overflow-hidden rounded-lg border">
                <img src={preview} alt="preview" className="h-40 w-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button>
          <button onClick={save} className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-50" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDelete({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Xoá đạo diễn</h3>
        <p className="text-sm text-gray-600">Bạn có chắc chắn muốn xoá đạo diễn này? Hành động không thể hoàn tác.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Xoá</button>
        </div>
      </div>
    </div>
  )
}

export default function Directors() {
  const { token } = useAuth()
  const [rows, setRows] = useState<DirectorDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [edit, setEdit] = useState<{ open: boolean; item?: DirectorDTO }>({ open: false })
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false })
  const [page, setPage] = useState(0)
  const pageSize = 10
  const [pageMeta, setPageMeta] = useState<{ totalElements: number; totalPages: number }>({ totalElements: 0, totalPages: 0 })

  const pages = useMemo<(number | string)[]>(() => {
    const total = pageMeta.totalPages
    const curr = page
    const result: (number | string)[] = []
    if (total <= 7) { for (let i = 0; i < total; i++) result.push(i); return result }
    result.push(0)
    const start = Math.max(1, curr - 1)
    const end = Math.min(total - 2, curr + 1)
    if (start > 1) result.push('...')
    for (let i = start; i <= end; i++) result.push(i)
    if (end < total - 2) result.push('...')
    result.push(total - 1)
    return result
  }, [page, pageMeta.totalPages])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data: PageResult<DirectorDTO> = await directorApi.listPaged(page, pageSize)
      setRows(data.content)
      setPageMeta({ totalElements: data.totalElements, totalPages: data.totalPages })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được danh sách')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page])

  const columns: Column<DirectorDTO>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    {
      key: 'name', header: 'Đạo diễn', render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-gray-200">
            {r.imageUrl ? <img src={r.imageUrl} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">No</div>}
          </div>
          <div className="leading-tight">
            <div className="font-medium text-gray-900">{r.name}</div>
            {r.birthDate && <div className="text-xs text-gray-500">Sinh: {r.birthDate}</div>}
          </div>
        </div>
      )
    },
    { key: 'bio', header: 'Tiểu sử', render: (r) => <span className="line-clamp-2 text-gray-700">{r.bio || '-'}</span> },
    { key: 'imagePublicId', header: 'Hành động', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => setEdit({ open: true, item: r })} className="inline-flex items-center rounded-md bg-amber-500/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-amber-400/30 hover:bg-amber-600 shadow-sm">✏️ Sửa</button>
        <button onClick={() => setConfirm({ open: true, id: r.id })} className="inline-flex items-center rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-red-400/30 hover:bg-red-600 shadow-sm">🗑️ Xoá</button>
      </div>
    ) },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Đạo diễn</h3>
        <Button onClick={() => setModalOpen(true)}>Thêm đạo diễn</Button>
      </div>

      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
      {loading ? (
        <div className="text-sm text-gray-600">Đang tải...</div>
      ) : (
        <>
          <Table columns={columns} rows={rows} bordered={false} />
          <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-gray-600 md:flex-row">
            <div className="order-2 md:order-1">
              {rows.length > 0
                ? `Hiển thị ${page * pageSize + 1}–${page * pageSize + rows.length} trên ${pageMeta.totalElements}`
                : 'Không có dữ liệu'}
            </div>
            <div className="order-1 md:order-2 inline-flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-md px-2 py-1.5 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50" aria-label="Trang trước" title="Trang trước">&lt;</button>
              {pages.map((p, idx) => p === '...'
                ? <span key={`dots-${idx}`} className="px-2 text-gray-400 select-none">…</span>
                : (
                  <button key={p as number} onClick={() => setPage(p as number)} className={`min-w-9 rounded-md px-3 py-1.5 text-sm ring-1 ${ (p as number) === page ? 'bg-sky-600 text-white ring-sky-600' : 'text-gray-700 ring-gray-200 hover:bg-gray-50' }`} aria-current={(p as number) === page ? 'page' : undefined}>
                    {(p as number) + 1}
                  </button>
                ))}
              <button onClick={() => setPage((p) => (p + 1 < pageMeta.totalPages ? p + 1 : p))} disabled={page + 1 >= pageMeta.totalPages} className="rounded-md px-2 py-1.5 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50" aria-label="Trang sau" title="Trang sau">&gt;</button>
            </div>
          </div>
        </>
      )}

      <CreateDirectorModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={(_d) => { setPage(0); load() }} />

      <EditDirectorModal open={edit.open} director={edit.item} onClose={() => setEdit({ open: false })} onUpdated={(_d) => load()} />

      <ConfirmDelete open={confirm.open} onClose={() => setConfirm({ open: false })} onConfirm={async () => {
        if (!confirm.id) return
        if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
        try {
          await directorApi.remove(confirm.id, token)
          const newCount = rows.length - 1
          if (newCount <= 0 && page > 0) setPage((p) => p - 1)
          else load()
          setConfirm({ open: false })
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Xoá thất bại')
        }
      }} />
    </div>
  )
}

