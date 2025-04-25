import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { OverallLeaderboardEntry } from '../../../types/leaderboard'
import { OverallLeaderboardEntry as OverallLeaderboardEntryComponent } from '../../../components/OverallLeaderboardEntry'
import styles from './OverallLeaderboardPage.module.css'

// Initial match number (will be controlled by dropdown)
const INITIAL_MATCH_NUMBER = 42
const MAX_MATCH_NUMBER = 42

let overallData: any = {}

const ENTRIES_PER_PAGE = 15

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

// Helper to format match number with leading zero if needed
const formatMatchNumber = (match: number): string => {
  return match.toString().padStart(2, '0');
}

// Convert the JSON data to array format and sort by overall rank
const getEntries = (): OverallLeaderboardEntry[] => {
  return Object.entries(overallData).map(([name, data]: [string, any]) => ({
    name,
    matchesPlayed: data.matches_played,
    cumulativePoints: data.cumulative_points,
    average: data.average,
    wins: data.wins,
    podiums: data.podiums,
    overallRank: data.overall_rank,
    overallRankChange: data.overall_rank_change
  })).sort((a, b) => a.overallRank - b.overallRank)
}

export function OverallLeaderboardPage() {
  const [leaderboardEntries, setLeaderboardEntries] = useState<OverallLeaderboardEntry[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState(INITIAL_MATCH_NUMBER)
  const [availableMatches, setAvailableMatches] = useState<number[]>([])

  // Get available match numbers
  useEffect(() => {
    // Create array from 1 to MAX_MATCH_NUMBER in reverse order (newest first)
    const matches = Array.from({ length: MAX_MATCH_NUMBER }, (_, i) => MAX_MATCH_NUMBER - i);
    setAvailableMatches(matches);
  }, []);

  useEffect(() => {
    // Reset loading state when match selection changes
    setIsLoading(true)
    
    // Import data for selected match and update state
    import(`../../../../data/overall/after_match_${formatMatchNumber(selectedMatch)}.json`)
      .then((module) => {
        overallData = module.default
        setLeaderboardEntries(getEntries())
        setIsLoading(false)
      })
      .catch(error => {
        console.error(`Error loading data file for match ${selectedMatch}:`, error)
        setIsLoading(false)
      })
  }, [selectedMatch])

  const pageCount = Math.ceil(leaderboardEntries.length / ENTRIES_PER_PAGE)
  const startIndex = currentPage * ENTRIES_PER_PAGE
  const visibleEntries = leaderboardEntries.slice(startIndex, startIndex + ENTRIES_PER_PAGE)

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleMatchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMatch(Number(event.target.value))
    setCurrentPage(0) // Reset to first page when changing match
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextPage()
      } else if (event.key === 'ArrowLeft') {
        goToPreviousPage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pageCount]) // Include pageCount in dependencies since it's used in the handlers

  return (
    <motion.div 
      className={styles['leaderboard-page']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>LEADERBOARD</h1>
        <div className={styles['match-selector-container']}>
          <span className={styles['page-subtitle']}>After Match #</span>
          <select 
            value={selectedMatch}
            onChange={handleMatchChange}
            className={styles['match-selector']}
          >
            {availableMatches.map(match => (
              <option key={match} value={match}>
                {match}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            className={styles['loading-indicator']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Loading data...
          </motion.div>
        ) : (
          <motion.div 
            key={`match-${selectedMatch}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className={styles['leaderboard-entries']}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {visibleEntries.map((entry, index) => (
                <motion.div 
                  key={entry.name}
                  variants={itemVariants}
                  transition={{ duration: 0.2 }}
                >
                  <OverallLeaderboardEntryComponent
                    entry={entry}
                    index={startIndex + index}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 