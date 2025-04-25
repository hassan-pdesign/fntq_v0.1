import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './OverallLeaderboardCards.module.css'
import { OverallLeaderboardCard } from './OverallLeaderboardCard'
import { OverallLeaderboardEntry } from '../../../types/leaderboard'

interface OverallLeaderboardCardsProps {
  entries: OverallLeaderboardEntry[]
  loading: boolean
  matchNumber?: number
}

export function OverallLeaderboardCards({ entries, loading }: OverallLeaderboardCardsProps) {
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
    <div className={styles.container}>
      
      <motion.div 
        className={styles.cardsGrid}
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
            <OverallLeaderboardCard entry={entry} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 