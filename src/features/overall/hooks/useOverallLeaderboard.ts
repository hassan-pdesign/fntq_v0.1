import { useState, useEffect } from 'react'
import { OverallLeaderboardEntry } from '../../../types/leaderboard'

export function useOverallLeaderboard(matchNumber?: number) {
  const [entries, setEntries] = useState<OverallLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOverallLeaderboard()
  }, [matchNumber])

  const fetchOverallLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let data;
      
      if (matchNumber) {
        // Fetch specific match data
        try {
          const response = await fetch(`/data/overall/after_match_${matchNumber.toString().padStart(2, '0')}.json`);
          if (!response.ok) {
            throw new Error(`Failed to fetch match ${matchNumber} data`);
          }
          
          const matchData = await response.json();
          
          // Handle duplicate player names by consolidating stats
          const consolidatedData: { [key: string]: any } = {};
          
          Object.entries(matchData).forEach(([username, info]: [string, any]) => {
            if (consolidatedData[username]) {
              // If duplicate exists, keep the one with more matches played
              if (info.matches_played > consolidatedData[username].matches_played) {
                consolidatedData[username] = info;
              }
            } else {
              consolidatedData[username] = info;
            }
          });
          
          // Transform consolidated data format to match OverallLeaderboardEntry
          data = Object.entries(consolidatedData).map(([username, info]: [string, any]) => ({
            rank: info.overall_rank,
            username,
            totalScore: info.cumulative_points,
            matchesPlayed: info.matches_played,
            wins: info.wins,
            podiums: info.podiums,
            average: info.average,
            previousRank: info.overall_rank_change === "-" ? info.overall_rank : 
                          info.overall_rank_change.startsWith("↑") ? info.overall_rank + parseInt(info.overall_rank_change.substring(1)) :
                          info.overall_rank_change.startsWith("↓") ? info.overall_rank - parseInt(info.overall_rank_change.substring(1)) : undefined
          }));
          
        } catch (err) {
          console.error(`Error fetching match ${matchNumber} data:`, err);
          // Fallback to default data
          const response = await fetch('/overall-leaderboard.json');
          if (!response.ok) {
            throw new Error('Failed to fetch overall leaderboard');
          }
          data = await response.json();
        }
      } else {
        // Fetch default overall leaderboard
        const response = await fetch('/overall-leaderboard.json');
        if (!response.ok) {
          throw new Error('Failed to fetch overall leaderboard');
        }
        data = await response.json();
      }
      
      // Transform the data if needed
      const transformedData: OverallLeaderboardEntry[] = Array.isArray(data) 
        ? data
        : [];
      
      // Sort by rank
      transformedData.sort((a, b) => a.rank - b.rank);
      
      setEntries(transformedData)
    } catch (error) {
      console.error('Error fetching overall leaderboard data:', error)
      setError('Failed to load overall leaderboard data. Please try again later.')
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  return {
    entries,
    loading,
    error,
    refetch: fetchOverallLeaderboard
  }
} 