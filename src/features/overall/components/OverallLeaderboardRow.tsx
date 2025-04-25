import styles from './OverallLeaderboardRow.module.css'
import { OverallLeaderboardEntry } from '../../../types/leaderboard'

interface OverallLeaderboardRowProps {
  entry: OverallLeaderboardEntry
}

export function OverallLeaderboardRow({ entry }: OverallLeaderboardRowProps) {
  const getRankChangeElement = () => {
    if (!entry.previousRank) return null
    
    const change = entry.previousRank - entry.rank
    
    if (change === 0) {
      return <span className={styles.noChange}>-</span>
    } else if (change > 0) {
      return <span className={styles.rankUp}>↑{change}</span>
    } else {
      return <span className={styles.rankDown}>↓{Math.abs(change)}</span>
    }
  }
  
  return (
    <div className={styles.row}>
      <div className={styles.rank}>{entry.rank}</div>
      <div className={styles.username}>{entry.username}</div>
      <div className={styles.score}>{entry.totalScore}</div>
      <div className={styles.matches}>{entry.matchesPlayed}</div>
      <div className={styles.change}>{getRankChangeElement()}</div>
    </div>
  )
} 