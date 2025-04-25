import { motion } from 'framer-motion'
import styles from './MatchHeader.module.css'

interface MatchHeaderProps {
  matchInfo: {
    matchNumber: number;
    team1: string;
    team2: string;
    venue: string;
    date: string;
    time: string;
    separator?: string;
  }
}

export function MatchHeader({ matchInfo }: MatchHeaderProps) {
  return (
    <motion.header 
      className={styles['match-header']}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles['header-left']}>
        <div className={styles['match-number']}>#{matchInfo.matchNumber}</div>
        <div className={styles['match-teams']}>
          <span className={styles.team1}>{matchInfo.team1}</span>
          <span className={styles.vs}>v</span>
          <span className={styles.team2}>{matchInfo.team2}</span>
        </div>
      </div>
      <div className={styles['match-location']}>
        <span className={styles.venue}>{matchInfo.venue}</span>
        <div className={styles['date-time']}>
          <span className={styles.date}>{matchInfo.date}</span>
          {matchInfo.separator && (
            <span style={{ opacity: 0.5, margin: '0 6px' }}>{matchInfo.separator}</span>
          )}
          <span className={styles.time}>{matchInfo.time}</span>
        </div>
      </div>
    </motion.header>
  )
} 