export interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  totalPoints: number
  overallRank: number
  players: {
    captain: string
    player1: string
    player2: string
  }
}

export interface OverallLeaderboardEntry {
  name: string
  matchesPlayed: number
  cumulativePoints: number
  average: number
  wins: number
  podiums: number
  overallRank: number
  overallRankChange: string
} 