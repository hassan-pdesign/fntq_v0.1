import { motion } from 'framer-motion'
import type { LeaderboardEntry as LeaderboardEntryType } from '../../../types/leaderboard'
import styles from './LeaderboardEntry.module.css'

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

interface LeaderboardEntryProps {
  entry: LeaderboardDataEntry
}

export function LeaderboardEntry({ entry }: LeaderboardEntryProps) {
  // Function to determine the CSS class for rank change
  const getRankChangeClass = () => {
    if (!entry.overall_rank_change) return '';
    if (entry.overall_rank_change.startsWith('↑')) return styles.improved;
    if (entry.overall_rank_change.startsWith('↓')) return styles.dropped;
    return '';
  };

  return (
    <div className={styles.entryRow}>
      <div className={styles.rank}>{entry.rank}</div>
      <div className={styles.username}>{entry.username}</div>
      <div className={styles.score}>{entry.score}</div>
      <div className={styles.prediction}>
        {entry.prediction}
        {entry.actual && (
          <span className={styles.actual}>Actual: {entry.actual}</span>
        )}
      </div>
      {entry.overall_rank && (
        <div className={styles.overall}>
          <span className={styles.overallRank}>{entry.overall_rank}</span>
          {entry.overall_rank_change && (
            <span className={`${styles.rankChange} ${getRankChangeClass()}`}>
              {entry.overall_rank_change}
            </span>
          )}
          {entry.overall_points && (
            <span className={styles.overallPoints}>{entry.overall_points} pts</span>
          )}
        </div>
      )}
    </div>
  )
} 