# Analytics Feature

This feature provides participant progress visualization throughout the tournament.

## Components

### AnalyticsPage
Main page component that combines participant selection and chart visualization.

### ParticipantSelector
- Search and select participants for comparison
- Support for up to 5 participants simultaneously
- Color-coded participant management

### ProgressChart
- Line chart showing cumulative points progression
- X-axis: Match numbers (1-74)
- Y-axis: Points (0-10,000)
- Interactive tooltips and legends
- Current rankings display

## Hooks

### useProgressData
Fetches and processes participant data from all 74 match result files.
- Loads data from `./data/results/match_results_XX.json`
- Calculates cumulative points progression
- Provides participant search functionality

## Types

- `ParticipantProgressData`: Individual participant's complete progress data
- `MatchProgressPoint`: Single match point data
- `ChartData`: Formatted data for chart rendering
- `SelectedParticipant`: Selected participant with color assignment

## Features

- **Multi-participant comparison**: Compare up to 5 participants
- **Interactive search**: Type-ahead participant selection
- **Responsive design**: Works on mobile and desktop
- **Real-time data**: Loads from actual match results
- **Visual indicators**: Color-coded lines and legends 