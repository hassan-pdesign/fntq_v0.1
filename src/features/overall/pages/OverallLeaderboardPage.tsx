import { useState, useEffect } from 'react'
import styles from './OverallLeaderboardPage.module.css'
import { useOverallLeaderboard } from '../hooks/useOverallLeaderboard'
import { OverallLeaderboardCards } from '../components/OverallLeaderboardCards'
import { LoadingState } from '../../shared/components/LoadingState'
import { EmptyState } from '../../shared/components/EmptyState'
import { Tabs } from '../../shared/components/Tabs'

type ActiveTab = 'OVERALL'

export function OverallLeaderboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('OVERALL')
  const [selectedMatch, setSelectedMatch] = useState<number | undefined>(undefined);
  const [availableMatches, setAvailableMatches] = useState<number[]>([]);
  const { entries, loading, error } = useOverallLeaderboard(selectedMatch);
  
  // Get available match numbers
  useEffect(() => {
    // This is hardcoded but could be fetched from an API in a real app
    const matches = Array.from({ length: 42 }, (_, i) => i + 1).sort((a, b) => b - a);
    setAvailableMatches(matches);
  }, []);
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as ActiveTab)
  }
  
  const handleMatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedMatch(undefined);
    } else {
      setSelectedMatch(parseInt(value));
    }
  };
  
  const tabs = [
    { id: 'OVERALL', label: 'Overall' }
  ]
  
  return (
    <div className={styles.container}>
      <div className={styles.tabsWithSelector}>
        <Tabs 
          activeTab={activeTab} 
          tabs={tabs} 
          onTabChange={handleTabChange} 
        />
        
        <div className={styles.matchSelector}>
          <select 
            id="match-select"
            value={selectedMatch || ""}
            onChange={handleMatchChange}
            className={styles.select}
          >
            {availableMatches.map(match => (
              <option key={match} value={match}>
                After Match {match}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {error ? (
        <EmptyState message={error} />
      ) : loading ? (
        <LoadingState message="Loading overall leaderboard..." />
      ) : (
        <OverallLeaderboardCards 
          entries={entries}
          loading={loading}
          matchNumber={selectedMatch}
        />
      )}
    </div>
  )
} 