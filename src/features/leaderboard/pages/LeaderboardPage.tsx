import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MatchHeader } from '../../shared/components/MatchHeader'
import styles from './LeaderboardPage.module.css'
import { Match } from '../../../types/match'
import { useLeaderboardData } from '../hooks/useLeaderboardData'
import { LeaderboardCardList } from '../components/LeaderboardCardList'
import { LoadingState } from '../../shared/components/LoadingState'
import { EmptyState } from '../../shared/components/EmptyState'

// Helper function to format date as "Mon, April 21"
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  
  return `${dayOfWeek}, ${month} ${day}`;
}

// Helper function to format match number for playoffs
function formatMatchNumber(matchNumber: string): string {
  switch (matchNumber) {
    case "71":
      return "Qualifier 1";
    case "72":
      return "Eliminator";
    case "73":
      return "Qualifier 2";
    case "74":
      return "Final";
    default:
      return matchNumber;
  }
}

// Helper function to format time from "07:30 PM" to "7:30 PM"
function formatTime(timeString: string): string {
  // Check if the time is already in the correct format
  if (!timeString || timeString === 'TBA') return timeString;
  
  // Handle 12-hour time format (e.g., "07:30 PM")
  const timeMatch = timeString.match(/^(\d{1,2}):(\d{1,2})\s*(AM|PM)$/i);
  if (timeMatch) {
    const [, hours, minutes, period] = timeMatch;
    // Remove leading zero from hours if present
    const formattedHours = hours.replace(/^0+/, '') || '12'; // Replace '0' with '12' for midnight
    return `${formattedHours}:${minutes} ${period.toUpperCase()}`;
  }
  
  return timeString; // Return original if no match
}

export function LeaderboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedMatch, setSelectedMatch] = useState<Match | undefined>(
    location.state?.selectedMatch
  )
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  
  const { entries, loading: leaderboardLoading, error } = useLeaderboardData({
    selectedMatch
  })
  
  // Fetch all completed matches for navigation
  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch('/matches.json')
        if (!response.ok) throw new Error('Failed to fetch matches')
        
        const data: Match[] = await response.json()
        
        // Filter to only include completed matches with results
        const completedMatches = data.filter(match => 
          match.result && match.result !== "N/A"
        ).sort((a, b) => {
          // Sort by match number
          return parseInt(a.match_number) - parseInt(b.match_number)
        })
        
        setAllMatches(completedMatches)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching matches:', error)
        setLoading(false)
      }
    }
    
    fetchMatches()
  }, [])
  
  useEffect(() => {
    if (location.state?.selectedMatch) {
      setSelectedMatch(location.state.selectedMatch)
    }
  }, [location.state])
  
  const handleBackClick = () => {
    navigate('/fixtures')
  }
  
  // Handle navigation to previous match
  const handlePreviousMatch = () => {
    if (!selectedMatch || allMatches.length === 0) return
    
    const currentIndex = allMatches.findIndex(
      match => match.match_number === selectedMatch.match_number
    )
    
    if (currentIndex > 0) {
      const previousMatch = allMatches[currentIndex - 1]
      setSelectedMatch(previousMatch)
      navigate('/leaderboard', { state: { selectedMatch: previousMatch }, replace: true })
    }
  }
  
  // Handle navigation to next match
  const handleNextMatch = () => {
    if (!selectedMatch || allMatches.length === 0) return
    
    const currentIndex = allMatches.findIndex(
      match => match.match_number === selectedMatch.match_number
    )
    
    if (currentIndex < allMatches.length - 1) {
      const nextMatch = allMatches[currentIndex + 1]
      setSelectedMatch(nextMatch)
      navigate('/leaderboard', { state: { selectedMatch: nextMatch }, replace: true })
    }
  }
  
  // Determine if previous/next match buttons should be enabled
  const getPreviousMatchAvailable = () => {
    if (!selectedMatch || allMatches.length === 0) return false
    
    const currentIndex = allMatches.findIndex(
      match => match.match_number === selectedMatch.match_number
    )
    
    return currentIndex > 0
  }
  
  const getNextMatchAvailable = () => {
    if (!selectedMatch || allMatches.length === 0) return false
    
    const currentIndex = allMatches.findIndex(
      match => match.match_number === selectedMatch.match_number
    )
    
    return currentIndex < allMatches.length - 1
  }
  
  if (loading) {
    return <LoadingState message="Loading matches..." />
  }
  
  if (!selectedMatch) {
    return (
      <div className={styles.container}>
        <EmptyState message="No match selected. Please select a match from the fixtures page." />
        <button className={styles.backButton} onClick={handleBackClick}>
          Back to Fixtures
        </button>
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      <MatchHeader 
        matchNumber={formatMatchNumber(selectedMatch.match_number)}
        team1={selectedMatch.team1}
        team2={selectedMatch.team2}
        result={selectedMatch.result}
        venue={selectedMatch.venue}
        date={formatDate(selectedMatch.date)}
        time={formatTime(selectedMatch.time_ist)}
        onPreviousMatch={handlePreviousMatch}
        onNextMatch={handleNextMatch}
        hasPreviousMatch={getPreviousMatchAvailable()}
        hasNextMatch={getNextMatchAvailable()}
      />
      
      {error ? (
        <EmptyState message={error} />
      ) : leaderboardLoading ? (
        <LoadingState message="Loading leaderboard..." />
      ) : (
        <LeaderboardCardList 
          entries={entries}
          matchNumber={selectedMatch.match_number}
          loading={leaderboardLoading}
        />
      )}
    </div>
  )
} 