import { SelectedParticipant } from '../types'
import styles from './ParticipantSelector.module.css'

interface ParticipantSelectorProps {
  participants: string[]
  selectedParticipants: SelectedParticipant[]
  onSelectionChange: (participants: SelectedParticipant[]) => void
  loading?: boolean
}

const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#ffb366', '#87d068', '#ffa39e', '#b7eb8f'
]

export function ParticipantSelector({ 
  participants, 
  selectedParticipants, 
  onSelectionChange,
  loading 
}: ParticipantSelectorProps) {
  // Get available participants (not already selected)
  const availableParticipants = participants.filter(participant =>
    !selectedParticipants.some(selected => selected.username === participant)
  )

  const addParticipant = (username: string) => {
    if (!username || username === '') return
    
    if (selectedParticipants.length >= 5) {
      alert('Maximum 5 participants can be compared at once')
      return
    }

    const color = CHART_COLORS[selectedParticipants.length % CHART_COLORS.length]
    const newParticipant: SelectedParticipant = {
      username,
      name: username,
      color
    }

    onSelectionChange([...selectedParticipants, newParticipant])
  }

  const removeParticipant = (username: string) => {
    onSelectionChange(selectedParticipants.filter(p => p.username !== username))
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsername = event.target.value
    if (selectedUsername) {
      addParticipant(selectedUsername)
      // Reset the select to default value
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className={styles.participantSelector}>
        <div className={styles.loading}>Loading players...</div>
      </div>
    )
  }

  return (
    <div className={styles.participantSelector}>
      <div className={styles.selectorSection}>
        <div className={styles.searchContainer}>
          <select
            className={styles.searchInput}
            onChange={handleSelectChange}
            value=""
            disabled={availableParticipants.length === 0}
          >
            <option value="" disabled>
              {availableParticipants.length > 0 
                ? "Select players to compare..." 
                : "No available players"}
            </option>
            {availableParticipants.map(participant => (
              <option key={participant} value={participant}>
                {participant}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedParticipants.length > 0 && (
        <div className={styles.selectedSection}>
          <h3>Selected Participants ({selectedParticipants.length}/5)</h3>
          <div className={styles.selectedList}>
            {selectedParticipants.map(participant => (
              <div key={participant.username} className={styles.selectedItem}>
                <div className={styles.participantInfo}>
                  <div 
                    className={styles.colorIndicator} 
                    style={{ backgroundColor: participant.color }}
                  ></div>
                  <span className={styles.participantName}>{participant.name}</span>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeParticipant(participant.username)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 