import styles from './MatchCard.module.css'

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

interface MatchCardProps {
  match: Match
  isCompleted: boolean
  onClick?: (match: Match) => void
}

export function MatchCard({ match, isCompleted, onClick }: MatchCardProps) {
  const handleClick = () => {
    if (isCompleted && match.result && match.result !== "N/A" && onClick) {
      onClick(match)
    }
  }

  return (
    <div 
      className={styles.matchCard}
      onClick={handleClick}
      style={{ cursor: isCompleted && match.result && match.result !== "N/A" ? 'pointer' : 'default' }}
    >
      <div className={styles.matchHeader}>
        <div className={styles.matchNumber}>
          #{match.match_number}
        </div>
        <div className={styles.matchTime}>{formatTime(match.time_ist)}</div>
      </div>
      <div className={styles.teamsContainer}>
        <span className={styles.team}>{match.team1}</span>
        <span className={styles.vs}>v</span>
        <span className={styles.team}>{match.team2}</span>
      </div>
      <div className={styles.venue}>{match.venue}</div>
      {match.result && match.result !== "N/A" && (
        <div className={styles.result}>{match.result}</div>
      )}
    </div>
  )
}

// Helper function to format time
function formatTime(timeString: string) {
  try {
    // Handle time string like "19:30"
    const [hours, minutes] = timeString.split(':').map(Number)
    
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString // Return as is if parsing fails
    }
    
    const isPM = hours >= 12
    const displayHours = hours % 12 || 12 // Convert 0 to 12 for 12-hour format
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`
  } catch (error) {
    return timeString // Return original string if any error occurs
  }
} 