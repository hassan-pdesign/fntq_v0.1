import { readFileSync, writeFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvFilePath = path.join(__dirname, '..', 'public', 'data', 'fixtures.csv')
const jsonFilePath = path.join(__dirname, '..', 'public', 'data', 'fixtures.json')

try {
  const fileContent = readFileSync(csvFilePath, 'utf-8')
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  })

  const fixtures = records.map(record => ({
    matchNumber: parseInt(record['Match Number']),
    date: record['Date'],
    time: record['Time (IST)'],
    venue: record['Venue'],
    team1: record['Team 1'],
    team2: record['Team 2'],
    matchType: record['Match Type']
  }))

  writeFileSync(jsonFilePath, JSON.stringify(fixtures, null, 2))
  console.log('Successfully converted fixtures.csv to fixtures.json')
} catch (error) {
  console.error('Error converting fixtures:', error)
  process.exit(1)
} 