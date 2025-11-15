import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { gameApi, type QuizQuestion } from '../../services/gameApi'
import Button from '../ui/Button'

export default function QuizGame({ onGameEnd }: { onGameEnd: (score: number, points: number) => void }) {
  const { token } = useAuth()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)

  async function startGame() {
    if (!token) return
    try {
      setLoading(true)
      const quizQuestions = await gameApi.getQuizQuestions(token)
      setQuestions(quizQuestions)
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setScore(0)
      setPlaying(true)
      setGameOver(false)
    } catch (e) {
      console.error('Failed to load questions', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAnswerSelect(answerIndex: number) {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    const question = questions[currentQuestion]
    
    if (answerIndex === question.correctAnswer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        finishGame(answerIndex === question.correctAnswer ? score + 1 : score)
      }
    }, 1500)
  }

  async function finishGame(finalScore: number) {
    if (!token) return
    try {
      setLoading(true)
      const result = await gameApi.submitGame(token, {
        gameType: 'QUIZ',
        score: finalScore,
        gameData: JSON.stringify({ totalQuestions: questions.length })
      })
      setPointsEarned(result.pointsEarned)
      setGameOver(true)
      setPlaying(false)
    } catch (e) {
      console.error('Failed to submit game result', e)
    } finally {
      setLoading(false)
    }
  }

  if (!playing && !gameOver) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 p-8 text-center border border-sky-200">
        <div className="mb-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-4xl mb-4 shadow-lg">
            🎯
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trò chơi Đố Vui về Phim</h2>
          <p className="text-gray-600 mb-4">
            Trả lời đúng càng nhiều câu hỏi, bạn càng nhận được nhiều điểm!
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            <span>💡</span>
            <span>20-100 điểm (10 điểm/câu đúng)</span>
          </div>
        </div>
        <Button onClick={startGame} disabled={loading} className="px-8 py-3 text-base">
          {loading ? 'Đang tải...' : 'Bắt đầu chơi'}
        </Button>
      </div>
    )
  }

  if (playing && questions.length > 0) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200/60">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-600">
            Câu {currentQuestion + 1} / {questions.length}
          </div>
          <div className="text-sm font-bold text-sky-600">
            Điểm: {score} / {questions.length}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {questions[currentQuestion].question}
          </h2>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => {
              const isSelected = selectedAnswer === idx
              const isCorrect = idx === questions[currentQuestion].correctAnswer
              const showResult = selectedAnswer !== null
              
              let bgClass = 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50'
              if (showResult) {
                if (isCorrect) {
                  bgClass = 'bg-emerald-50 border-emerald-500'
                } else if (isSelected && !isCorrect) {
                  bgClass = 'bg-red-50 border-red-500'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full rounded-xl border-2 p-4 text-left font-medium transition-all ${bgClass} ${
                    selectedAnswer === null ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && (
                      <span className="text-emerald-600 font-bold">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="text-red-600 font-bold">✗</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 p-8 shadow-xl ring-1 ring-slate-200/60 text-center">
        <div className="mb-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-4xl mb-4 shadow-lg animate-bounce">
            🎉
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
          <p className="text-lg text-gray-600 mb-4">
            Bạn đã trả lời đúng <span className="font-bold text-sky-600">{score}</span> / {questions.length} câu hỏi
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-bold text-sky-700 shadow-md">
            <span>💰</span>
            <span>Bạn nhận được {pointsEarned} điểm!</span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Tương đương {gameApi.pointsToVnd(pointsEarned).toLocaleString('vi-VN')} VND giảm giá
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={startGame} disabled={loading}>
            Chơi lại
          </Button>
        </div>
      </div>
    )
  }

  return null
}

