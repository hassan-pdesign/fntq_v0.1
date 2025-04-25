export interface LeaderboardDataEntry {
  rank: number
  username: string
  score: number
  prediction: string
  actual?: string
  overall_rank?: number
  overall_points?: number
  overall_rank_change?: string
}

export interface OverallLeaderboardEntry {
  rank: number
  username: string
  totalScore: number
  matchesPlayed: number
  previousRank?: number
}

export interface LeaderboardEntry {
  name: string
  rank: number
  points: number
  totalPoints: number
  overallRank: number
  players: {
    captain: string
    player1: string
    player2: string
  }
} 