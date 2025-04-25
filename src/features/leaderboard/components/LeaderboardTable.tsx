import { useState, useEffect } from 'react'
import styles from './LeaderboardTable.module.css'
import { LeaderboardEntry } from './LeaderboardEntry'

interface LeaderboardDataEntry {
  rank: number
  username: string
  score: number
  prediction: string
  actual?: string
  overall_rank?: number
  overall_points?: number
  overall_rank_change?: string
}

interface LeaderboardTableProps {
  entries: LeaderboardDataEntry[]
  matchNumber: string
  loading: boolean
}

export function LeaderboardTable({ 
  entries, 
  matchNumber, 
  loading
}: LeaderboardTableProps) {
  const [sortedEntries, setSortedEntries] = useState<LeaderboardDataEntry[]>([])
  
  useEffect(() => {
    // Sort entries by rank
    const sorted = [...entries].sort((a, b) => a.rank - b.rank)
    setSortedEntries(sorted)
  }, [entries])
  
  if (loading) {
    return (
      <div className={styles.loading}>
        Loading leaderboard...
      </div>
    )
  }
  
  if (sortedEntries.length === 0) {
    return (
      <div className={styles.emptyState}>
        No leaderboard entries available for match #{matchNumber}
      </div>
    )
  }
  
  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <div className={styles.rankHeader}>Rank</div>
        <div className={styles.userHeader}>User</div>
        <div className={styles.scoreHeader}>Score</div>
        <div className={styles.predictionHeader}>Team Selection</div>
        <div className={styles.overallHeader}>Overall</div>
      </div>
      
      <div className={styles.entriesContainer}>
        {sortedEntries.map((entry) => (
          <LeaderboardEntry 
            key={entry.username} 
            entry={entry} 
          />
        ))}
      </div>
    </div>
  )
} 