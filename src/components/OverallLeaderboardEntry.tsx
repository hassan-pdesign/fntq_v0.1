import { motion } from 'framer-motion'
import type { OverallLeaderboardEntry as OverallLeaderboardEntryType } from '../types/leaderboard'
import styles from './LeaderboardEntry.module.css'

interface OverallLeaderboardEntryProps {
  entry: OverallLeaderboardEntryType
  index: number
}

export function OverallLeaderboardEntry({ entry, index }: OverallLeaderboardEntryProps) {
  const getRankChangeClass = () => {
    if (!entry.overallRankChange) return styles['rank-same']
    if (entry.overallRankChange.startsWith('↑')) return styles['rank-up']
    if (entry.overallRankChange.startsWith('↓')) return styles['rank-down']
    return styles['rank-same']
  }

  const displayRankChange = !entry.overallRankChange || entry.overallRankChange === '-' ? '↔' : entry.overallRankChange

  return (
    <motion.div 
      className={styles['leaderboard-entry']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={styles['entry-details']}>
        <div className={styles['entry-details-left']}>
          <div className={styles['entry-rank']}>{entry.overallRank}</div>
          <div className={styles['entry-name']}>
            {entry.name}
          </div>
          
              <span 
                className={`${styles['rank-change']} ${getRankChangeClass()}`}
                style={{marginLeft: '16px', fontFamily: 'Inter', fontSize: '16px', padding: '12px', lineHeight: '16px'}}
              >
                {displayRankChange}
              </span>
            
        </div>
        <div className={styles['entry-points']}>{entry.cumulativePoints}</div>
      </div>
      <div className={styles['entry-stats']}>
        <div className={styles['entry-stats-1']}>
          <span className={styles['total-points']}>Wins</span>
          <span className={styles['total-points-value']}>{entry.wins}</span>
        </div>
        <div className={styles['entry-stats-2']}>
          <span className={styles['overall-rank']}>Podiums</span>
          <span className={styles['overall-rank-value']}>{entry.podiums}</span>
        </div>
      </div>
      <div className={styles['entry-stats']}>
        <div className={styles['entry-stats-1']}>
          <span className={styles['total-points']}>Matches</span>
          <span className={styles['total-points-value']}>{entry.matchesPlayed}</span>
        </div>
        <div className={styles['entry-stats-2']}>
          <span className={styles['overall-rank']}>Average</span>
          <span className={styles['overall-rank-value']}>{entry.average}</span>
        </div>
      </div>
    </motion.div>
  )
} 