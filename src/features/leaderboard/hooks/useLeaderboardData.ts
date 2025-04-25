import { useState, useEffect } from 'react'
import { Match } from '../../../types/match'
import { LeaderboardDataEntry } from '../../../types/leaderboard'

interface UseLeaderboardDataProps {
  selectedMatch?: Match
}

export function useLeaderboardData({ selectedMatch }: UseLeaderboardDataProps) {
  const [entries, setEntries] = useState<LeaderboardDataEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedMatch) {
      fetchLeaderboardData(selectedMatch.match_number)
    } else {
      setLoading(false)
      setEntries([])
    }
  }, [selectedMatch])

  const fetchLeaderboardData = async (matchNumber: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Normalize match number to ensure it's 2 digits (01, 02, etc.)
      const normalizedMatchNumber = matchNumber.padStart(2, '0')
      
      // Use the correct path for the data files in the project structure
      const response = await fetch(`./data/results/match_results_${normalizedMatchNumber}.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard for match #${matchNumber}`)
      }
      
      const data = await response.json()
      
      // Transform the data structure from match_results format to leaderboard format
      if (data && data.participant_scores) {
        const transformedData: LeaderboardDataEntry[] = data.participant_scores.map((player: any) => {
          // Get player names from the player array
          const playerNames = player.players.map((p: any) => 
            p.is_captain ? `${p.player} (C)` : p.player
          ).join(', ');
          
          return {
            rank: player.rank,
            username: player.name,
            score: player.rounded_off_total_points,
            prediction: playerNames,
            overall_rank: player.overall_rank,
            overall_rank_change: player.overall_rank_change,
            overall_points: player.overall_points
          };
        });
        
        setEntries(transformedData);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error)
      setError('Failed to load leaderboard data. Please try again later.')
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  return {
    entries,
    loading,
    error,
    fetchLeaderboardData
  }
} 