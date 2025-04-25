import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LeaderboardEntry } from '../../../types/leaderboard'
import { MatchHeader } from '../../../components/MatchHeader'
import { LeaderboardEntry as LeaderboardEntryComponent } from '../../../components/LeaderboardEntry'
import teamAcronyms from '../../../../data/team_acronyms.json'
import { getMatchDetails } from '../../../utils/fixtureUtils'
import styles from './LeaderboardPage.module.css'

const ENTRIES_PER_PAGE = 15

// Define Match interface to match the one from FixturesPage
interface Match {
  match_number: string
  team1: string
  team2: string
  venue: string
  date: string
  day: string
  time_ist: string
  cricinfo_url: string
  result?: string
}

// Match the expected MatchHeader props
interface MatchInfo {
  matchNumber: number;
  team1: string;
  team2: string;
  venue: string;
  date: string;
  time: string;
  separator?: string; // Add optional separator prop
}

// Add interface for raw match data to provide proper typing
interface MatchData {
  match_number: string;
  teams: {
    team1: string;
    team2: string;
  };
  participant_scores: Array<{
    rank: number;
    name: string;
    rounded_off_total_points: number;
    overall_points: number;
    overall_rank: number;
    overall_rank_change: string;
    players: Array<{
      player: string;
      is_captain: boolean;
    }>;
  }>;
}

// Helper function to format date as "Mon, April 21"
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  
  return `${dayOfWeek}, ${month} ${day}`;
}

export function LeaderboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedMatch = location.state?.selectedMatch as Match | undefined;
  
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState<MatchInfo>({
    matchNumber: 0,
    team1: '',
    team2: '',
    venue: '',
    date: '',
    time: '',
    separator: '•' // Add the separator
  });
  const [rawMatchData, setRawMatchData] = useState<MatchData | null>(null);
  const [matchNumber, setMatchNumber] = useState<number>(0);

  // Always scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle touch events for swipe detection
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Required minimum distance traveled to be considered swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // If right swipe, navigate back to fixtures page
    if (isRightSwipe) {
      // Use navigate(-1) to go back in history instead of directly to /fixtures
      // This helps maintain the scroll position
      navigate(-1);
    }
    // If left swipe, go to next page (if available)
    else if (isLeftSwipe) {
      goToNextPage();
    }
  };

  useEffect(() => {
    async function loadMatchData() {
      try {
        setLoading(true);
        
        // Determine which match data to load
        const matchNumber = selectedMatch ? parseInt(selectedMatch.match_number) : 41;
        setMatchNumber(matchNumber);
        
        // Ensure match number has correct format for file path (pad with leading zero if needed)
        const formattedMatchNumber = matchNumber < 10 ? `0${matchNumber}` : `${matchNumber}`;
        
        // Dynamically import the match results with correctly formatted match number
        const matchData = await import(`../../../../data/results/match_results_${formattedMatchNumber}.json`);
        setRawMatchData(matchData);
        
        // Parse the entries from the match data
        const entries: LeaderboardEntry[] = matchData.participant_scores.map((participant: any) => ({
          rank: participant.rank,
          name: participant.name.toUpperCase(),
          points: participant.rounded_off_total_points,
          totalPoints: participant.overall_points,
          overallRank: participant.overall_rank,
          players: {
            captain: participant.players.find((p: any) => p.is_captain)?.player || '',
            player1: participant.players.find((p: any) => !p.is_captain)?.player || '',
            player2: participant.players.filter((p: any) => !p.is_captain)[1]?.player || ''
          }
        }));
        
        setLeaderboardEntries(entries);
        
        // Get fixture details from utils or use selected match
        const fixtureDetails = getMatchDetails(matchNumber);

        // Format the date string
        const formattedDate = selectedMatch?.date ? formatDate(selectedMatch.date) : 
                              fixtureDetails?.date ? formatDate(fixtureDetails.date) : 'TBA';
        
        setMatchInfo({
          matchNumber: matchNumber,
          team1: selectedMatch ? selectedMatch.team1 : (fixtureDetails?.team1 || 'TBA'),
          team2: selectedMatch ? selectedMatch.team2 : (fixtureDetails?.team2 || 'TBA'),
          venue: selectedMatch ? selectedMatch.venue : (fixtureDetails?.venue || 'TBA'),
          date: formattedDate,
          time: selectedMatch ? selectedMatch.time_ist : (fixtureDetails?.time || 'TBA'),
          separator: '•' // Add the separator
        });
        
      } catch (error) {
        console.error('Failed to load match data:', error);
        setLeaderboardEntries([]);
        setRawMatchData(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadMatchData();
  }, [selectedMatch]);

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

  if (loading) {
    return <div className={styles['loading']}>Loading match results...</div>;
  }

  return (
    <motion.div 
      className={styles['leaderboard-page']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Match Leaderboard Section */}
      <div className={styles['match-leaderboard']}>
        <MatchHeader matchInfo={matchInfo} />
        
        {leaderboardEntries.length === 0 ? (
          <div className={styles['no-data']}>No results available for this match yet.</div>
        ) : (
          <>
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
                  rankChange={rawMatchData?.participant_scores[startIndex + index]?.overall_rank_change || "0"}
                />
              ))}
            </motion.div>
            
            {/* Pagination controls - These are currently hidden in CSS but kept for future use */}
            <div className={styles['pagination-controls']}>
              <button 
                className={styles['pagination-button']}
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span className={styles['page-indicator']}>
                Page {currentPage + 1} of {pageCount}
              </span>
              <button 
                className={styles['pagination-button']}
                onClick={goToNextPage}
                disabled={currentPage === pageCount - 1}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
} 