import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { checkInApi, type CheckInStatus } from '../services/checkInApi'
import { gameApi } from '../services/gameApi'
import Button from './ui/Button'

export default function CheckInWidget() {
  const { token } = useAuth()
  const [status, setStatus] = useState<CheckInStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      loadStatus()
    }
  }, [token])

  async function loadStatus() {
    if (!token) return
    try {
      setLoading(true)
      const data = await checkInApi.getStatus(token)
      setStatus(data)
    } catch (e) {
      console.error('Failed to load check-in status', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckIn() {
    if (!token || checkingIn) return
    try {
      setCheckingIn(true)
      setMessage(null)
      const result = await checkInApi.checkIn(token)
      setMessage(
        result.isMilestone
          ? `🎉 Điểm danh thành công! Nhận ${result.basePoints} điểm + ${result.bonusPoints} điểm thưởng = ${result.totalPoints} điểm!`
          : `✅ Điểm danh thành công! Nhận ${result.totalPoints} điểm!`
      )
      await loadStatus()
      // Refresh points in Navbar
      window.dispatchEvent(new Event('points-updated'))
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Điểm danh thất bại')
    } finally {
      setCheckingIn(false)
    }
  }

  function getMilestoneText(milestone: number): string {
    switch (milestone) {
      case 7:
        return '7 ngày (+20 điểm)'
      case 14:
        return '14 ngày (+30 điểm)'
      case 28:
        return '28 ngày (+100 điểm)'
      default:
        return ''
    }
  }

  if (!token || loading) {
    return null
  }

  if (!status) {
    return (
      <div className="rounded-xl glass-cinema border border-red-500/30 p-4">
        <div className="text-sm text-slate-300">Đang tải...</div>
      </div>
    )
  }

  const progress = status.nextMilestone > 0 
    ? (status.consecutiveDays / status.nextMilestone) * 100 
    : 100

  return (
    <div className="rounded-xl glass-cinema border border-red-500/30 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold gradient-text-cinema">Điểm danh hàng ngày</h3>
        <span className="text-xs text-slate-400">+10 điểm/ngày</span>
      </div>

      {message && (
        <div className={`mb-3 rounded-lg border px-3 py-2 text-sm ${
          message.includes('thành công')
            ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300'
            : 'border-red-500/50 bg-red-900/30 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">
            Ngày liên tục: <span className="text-amber-400 font-bold">{status.consecutiveDays}</span>
          </span>
          {status.nextMilestone > 0 && (
            <span className="text-xs text-slate-400">
              Còn {status.daysUntilNextMilestone} ngày đến mốc {getMilestoneText(status.nextMilestone)}
            </span>
          )}
        </div>
        {status.nextMilestone > 0 ? (
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        ) : (
          <div className="w-full h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
        )}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-800/50 p-2 border border-amber-500/20">
          <div className="text-xs text-slate-400 mb-1">7 ngày</div>
          <div className="text-sm font-bold text-amber-400">+20</div>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-2 border border-amber-500/20">
          <div className="text-xs text-slate-400 mb-1">14 ngày</div>
          <div className="text-sm font-bold text-amber-400">+30</div>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-2 border border-amber-500/20">
          <div className="text-xs text-slate-400 mb-1">28 ngày</div>
          <div className="text-sm font-bold text-amber-400">+100</div>
        </div>
      </div>

      <Button
        onClick={handleCheckIn}
        disabled={status.hasCheckedInToday || checkingIn}
        loading={checkingIn}
        className={`w-full btn-cinema ${status.hasCheckedInToday ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {status.hasCheckedInToday ? (
          <span className="flex items-center justify-center gap-2">
            <span>✅</span>
            <span>Đã điểm danh hôm nay</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🎯</span>
            <span>Điểm danh ngay</span>
          </span>
        )}
      </Button>

      {status.checkIns.length > 0 && (
        <div className="mt-4 pt-4 border-t border-red-500/20">
          <div className="text-xs text-slate-400 mb-2">Lịch sử tháng này: {status.totalCheckIns} ngày</div>
          <div className="flex flex-wrap gap-1">
            {status.checkIns.slice(-7).map((checkIn, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  checkIn.bonusPoints > 0
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
                title={`${new Date(checkIn.date).toLocaleDateString('vi-VN')}: +${checkIn.totalPoints} điểm`}
              >
                ✓
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

