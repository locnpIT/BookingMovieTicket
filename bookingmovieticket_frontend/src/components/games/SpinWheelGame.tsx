import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { gameApi, type GameType } from '../../services/gameApi'
import Button from '../ui/Button'

const WHEEL_SEGMENTS = [
  { label: '50', value: 50, color: '#ef4444', gradient: 'from-red-500 via-red-600 to-red-700' },
  { label: '75', value: 75, color: '#f97316', gradient: 'from-orange-500 via-orange-600 to-orange-700' },
  { label: '100', value: 100, color: '#fbbf24', gradient: 'from-amber-500 via-amber-600 to-amber-700' },
  { label: '125', value: 125, color: '#eab308', gradient: 'from-yellow-500 via-yellow-600 to-yellow-700' },
  { label: '150', value: 150, color: '#84cc16', gradient: 'from-lime-500 via-lime-600 to-lime-700' },
  { label: '175', value: 175, color: '#22c55e', gradient: 'from-green-500 via-green-600 to-green-700' },
  { label: '200', value: 200, color: '#10b981', gradient: 'from-emerald-500 via-emerald-600 to-emerald-700' },
  { label: 'Chúc bạn may mắn lần sau', value: 0, color: '#64748b', gradient: 'from-slate-500 via-slate-600 to-slate-700', isLose: true },
]

export default function SpinWheelGame({ onGameEnd }: { onGameEnd: (score: number, points: number) => void }) {
  const { token } = useAuth()
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<{ value: number; isLose: boolean } | null>(null)
  const [canSpin, setCanSpin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    if (token) {
      checkCanSpin()
    }
  }, [token])

  async function checkCanSpin() {
    if (!token) return
    try {
      const can = await gameApi.canPlayGameType(token, 'SPIN_WHEEL')
      setCanSpin(can)
    } catch (e) {
      setCanSpin(false)
    }
  }

  async function handleSpin() {
    if (!token || spinning || !canSpin) return

    setSpinning(true)
    setResult(null)
    setShowParticles(true)

    // Random rotation (5-10 full rotations + random segment)
    const baseRotation = 1800 + Math.random() * 1800 // 5-10 full rotations
    const segmentAngle = 360 / WHEEL_SEGMENTS.length
    const randomSegment = Math.floor(Math.random() * WHEEL_SEGMENTS.length)
    const finalRotation = baseRotation + (randomSegment * segmentAngle) + (segmentAngle / 2)

    setRotation(rotation + finalRotation)

    // Wait for spin animation
    setTimeout(async () => {
      const selectedSegment = WHEEL_SEGMENTS[randomSegment]
      setResult({ value: selectedSegment.value, isLose: selectedSegment.isLose || false })
      setSpinning(false)
      setShowParticles(false)

      // Submit result only if not lose
      if (!selectedSegment.isLose) {
        setLoading(true)
        try {
          const result = await gameApi.submitGame(token, {
            gameType: 'SPIN_WHEEL',
            score: selectedSegment.value,
            gameData: JSON.stringify({ segment: randomSegment })
          })
          onGameEnd(selectedSegment.value, result.pointsEarned)
          setCanSpin(false) // Can only spin once per day
        } catch (e) {
          console.error('Failed to submit game result', e)
        } finally {
          setLoading(false)
        }
      } else {
        // If lose, still mark as used
        setCanSpin(false)
        onGameEnd(0, 0)
      }
    }, 4000)
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6 md:p-8 text-center border-2 border-amber-200 shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400 to-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-5xl mb-4 shadow-2xl ring-4 ring-white/50 animate-pulse">
            🎡
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Vòng Quay May Mắn
          </h2>
          <p className="text-gray-700 mb-4 text-lg">
            Quay vòng quay để nhận điểm thưởng ngẫu nhiên từ 50-200 điểm!
          </p>
          {!canSpin && (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-5 py-2.5 text-sm font-semibold text-red-700 mb-4 border-2 border-red-200 shadow-md animate-bounce">
              <span>⏰</span>
              <span>Bạn đã quay hôm nay. Vui lòng quay lại vào ngày mai!</span>
            </div>
          )}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-5 py-2.5 text-sm font-semibold text-amber-800 border-2 border-amber-300 shadow-md">
            <span>💡</span>
            <span>1 lượt quay / ngày</span>
          </div>
        </div>

        {/* Wheel Container */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full ${
            spinning ? 'animate-spin-slow' : ''
          }`} style={{ 
            background: 'conic-gradient(from 0deg, #ef4444 0deg 45deg, #f97316 45deg 90deg, #fbbf24 90deg 135deg, #eab308 135deg 180deg, #84cc16 180deg 225deg, #22c55e 225deg 270deg, #10b981 270deg 315deg, #64748b 315deg 360deg)',
            filter: 'blur(20px)',
            opacity: spinning ? 0.6 : 0.3,
            transform: 'scale(1.1)'
          }} />

          {/* Wheel */}
          <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
            {/* Shadow */}
            <div className="absolute inset-0 rounded-full bg-black/20 blur-xl -z-10" />
            
            {/* Wheel body */}
            <div
              className={`absolute inset-0 rounded-full border-8 border-white/90 shadow-2xl ${
                spinning ? 'transition-transform duration-[4000ms] ease-out' : ''
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(
                  from 0deg,
                  #ef4444 0deg 45deg,
                  #f97316 45deg 90deg,
                  #fbbf24 90deg 135deg,
                  #eab308 135deg 180deg,
                  #84cc16 180deg 225deg,
                  #22c55e 225deg 270deg,
                  #10b981 270deg 315deg,
                  #64748b 315deg 360deg
                )`,
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1), 0 0 30px rgba(0,0,0,0.2)'
              }}
            >
              {/* Segment borders */}
              {WHEEL_SEGMENTS.map((seg, idx) => {
                const segmentAngle = 360 / WHEEL_SEGMENTS.length
                const borderAngle = idx * segmentAngle
                return (
                  <div
                    key={`border-${idx}`}
                    className="absolute inset-0"
                    style={{
                      transform: `rotate(${borderAngle}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/60" />
                  </div>
                )
              })}

              {/* Labels */}
              {WHEEL_SEGMENTS.map((seg, idx) => {
                const segmentAngle = 360 / WHEEL_SEGMENTS.length
                const labelAngle = (idx * segmentAngle) + (segmentAngle / 2) - 90
                const radian = (labelAngle * Math.PI) / 180
                const radius = seg.isLose ? 100 : 130
                const x = Math.cos(radian) * radius
                const y = Math.sin(radian) * radius

                return (
                  <div
                    key={idx}
                    className={`absolute text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
                      seg.isLose ? 'text-xs md:text-sm' : 'text-xl md:text-2xl'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      maxWidth: seg.isLose ? '90px' : '60px',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    {seg.label}
                  </div>
                )
              })}
            </div>

            {/* Center Circle with glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-xl opacity-60 animate-pulse" />
                {/* Center circle */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-white via-amber-50 to-orange-100 shadow-2xl border-4 border-amber-400 flex items-center justify-center">
                  <span className="text-3xl md:text-4xl">🎁</span>
                </div>
              </div>
            </div>

            {/* Pointer with 3D effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="relative">
                {/* Pointer shadow */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[50px] border-t-black/30 blur-md" />
                {/* Pointer body */}
                <div className="relative">
                  <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[50px] border-t-red-600 drop-shadow-2xl" />
                  {/* Pointer highlight */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-red-400" />
                </div>
                {/* Pointer center dot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg" />
              </div>
            </div>

            {/* Particles effect when spinning */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-yellow-400 animate-ping"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-180px)`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result display */}
        {result && (
          <div className={`mb-6 rounded-2xl border-2 p-6 shadow-2xl animate-scaleIn ${
            result.isLose 
              ? 'bg-gradient-to-r from-slate-50 via-gray-50 to-slate-50 border-slate-300' 
              : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-300'
          }`}>
            {result.isLose ? (
              <>
                <div className="text-4xl mb-3 animate-bounce">😔</div>
                <div className="text-2xl md:text-3xl font-bold text-slate-700 mb-2">
                  Chúc bạn may mắn lần sau!
                </div>
                <div className="text-lg text-gray-600">
                  Bạn không nhận được điểm lần này. Hãy thử lại vào ngày mai!
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3 animate-bounce">🎉</div>
                <div className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2">
                  Chúc mừng!
                </div>
                <div className="text-xl md:text-2xl font-semibold text-gray-800">
                  Bạn nhận được <span className="text-3xl md:text-4xl text-emerald-600 font-black">{result.value}</span> điểm!
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Tương đương {gameApi.pointsToVnd(result.value).toLocaleString('vi-VN')} VND giảm giá
                </div>
              </>
            )}
          </div>
        )}

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={spinning || !canSpin || loading}
          loading={loading}
          className={`px-10 py-4 text-lg font-bold shadow-2xl transition-all duration-300 ${
            canSpin && !spinning
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 hover:scale-105 active:scale-95'
              : ''
          }`}
        >
          {spinning ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🎡</span>
              <span>Đang quay...</span>
            </span>
          ) : canSpin ? (
            <span className="flex items-center gap-2">
              <span>🎯</span>
              <span>Quay ngay</span>
            </span>
          ) : (
            <span>Đã quay hôm nay</span>
          )}
        </Button>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
