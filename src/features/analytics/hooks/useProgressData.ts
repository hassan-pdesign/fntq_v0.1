import { useState, useEffect } from 'react'
import { ParticipantProgressData, MatchProgressPoint } from '../types'

export function useProgressData() {
  const [participants, setParticipants] = useState<string[]>([])
  const [progressData, setProgressData] = useState<Map<string, ParticipantProgressData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllProgressData()
  }, [])

  const fetchAllProgressData = async () => {
    try {
      setLoading(true)
      setError(null)

      const allParticipantsMap = new Map<string, ParticipantProgressData>()
      const participantSet = new Set<string>()

      // Fetch data from all 74 matches
      for (let matchNum = 1; matchNum <= 74; matchNum++) {
        try {
          const normalizedMatchNumber = matchNum.toString().padStart(2, '0')
          const response = await fetch(`./data/results/match_results_${normalizedMatchNumber}.json`)
          
          if (!response.ok) {
            console.warn(`Failed to fetch match ${matchNum} data`)
            continue
          }

          const matchData = await response.json()
          
          if (matchData?.participant_scores) {
            matchData.participant_scores.forEach((participant: any) => {
              const username = participant.name
              participantSet.add(username)

              if (!allParticipantsMap.has(username)) {
                allParticipantsMap.set(username, {
                  username,
                  name: username,
                  progressData: []
                })
              }

              const participantData = allParticipantsMap.get(username)!
              
              // Calculate match points (difference from previous overall points)
              const matchPoints = participantData.progressData.length > 0 
                ? participant.overall_points - participantData.progressData[participantData.progressData.length - 1].cumulativePoints
                : participant.overall_points

              const progressPoint: MatchProgressPoint = {
                matchNumber: matchNum,
                cumulativePoints: participant.overall_points || 0,
                matchPoints: matchPoints,
                matchLabel: `M${matchNum}`
              }

              participantData.progressData.push(progressPoint)
            })
          }
        } catch (matchError) {
          console.warn(`Error processing match ${matchNum}:`, matchError)
        }
      }

      setParticipants(Array.from(participantSet).sort())
      setProgressData(allParticipantsMap)
    } catch (error) {
      console.error('Error fetching progress data:', error)
      setError('Failed to load progress data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getParticipantData = (username: string): ParticipantProgressData | undefined => {
    return progressData.get(username)
  }

  return {
    participants,
    progressData,
    loading,
    error,
    getParticipantData,
    refetch: fetchAllProgressData
  }
} 