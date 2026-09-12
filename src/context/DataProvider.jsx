import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMatches,
  getStandings,
  getCardStats,
  getGoalStats,
  getCornerStats,
} from "../api/api";
import PageLoader from "../Components/LoadingPage.jsx";
import { DataContext } from "./DataContext";

const DataProvider = ({ children }) => {
  const [selectedLeague, setSelectedLeague] = useState("Super Lig");
  const [selectedSeason, setSelectedSeason] = useState("2026-2027");

  const {
    data: matches = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  const seasons = useMemo(() => {
    if (!Array.isArray(matches) || !matches.length) return [];
    return [...new Set(matches.map(m => m.season).filter(Boolean))].sort();
  }, [matches]);

  const defaultSeason = useMemo(() => {
    if (!seasons.length) return null;
    const latestWithCompletedMatches = [...seasons]
      .reverse()
      .find(season =>
        matches.some(m => m.season === season && m.winner !== "TBD")
      );
    return latestWithCompletedMatches || seasons[seasons.length - 1];
  }, [matches, seasons]);

  const activeSeason = selectedSeason ?? defaultSeason;

  const seasonMatches = useMemo(() => {
    if (!activeSeason || !Array.isArray(matches)) return [];
    return matches.filter(m => m.season === activeSeason);
  }, [matches, activeSeason]);

  const {
    data: standings = [],
    isLoading: isLoadingStandings,
    error: standingsError,
  } = useQuery({
    queryKey: ["standings", activeSeason],
    queryFn: () => getStandings(null, activeSeason),
    enabled: Boolean(activeSeason),
  });

  const filteredStandings = useMemo(() => {
    if (!activeSeason || !Array.isArray(standings)) return [];
    return standings.filter(s => (s.season || s.Season) === activeSeason);
  }, [standings, activeSeason]);
  
  const {
    data: cardStats = [],
    isLoading: isLoadingCards,
    error: cardsError,
  } = useQuery({
    queryKey: ["cardStats", activeSeason, selectedLeague],
    queryFn: () => getCardStats(activeSeason, selectedLeague),
    enabled: Boolean(activeSeason && selectedLeague),
    select: data => (Array.isArray(data) ? data : []),
  });

  const {
    data: apiGoalStats = [],
    isLoading: isLoadingGoals,
    error: goalsError,
  } = useQuery({
    queryKey: ["goalStats", activeSeason, selectedLeague],
    queryFn: () => getGoalStats(activeSeason, selectedLeague),
    enabled: Boolean(activeSeason && selectedLeague),
    select: data => (Array.isArray(data) ? data : []),
  });

  const {
    data: apiCornerStats = [],
    isLoading: isLoadingCorners,
    error: cornersError,
  } = useQuery({
    queryKey: ["cornerStats", activeSeason, selectedLeague],
    queryFn: () => getCornerStats(activeSeason, selectedLeague),
    enabled: Boolean(activeSeason && selectedLeague),
    select: data => (Array.isArray(data) ? data : []),
  });

  // Lig listesi (seçili sezon)
  const leagues = useMemo(() => {
    if (!Array.isArray(seasonMatches) || !seasonMatches.length) return [];
    return [...new Set(seasonMatches.map(m => m.league))].sort();
  }, [seasonMatches]);

  /*
  // Gol istatistikleri hesaplaması (seçili lig)
  const localGoalStats = useMemo(() => {
    if (!selectedLeague || !Array.isArray(seasonMatches) || !seasonMatches.length) return [];

    const hasScoredBothHalves = (minutesStr) => {
      if (!minutesStr) return false;
      const minutes = minutesStr.split("|").map(m => {
        if (m.includes("+")) {
          const [base, extra] = m.split("+").map(Number);
          return base + extra;
        }
        return Number(m);
      });
      const scoredFirstHalf = minutes.some(m => m <= 45);
      const scoredSecondHalf = minutes.some(m => m >= 46);
      return scoredFirstHalf && scoredSecondHalf;
    };

    const leagueMatches = seasonMatches.filter(m => m.league === selectedLeague && m.winner !== "TBD");
    const teamGoals = {};

    leagueMatches.forEach(match => {
      const totalGoals = match.goalHome + match.goalAway;
      if (!teamGoals[match.homeTeam]) {
        teamGoals[match.homeTeam] = {
          team: match.homeTeam,
          goalsFor: 0, goalsAgainst: 0, homeMatchCount: 0, awayMatchCount: 0, matchCount: 0, totalMatchGoals: 0,
          bts: 0, homeBts: 0, awayBts: 0, bothHalvesScored: 0, homeBothHalvesScored: 0, awayBothHalvesScored: 0,
          over25Count: 0, homeOver25Count: 0, awayOver25Count: 0, over35Count: 0, homeOver35Count: 0, awayOver35Count: 0,
          over45Count: 0, homeOver45Count: 0, awayOver45Count: 0, over15Count: 0, homeOver15Count: 0, awayOver15Count: 0,
          less25Count: 0, homeLess25Count: 0, awayLess25Count: 0, less35Count: 0, homeLess35Count: 0, awayLess35Count: 0,
          less45Count: 0, homeLess45Count: 0, awayLess45Count: 0, less15Count: 0, homeLess15Count: 0, awayLess15Count: 0,
        };
      }
      teamGoals[match.homeTeam].goalsFor += match.goalHome;
      teamGoals[match.homeTeam].goalsAgainst += match.goalAway;
      teamGoals[match.homeTeam].homeMatchCount++;
      teamGoals[match.homeTeam].matchCount++;
      teamGoals[match.homeTeam].totalMatchGoals += totalGoals;
      if (match.goalHome > 0 && match.goalAway > 0) teamGoals[match.homeTeam].bts++;
      if (match.goalHome > 0 && match.goalAway > 0) teamGoals[match.homeTeam].homeBts++;
      if (totalGoals > 2.5) { teamGoals[match.homeTeam].over25Count++; teamGoals[match.homeTeam].homeOver25Count++; }
      if (totalGoals > 3.5) { teamGoals[match.homeTeam].over35Count++; teamGoals[match.homeTeam].homeOver35Count++; }
      if (totalGoals > 4.5) { teamGoals[match.homeTeam].over45Count++; teamGoals[match.homeTeam].homeOver45Count++; }
      if (totalGoals > 1.5) { teamGoals[match.homeTeam].over15Count++; teamGoals[match.homeTeam].homeOver15Count++; }
      if (totalGoals < 2.5) { teamGoals[match.homeTeam].less25Count++; teamGoals[match.homeTeam].homeLess25Count++; }
      if (totalGoals < 3.5) { teamGoals[match.homeTeam].less35Count++; teamGoals[match.homeTeam].homeLess35Count++; }
      if (totalGoals < 4.5) { teamGoals[match.homeTeam].less45Count++; teamGoals[match.homeTeam].homeLess45Count++; }
      if (totalGoals < 1.5) { teamGoals[match.homeTeam].less15Count++; teamGoals[match.homeTeam].homeLess15Count++; }
      if (hasScoredBothHalves(match.homeGoalsMinutes)) teamGoals[match.homeTeam].homeBothHalvesScored++;

      if (!teamGoals[match.awayTeam]) {
        teamGoals[match.awayTeam] = {
          team: match.awayTeam,
          goalsFor: 0, goalsAgainst: 0, homeMatchCount: 0, awayMatchCount: 0, matchCount: 0, totalMatchGoals: 0,
          bts: 0, homeBts: 0, awayBts: 0, bothHalvesScored: 0, homeBothHalvesScored: 0, awayBothHalvesScored: 0,
          over25Count: 0, homeOver25Count: 0, awayOver25Count: 0, over35Count: 0, homeOver35Count: 0, awayOver35Count: 0,
          over45Count: 0, homeOver45Count: 0, awayOver45Count: 0, over15Count: 0, homeOver15Count: 0, awayOver15Count: 0,
          less25Count: 0, homeLess25Count: 0, awayLess25Count: 0, less35Count: 0, homeLess35Count: 0, awayLess35Count: 0,
          less45Count: 0, homeLess45Count: 0, awayLess45Count: 0, less15Count: 0, homeLess15Count: 0, awayLess15Count: 0,
        };
      }
      teamGoals[match.awayTeam].goalsFor += match.goalAway;
      teamGoals[match.awayTeam].goalsAgainst += match.goalHome;
      teamGoals[match.awayTeam].awayMatchCount++;
      teamGoals[match.awayTeam].matchCount++;
      teamGoals[match.awayTeam].totalMatchGoals += totalGoals;
      if (match.goalHome > 0 && match.goalAway > 0) teamGoals[match.awayTeam].bts++;
      if (match.goalHome > 0 && match.goalAway > 0) teamGoals[match.awayTeam].awayBts++;
      if (totalGoals > 2.5) { teamGoals[match.awayTeam].over25Count++; teamGoals[match.awayTeam].awayOver25Count++; }
      if (totalGoals > 3.5) { teamGoals[match.awayTeam].over35Count++; teamGoals[match.awayTeam].awayOver35Count++; }
      if (totalGoals > 4.5) { teamGoals[match.awayTeam].over45Count++; teamGoals[match.awayTeam].awayOver45Count++; }
      if (totalGoals > 1.5) { teamGoals[match.awayTeam].over15Count++; teamGoals[match.awayTeam].awayOver15Count++; }
      if (totalGoals < 2.5) { teamGoals[match.awayTeam].less25Count++; teamGoals[match.awayTeam].awayLess25Count++; }
      if (totalGoals < 3.5) { teamGoals[match.awayTeam].less35Count++; teamGoals[match.awayTeam].awayLess35Count++; }
      if (totalGoals < 4.5) { teamGoals[match.awayTeam].less45Count++; teamGoals[match.awayTeam].awayLess45Count++; }
      if (totalGoals < 1.5) { teamGoals[match.awayTeam].less15Count++; teamGoals[match.awayTeam].awayLess15Count++; }
      if (hasScoredBothHalves(match.awayGoalsMinutes)) teamGoals[match.awayTeam].awayBothHalvesScored++;
    });

    const stats = Object.values(teamGoals).map(team => ({
      ...team,
      avgGoalsFor: team.goalsFor / team.matchCount,
      avgMatchGoals: team.totalMatchGoals / team.matchCount,
      btsRate: (team.bts / team.matchCount) * 100,
      homeBtsRate: team.homeMatchCount ? (team.homeBts / team.homeMatchCount) * 100 : 0,
      awayBtsRate: team.awayMatchCount ? (team.awayBts / team.awayMatchCount) * 100 : 0,
      over25Rate: (team.over25Count / team.matchCount) * 100,
      over35Rate: (team.over35Count / team.matchCount) * 100,
      over45Rate: (team.over45Count / team.matchCount) * 100,
      over15Rate: (team.over15Count / team.matchCount) * 100,
      less25Rate: (team.less25Count / team.matchCount) * 100,
      less35Rate: (team.less35Count / team.matchCount) * 100,
      less45Rate: (team.less45Count / team.matchCount) * 100,
      less15Rate: (team.less15Count / team.matchCount) * 100,
      homeOver25Rate: team.homeMatchCount ? (team.homeOver25Count / team.homeMatchCount) * 100 : 0,
      awayOver25Rate: team.awayMatchCount ? (team.awayOver25Count / team.awayMatchCount) * 100 : 0,
      homeOver35Rate: team.homeMatchCount ? (team.homeOver35Count / team.homeMatchCount) * 100 : 0,
      awayOver35Rate: team.awayMatchCount ? (team.awayOver35Count / team.awayMatchCount) * 100 : 0,
      homeOver45Rate: team.homeMatchCount ? (team.homeOver45Count / team.homeMatchCount) * 100 : 0,
      awayOver45Rate: team.awayMatchCount ? (team.awayOver45Count / team.awayMatchCount) * 100 : 0,
      homeOver15Rate: team.homeMatchCount ? (team.homeOver15Count / team.homeMatchCount) * 100 : 0,
      awayOver15Rate: team.awayMatchCount ? (team.awayOver15Count / team.awayMatchCount) * 100 : 0,
      homeLess25Rate: team.homeMatchCount ? (team.homeLess25Count / team.homeMatchCount) * 100 : 0,
      awayLess25Rate: team.awayMatchCount ? (team.awayLess25Count / team.awayMatchCount) * 100 : 0,
      homeLess35Rate: team.homeMatchCount ? (team.homeLess35Count / team.homeMatchCount) * 100 : 0,
      awayLess35Rate: team.awayMatchCount ? (team.awayLess35Count / team.awayMatchCount) * 100 : 0,
      homeLess45Rate: team.homeMatchCount ? (team.homeLess45Count / team.homeMatchCount) * 100 : 0,
      awayLess45Rate: team.awayMatchCount ? (team.awayLess45Count / team.awayMatchCount) * 100 : 0,
      homeLess15Rate: team.homeMatchCount ? (team.homeLess15Count / team.homeMatchCount) * 100 : 0,
      awayLess15Rate: team.awayMatchCount ? (team.awayLess15Count / team.awayMatchCount) * 100 : 0,
      bothHalvesRate: (team.homeBothHalvesScored + team.awayBothHalvesScored) / team.matchCount * 100,
      homeBothHalvesRate: team.homeMatchCount ? (team.homeBothHalvesScored / team.homeMatchCount) * 100 : 0,
      awayBothHalvesRate: team.awayMatchCount ? (team.awayBothHalvesScored / team.awayMatchCount) * 100 : 0,
    }));
    return stats.sort((a, b) => b.over25Rate - a.over25Rate).map((t, i) => ({ ...t, rank: i + 1 }));
  }, [selectedLeague, seasonMatches]);
  */

  // Tüm ligler için istatistikler (Bugünkü Maçlar – her maç kendi ligine göre)
  const goalStatsByLeague = useMemo(() => {
    const result = {};
    leagues.forEach(leagueName => {
      const leagueMatches = seasonMatches.filter(m => m.league === leagueName && m.winner !== "TBD");
      const teamGoals = {};
      leagueMatches.forEach(match => {
        const totalGoals = match.goalHome + match.goalAway;
        if (!teamGoals[match.homeTeam]) {
          teamGoals[match.homeTeam] = { team: match.homeTeam, matchCount: 0, over25Count: 0 };
        }
        teamGoals[match.homeTeam].matchCount++;
        if (totalGoals > 1.5) teamGoals[match.homeTeam].over15Count++;
        if (totalGoals > 2.5) teamGoals[match.homeTeam].over25Count++;
        if (totalGoals > 3.5) teamGoals[match.homeTeam].over35Count++;

        if (!teamGoals[match.awayTeam]) {
          teamGoals[match.awayTeam] = { team: match.awayTeam, matchCount: 0, over25Count: 0 };
        }
        teamGoals[match.awayTeam].matchCount++;
        if (totalGoals > 1.5) teamGoals[match.awayTeam].over15Count++;
        if (totalGoals > 2.5) teamGoals[match.awayTeam].over25Count++;
        if (totalGoals > 3.5) teamGoals[match.awayTeam].over35Count++;
      });
      result[leagueName] = Object.values(teamGoals).map(t => ({
        team: t.team,
        over25Rate: (t.over25Count / t.matchCount) * 100,
      }));
    });
    return result;
  }, [seasonMatches, leagues]);

  const cardStatsByLeague = useMemo(() => {
    const result = {};
    leagues.forEach(leagueName => {
      const leagueMatches = seasonMatches.filter(m => m.league === leagueName && m.winner !== "TBD");
      const teamCards = {};
      leagueMatches.forEach(match => {
        const matchTotalPenaltyScore = (match.yellowHome * 1) + (match.redHome * 2) + (match.yellowAway * 1) + (match.redAway * 2);
        if (!teamCards[match.homeTeam]) {
          teamCards[match.homeTeam] = { team: match.homeTeam, matchCount: 0, penaltyOver25Count: 0, penaltyOver35Count: 0 };
        }
        teamCards[match.homeTeam].matchCount++;
        if (matchTotalPenaltyScore > 2.5) teamCards[match.homeTeam].penaltyOver25Count++;
        if (matchTotalPenaltyScore > 3.5) teamCards[match.homeTeam].penaltyOver35Count++;

        if (!teamCards[match.awayTeam]) {
          teamCards[match.awayTeam] = { team: match.awayTeam, matchCount: 0, penaltyOver25Count: 0, penaltyOver35Count: 0 };
        }
        teamCards[match.awayTeam].matchCount++;
        if (matchTotalPenaltyScore > 2.5) teamCards[match.awayTeam].penaltyOver25Count++;
        if (matchTotalPenaltyScore > 3.5) teamCards[match.awayTeam].penaltyOver35Count++;
      });
      result[leagueName] = Object.values(teamCards).map(t => ({
        team: t.team,
        penaltyOver25Rate: (t.penaltyOver25Count / t.matchCount) * 100,
        penaltyOver35Rate: (t.penaltyOver35Count / t.matchCount) * 100,
        penaltyOver45Rate: (t.penaltyOver45Count / t.matchCount) * 100,
      }));
    });
    return result;
  }, [seasonMatches, leagues]);

  const cornerStatsByLeague = useMemo(() => {
    const result = {};
    leagues.forEach(leagueName => {
      const leagueMatches = seasonMatches.filter(m => m.league === leagueName && m.winner !== "TBD");
      const teamCorners = {};
      leagueMatches.forEach(match => {
        const matchCorners = match.cornerHome + match.cornerAway;
        if (!teamCorners[match.homeTeam]) {
          teamCorners[match.homeTeam] = { team: match.homeTeam, matchCount: 0, over85Count: 0, over95Count: 0, over105Count: 0};
        }
        teamCorners[match.homeTeam].matchCount++;
        if (matchCorners > 8.5) teamCorners[match.homeTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.homeTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.homeTeam].over105Count++;

        if (!teamCorners[match.awayTeam]) {
          teamCorners[match.awayTeam] = { team: match.awayTeam, matchCount: 0, over85Count: 0, over95Count: 0, over105Count: 0};
        }
        teamCorners[match.awayTeam].matchCount++;
        if (matchCorners > 8.5) teamCorners[match.awayTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.awayTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.awayTeam].over105Count++;
      });
      result[leagueName] = Object.values(teamCorners).map(t => ({
        team: t.team,
        over85Rate: (t.over85Count / t.matchCount) * 100,
        over95Rate: (t.over95Count / t.matchCount) * 100,
        over105Rate: (t.over105Count / t.matchCount) * 100,
      }));
    });
    return result;
  }, [seasonMatches, leagues]);

  const value = {
    matches,
    seasonMatches,
    standings: filteredStandings,
    leagues,
    seasons,
    selectedLeague,
    setSelectedLeague,
    selectedSeason: activeSeason,
    setSelectedSeason,
    isLoading,
    isLoadingCards,
    isLoadingGoals,
    isLoadingCorners,
    isLoadingStandings,
    error,
    cardsError,
    goalsError,
    cornersError,
    standingsError,
    goalStats: apiGoalStats,
    cardStats,
    cornerStats: apiCornerStats,
    goalStatsByLeague,
    cardStatsByLeague,
    cornerStatsByLeague,
  };
   
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;