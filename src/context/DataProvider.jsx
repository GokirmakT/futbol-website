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