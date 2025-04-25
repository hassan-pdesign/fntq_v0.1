import { MatchCard } from './MatchCard'
import styles from './DateSection.module.css'

interface Match {
  match_number: string
  team1: string
  team2: string
  venue: string
  date: string
  day: string
  time_ist: string
  cricinfo_url: string
  result?: string
}

interface DateSectionProps {
  dateLabel: string
  matches: Match[]
  isCompleted: boolean
  onMatchClick?: (match: Match) => void
}

export function DateSection({ dateLabel, matches, isCompleted, onMatchClick }: DateSectionProps) {
  return (
    <div className={styles.dateSection}>
      <h2 className={styles.dateLabel}>{dateLabel}</h2>
      <div className={styles.matchesContainer}>
        {matches.map((match) => (
          <MatchCard
            key={match.match_number}
            match={match}
            isCompleted={isCompleted}
            onClick={onMatchClick}
          />
        ))}
      </div>
    </div>
  )
} 