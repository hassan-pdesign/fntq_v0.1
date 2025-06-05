import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { SelectedParticipant, ParticipantProgressData, ChartData } from '../types'
import styles from './ProgressChart.module.css'

interface ProgressChartProps {
  selectedParticipants: SelectedParticipant[]
  getParticipantData: (username: string) => ParticipantProgressData | undefined
}

export function ProgressChart({ selectedParticipants, getParticipantData }: ProgressChartProps) {
  const chartData = useMemo(() => {
    if (selectedParticipants.length === 0) return []

    const participantDataMap = new Map<string, ParticipantProgressData>()

    // Collect all participant data
    selectedParticipants.forEach(participant => {
      const data = getParticipantData(participant.username)
      if (data) {
        participantDataMap.set(participant.username, data)
      }
    })

    // Get all unique match numbers across selected participants and sort them
    const allMatches = new Set<number>()
    participantDataMap.forEach(data => {
      data.progressData.forEach(point => allMatches.add(point.matchNumber))
    })
    const sortedMatches = Array.from(allMatches).sort((a, b) => a - b)

    // Build complete progression for each participant by filling gaps
    const completeProgressionMap = new Map<string, Map<number, number>>()
    
    selectedParticipants.forEach(participant => {
      const participantData = participantDataMap.get(participant.username)
      if (!participantData) return

      const progressionMap = new Map<number, number>()
      let lastCumulativePoints = 0

      // Fill in data for all matches, using previous cumulative points for missing matches
      sortedMatches.forEach(matchNumber => {
        const matchData = participantData.progressData.find(point => point.matchNumber === matchNumber)
        if (matchData) {
          lastCumulativePoints = matchData.cumulativePoints
        }
        progressionMap.set(matchNumber, lastCumulativePoints)
      })

      completeProgressionMap.set(participant.username, progressionMap)
    })

    // Transform data for chart
    const chartDataArray: ChartData[] = sortedMatches.map(matchNumber => {
      const dataPoint: ChartData = {
        matchNumber,
        matchLabel: `M${matchNumber}`
      }

      selectedParticipants.forEach(participant => {
        const progressionMap = completeProgressionMap.get(participant.username)
        if (progressionMap) {
          dataPoint[participant.username] = progressionMap.get(matchNumber) || 0
        }
      })

      return dataPoint
    })

    return chartDataArray
  }, [selectedParticipants, getParticipantData])

  const formatTooltip = (value: any, name: string) => {
    const participant = selectedParticipants.find(p => p.username === name)
    return [`${value} points`, participant?.name || name]
  }

  return (
    <div className={styles.progressChart}>
      <div className={styles.chartContainer}>
        {selectedParticipants.length === 0 ? (
          <div className={styles.chartPlaceholder}>
            <div className={styles.placeholderContent}>
              <p>Use the search below to add players and compare their point progression throughout the tournament.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={chartData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
              }}
            >
              <XAxis 
                dataKey="matchNumber"
                tick={false}
                axisLine={false}
                height={20}
              />
              <YAxis 
                domain={[0, 10000]}
                tick={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(label) => `Match ${label}`}
              />
              <Legend />
              
              {selectedParticipants.map(participant => (
                <Line
                  key={participant.username}
                  type="monotone"
                  dataKey={participant.username}
                  stroke={participant.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: participant.color }}
                  name={participant.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
} 