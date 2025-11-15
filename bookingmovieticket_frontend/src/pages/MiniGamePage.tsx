import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { gameApi, type GameType } from '../services/gameApi'
import QuizGame from '../components/games/QuizGame'
import MemoryCardGame from '../components/games/MemoryCardGame'
import SpinWheelGame from '../components/games/SpinWheelGame'
import ClickRaceGame from '../components/games/ClickRaceGame'

type GameTab = {
  id: GameType
  name: string
  icon: string
  color: string
  description: string
}

const GAME_TABS: GameTab[] = [
  {
    id: 'QUIZ',
    name: 'Đố Vui',
    icon: '🎯',
    color: 'from-sky-500 to-indigo-600',
    description: 'Trả lời câu hỏi về phim'
  },
  {
    id: 'MEMORY_CARD',
    name: 'Lật Thẻ',
    icon: '🎴',
    color: 'from-purple-500 to-pink-500',
    description: 'Tìm cặp thẻ giống nhau'
  },
  {
    id: 'SPIN_WHEEL',
    name: 'Vòng Quay',
    icon: '🎡',
    color: 'from-amber-400 to-orange-500',
    description: 'Quay may mắn (1 lần/ngày)'
  },
  {
    id: 'CLICK_RACE',
    name: 'Click Nhanh',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
    description: 'Click càng nhanh càng tốt'
  }
]

export default function MiniGamePage() {
  const { token } = useAuth()
  const [selectedGame, setSelectedGame] = useState<GameType>('QUIZ')
  const [canPlay, setCanPlay] = useState<Record<GameType, boolean>>({
    QUIZ: true,
    MEMORY_CARD: true,
    SPIN_WHEEL: true,
    CLICK_RACE: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameResult, setGameResult] = useState<{ score: number; points: number } | null>(null)

  useEffect(() => {
    if (token) {
      checkAllGames()
    } else {
      setLoading(false)
    }
  }, [token])

  async function checkAllGames() {
    if (!token) return
    setLoading(true)
    try {
      const checks = await Promise.all(
        GAME_TABS.map(async (tab) => {
          try {
            const can = await gameApi.canPlayGameType(token, tab.id)
            return { game: tab.id, can }
          } catch {
            return { game: tab.id, can: false }
          }
        })
      )
      const canPlayMap = checks.reduce((acc, { game, can }) => {
        acc[game] = can
        return acc
      }, {} as Record<GameType, boolean>)
      setCanPlay(canPlayMap)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể kiểm tra lượt chơi')
    } finally {
      setLoading(false)
    }
  }

  function handleGameEnd(score: number, points: number) {
    setGameResult({ score, points })
    // Refresh can play status
    if (token) {
      checkAllGames()
    }
  }

  function renderGame() {
    switch (selectedGame) {
      case 'QUIZ':
        return <QuizGame onGameEnd={handleGameEnd} />
      case 'MEMORY_CARD':
        return <MemoryCardGame onGameEnd={handleGameEnd} />
      case 'SPIN_WHEEL':
        return <SpinWheelGame onGameEnd={handleGameEnd} />
      case 'CLICK_RACE':
        return <ClickRaceGame onGameEnd={handleGameEnd} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600 mb-4" />
            <div className="text-sm font-medium text-gray-600">Đang tải...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Mini Game - Kiếm Xu</h1>
        <p className="text-gray-600 text-lg">Chơi game để nhận điểm thưởng và giảm giá khi mua vé!</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-sm font-semibold text-amber-700 border border-amber-200">
          <span>💰</span>
          <span>1 điểm = 10 VND giảm giá</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200/50 shadow-sm animate-slideIn">
          {error}
        </div>
      )}

      {gameResult && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 p-6 shadow-xl animate-scaleIn">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-700 mb-1">🎉 Chúc mừng!</div>
              <div className="text-lg text-gray-700">
                Bạn nhận được <span className="font-bold text-2xl text-emerald-600">{gameResult.points}</span> điểm
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Tương đương {gameApi.pointsToVnd(gameResult.points).toLocaleString('vi-VN')} VND giảm giá
              </div>
            </div>
            <button
              onClick={() => setGameResult(null)}
              className="rounded-full bg-white p-2 hover:bg-emerald-50 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Game Tabs */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {GAME_TABS.map((tab) => {
          const isSelected = selectedGame === tab.id
          const canPlayThis = canPlay[tab.id]
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedGame(tab.id)
                setGameResult(null)
              }}
              className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-br ${tab.color} text-white shadow-xl scale-105`
                  : 'bg-white text-gray-700 hover:shadow-lg hover:scale-102 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{tab.icon}</span>
                <div>
                  <div className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {tab.name}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                    {tab.description}
                  </div>
                </div>
              </div>
              {!canPlayThis && (
                <div className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-red-600'}`}>
                  ⏰ Đã hết lượt
                </div>
              )}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
            </button>
          )
        })}
      </div>

      {/* Game Content */}
      <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl ring-1 ring-slate-200/60 min-h-[500px]">
        {renderGame()}
      </div>
    </div>
  )
}
