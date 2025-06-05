import fixturesData from '../../public/data/fixtures.json'

export interface FixtureDetails {
  matchNumber: number
  date: string
  time: string
  venue: string
  team1: string
  team2: string
  matchType: string
}

export function getMatchDetails(matchNumber: number): FixtureDetails | null {
  try {
    const matchDetails = fixturesData.find(
      (fixture: FixtureDetails) => fixture.matchNumber === matchNumber
    )
    return matchDetails || null
  } catch (error) {
    console.error('Error reading fixtures:', error)
    return null
  }
} 