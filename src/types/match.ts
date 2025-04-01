export interface Match {
  id: string  // it's a uuid in the database
  team_1: string
  team_2: string
  match_date: string
  venue: string
  city: string
  is_completed: boolean
  season: string
} 