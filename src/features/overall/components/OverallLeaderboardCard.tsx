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
        
        {/* Row 1: Points & Rank Change */}
        <div className={styles.statsRow}>
          <div className={styles.statsColumn}>
            <div className={styles.matchesLabel}>Points</div>
            <div className={styles.matchesValue}>{entry.totalScore}</div>
          </div>
          
          {entry.previousRank && (
            <div className={styles.statsColumn}>
              <div className={styles.rankChangeLabel}>Rank Change</div>
              <div className={styles.rankChangeDetails}>
                {getRankChangeElement()}
              </div>
            </div>
          )}
        </div>
        
        {/* Row 2: Matches & Average */}
        <div className={styles.statsRow}>
          <div className={styles.statsColumn}>
            <div className={styles.matchesLabel}>Matches</div>
            <div className={styles.matchesValue}>{entry.matchesPlayed}</div>
          </div>
          
          {entry.average !== undefined && (
            <div className={styles.statsColumn}>
              <div className={styles.matchesLabel}>Average</div>
              <div className={styles.matchesValue}>{entry.average}</div>
            </div>
          )}
        </div>
        
        {/* Row 3: Wins & Podiums */}
        {(entry.wins !== undefined || entry.podiums !== undefined) && (
          <div className={styles.statsRow}>
            {entry.wins !== undefined && (
              <div className={styles.statsColumn}>
                <div className={styles.matchesLabel}>Wins</div>
                <div className={styles.matchesValue}>{entry.wins}</div>
              </div>
            )}
            
            {entry.podiums !== undefined && (
              <div className={styles.statsColumn}>
                <div className={styles.matchesLabel}>Podiums</div>
                <div className={styles.matchesValue}>{entry.podiums}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
} 