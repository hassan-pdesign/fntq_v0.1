import { motion } from 'framer-motion'
import type { LeaderboardEntry as LeaderboardEntryType } from '../types/leaderboard'
import styles from './LeaderboardEntry.module.css'

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType
  index: number
  rankChange: string
}

export function LeaderboardEntry({ entry, index, rankChange }: LeaderboardEntryProps) {
  const getRankChangeClass = () => {
    if (rankChange.startsWith('↑')) return styles['rank-up']
    if (rankChange.startsWith('↓')) return styles['rank-down']
    return styles['rank-same']
  }

  const displayRankChange = rankChange === '-' ? '↔' : rankChange

  return (
    <motion.div 
      className={styles['leaderboard-entry']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={styles['entry-details']}>
        <div className={styles['entry-details-left']}>
          <div className={styles['entry-rank']}>{entry.rank}</div>
          <div className={styles['entry-name']}>{entry.name}</div>
        </div>
        <div className={styles['entry-points']}>{entry.points}</div>
      </div>
      <div className={styles['entry-players']}>
        {entry.players.captain}©, {entry.players.player1}, {entry.players.player2}
      </div>
      <div className={styles['entry-stats']}>
        <div className={styles['entry-stats-1']}>
          <span className={styles['total-points']}>Total Points</span>
          <span className={styles['total-points-value']}>{entry.totalPoints}</span>
        </div>
        <div className={styles['entry-stats-2']}>
          <span className={styles['overall-rank']}>Overall Rank</span>
          <span className={styles['overall-rank-value']}>{entry.overallRank}</span>
        </div>
          <span className={`${styles['rank-change']} ${getRankChangeClass()}`}>
            {displayRankChange}
          </span>
      </div>
    </motion.div>
  )
} 