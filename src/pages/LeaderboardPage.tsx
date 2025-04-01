import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { LeaderboardEntry } from '../types/leaderboard'
import { MatchHeader } from '../components/MatchHeader'
import { LeaderboardEntry as LeaderboardEntryComponent } from '../components/LeaderboardEntry'
import matchData from '../../data/results/match_results_01.json'
import teamAcronyms from '../../data/team_acronyms.json'
import { getMatchDetails } from '../utils/fixtureUtils'
import styles from './LeaderboardPage.module.css'

const ENTRIES_PER_PAGE = 5

const entries: LeaderboardEntry[] = matchData.participant_scores.map(participant => ({
  rank: participant.rank,
  name: participant.name.toUpperCase(),
  points: participant.rounded_off_total_points,
  totalPoints: participant.overall_points,
  overallRank: participant.overall_rank,
  players: {
    captain: participant.players.find(p => p.is_captain)?.player || '',
    player1: participant.players.find(p => !p.is_captain)?.player || '',
    player2: participant.players.filter(p => !p.is_captain)[1]?.player || ''
  }
}))

const fixtureDetails = getMatchDetails(matchData.match_number)

const matchInfo = {
  matchNumber: matchData.match_number,
  team1: teamAcronyms[matchData.teams.team1 as keyof typeof teamAcronyms],
  team2: teamAcronyms[matchData.teams.team2 as keyof typeof teamAcronyms],
  venue: fixtureDetails?.venue || 'TBA',
  date: fixtureDetails?.date || 'TBA',
  time: fixtureDetails?.time || 'TBA'
}

export function LeaderboardPage() {
  const [leaderboardEntries] = useState<LeaderboardEntry[]>(entries)
  const [currentPage, setCurrentPage] = useState(0)

  const pageCount = Math.ceil(leaderboardEntries.length / ENTRIES_PER_PAGE)
  const startIndex = currentPage * ENTRIES_PER_PAGE
  const visibleEntries = leaderboardEntries.slice(startIndex, startIndex + ENTRIES_PER_PAGE)

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
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
      <MatchHeader matchInfo={matchInfo} />
      
      <motion.div 
        className={styles['leaderboard-entries']}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {visibleEntries.map((entry, index) => (
          <LeaderboardEntryComponent
            key={entry.name}
            entry={entry}
            index={startIndex + index}
            rankChange={matchData.participant_scores[startIndex + index].overall_rank_change}
          />
        ))}
      </motion.div>

      <div className={styles['pagination-controls']}>
        <button 
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={styles['pagination-button']}
        >
          Previous
        </button>
        <span className={styles['page-indicator']}>
          Page {currentPage + 1} of {pageCount}
        </span>
        <button 
          onClick={goToNextPage}
          disabled={currentPage === pageCount - 1}
          className={styles['pagination-button']}
        >
          Next
        </button>
      </div>
    </motion.div>
  )
} 