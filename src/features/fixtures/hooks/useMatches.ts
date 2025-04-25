import { useState, useEffect } from 'react'
import { Match } from '../../../types/match'

type MatchTab = 'UPCOMING' | 'COMPLETED'

export function useMatches(activeTab: MatchTab) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [activeTab])

  async function fetchMatches() {
    try {
      setLoading(true)
      setError(null)
      
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
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        
        // For COMPLETED tab, sort by most recent first (descending)
        // For UPCOMING tab, sort by earliest first (ascending)
        return activeTab === 'COMPLETED' 
          ? dateB.getTime() - dateA.getTime() 
          : dateA.getTime() - dateB.getTime()
      })
        
      setMatches(sortedData)
    } catch (error) {
      console.error('Error fetching matches:', error)
      setError('Failed to load matches. Please try again later.')
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

  return {
    matches,
    loading,
    error,
    matchesByDate,
    refetch: fetchMatches
  }
} 