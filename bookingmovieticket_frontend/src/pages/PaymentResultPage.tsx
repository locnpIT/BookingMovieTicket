import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function PaymentResultPage() {
  const query = useQuery()
  const status = query.get('status') ?? 'unknown'
  const message = query.get('message')
  const bookingCode = query.get('bookingCode')
  const navigate = useNavigate()
  const { token } = useAuth()

  useEffect(() => {
    // Nếu không có trạng thái, quay về trang chủ
    if (!status) navigate('/', { replace: true })
  }, [status, navigate])

  const isSuccess = status === 'success'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      {isSuccess ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-10 shadow">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            ✓
          </div>
          <h1 className="text-2xl font-semibold text-emerald-700">Thanh toán thành công</h1>
          <p className="mt-2 text-sm text-emerald-700/80">
            {bookingCode ? (
              <>
                Mã đặt vé của bạn: <span className="font-semibold">{bookingCode}</span>.
              </>
            ) : (
              'Giao dịch đã được xác nhận.'
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/" className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
              Về trang chủ
            </Link>
            {token && (
              <Link
                to="/account/bookings"
                className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:from-sky-600 hover:to-indigo-600"
              >
                Xem lịch sử đặt vé
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 shadow">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner">
            !
          </div>
          <h1 className="text-2xl font-semibold text-red-700">Thanh toán không thành công</h1>
          <p className="mt-2 text-sm text-red-600/80">{message || 'Vui lòng thử lại hoặc chọn phương thức khác.'}</p>
          <div className="mt-6 flex justify-center">
            <Link to="/" className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
