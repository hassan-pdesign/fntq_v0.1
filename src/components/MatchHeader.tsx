import { motion } from 'framer-motion'
import styles from './MatchHeader.module.css'
import teamAcronyms from '../../data/team_acronyms.json'

// Define the type for the team acronyms object
type TeamAcronyms = {
  [key: string]: string;
}

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
  // Get team acronyms or use the full team name if acronym doesn't exist
  const acronyms = teamAcronyms as TeamAcronyms;
  const team1Acronym = acronyms[matchInfo.team1] || matchInfo.team1;
  const team2Acronym = acronyms[matchInfo.team2] || matchInfo.team2;
  
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
          <span className={styles.team1}>{team1Acronym}</span>
          <span className={styles.vs}>v</span>
          <span className={styles.team2}>{team2Acronym}</span>
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