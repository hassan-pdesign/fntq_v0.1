import { useState } from 'react'

export function BottomBar() {
  const [activeTab, setActiveTab] = useState('matches')

  return (
    <div className="bottom-bar">
      <button 
        className={`bottom-bar-item ${activeTab === 'matches' ? 'active' : ''}`}
        onClick={() => setActiveTab('matches')}
      >
        <img src="/icons/1 matches.svg" alt="Matches" />
      </button>
      <button 
        className={`bottom-bar-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('leaderboard')}
      >
        <img src="/icons/2 leaderboard.svg" alt="Leaderboard" />
      </button>
      <button 
        className={`bottom-bar-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <img src="/icons/3 profile.svg" alt="Profile" />
      </button>
      <button 
        className={`bottom-bar-item ${activeTab === 'feedback' ? 'active' : ''}`}
        onClick={() => setActiveTab('feedback')}
      >
        <img src="/icons/4 feedback.svg" alt="Feedback" />
      </button>
    </div>
  )
} 