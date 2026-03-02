export const IY_MS_PATTERNS = ["1/1", "1/X", "1/2", "X/1", "X/X", "X/2", "2/1", "2/X", "2/2"];

export function getHalfTimeScore(match) {
  const parseMinutes = (minutesStr) => {
    if (!minutesStr) return [];
    return minutesStr.split("|").map(m => {
      if (m.includes("+")) {
        const [base, extra] = m.split("+").map(Number);
        return base + extra;
      }
      return Number(m);
    }).filter(n => !Number.isNaN(n));
  };

  const homeMinutes = parseMinutes(match.homeGoalsMinutes);
  const awayMinutes = parseMinutes(match.awayGoalsMinutes);

  const homeHT = homeMinutes.filter(m => m <= 45).length;
  const awayHT = awayMinutes.filter(m => m <= 45).length;

  return { homeHT, awayHT };
}

export function getIyMsResult(match) {
  const { homeHT, awayHT } = getHalfTimeScore(match);
  const fullHome = match.goalHome ?? 0;
  const fullAway = match.goalAway ?? 0;

  const iy =
    homeHT > awayHT ? "1" :
    homeHT < awayHT ? "2" :
    "X";

  const ms =
    fullHome > fullAway ? "1" :
    fullHome < fullAway ? "2" :
    "X";

  return {
    iy,
    ms,
    pattern: `${iy}/${ms}`,
    homeHT,
    awayHT,
    fullHome,
    fullAway,
  };
}

export function aggregateIyMsStats(matches, teamName) {
  const base = {
    total: 0,
    patterns: IY_MS_PATTERNS.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}),
  };

  const overall = { ...base, patterns: { ...base.patterns } };
  const home = { ...base, patterns: { ...base.patterns } };
  const away = { ...base, patterns: { ...base.patterns } };

  matches.forEach(match => {
    if (match.winner === "TBD") return;
    const isHome = match.homeTeam === teamName;
    const isAway = match.awayTeam === teamName;
    if (!isHome && !isAway) return;

    const { pattern } = getIyMsResult(match);
    if (!IY_MS_PATTERNS.includes(pattern)) return;

    overall.total += 1;
    overall.patterns[pattern] += 1;

    if (isHome) {
      home.total += 1;
      home.patterns[pattern] += 1;
    } else if (isAway) {
      away.total += 1;
      away.patterns[pattern] += 1;
    }
  });

  const calcPercentages = (bucket) => {
    const result = {};
    IY_MS_PATTERNS.forEach(p => {
      const count = bucket.patterns[p];
      result[p] = bucket.total ? (count / bucket.total) * 100 : 0;
    });
    return result;
  };

  const overallPerc = calcPercentages(overall);

  const homePerc = calcPercentages(home);

  const awayPerc = calcPercentages(away);

  const mostFrequentPattern = IY_MS_PATTERNS.reduce(
    (best, p) => {
      const count = overall.patterns[p];
      if (count > best.count) return { pattern: p, count };
      return best;
    },
    { pattern: null, count: 0 }
  );

  return {
    overall,
    home,
    away,
    overallPerc,
    homePerc,
    awayPerc,
    mostFrequentPattern,
  };
}

