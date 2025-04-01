import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import { supabase } from './lib/supabase'
import { Match } from './types/match'
import { BottomBar } from './components/BottomBar'
import { MatchPage } from './pages/MatchPage'
import { LeaderboardPage } from './pages/LeaderboardPage'

function MatchList() {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMatches()
  }, [activeTab])

  async function fetchMatches() {
    try {
      setLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison
      
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: activeTab === 'UPCOMING' })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      if (!data) {
        console.warn('No data returned from Supabase')
        setMatches([])
        return
      }
      
      const filteredData = data.filter(match => {
        const matchDate = new Date(match.match_date)
        const isMatchInPast = matchDate < today
        
        if (activeTab === 'COMPLETED') {
          // Show in completed tab if either marked as completed OR date has passed
          return match.is_completed || isMatchInPast
        } else {
          // Show in upcoming tab if NOT completed AND date hasn't passed
          return !match.is_completed && !isMatchInPast
        }
      })
        
      setMatches(filteredData)
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
    const date = new Date(match.match_date)
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

  return (
    <div className="app">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'UPCOMING' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('UPCOMING')}
        >
          UPCOMING
        </button>
        <button 
          className={`tab ${activeTab === 'COMPLETED' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          COMPLETED
        </button>
      </div>
      
      {loading ? (
        <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>
          Loading matches...
        </div>
      ) : matches.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          No matches found for this section
        </div>
      ) : (
        Object.entries(matchesByDate).map(([date, dateMatches]) => (
          <div key={date} className="date-section">
            <h2>{date}</h2>
            {dateMatches.map(match => (
              <div 
                key={match.id} 
                className="match"
                onClick={() => navigate(`/match/${match.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="time">{formatTime(match.match_date)}</div>
                <div className="teams">
                  <span className="team">{match.team_1}</span>
                  <span className="vs">v</span>
                  <span className="team">{match.team_2}</span>
                </div>
                <div className="venue">{match.venue}</div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>
          <MatchList />
          <BottomBar />
        </>} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/leaderboard" element={<>
          <LeaderboardPage />
          {/* <BottomBar /> */}
        </>} />
      </Routes>
    </BrowserRouter>
  )
}

// Helper function to format time
function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true 
  })
}

export default App
