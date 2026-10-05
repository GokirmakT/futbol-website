const toNumber = value => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const getPlayedTeamMatches = (matches = [], team) => matches
  .filter(match =>
    (match.homeTeam === team || match.awayTeam === team) &&
    match.winner !== "TBD" &&
    match.goalHome != null &&
    match.goalAway != null
  )
  .map(match => {
    const isHome = match.homeTeam === team;
    const goalsFor = toNumber(isHome ? match.goalHome : match.goalAway);
    const goalsAgainst = toNumber(isHome ? match.goalAway : match.goalHome);
    const cornersFor = toNumber(isHome ? match.cornerHome : match.cornerAway);
    const cornersAgainst = toNumber(isHome ? match.cornerAway : match.cornerHome);
    const yellowFor = toNumber(isHome ? match.yellowHome : match.yellowAway);
    const yellowAgainst = toNumber(isHome ? match.yellowAway : match.yellowHome);
    const redFor = toNumber(isHome ? match.redHome : match.redAway);
    const redAgainst = toNumber(isHome ? match.redAway : match.redHome);
    const shots = toNumber(isHome ? match.shotsHome : match.shotsAway);
    const shotsOnTarget = toNumber(isHome ? match.shotsOnTargetHome : match.shotsOnTargetAway);

    return {
      date: match.date,
      isHome,
      goalsFor,
      goalsAgainst,
      totalGoals: goalsFor + goalsAgainst,
      bothTeamsScored: goalsFor > 0 && goalsAgainst > 0,
      cleanSheet: goalsAgainst === 0,
      failedToScore: goalsFor === 0,
      result: goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D",
      cornersFor,
      cornersAgainst,
      totalCorners: cornersFor + cornersAgainst,
      yellowFor,
      yellowAgainst,
      redFor,
      redAgainst,
      totalYellow: yellowFor + yellowAgainst,
      totalRed: redFor + redAgainst,
      teamPenaltyScore: yellowFor + redFor * 2,
      penaltyScore: yellowFor + yellowAgainst + (redFor + redAgainst) * 2,
      shots,
      shotsOnTarget,
    };
  });

export const countMatches = (matches, predicate) => matches.filter(predicate).length;

export const formatRate = (count, total) => total
  ? `%${Math.round((count / total) * 100)} · ${count}/${total}`
  : "—";

export const formatAverage = (matches, selector) => matches.length
  ? (matches.reduce((sum, match) => sum + selector(match), 0) / matches.length).toFixed(2)
  : "—";