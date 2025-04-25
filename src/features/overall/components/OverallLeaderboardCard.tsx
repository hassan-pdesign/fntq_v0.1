import { motion } from 'framer-motion'
import styles from './OverallLeaderboardCard.module.css'
import { OverallLeaderboardEntry } from '../../../types/leaderboard'

interface OverallLeaderboardCardProps {
  entry: OverallLeaderboardEntry
}

export function OverallLeaderboardCard({ entry }: OverallLeaderboardCardProps) {
  const getRankChangeElement = () => {
    if (!entry.previousRank) return null
    
    const change = entry.previousRank - entry.rank
    
    if (change === 0) {
      return <span className={styles.neutral}>↔</span>
    } else if (change > 0) {
      return <span className={styles.improved}>↑{change}</span>
    } else {
      return <span className={styles.dropped}>↓{Math.abs(change)}</span>
    }
  }
  
  return (
    <motion.div 
      className={styles.card}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.rankBadge}>{entry.rank}</div>
      
      <div className={styles.cardContent}>
        <div className={styles.username}>{entry.username}</div>
        
        <div className={styles.scoreSection}>
          <div className={styles.scoreLabel}>Total Score</div>
          <div className={styles.scoreValue}>{entry.totalScore}</div>
        </div>
        
        <div className={styles.matchesSection}>
          <div className={styles.matchesLabel}>Matches Played</div>
          <div className={styles.matchesValue}>{entry.matchesPlayed}</div>
        </div>
        
        {entry.previousRank && (
          <div className={styles.rankChangeSection}>
            <div className={styles.rankChangeLabel}>Rank Change</div>
            <div className={styles.rankChangeDetails}>
              {getRankChangeElement()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 