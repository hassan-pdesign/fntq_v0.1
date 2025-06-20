import { useNavigate } from 'react-router-dom'
import styles from './FixturesPage.module.css'
import { Match } from '../../../types/match'
import { useMatches } from '../hooks/useMatches'
import { DateSection } from '../components/DateSection'
import { LoadingState } from '../../shared/components/LoadingState'
import { EmptyState } from '../../shared/components/EmptyState'

type ActiveTab = 'UPCOMING' | 'COMPLETED'

export function FixturesPage() {
  const activeTab: ActiveTab = 'COMPLETED'
  const navigate = useNavigate()
  
  const { loading, matchesByDate } = useMatches(activeTab)

  const handleMatchClick = (match: Match) => {
    // Only handle clicks for completed matches
    if (activeTab === 'COMPLETED' && match.result && match.result !== "N/A") {
      // Normalize match_number to ensure consistent format
      const normalizedMatch = {
        ...match,
        match_number: match.match_number.padStart(2, '0')
      }
      
      navigate('/leaderboard', { state: { selectedMatch: normalizedMatch } })
    }
  }

  return (
    <div className={styles.fixturesContainer}>
      {/* <Tabs 
        activeTab={activeTab} 
        tabs={tabs} 
        onTabChange={handleTabChange} 
      /> */}
      
      {loading ? (
        <LoadingState message="Loading fixtures..." />
      ) : Object.keys(matchesByDate).length === 0 ? (
        <EmptyState message="No fixtures found for this section" />
      ) : (
        <>
          {Object.entries(matchesByDate).map(([dateLabel, matches]) => (
            <DateSection
              key={dateLabel}
              dateLabel={dateLabel}
              matches={matches}
              isCompleted={activeTab === 'COMPLETED'}
              onMatchClick={handleMatchClick}
            />
          ))}
        </>
      )}
    </div>
  )
} 