import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LeaderboardCard } from './LeaderboardCard'
import styles from './LeaderboardCardList.module.css'

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

interface LeaderboardCardListProps {
  entries: LeaderboardDataEntry[]
  matchNumber: string
  loading: boolean
}

export function LeaderboardCardList({ 
  entries, 
  matchNumber, 
  loading
}: LeaderboardCardListProps) {
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
    <motion.div 
      className={styles.cardsContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {sortedEntries.map((entry, index) => (
        <motion.div
          key={entry.username}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <LeaderboardCard entry={entry} />
        </motion.div>
      ))}
    </motion.div>
  )
} 