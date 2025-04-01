import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Match } from '../types/match'

interface Player {
  id: number
  name: string
  team: string
}

function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  )
}

export function MatchPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [match, setMatch] = useState<Match | null>(null)
  const [activeTeam, setActiveTeam] = useState<string>('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])

  useEffect(() => {
    fetchMatchAndPlayers()
  }, [id])

  async function fetchMatchAndPlayers() {
    try {
      setLoading(true)
      
      // Fetch match details
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single()

      if (matchError) throw matchError
      if (!matchData) {
        console.error('Match not found')
        navigate('/')
        return
      }

      setMatch(matchData)
      setActiveTeam(matchData.team_1)

      // Fetch players for both teams
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .in('team', [matchData.team_1, matchData.team_2])

      if (playersError) throw playersError
      setPlayers(playersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    )
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return <Spinner />
  }

  if (!match) {
    return null
  }

  const currentTeamPlayers = players.filter(player => player.team === activeTeam)

  return (
    <motion.div 
      className="match-page"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <header className="match-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src="/icons/back.SVG" alt="Back" width="40" height="40" />
        </button>
        <div className="match-info">
          <div className="match-datetime">
            <span className="match-date">{formatDate(match.match_date)}</span>
            <span className="separator">|</span>
            <span className="match-time">{formatTime(match.match_date)}</span>
          </div>
          <div className="match-venue">{match.venue}</div>
          <div className="match-city">{match.city}</div>
        </div>
      </header>

      <div className="team-tabs">
        <motion.button 
          className={`team-tab ${activeTeam === match.team_1 ? 'active' : ''}`}
          onClick={() => setActiveTeam(match.team_1)}
          whileTap={{ scale: 0.95 }}
        >
          {match.team_1}
        </motion.button>
        <motion.button 
          className={`team-tab ${activeTeam === match.team_2 ? 'active' : ''}`}
          onClick={() => setActiveTeam(match.team_2)}
          whileTap={{ scale: 0.95 }}
        >
          {match.team_2}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTeam}
          className="players-list"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentTeamPlayers.map((player) => (
            <motion.div 
              key={player.id} 
              className="player-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="player-name">{player.name}</span>
              <motion.button 
                className={`add-player-button ${selectedPlayers.includes(player.id) ? 'selected' : ''}`}
                onClick={() => togglePlayerSelection(player.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>{selectedPlayers.includes(player.id) ? '✓' : '+'}</span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
} 