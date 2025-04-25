interface MatchResult {
  match_number: number;
  match_title: string;
  teams: {
    team1: string;
    team2: string;
    winner: string;
  };
  participant_scores: ParticipantScore[];
}

interface ParticipantScore {
  rank: number;
  name: string;
  players: PlayerScore[];
  total_points: number;
  rounded_off_total_points: number;
  overall_points: number;
  overall_rank: number;
  overall_rank_change: string;
}

interface PlayerScore {
  player: string;
  is_captain?: boolean;
  points: number;
  effective_points: number;
}

interface Insight {
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

// Function to find participants with significant rank improvements
export function findRisingParticipants(
  matchResults: MatchResult[],
  numMatches: number = 6
): Insight {
  const recentMatches = matchResults
    .sort((a, b) => b.match_number - a.match_number)
    .slice(0, numMatches);
  
  const oldestMatch = recentMatches[numMatches - 1];
  const latestMatch = recentMatches[0];
  
  // Calculate rank changes
  const rankChanges: { [name: string]: number } = {};
  const pointGains: { [name: string]: number } = {};
  
  oldestMatch.participant_scores.forEach(participant => {
    rankChanges[participant.name] = participant.overall_rank;
    pointGains[participant.name] = 0;
  });
  
  recentMatches.forEach(match => {
    match.participant_scores.forEach(participant => {
      if (participant.name in rankChanges) {
        pointGains[participant.name] += participant.total_points;
      }
    });
  });
  
  latestMatch.participant_scores.forEach(participant => {
    if (participant.name in rankChanges) {
      rankChanges[participant.name] = rankChanges[participant.name] - participant.overall_rank;
    }
  });
  
  // Find participants with biggest rank improvements
  const sortedParticipants = Object.entries(rankChanges)
    .filter(([_, change]) => change > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);
  
  if (sortedParticipants.length < 2) {
    return {
      title: "PARTICIPANTS ON THE RISE",
      description: "Notable improvements in the last few matches",
      stats: [
        { label: "No significant rise", value: "No participants showed significant improvement" }
      ]
    };
  }
  
  const [topRiser, secondRiser] = sortedParticipants;
  
  // Find the match that contributed most to their rise
  let keyMatch = recentMatches[0];
  let maxImpact = 0;
  
  recentMatches.forEach(match => {
    const topScore = match.participant_scores.find(p => p.name === topRiser[0])?.rank || 0;
    const secondScore = match.participant_scores.find(p => p.name === secondRiser[0])?.rank || 0;
    const impact = (topScore === 1 ? 3 : topScore <= 3 ? 2 : 1) + 
                   (secondScore === 1 ? 3 : secondScore <= 3 ? 2 : 1);
    
    if (impact > maxImpact) {
      maxImpact = impact;
      keyMatch = match;
    }
  });
  
  return {
    title: `${topRiser[0].toUpperCase()} & ${secondRiser[0].toUpperCase()}'S RISE TO THE TOP`,
    description: `These two participants showed remarkable improvement in the last ${numMatches} matches, gaining significant positions.`,
    stats: [
      { label: `${topRiser[0]}'s Climb`, value: `+${topRiser[1]} positions` },
      { label: `${secondRiser[0]}'s Climb`, value: `+${secondRiser[1]} positions` },
      { label: "Key Match", value: `Match #${keyMatch.match_number}` },
      { label: "Points Gained", value: `${topRiser[0]} (+${pointGains[topRiser[0]]}) | ${secondRiser[0]} (+${pointGains[secondRiser[0]]})` }
    ]
  };
}

// Function to identify each participant's most valuable player
export function findMostValuablePlayers(matchResults: MatchResult[]): Insight {
  const playerPoints: { [participant: string]: { [player: string]: number } } = {};
  const playerAppearances: { [participant: string]: { [player: string]: number } } = {};
  const totalPlayerPoints: { [player: string]: { points: number, appearances: number } } = {};
  
  // Collect data
  matchResults.forEach(match => {
    match.participant_scores.forEach(participant => {
      if (!playerPoints[participant.name]) {
        playerPoints[participant.name] = {};
        playerAppearances[participant.name] = {};
      }
      
      participant.players.forEach(player => {
        const playerName = player.player;
        if (!playerPoints[participant.name][playerName]) {
          playerPoints[participant.name][playerName] = 0;
          playerAppearances[participant.name][playerName] = 0;
        }
        
        playerPoints[participant.name][playerName] += player.effective_points;
        playerAppearances[participant.name][playerName]++;
        
        if (!totalPlayerPoints[playerName]) {
          totalPlayerPoints[playerName] = { points: 0, appearances: 0 };
        }
        totalPlayerPoints[playerName].points += player.effective_points;
        totalPlayerPoints[playerName].appearances++;
      });
    });
  });
  
  // Find most valuable player for each participant
  const mvps: { participant: string, player: string, points: number }[] = [];
  
  Object.entries(playerPoints).forEach(([participant, players]) => {
    const sortedPlayers = Object.entries(players)
      .sort(([, a], [, b]) => b - a);
    
    if (sortedPlayers.length > 0) {
      mvps.push({
        participant,
        player: sortedPlayers[0][0],
        points: Math.round(sortedPlayers[0][1])
      });
    }
  });
  
  // Sort by points
  mvps.sort((a, b) => b.points - a.points);
  
  // Find overall MVP
  const overallMVP = Object.entries(totalPlayerPoints)
    .sort(([, a], [, b]) => b.points - a.points)[0];
    
  return {
    title: "MOST VALUABLE PLAYERS",
    description: "These players contributed the most points to their participants' total scores.",
    stats: [
      { label: `For ${mvps[0].participant}`, value: `${mvps[0].player} (${mvps[0].points} pts)` },
      { label: `For ${mvps[1].participant}`, value: `${mvps[1].player} (${mvps[1].points} pts)` },
      { label: `For ${mvps[2].participant}`, value: `${mvps[2].player} (${mvps[2].points} pts)` },
      { label: "Overall MVP", value: `${overallMVP[0]} (${Math.round(overallMVP[1].points)} pts across ${overallMVP[1].appearances} selections)` }
    ]
  };
}

// Function to analyze captain selection performance
export function analyzeCaptainSelections(matchResults: MatchResult[]): Insight {
  const captainEfficiency: { [participant: string]: { 
    captainPoints: number, 
    regularPoints: number,
    totalSelections: number,
    bestCaptain: { player: string, match: number, points: number },
    worstCaptain: { player: string, match: number, points: number }
  } } = {};
  
  // Collect data
  matchResults.forEach(match => {
    match.participant_scores.forEach(participant => {
      if (!captainEfficiency[participant.name]) {
        captainEfficiency[participant.name] = { 
          captainPoints: 0, 
          regularPoints: 0,
          totalSelections: 0,
          bestCaptain: { player: '', match: 0, points: 0 },
          worstCaptain: { player: '', match: 0, points: 1000 }
        };
      }
      
      let captainPoints = 0;
      let regularPoints = 0;
      
      participant.players.forEach(player => {
        if (player.is_captain) {
          captainPoints += player.effective_points;
          
          // Check for best/worst captain choice
          if (player.effective_points > captainEfficiency[participant.name].bestCaptain.points) {
            captainEfficiency[participant.name].bestCaptain = {
              player: player.player,
              match: match.match_number,
              points: player.effective_points
            };
          }
          
          if (player.effective_points < captainEfficiency[participant.name].worstCaptain.points) {
            captainEfficiency[participant.name].worstCaptain = {
              player: player.player,
              match: match.match_number,
              points: player.effective_points
            };
          }
        } else {
          regularPoints += player.points;
        }
      });
      
      captainEfficiency[participant.name].captainPoints += captainPoints;
      captainEfficiency[participant.name].regularPoints += regularPoints;
      captainEfficiency[participant.name].totalSelections++;
    });
  });
  
  // Calculate efficiency (captain points as % of total)
  const efficiencyData = Object.entries(captainEfficiency)
    .map(([name, data]) => {
      const totalPoints = data.captainPoints + data.regularPoints;
      const efficiency = data.captainPoints / totalPoints;
      return {
        name,
        efficiency: Math.round(efficiency * 100),
        captainPoints: Math.round(data.captainPoints),
        bestCaptain: data.bestCaptain,
        worstCaptain: data.worstCaptain
      };
    })
    .sort((a, b) => b.efficiency - a.efficiency);
  
  // Find best and worst single captain choices
  let bestSingleChoice = { participant: '', player: '', match: 0, points: 0 };
  let worstSingleChoice = { participant: '', player: '', match: 0, points: 1000 };
  
  Object.entries(captainEfficiency).forEach(([participant, data]) => {
    if (data.bestCaptain.points > bestSingleChoice.points) {
      bestSingleChoice = {
        participant,
        player: data.bestCaptain.player,
        match: data.bestCaptain.match,
        points: data.bestCaptain.points
      };
    }
    
    if (data.worstCaptain.points < worstSingleChoice.points) {
      worstSingleChoice = {
        participant,
        player: data.worstCaptain.player,
        match: data.worstCaptain.match,
        points: data.worstCaptain.points
      };
    }
  });
    
  return {
    title: "CAPTAIN SELECTION MASTERS",
    description: "Participants with the most effective captain selections over the season.",
    stats: [
      { label: "Best Picker", value: `${efficiencyData[0].name} (${efficiencyData[0].efficiency}% efficiency)` },
      { label: "Most Captain Points", value: `${efficiencyData.sort((a, b) => b.captainPoints - a.captainPoints)[0].name} (${efficiencyData[0].captainPoints} pts)` },
      { label: "Best Single Choice", value: `${bestSingleChoice.participant} - ${bestSingleChoice.player} in Match #${bestSingleChoice.match} (${Math.round(bestSingleChoice.points)} pts)` },
      { label: "Worst Single Choice", value: `${worstSingleChoice.participant} - ${worstSingleChoice.player} in Match #${worstSingleChoice.match} (${Math.round(worstSingleChoice.points)} pts)` }
    ]
  };
}

// Function to find close position battles
export function findPositionBattles(matchResults: MatchResult[]): Insight {
  const latestMatch = matchResults.sort((a, b) => b.match_number - a.match_number)[0];
  const battles: { 
    position: number, 
    participants: string[], 
    difference: number,
    volatility: { participant: string, changes: number }
  }[] = [];
  
  // Find participants in close competition
  const sortedParticipants = latestMatch.participant_scores
    .sort((a, b) => a.overall_rank - b.overall_rank);
  
  for (let i = 0; i < sortedParticipants.length - 1; i++) {
    const current = sortedParticipants[i];
    const next = sortedParticipants[i + 1];
    
    // Calculate point difference
    const pointDifference = Math.abs(current.overall_points - next.overall_points);
    
    // Check if the difference is close
    if (pointDifference < 150) {
      battles.push({
        position: current.overall_rank,
        participants: [current.name, next.name],
        difference: pointDifference,
        volatility: { participant: '', changes: 0 }
      });
    }
  }
  
  // Calculate position volatility for participants
  const positionChanges: { [participant: string]: number } = {};
  const recentMatches = matchResults
    .sort((a, b) => b.match_number - a.match_number)
    .slice(0, 5);
  
  // For each participant, count how many times their rank changed
  recentMatches.forEach((match, index) => {
    if (index === recentMatches.length - 1) return; // Skip last match in the recent set
    
    const currentMatch = match.participant_scores;
    const nextMatch = recentMatches[index + 1].participant_scores;
    
    currentMatch.forEach(participant => {
      const previousEntry = nextMatch.find(p => p.name === participant.name);
      
      if (previousEntry && previousEntry.overall_rank !== participant.overall_rank) {
        positionChanges[participant.name] = (positionChanges[participant.name] || 0) + 1;
      }
    });
  });
  
  // Find most volatile participant
  const mostVolatile = Object.entries(positionChanges)
    .sort(([, a], [, b]) => b - a)[0] || ['None', 0];
  
  // Update battles with volatility info
  battles.forEach(battle => {
    const volatileParticipant = battle.participants
      .sort((a, b) => (positionChanges[b] || 0) - (positionChanges[a] || 0))[0];
    
    battle.volatility = {
      participant: volatileParticipant,
      changes: positionChanges[volatileParticipant] || 0
    };
  });
  
  // Sort battles by closest difference
  battles.sort((a, b) => a.difference - b.difference);
  
  return {
    title: "POSITION BATTLES",
    description: "These participants are in close competition for positions on the leaderboard.",
    stats: [
      ...battles.slice(0, 3).map(battle => ({
        label: `For #${battle.position} Position`,
        value: `${battle.participants[0]} vs ${battle.participants[1]} (${battle.difference} pts difference)`
      })),
      { label: "Most Volatile", value: `${mostVolatile[0]} (±${mostVolatile[1]} positions in last 4 matches)` }
    ]
  };
}

// Function to identify significant streaks
export function findImpactfulStreaks(matchResults: MatchResult[]): Insight {
  interface StreakData {
    participant: string;
    start: number;
    end: number;
    direction: 'upward' | 'downward';
    positions: number;
    matches: number[];
  }

  const streaks: StreakData[] = [];
  const consistentParticipants: { name: string, matches: number }[] = [];
  const comebacks: { name: string, from: number, to: number, matches: number }[] = [];
  
  // Prepare chronologically sorted matches
  const sortedMatches = matchResults.sort((a, b) => a.match_number - b.match_number);
  
  // Identify all participants
  const allParticipants = new Set<string>();
  sortedMatches.forEach(match => {
    match.participant_scores.forEach(participant => {
      allParticipants.add(participant.name);
    });
  });
  
  // Track rank changes for each participant
  allParticipants.forEach(participant => {
    const rankHistory: { match: number, rank: number }[] = [];
    let noChangeStreak = 0;
    let lastRank = 0;
    
    sortedMatches.forEach(match => {
      const participantData = match.participant_scores.find(p => p.name === participant);
      if (participantData) {
        rankHistory.push({ 
          match: match.match_number, 
          rank: participantData.overall_rank 
        });
        
        // Check for consistent (no change) streaks
        if (rankHistory.length > 1 && participantData.overall_rank === lastRank) {
          noChangeStreak++;
        } else {
          noChangeStreak = 0;
        }
        
        if (noChangeStreak >= 5) {
          // Found a significant no-change streak
          const existingEntry = consistentParticipants.find(p => p.name === participant);
          if (!existingEntry || existingEntry.matches < noChangeStreak) {
            const index = consistentParticipants.findIndex(p => p.name === participant);
            if (index >= 0) {
              consistentParticipants[index] = { name: participant, matches: noChangeStreak };
            } else {
              consistentParticipants.push({ name: participant, matches: noChangeStreak });
            }
          }
        }
        
        lastRank = participantData.overall_rank;
      }
    });
    
    // Now look for significant streaks (3+ matches of continuous improvement or decline)
    let currentStreak: StreakData | null = null;
    
    for (let i = 1; i < rankHistory.length; i++) {
      const prevRank = rankHistory[i - 1].rank;
      const currRank = rankHistory[i].rank;
      const rankDifference = prevRank - currRank;
      
      if (rankDifference > 0) {
        // Rank improved (number got smaller)
        if (currentStreak && currentStreak.direction === 'upward') {
          // Continue existing streak
          currentStreak.end = rankHistory[i].match;
          currentStreak.positions += rankDifference;
          currentStreak.matches.push(rankHistory[i].match);
        } else {
          // Start new streak
          if (currentStreak && currentStreak.matches.length >= 3 && currentStreak.positions >= 3) {
            streaks.push(currentStreak);
          }
          
          currentStreak = {
            participant,
            start: rankHistory[i-1].match,
            end: rankHistory[i].match,
            direction: 'upward',
            positions: rankDifference,
            matches: [rankHistory[i-1].match, rankHistory[i].match]
          };
        }
      } else if (rankDifference < 0) {
        // Rank declined (number got bigger)
        if (currentStreak && currentStreak.direction === 'downward') {
          // Continue existing streak
          currentStreak.end = rankHistory[i].match;
          currentStreak.positions += Math.abs(rankDifference);
          currentStreak.matches.push(rankHistory[i].match);
        } else {
          // Start new streak
          if (currentStreak && currentStreak.matches.length >= 3 && currentStreak.positions >= 3) {
            streaks.push(currentStreak);
          }
          
          currentStreak = {
            participant,
            start: rankHistory[i-1].match,
            end: rankHistory[i].match,
            direction: 'downward',
            positions: Math.abs(rankDifference),
            matches: [rankHistory[i-1].match, rankHistory[i].match]
          };
        }
      } else {
        // No change
        if (currentStreak && currentStreak.matches.length >= 3 && currentStreak.positions >= 3) {
          streaks.push(currentStreak);
        }
        currentStreak = null;
      }
    }
    
    // Check for significant comebacks (large positive rank change over a small number of matches)
    if (rankHistory.length >= 4) {
      const recentMatches = rankHistory.slice(-4);
      const rankChange = recentMatches[0].rank - recentMatches[recentMatches.length - 1].rank;
      
      if (rankChange >= 3) {
        comebacks.push({
          name: participant,
          from: recentMatches[0].rank,
          to: recentMatches[recentMatches.length - 1].rank,
          matches: 4
        });
      }
    }
    
    // Add final streak if it exists
    if (currentStreak && currentStreak.matches.length >= 3 && currentStreak.positions >= 3) {
      streaks.push(currentStreak);
    }
  });
  
  // Sort streaks by impact (positions changed)
  streaks.sort((a, b) => b.positions - a.positions);
  
  // Find best upward and downward streaks
  const upwardStreak = streaks.find(s => s.direction === 'upward');
  const downwardStreak = streaks.find(s => s.direction === 'downward');
  
  // Sort consistent participants by streak length
  consistentParticipants.sort((a, b) => b.matches - a.matches);
  
  // Sort comebacks by magnitude
  comebacks.sort((a, b) => (a.from - a.to) - (b.from - b.to));
  
  return {
    title: "IMPACTFUL STREAKS",
    description: "Series of matches that significantly affected participants' standings.",
    stats: [
      { 
        label: "Upward Streak", 
        value: upwardStreak ? 
          `${upwardStreak.participant}: Matches #${upwardStreak.matches.join('-')} (+${upwardStreak.positions} positions)` : 
          "No significant upward streaks" 
      },
      { 
        label: "Downward Streak", 
        value: downwardStreak ? 
          `${downwardStreak.participant}: Matches #${downwardStreak.matches.join('-')} (-${downwardStreak.positions} positions)` : 
          "No significant downward streaks" 
      },
      { 
        label: "Most Consistent", 
        value: consistentParticipants.length > 0 ? 
          `${consistentParticipants[0].name} (No position change in ${consistentParticipants[0].matches} matches)` : 
          "No notably consistent participants" 
      },
      { 
        label: "Biggest Comeback", 
        value: comebacks.length > 0 ? 
          `${comebacks[0].name} (From #${comebacks[0].from} to #${comebacks[0].to} in ${comebacks[0].matches} matches)` : 
          "No significant comebacks" 
      }
    ]
  };
}

// Function to analyze recent form
export function analyzeRecentForm(matchResults: MatchResult[]): Insight {
  const recentMatches = matchResults
    .sort((a, b) => b.match_number - a.match_number)
    .slice(0, 5);
  
  const formData: { [participant: string]: {
    recentPoints: number[],
    recentAvg: number,
    seasonAvg: number,
    improvement: number
  } } = {};
  
  // Calculate recent form
  recentMatches.forEach(match => {
    match.participant_scores.forEach(participant => {
      if (!formData[participant.name]) {
        formData[participant.name] = {
          recentPoints: [],
          recentAvg: 0,
          seasonAvg: 0,
          improvement: 0
        };
      }
      
      formData[participant.name].recentPoints.push(participant.total_points);
    });
  });
  
  // Calculate season averages
  matchResults.forEach(match => {
    match.participant_scores.forEach(participant => {
      if (formData[participant.name]) {
        formData[participant.name].seasonAvg = 
          match.participant_scores.find(p => p.name === participant.name)?.overall_points || 0;
      }
    });
  });
  
  // Calculate averages and improvements
  Object.keys(formData).forEach(participant => {
    const data = formData[participant];
    
    // Calculate averages only if we have enough data
    if (data.recentPoints.length > 0) {
      data.recentAvg = data.recentPoints.reduce((a, b) => a + b, 0) / data.recentPoints.length;
      
      // Calculate overall season average from the latest match data
      const matchesPlayed = recentMatches.find(m => 
        m.participant_scores.some(p => p.name === participant)
      )?.participant_scores.find(p => p.name === participant)?.overall_rank || 0;
      
      // Calculate improvement compared to season average
      if (matchesPlayed > 5) {
        data.seasonAvg = data.seasonAvg / matchesPlayed;
        data.improvement = data.recentAvg - data.seasonAvg;
      }
    }
  });
  
  // Sort by recent form
  const bestForm = Object.entries(formData)
    .filter(([, data]) => data.recentPoints.length >= 3)
    .sort(([, a], [, b]) => b.recentAvg - a.recentAvg)[0];
  
  const worstForm = Object.entries(formData)
    .filter(([, data]) => data.recentPoints.length >= 3)
    .sort(([, a], [, b]) => a.recentAvg - b.recentAvg)[0];
  
  // Sort by improvement
  const mostImproved = Object.entries(formData)
    .filter(([, data]) => data.recentPoints.length >= 3)
    .sort(([, a], [, b]) => b.improvement - a.improvement)[0];
  
  const mostDeclined = Object.entries(formData)
    .filter(([, data]) => data.recentPoints.length >= 3)
    .sort(([, a], [, b]) => a.improvement - b.improvement)[0];
  
  return {
    title: "LATE SEASON FORM",
    description: "Participants who are showing the best and worst form in recent matches.",
    stats: [
      { 
        label: "Best Form", 
        value: bestForm ? 
          `${bestForm[0]} (${Math.round(bestForm[1].recentAvg)} pts avg last 5 matches)` : 
          "Not enough data" 
      },
      { 
        label: "Worst Form", 
        value: worstForm ? 
          `${worstForm[0]} (${Math.round(worstForm[1].recentAvg)} pts avg last 5 matches)` : 
          "Not enough data" 
      },
      { 
        label: "Most Improved", 
        value: mostImproved ? 
          `${mostImproved[0]} (+${Math.round(mostImproved[1].improvement)} pts avg vs season)` : 
          "Not enough data" 
      },
      { 
        label: "Most Declined", 
        value: mostDeclined ? 
          `${mostDeclined[0]} (${Math.round(mostDeclined[1].improvement)} pts avg vs season)` : 
          "Not enough data" 
      }
    ]
  };
}

// Function to find best average scores (minimum 8 matches)
export function findBestAverages(matchResults: MatchResult[]): Insight {
  const participantMatches: { [participant: string]: number[] } = {};
  
  // Collect all match scores for each participant
  matchResults.forEach(match => {
    match.participant_scores.forEach(participant => {
      if (!participantMatches[participant.name]) {
        participantMatches[participant.name] = [];
      }
      participantMatches[participant.name].push(participant.total_points);
    });
  });
  
  // Calculate averages for participants with at least 8 matches
  const participantAverages = Object.entries(participantMatches)
    .filter(([_, scores]) => scores.length >= 8)
    .map(([name, scores]) => {
      const sum = scores.reduce((total, score) => total + score, 0);
      return {
        name,
        average: sum / scores.length,
        matches: scores.length
      };
    })
    .sort((a, b) => b.average - a.average);
  
  // Get top 3
  const top3 = participantAverages.slice(0, 3);
  
  return {
    title: "BEST MATCH AVERAGES",
    description: "Participants with the highest average points per match (minimum 8 matches played).",
    stats: [
      { label: "1st Place", value: `${top3[0].name} (${top3[0].average.toFixed(1)} pts/match)` },
      { label: "2nd Place", value: `${top3[1].name} (${top3[1].average.toFixed(1)} pts/match)` },
      { label: "3rd Place", value: `${top3[2].name} (${top3[2].average.toFixed(1)} pts/match)` },
      { label: "Matches Considered", value: "8+" }
    ]
  };
}

// Function to find highest single match scores
export function findHighestSingleMatchScores(matchResults: MatchResult[]): Insight {
  // Collect all participant scores across all matches
  const allScores: { participant: string, match: number, score: number }[] = [];
  let totalScores = 0;
  let scoreCount = 0;
  
  matchResults.forEach(match => {
    match.participant_scores.forEach(participant => {
      allScores.push({
        participant: participant.name,
        match: match.match_number,
        score: participant.total_points
      });
      totalScores += participant.total_points;
      scoreCount++;
    });
  });
  
  // Sort by score (highest first)
  const sortedScores = allScores.sort((a, b) => b.score - a.score);
  
  // Get top 3
  const top3 = sortedScores.slice(0, 3);
  
  // Calculate average score across all matches
  const averageScore = totalScores / scoreCount;
  
  return {
    title: "HIGHEST SINGLE MATCH SCORES",
    description: "The most points scored by participants in a single match.",
    stats: [
      { label: "1st Place", value: `${top3[0].participant} (${Math.round(top3[0].score)} pts in Match #${top3[0].match})` },
      { label: "2nd Place", value: `${top3[1].participant} (${Math.round(top3[1].score)} pts in Match #${top3[1].match})` },
      { label: "3rd Place", value: `${top3[2].participant} (${Math.round(top3[2].score)} pts in Match #${top3[2].match})` },
      { label: "Season Average", value: `${averageScore.toFixed(1)} pts/match` }
    ]
  };
}

// Function to calculate captain point ratio
export function findCaptainPointRatios(matchResults: MatchResult[]): Insight {
  const captainStats: { [participant: string]: { captainPoints: number, regularPoints: number } } = {};
  
  // Collect data
  matchResults.forEach(match => {
    match.participant_scores.forEach(participant => {
      if (!captainStats[participant.name]) {
        captainStats[participant.name] = { captainPoints: 0, regularPoints: 0 };
      }
      
      participant.players.forEach(player => {
        if (player.is_captain) {
          captainStats[participant.name].captainPoints += player.effective_points;
        } else {
          captainStats[participant.name].regularPoints += player.points;
        }
      });
    });
  });
  
  // Calculate ratios
  const participantRatios = Object.entries(captainStats)
    .filter(([_, stats]) => stats.regularPoints > 0) // Avoid division by zero
    .map(([name, stats]) => ({
      name,
      ratio: stats.captainPoints / stats.regularPoints
    }))
    .sort((a, b) => b.ratio - a.ratio);
  
  // Get top 3
  const top3 = participantRatios.slice(0, 3);
  
  // Calculate league average
  const totalCaptainPoints = Object.values(captainStats).reduce((sum, stats) => sum + stats.captainPoints, 0);
  const totalRegularPoints = Object.values(captainStats).reduce((sum, stats) => sum + stats.regularPoints, 0);
  const leagueAverage = totalCaptainPoints / totalRegularPoints;
  
  return {
    title: "CAPTAIN POINT RATIO CHAMPIONS",
    description: "Participants with the highest ratio of captain points to non-captain points.",
    stats: [
      { label: "1st Place", value: `${top3[0].name} (${top3[0].ratio.toFixed(2)} ratio)` },
      { label: "2nd Place", value: `${top3[1].name} (${top3[1].ratio.toFixed(2)} ratio)` },
      { label: "3rd Place", value: `${top3[2].name} (${top3[2].ratio.toFixed(2)} ratio)` },
      { label: "League Average", value: `${leagueAverage.toFixed(2)} ratio` }
    ]
  };
}

// Main function to generate all insights
export async function generateInsights(): Promise<Insight[]> {
  try {
    const response = await fetch('/api/matches');
    if (!response.ok) {
      throw new Error('Failed to fetch match data');
    }
    
    // Fetch raw match data - using any here since the API might return a different structure
    // than our Match interface
    const matchData: any[] = await response.json();
    
    // Transform match data into the format needed for analysis
    const matchResults: MatchResult[] = matchData.map(match => ({
      match_number: parseInt(match.id) || 0,  // Fallback to 0 if parsing fails
      match_title: `${match.team_1} vs ${match.team_2}`,
      teams: {
        team1: match.team_1,
        team2: match.team_2,
        winner: match.winner || ''  // Fallback to empty string if winner is not specified
      },
      participant_scores: (match.scores || []).map((score: any) => ({
        rank: score.rank || 0,
        name: score.participantName || '',
        players: (score.playerScores || []).map((playerScore: any) => ({
          player: playerScore.playerName || '',
          is_captain: playerScore.isCaptain || false,
          points: playerScore.points || 0,
          effective_points: playerScore.effectivePoints || 0
        })),
        total_points: score.totalPoints || 0,
        rounded_off_total_points: score.roundedOffTotalPoints || 0,
        overall_points: score.overallPoints || 0,
        overall_rank: score.overallRank || 0,
        overall_rank_change: score.overallRankChange || ''
      }))
    }));
    
    // Generate insights
    const insights = [
      findRisingParticipants(matchResults),
      findMostValuablePlayers(matchResults),
      analyzeCaptainSelections(matchResults),
      findBestAverages(matchResults),
      findHighestSingleMatchScores(matchResults),
      findCaptainPointRatios(matchResults),
      findPositionBattles(matchResults),
      findImpactfulStreaks(matchResults),
      analyzeRecentForm(matchResults)
    ];
    
    return insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
} 