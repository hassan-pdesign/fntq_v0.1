import { useState, useEffect } from 'react'
import styles from './OverallLeaderboardTable.module.css'
import { OverallLeaderboardRow } from './OverallLeaderboardRow'
import { OverallLeaderboardEntry } from '../../../types/leaderboard'

interface OverallLeaderboardTableProps {
  entries: OverallLeaderboardEntry[]
  loading: boolean
  matchNumber?: number
}

export function OverallLeaderboardTable({ entries, loading, matchNumber }: OverallLeaderboardTableProps) {
  const [sortedEntries, setSortedEntries] = useState<OverallLeaderboardEntry[]>([])
  
  useEffect(() => {
    // Sort entries by rank
    const sorted = [...entries].sort((a, b) => a.rank - b.rank)
    setSortedEntries(sorted)
  }, [entries])
  
  if (loading) {
    return (
      <div className={styles.loading}>
        Loading overall leaderboard...
      </div>
    )
  }
  
  if (sortedEntries.length === 0) {
    return (
      <div className={styles.emptyState}>
        No overall leaderboard entries available
      </div>
    )
  }
  
  return (
    <div className={styles.tableContainer}>
      <div className={styles.headerInfo}>
        {matchNumber ? (
          <div className={styles.matchInfo}>
            Standings after Match #{matchNumber}
          </div>
        ) : (
          <div className={styles.matchInfo}>
            Latest Standings
          </div>
        )}
      </div>
      
      <div className={styles.header}>
        <div className={styles.rankHeader}>Rank</div>
        <div className={styles.userHeader}>User</div>
        <div className={styles.scoreHeader}>Total Score</div>
        <div className={styles.matchesHeader}>Matches</div>
        <div className={styles.changeHeader}>Change</div>
      </div>
      
      <div className={styles.entriesContainer}>
        {sortedEntries.map((entry) => (
          <OverallLeaderboardRow 
            key={entry.username} 
            entry={entry} 
          />
        ))}
      </div>
    </div>
  )
} 