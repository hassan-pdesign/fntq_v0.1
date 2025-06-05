import { useState, useEffect } from 'react'

export interface WinnerData {
  overallPointsWinner: { name: string; points: number }
  overallPointsRunner: { name: string; points: number }
  mostWins: { name: string; wins: number }
}

export function useWinnerData() {
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWinnerData = async () => {
      try {
        setLoading(true)
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/winners')
        // const data = await response.json()
        
        // Mock data for now
        const mockData: WinnerData = {
          overallPointsWinner: { name: "Bipin", points: 9486 },
          overallPointsRunner: { name: "Sawant", points: 9027 },
          mostWins: { name: "Dubai Deepak", wins: 15 }
        }
        
        // Simulate loading delay
        setTimeout(() => {
          setWinnerData(mockData)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError('Failed to load winner data')
        setLoading(false)
      }
    }

    fetchWinnerData()
  }, [])

  return { winnerData, loading, error }
} 