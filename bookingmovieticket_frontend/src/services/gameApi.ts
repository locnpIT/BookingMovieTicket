import { apiFetch, type ApiResponse } from './api'

export type GameType = 'MEMORY_CARD' | 'QUIZ' | 'SPIN_WHEEL' | 'CLICK_RACE'

export type QuizQuestion = {
  question: string
  options: string[]
  correctAnswer: number
}

export type GameResult = {
  sessionId: number
  score: number
  pointsEarned: number
  totalPoints: number
  message: string
}

export type SubmitGameRequest = {
  gameType: GameType
  score: number
  gameData?: string
}

export const gameApi = {
  async getPoints(token: string): Promise<number> {
    const res = await apiFetch<ApiResponse<number>>('/api/games/points', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  async canPlayGame(token: string): Promise<boolean> {
    const res = await apiFetch<ApiResponse<boolean>>('/api/games/can-play', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  async canPlayGameType(token: string, gameType: GameType): Promise<boolean> {
    const res = await apiFetch<ApiResponse<boolean>>(`/api/games/can-play/${gameType}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  async getQuizQuestions(token: string): Promise<QuizQuestion[]> {
    const res = await apiFetch<ApiResponse<QuizQuestion[]>>('/api/games/quiz/questions', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  async submitGame(token: string, request: SubmitGameRequest): Promise<GameResult> {
    const res = await apiFetch<ApiResponse<GameResult>>('/api/games/submit', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(request)
    })
    return res.data
  },

  async getGameHistory(token: string) {
    const res = await apiFetch<ApiResponse<any[]>>('/api/games/history', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  pointsToVnd(points: number): number {
    return points * 10 // 1 point = 10 VND
  },

  vndToPoints(vnd: number): number {
    return Math.ceil(vnd / 10)
  }
}

