import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './FixturesPage.module.css'

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

export function FixturesPage() {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED'>('COMPLETED')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Initialize scroll position from localStorage
  const SCROLL_POSITION_KEY = 'fixturesScrollPosition'
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false)

  useEffect(() => {
    fetchMatches()
  }, [activeTab])

  // Save scroll position when the component unmounts
  useEffect(() => {
    // Add scroll event listener to save position
    const handleScroll = () => {
      if (!loading) {
        localStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString())
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loading])
  
  // Restore scroll position after content loads
  useEffect(() => {
    if (!loading && !hasRestoredScroll) {
      const savedScrollPosition = localStorage.getItem(SCROLL_POSITION_KEY)
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition)
        window.scrollTo(0, scrollY)
        setHasRestoredScroll(true)
      }
    }
  }, [loading, hasRestoredScroll])

  // Clear scroll position when changing tabs
  useEffect(() => {
    localStorage.removeItem(SCROLL_POSITION_KEY)
    setHasRestoredScroll(false)
  }, [activeTab])

  async function fetchMatches() {
    try {
      setLoading(true)
      const response = await fetch('/matches.json')
      if (!response.ok) {
        throw new Error('Failed to fetch matches')
      }
      
      const data: Match[] = await response.json()
      
      if (!data) {
        console.warn('No data returned from matches.json')
        setMatches([])
        return
      }
      
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison
      
      const filteredData = data.filter(match => {
        const matchDate = new Date(match.date)
        const isMatchInPast = matchDate < today
        const hasValidResult = match.result && match.result !== "N/A"
        
        if (activeTab === 'COMPLETED') {
          // Show in completed tab if (date has passed OR has result) AND result is not "N/A"
          return (isMatchInPast || hasValidResult) && (!match.result || match.result !== "N/A")
        } else {
          // Show in upcoming tab if date hasn't passed or result is "N/A"
          return !isMatchInPast || (match.result === "N/A")
        }
      })
      
      // Sort matches by date
      const sortedData = [...filteredData].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // For COMPLETED tab, sort by most recent first (descending)
        // For UPCOMING tab, sort by earliest first (ascending)
        return activeTab === 'COMPLETED' 
          ? dateB.getTime() - dateA.getTime() 
          : dateA.getTime() - dateB.getTime();
      });
        
      setMatches(sortedData)
    } catch (error) {
      console.error('Error fetching matches:', error)
      // Show error state to user
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  // Group matches by date
  const matchesByDate = matches.reduce((groups, match) => {
    const date = new Date(match.date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let dateLabel: string
    if (activeTab === 'COMPLETED') {
      if (date.toDateString() === today.toDateString()) {
        dateLabel = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = 'Yesterday'
      } else {
        dateLabel = date.toLocaleDateString('en-US', { 
          day: 'numeric',
          month: 'long'
        })
      }
    } else {
      if (date.toDateString() === today.toDateString()) {
        dateLabel = 'Today'
      } else if (date.toDateString() === tomorrow.toDateString()) {
        dateLabel = 'Tomorrow'
      } else {
        dateLabel = date.toLocaleDateString('en-US', { 
          day: 'numeric',
          month: 'long'
        })
      }
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = []
    }
    groups[dateLabel].push(match)
    return groups
  }, {} as Record<string, Match[]>)

  const handleMatchClick = (match: Match) => {
    // Only handle clicks for completed matches
    if (activeTab === 'COMPLETED' && match.result && match.result !== "N/A") {
      // Normalize match_number to ensure consistent format
      // This handles single-digit match numbers (1-9)
      const normalizedMatch = {
        ...match,
        match_number: match.match_number.padStart(2, '0')
      };
      
      // Save the current scroll position before navigating
      localStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString())
      
      navigate('/leaderboard', { state: { selectedMatch: normalizedMatch } });
    }
  };

  return (
    <div className={styles['fixtures-container']}>
      <div className="tabs" style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        backgroundColor: 'var(--bg-color, #1e1e1e)',
        paddingTop: '40px',
        paddingBottom: '40px'
      }}>
        <button 
          className={`tab ${activeTab === 'COMPLETED' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('COMPLETED')}
          style={{ fontSize: '3rem' }}
        >
          COMPLETED
        </button>
        <button 
          className={`tab ${activeTab === 'UPCOMING' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('UPCOMING')}
          style={{ fontSize: '3rem' }}
        >
          UPCOMING
        </button>
      </div>
      
      {loading ? (
        <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>
          Loading fixtures...
        </div>
      ) : matches.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          No fixtures found for this section
        </div>
      ) : (
        <>
          {Object.entries(matchesByDate).map(([date, dateMatches]) => (
            <div key={date} className="date-section">
              <h2>{date}</h2>
              {dateMatches.map(match => (
                <div 
                  key={match.match_number} 
                  className="match"
                  onClick={activeTab === 'COMPLETED' ? () => handleMatchClick(match) : undefined}
                  style={{ cursor: activeTab === 'COMPLETED' ? 'pointer' : 'default' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <div className="match-number" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      #{match.match_number}
                    </div>
                    <div className="time">{formatTime(match.time_ist)}</div>
                  </div>
                  <div className="teams">
                    <span className="team">{match.team1}</span>
                    <span className="vs">v</span>
                    <span className="team">{match.team2}</span>
                  </div>
                  <div className="venue">{match.venue}</div>
                  {match.result && match.result !== "N/A" && <div className="result">{match.result}</div>}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// Helper function to format time
function formatTime(timeString: string) {
  // Convert time from string like "19:30" to a formatted time like "7:30 PM"
  const [hours, minutes] = timeString.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  
  return `${formattedHours}:${formattedMinutes} ${period}`
} 