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