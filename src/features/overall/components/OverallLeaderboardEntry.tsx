import { motion } from 'framer-motion'
import { useState } from 'react'
import type { OverallLeaderboardEntry as OverallLeaderboardEntryType } from '../../../types/leaderboard'
import styles from '../../leaderboard/pages/OverallLeaderboardPage.module.css'

interface OverallLeaderboardEntryProps {
  entry: OverallLeaderboardEntryType;
  index: number;
}

const getRankChangeClass = (rankChange: string) => {
  if (rankChange.startsWith('↑')) return styles['rank-improved']
  if (rankChange.startsWith('↓')) return styles['rank-declined']
  return styles['rank-no-change']
}

export function OverallLeaderboardEntry({ entry, index }: OverallLeaderboardEntryProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const rankChangeClass = getRankChangeClass(entry.overallRankChange)
  
  return (
    <motion.div 
      className={`${styles['leaderboard-entry']} ${entry.overallRank <= 3 ? styles['top-rank'] : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={styles['entry-main']}>
        <div className={styles['entry-rank']}>
          <span className={styles['rank-number']}>{entry.overallRank}</span>
          {entry.overallRankChange !== '-' && (
            <span className={`${styles['rank-change']} ${rankChangeClass}`}>
              {entry.overallRankChange}
            </span>
          )}
        </div>
        
        <div className={styles['entry-name']}>{entry.name}</div>
      </div>
      
      <div className={styles['entry-stats']}>
        <div className={styles['stat']}>
          <span className={styles['stat-value']}>{entry.cumulativePoints}</span>
          <span className={styles['stat-label']}>PTS</span>
        </div>
        
        <div className={styles['stat']}>
          <span className={styles['stat-value']}>{entry.wins}</span>
          <span className={styles['stat-label']}>WINS</span>
        </div>
        
        <div className={styles['stat']}>
          <span className={styles['stat-value']}>{entry.podiums}</span>
          <span className={styles['stat-label']}>PODIUMS</span>
        </div>
        
        <div className={styles['stat']}>
          <span className={styles['stat-value']}>{entry.matchesPlayed}</span>
          <span className={styles['stat-label']}>PLAYED</span>
        </div>
        
        <div className={styles['stat']}>
          <span className={styles['stat-value']}>{entry.average.toFixed(1)}</span>
          <span className={styles['stat-label']}>AVG</span>
        </div>
      </div>
    </motion.div>
  )
} 