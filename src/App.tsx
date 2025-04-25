import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { BottomBar } from './features/shared/components/BottomBar'
import { LeaderboardPage } from './features/leaderboard/pages/LeaderboardPage'
import { OverallLeaderboardPage } from './features/overall/pages/OverallLeaderboardPage'
import { FixturesPage } from './features/fixtures/pages/FixturesPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/fixtures" replace />} />
            <Route path="/fixtures" element={<FixturesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/overall" element={<OverallLeaderboardPage />} />
            <Route path="*" element={<Navigate to="/fixtures" replace />} />
          </Routes>
        </div>
        <BottomBar />
      </div>
    </BrowserRouter>
  )
}

export default App
