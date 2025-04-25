import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { OverallLeaderboardEntry } from '../types/leaderboard'
import { OverallLeaderboardEntry as OverallLeaderboardEntryComponent } from '../components/OverallLeaderboardEntry'
import styles from '../pages/OverallLeaderboardPage.module.css'

interface OverallLeaderboardSectionProps {
  matchNumber: number;
}

// Convert the JSON data to array format and sort by overall rank
const getEntries = (overallData: any): OverallLeaderboardEntry[] => {
  return Object.entries(overallData).map(([name, data]: [string, any]) => ({
    name,
    username: name,
    rank: data.overall_rank,
    totalScore: data.cumulative_points,
    matchesPlayed: data.matches_played,
    cumulativePoints: data.cumulative_points,
    average: data.average,
    wins: data.wins,
    podiums: data.podiums,
    overallRank: data.overall_rank,
    overallRankChange: data.overall_rank_change
  })).sort((a, b) => a.overallRank - b.overallRank)
}

export function OverallLeaderboardSection({ matchNumber }: OverallLeaderboardSectionProps) {
  const [leaderboardEntries, setLeaderboardEntries] = useState<OverallLeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Import data for the specific match
    import(`../../data/overall/after_match_${matchNumber}.json`)
      .then((module) => {
        const overallData = module.default;
        setLeaderboardEntries(getEntries(overallData));
        setIsLoading(false);
      })
      .catch(error => {
        console.error(`Error loading overall data for match ${matchNumber}:`, error);
        setError(`No overall leaderboard data available for match #${matchNumber}.`);
        setIsLoading(false);
      });
  }, [matchNumber]);

  const sectionStyle = {
    marginTop: '40px',
    paddingTop: '20px'
  };

  return (
    <motion.div 
      style={sectionStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>OVERALL LEADERBOARD</h1>
        <p className={styles['page-subtitle']}>After Match #{matchNumber}</p>
      </div>
      
      {isLoading ? (
        <div className={styles['loading-indicator']}>Loading overall standings...</div>
      ) : error ? (
        <div className={styles['error-message']}>{error}</div>
      ) : (
        <motion.div 
          className={styles['leaderboard-entries']}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {leaderboardEntries.slice(0, 15).map((entry, index) => (
            <OverallLeaderboardEntryComponent
              key={entry.name}
              entry={entry}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
} 