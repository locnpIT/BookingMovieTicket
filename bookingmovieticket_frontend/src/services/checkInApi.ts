import { apiFetch, type ApiResponse } from './api'

export type CheckInResult = {
  checkInId: number
  basePoints: number
  bonusPoints: number
  totalPoints: number
  consecutiveDays: number
  isMilestone: boolean
}

export type CheckInDay = {
  date: string
  pointsEarned: number
  bonusPoints: number
  totalPoints: number
}

export type CheckInStatus = {
  hasCheckedInToday: boolean
  consecutiveDays: number
  totalCheckIns: number
  nextMilestone: number
  daysUntilNextMilestone: number
  checkIns: CheckInDay[]
}

export const checkInApi = {
  async checkIn(token: string): Promise<CheckInResult> {
    const res = await apiFetch<ApiResponse<CheckInResult>>('/api/check-in', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  async getStatus(token: string): Promise<CheckInStatus> {
    const res = await apiFetch<ApiResponse<CheckInStatus>>('/api/check-in/status', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

