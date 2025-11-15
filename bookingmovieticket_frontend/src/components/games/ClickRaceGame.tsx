import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { gameApi, type GameType } from '../../services/gameApi'
import Button from '../ui/Button'

export default function ClickRaceGame({ onGameEnd }: { onGameEnd: (score: number, points: number) => void }) {
  const { token } = useAuth()
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (timeLeft === 0 && gameStarted && !gameOver) {
      finishGame()
    }
  }, [timeLeft, gameStarted, gameOver])

  function startGame() {
    setClicks(0)
    setTimeLeft(10)
    setGameStarted(true)
    setGameOver(false)
  }

  function handleClick() {
    if (!gameStarted || gameOver) return
    setClicks(prev => prev + 1)
  }

  async function finishGame() {
    setGameOver(true)
    setGameStarted(false)
    setLoading(true)
    try {
      const result = await gameApi.submitGame(token!, {
        gameType: 'CLICK_RACE',
        score: clicks,
        gameData: JSON.stringify({ timeLeft: 0 })
      })
      onGameEnd(clicks, result.pointsEarned)
    } catch (e) {
      console.error('Failed to submit game result', e)
    } finally {
      setLoading(false)
    }
  }

  if (!gameStarted) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8 text-center border border-blue-200">
        <div className="mb-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-4xl mb-4 shadow-lg">
            ⚡
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trò chơi Click Nhanh</h2>
          <p className="text-gray-600 mb-4">
            Click càng nhanh càng tốt trong 10 giây! Mỗi click = điểm của bạn.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <span>💡</span>
            <span>Click nhiều nhất có thể!</span>
          </div>
        </div>
        <Button onClick={startGame} className="px-8 py-3 text-base">
          Bắt đầu chơi
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
        <div className="text-sm font-medium text-gray-600">
          Thời gian: <span className={`font-bold text-lg ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="text-sm font-medium text-gray-600">
          Số click: <span className="font-bold text-lg text-emerald-600">{clicks}</span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={handleClick}
          disabled={gameOver}
          className={`w-full h-64 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white text-6xl font-bold shadow-2xl transition-all duration-150 ${
            gameOver
              ? 'cursor-not-allowed opacity-50'
              : 'hover:scale-105 active:scale-95 cursor-pointer hover:shadow-3xl'
          }`}
        >
          {gameOver ? '⏱️ Hết giờ!' : 'CLICK ME!'}
        </button>
        {!gameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white/20 text-9xl font-black">{clicks}</div>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 text-center">
          <div className="text-lg font-bold text-emerald-700 mb-2">🎉 Hoàn thành!</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            Bạn đã click <span className="text-emerald-600">{clicks}</span> lần!
          </div>
          <div className="text-sm text-gray-600">
            Điểm của bạn: {clicks} điểm
          </div>
        </div>
      )}
    </div>
  )
}

