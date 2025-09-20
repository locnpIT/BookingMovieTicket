import { useEffect, useMemo, useState } from 'react'
import Table from '../components/Table'
import type { Column } from '../components/Table'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { movieApi } from '../../services/movieApi'
import type { MovieDTO } from '../../services/movieApi'
import type { PageResult } from '../../services/api'
import { directorApi } from '../../services/directorApi'
import type { DirectorDTO } from '../../services/directorApi'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { buildPageList } from '../../utils/pagination'
import { formatDateDisplay } from '../../utils/date'

function CreateMovieModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (m: MovieDTO) => void }) {
  const { token } = useAuth() // reserved for future edit/delete actions
  const [form, setForm] = useState({
    title: '',
    duration: 120,
    releaseDate: '',
    imageUrl: '',
    trailerUrl: '',
    ageRating: 'T16',
    language: 'Việt/Eng',
    description: '',
    genreIds: '' as string,
    authorIds: '' as string,
  })
  const [directors, setDirectors] = useState<DirectorDTO[]>([])
  const [selectedDirectorId, setSelectedDirectorId] = useState<number | null>(null)
  const [dirOpen, setDirOpen] = useState(false)
  const [dirSearch, setDirSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setForm({ title: '', duration: 120, releaseDate: '', imageUrl: '', trailerUrl: '', ageRating: 'T16', language: 'Việt/Eng', description: '', genreIds: '', authorIds: '' })
      setSelectedDirectorId(null)
      setDirOpen(false)
      setDirSearch('')
      setError(null)
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        const list = await directorApi.list()
        setDirectors(list)
      } catch {
        // ignore
      }
    })()
  }, [open])

  function parseIds(s: string): number[] {
    return s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((n) => !Number.isNaN(n))
  }

  async function createMovie() {
    if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!form.title.trim() || !form.releaseDate || !form.ageRating.trim() || !form.language.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const payload = {
        title: form.title,
        duration: Number(form.duration),
        releaseDate: form.releaseDate,
        imageUrl: form.imageUrl || undefined,
        trailerUrl: form.trailerUrl || undefined,
        ageRating: form.ageRating,
        language: form.language,
        description: form.description || undefined,
        genreIds: parseIds(form.genreIds),
        directorIds: selectedDirectorId ? [selectedDirectorId] : [],
        authorIds: parseIds(form.authorIds),
      }
      const res = await movieApi.create(payload, token)
      onCreated(res.data)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tạo phim thất bại')
    } finally { setLoading(false) }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Thêm phim mới</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Tên phim" />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Thời lượng (phút)</label>
                <input type="number" min={1} value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: Number(e.target.value) }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ngày phát hành</label>
                <input type="date" value={form.releaseDate} onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Giới hạn tuổi</label>
                <input value={form.ageRating} onChange={(e) => setForm((p) => ({ ...p, ageRating: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Ngôn ngữ</label>
                <input value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Trailer URL</label>
                <input value={form.trailerUrl} onChange={(e) => setForm((p) => ({ ...p, trailerUrl: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="https://..." />
              </div>
            </div>
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={5} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Tóm tắt nội dung..." />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Genre IDs (tùy chọn)</label>
                <input value={form.genreIds} onChange={(e) => setForm((p) => ({ ...p, genreIds: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="vd: 1,2,3" />
              </div>
              <div className="relative">
                <label className="text-sm font-medium text-gray-700">Đạo diễn</label>
                <button
                  type="button"
                  onClick={() => setDirOpen((v) => !v)}
                  className="mt-1 w-full justify-between rounded-lg border px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 inline-flex items-center gap-2"
                >
                  <span className="truncate">{selectedDirectorId ? (directors.find(d => d.id === selectedDirectorId)?.name || 'Đã chọn') : 'Chọn đạo diễn'}</span>
                  <span className="ml-auto text-gray-500">▾</span>
                </button>
                {dirOpen && (
                  <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white p-2 shadow-lg">
                    <input
                      value={dirSearch}
                      onChange={(e) => setDirSearch(e.target.value)}
                      placeholder="Tìm đạo diễn..."
                      className="mb-2 w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {directors
                        .filter(d => !dirSearch.trim() || d.name.toLowerCase().includes(dirSearch.toLowerCase()))
                        .map((d) => (
                          <label key={d.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50">
                            <input
                              type="radio"
                              name="director"
                              className="h-4 w-4"
                              checked={selectedDirectorId === d.id}
                              onChange={() => { setSelectedDirectorId(d.id); setDirOpen(false) }}
                            />
                            <span className="text-sm text-gray-800">{d.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Author IDs (tùy chọn)</label>
                <input value={form.authorIds} onChange={(e) => setForm((p) => ({ ...p, authorIds: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="vd: 5,9" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Poster URL</label>
            <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="https://..." />
            {form.imageUrl && (
              <div className="overflow-hidden rounded-lg border">
                <img src={form.imageUrl} alt="poster" className="h-60 w-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Hủy</button>
          <Button onClick={createMovie} loading={loading}>Tạo phim</Button>
        </div>
      </div>
    </div>
  )
}

function EditMovieModal({ open, movie, onClose, onUpdated }: { open: boolean; movie?: MovieDTO; onClose: () => void; onUpdated: (m: MovieDTO) => void }) {
  const { token } = useAuth()
  const [form, setForm] = useState({
    title: '',
    duration: 120,
    releaseDate: '',
    imageUrl: '',
    trailerUrl: '',
    ageRating: 'T16',
    language: 'Việt/Eng',
    description: '',
    status: '' as '' | MovieDTO['status'],
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && movie) {
      setForm({
        title: movie.title || '',
        duration: movie.duration || 120,
        releaseDate: movie.releaseDate || '',
        imageUrl: movie.imageUrl || '',
        trailerUrl: movie.trailerUrl || '',
        ageRating: movie.ageRating || 'T16',
        language: movie.language || 'Việt/Eng',
        description: '',
        status: movie.status || '',
      })
      setFile(null); setPreview(null); setError(null); setLoading(false)
    }
    if (!open) {
      setFile(null); setPreview(null); setError(null); setLoading(false)
    }
  }, [open, movie])

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  async function save() {
    if (!token || !movie) { setError('Bạn cần đăng nhập ADMIN'); return }
    if (!form.title.trim() || !form.releaseDate || !form.ageRating.trim() || !form.language.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const payload = {
        title: form.title,
        duration: Number(form.duration),
        releaseDate: form.releaseDate,
        imageUrl: form.imageUrl || undefined,
        trailerUrl: form.trailerUrl || undefined,
        ageRating: form.ageRating,
        language: form.language,
        description: form.description || undefined,
        status: (form.status || undefined) as any,
      }
      const res = await movieApi.update(movie.id, payload, token)
      let latest: MovieDTO | undefined
      if (file) {
        try {
          await movieApi.uploadImage(movie.id, file, token)
          // Poll until imageUrl updated (async upload on backend)
          const start = Date.now(); const timeoutMs = 10000; const intervalMs = 800
          while (Date.now() - start < timeoutMs) {
            const curr = await movieApi.get(movie.id)
            if (curr.imageUrl && curr.imageUrl.length > 0) { latest = curr; break }
            await new Promise((r) => setTimeout(r, intervalMs))
          }
        } catch {}
      }
      onUpdated(latest ?? res.data)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cập nhật phim thất bại')
    } finally { setLoading(false) }
  }

  if (!open || !movie) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Sửa phim</h3>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tên phim" />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Thời lượng (phút)</label>
                <input type="number" min={1} value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: Number(e.target.value) }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ngày phát hành</label>
                <input type="date" value={form.releaseDate} onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Độ tuổi</label>
                <input value={form.ageRating} onChange={(e) => setForm((p) => ({ ...p, ageRating: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="T13, T16..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Ngôn ngữ</label>
                <input value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Không đổi</option>
                  <option value="NOW_SHOWING">Đang chiếu</option>
                  <option value="UPCOMING">Sắp chiếu</option>
                  <option value="ENDED">Đã kết thúc</option>
                </select>
              </div>
            </div>
            <label className="text-sm font-medium text-gray-700">Trailer URL</label>
            <input value={form.trailerUrl} onChange={(e) => setForm((p) => ({ ...p, trailerUrl: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
            <label className="text-sm font-medium text-gray-700">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tóm tắt nội dung..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Poster URL</label>
            <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
            {(preview || form.imageUrl) && (
              <div className="overflow-hidden rounded-lg border">
                <img src={preview || form.imageUrl} alt="poster" className="h-60 w-full object-cover" />
              </div>
            )}
            <label className="text-sm font-medium text-gray-700">Tải ảnh mới (tuỳ chọn)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-700 hover:file:bg-indigo-100" />
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


export default function Movies() {
  const { token } = useAuth()
  const [rows, setRows] = useState<MovieDTO[]>([])
  const [status, setStatus] = useState<'' | MovieDTO['status']>('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [edit, setEdit] = useState<{ open: boolean; item?: MovieDTO }>({ open: false })
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false })
  const [page, setPage] = useState(0)
  const pageSize = 10
  const [pageMeta, setPageMeta] = useState<{ totalElements: number; totalPages: number }>({ totalElements: 0, totalPages: 0 })

  const pages = useMemo<(number | string)[]>(() => buildPageList(pageMeta.totalPages, page), [page, pageMeta.totalPages])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data: PageResult<MovieDTO> = await movieApi.listPaged(page, pageSize, status || undefined)
      setRows(data.content)
      setPageMeta({ totalElements: data.totalElements, totalPages: data.totalPages })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được danh sách phim')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [status, page])

  const columns: Column<MovieDTO>[] = useMemo(() => [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Tiêu đề', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-12 w-9 overflow-hidden rounded ring-1 ring-gray-200">
          {r.imageUrl ? <img src={r.imageUrl} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">No</div>}
        </div>
        <div className="leading-tight">
          <div className="font-medium text-gray-900">{r.title}</div>
          <div className="text-xs text-gray-500">{formatDateDisplay(r.releaseDate)} • {r.duration} phút</div>
        </div>
      </div>
    )},
    { key: 'status', header: 'Trạng thái', render: (r) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        r.status === 'NOW_SHOWING' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : r.status === 'UPCOMING' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
      }`}>{r.status}</span>
    )},
    { key: 'language', header: 'Ngôn ngữ' },
    { key: 'ageRating', header: 'Độ tuổi' },
    { key: 'language', header: 'Hành động', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => setEdit({ open: true, item: r })} className="inline-flex items-center rounded-md bg-indigo-600/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-indigo-400/30 hover:bg-indigo-700 shadow-sm">✏️ Sửa</button>
        <button onClick={() => setConfirm({ open: true, id: r.id })} className="inline-flex items-center rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-red-400/30 hover:bg-red-600 shadow-sm">🗑️ Xoá</button>
      </div>
    ) },
  ], [])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((m) => m.title.toLowerCase().includes(q))
  }, [rows, search])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Movies</h3>
        <div className="flex items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">Tất cả</option>
            <option value="NOW_SHOWING">Đang chiếu</option>
            <option value="UPCOMING">Sắp chiếu</option>
            <option value="ENDED">Đã kết thúc</option>
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên phim..." className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <Button onClick={() => setModalOpen(true)}>Thêm phim</Button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
      {loading ? (
        <div className="text-sm text-gray-600">Đang tải...</div>
      ) : (
        <>
          <Table columns={columns} rows={filtered} bordered={false} />
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

      <CreateMovieModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={(_m) => { setModalOpen(false); setPage(0); load() }} />

      <EditMovieModal open={edit.open} movie={edit.item} onClose={() => setEdit({ open: false })} onUpdated={(_m) => load()} />

      <ConfirmDialog open={confirm.open} title="Xoá phim" message="Bạn có chắc chắn muốn xoá phim này? Hành động không thể hoàn tác." onClose={() => setConfirm({ open: false })} onConfirm={async () => {
        if (!confirm.id) return
        if (!token) { setError('Bạn cần đăng nhập ADMIN'); return }
        try {
          await movieApi.remove(confirm.id, token)
          const newCount = rows.length - 1
          if (newCount <= 0 && page > 0) setPage((p) => p - 1)
          else load()
          setConfirm({ open: false })
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Xoá phim thất bại')
        }
      }} />
    </div>
  )
}
