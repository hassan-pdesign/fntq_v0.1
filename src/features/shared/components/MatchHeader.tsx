import styles from './MatchHeader.module.css'

interface MatchHeaderProps {
  matchNumber: string
  team1: string
  team2: string
  result?: string
  venue?: string
  date?: string
  time?: string
  onPreviousMatch?: () => void
  onNextMatch?: () => void
  hasPreviousMatch?: boolean
  hasNextMatch?: boolean
}

export function MatchHeader({ 
  matchNumber, 
  team1, 
  team2, 
  result,
  venue,
  date, 
  time,
  onPreviousMatch,
  onNextMatch,
  hasPreviousMatch = true,
  hasNextMatch = true
}: MatchHeaderProps) {
  // Function to format result with bracketed content on new line
  const formatResult = (result: string) => {
    const bracketMatch = result.match(/^(.*?)(\(.*?\))(.*)$/);
    if (bracketMatch) {
      return (
        <>
          {bracketMatch[1]}
          <br />
          {bracketMatch[2]}{bracketMatch[3]}
        </>
      );
    }
    return result;
  };

  return (
    <header className={styles.header}>
      <div className={styles.matchInfo}>
        <div className={styles.matchNumber}>#{matchNumber}</div>
        
        <div className={styles.teamsContainer}>
          <button 
            className={`${styles.navButton} ${!hasPreviousMatch ? styles.disabled : ''}`} 
            onClick={onPreviousMatch}
            disabled={!hasPreviousMatch}
            aria-label="Previous match"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className={styles.teams}>
            <span className={styles.team}>{team1}</span>
            <span className={styles.vs}>v</span>
            <span className={styles.team}>{team2}</span>
          </div>
          
          <button 
            className={`${styles.navButton} ${!hasNextMatch ? styles.disabled : ''}`} 
            onClick={onNextMatch}
            disabled={!hasNextMatch}
            aria-label="Next match"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {result && <div className={styles.result}>{formatResult(result)}</div>}
        
        {venue && <div className={styles.venue}>{venue}</div>}
        
        {(date || time) && (
          <div className={styles.dateTime}>
            {date && <span className={styles.date}>{date}</span>}
            {date && time && <span className={styles.separator}>•</span>}
            {time && <span className={styles.time}>{time}</span>}
          </div>
        )}
      </div>
    </header>
  )
} 