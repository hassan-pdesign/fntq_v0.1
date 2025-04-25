import { motion } from 'framer-motion'
import styles from './LeaderboardCard.module.css'

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

interface LeaderboardCardProps {
  entry: LeaderboardDataEntry
}

export function LeaderboardCard({ entry }: LeaderboardCardProps) {
  // Function to determine the CSS class for rank change
  const getRankChangeClass = () => {
    if (!entry.overall_rank_change) return '';
    if (entry.overall_rank_change.startsWith('↑')) return styles.improved;
    if (entry.overall_rank_change.startsWith('↓')) return styles.dropped;
    return styles.neutral;
  };

  // Function to format rank change text
  const formatRankChange = () => {
    if (!entry.overall_rank_change) return '';
    if (entry.overall_rank_change.startsWith('↑') || entry.overall_rank_change.startsWith('↓')) {
      return entry.overall_rank_change;
    }
    return '↔';
  };

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.rankBadge}>{entry.rank}</div>
      
      <div className={styles.cardContent}>
        <div className={styles.username}>{entry.username}</div>
        
        <div className={styles.scoreSection}>
          <div className={styles.scoreLabel}>Score</div>
          <div className={styles.scoreValue}>{entry.score}</div>
        </div>
        
        <div className={styles.predictionSection}>
          <div className={styles.predictionLabel}>Team Selection</div>
          <div className={styles.predictionValue}>
            {entry.prediction.split(',').sort((a, b) => {
              // Show captain (marked with 'c') first
              return a.includes('(c)') ? -1 : b.includes('(c)') ? 1 : 0;
            }).map((player, index) => (
              <div key={index} className={styles.playerLine}>
                {player.trim()}
              </div>
            ))}
          </div>
          {entry.actual && (
            <div className={styles.actual}>Actual: {entry.actual}</div>
          )}
        </div>
        
        {entry.overall_rank && (
          <div className={styles.overallSection}>
            <div className={styles.overallLabel}>Overall</div>
            <div className={styles.overallDetails}>
              <span className={styles.overallRank}>#{entry.overall_rank}</span>
              {entry.overall_rank_change && (
                <span className={`${styles.rankChange} ${getRankChangeClass()}`}>
                  {formatRankChange()}
                </span>
              )}
              {entry.overall_points && (
                <span className={styles.overallPoints}>{entry.overall_points} pts</span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 