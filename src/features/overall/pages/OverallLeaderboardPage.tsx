import { useState, useEffect } from 'react'
import styles from './OverallLeaderboardPage.module.css'
import { useOverallLeaderboard } from '../hooks/useOverallLeaderboard'
import { OverallLeaderboardTable } from '../components/OverallLeaderboardTable'
import { LoadingState } from '../../shared/components/LoadingState'
import { EmptyState } from '../../shared/components/EmptyState'

export function OverallLeaderboardPage() {
  const [selectedMatch, setSelectedMatch] = useState<number | undefined>(undefined);
  const [availableMatches, setAvailableMatches] = useState<number[]>([]);
  const { entries, loading, error } = useOverallLeaderboard(selectedMatch);
  
  // Get available match numbers
  useEffect(() => {
    // This is hardcoded but could be fetched from an API in a real app
    const matches = Array.from({ length: 42 }, (_, i) => i + 1);
    setAvailableMatches(matches);
  }, []);
  
  const handleMatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedMatch(undefined);
    } else {
      setSelectedMatch(parseInt(value));
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Overall Leaderboard</h1>
        
        <div className={styles.matchSelector}>
          <label htmlFor="match-select">After Match: </label>
          <select 
            id="match-select"
            value={selectedMatch || ""}
            onChange={handleMatchChange}
            className={styles.select}
          >
            <option value="">Latest</option>
            {availableMatches.map(match => (
              <option key={match} value={match}>
                {match}
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
        <OverallLeaderboardTable 
          entries={entries}
          loading={loading}
          matchNumber={selectedMatch}
        />
      )}
    </div>
  )
} 