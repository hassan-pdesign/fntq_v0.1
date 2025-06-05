export interface ParticipantProgressData {
  username: string
  name?: string
  progressData: MatchProgressPoint[]
}

export interface MatchProgressPoint {
  matchNumber: number
  cumulativePoints: number
  matchPoints: number
  matchLabel: string
}

export interface ChartData {
  matchNumber: number
  matchLabel: string
  [key: string]: number | string // Dynamic keys for each participant
}

export interface SelectedParticipant {
  username: string
  name?: string
  color: string
} 