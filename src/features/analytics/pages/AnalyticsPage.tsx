import { useState } from 'react'
import { ParticipantSelector } from '../components/ParticipantSelector'
import { ProgressChart } from '../components/ProgressChart'
import { useProgressData } from '../hooks/useProgressData'
import { SelectedParticipant } from '../types'
import styles from './AnalyticsPage.module.css'

export function AnalyticsPage() {
  const [selectedParticipants, setSelectedParticipants] = useState<SelectedParticipant[]>([])
  const { participants, loading, error, getParticipantData } = useProgressData()

  const handleSelectionChange = (newParticipants: SelectedParticipant[]) => {
    setSelectedParticipants(newParticipants)
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      

      <div className={styles.analyticsContent}>
        <ProgressChart
          selectedParticipants={selectedParticipants}
          getParticipantData={getParticipantData}
        />

        <ParticipantSelector
          participants={participants}
          selectedParticipants={selectedParticipants}
          onSelectionChange={handleSelectionChange}
          loading={loading}
        />
      </div>
    </div>
  )
} 