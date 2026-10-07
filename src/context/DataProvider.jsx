import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  getMatchAnalysis,
  getMatchFixtures,
  getMatchOptions,
  getTeamMatches,
  getStandings,
  getCardStats,
  getGoalStats,
  getCornerStats,
} from "../api/api";
import PageLoader from "../Components/LoadingPage.jsx";
import { DataContext } from "./DataContext";

const DataProvider = ({ children }) => {
  const [selectedLeague, setSelectedLeague] = useState("Super Lig");
  const [selectedSeason, setSelectedSeason] = useState(null);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const currentPath = pathname.toLowerCase();
  const isStandingsPage = isAuthenticated && currentPath.startsWith("/lig/");
  const isCardPage = isAuthenticated && currentPath === "/cards";
  const isGoalPage = isAuthenticated && currentPath === "/goals";
  const isCornerPage = isAuthenticated && currentPath === "/corners";

  const {
    data: matchOptions,
    isLoading: isLoadingMatchOptions,
    error: matchOptionsError,
  } = useQuery({
    queryKey: ["matchOptions"],
    queryFn: getMatchOptions,
  });

  const seasons = matchOptions?.seasons ?? [];
  const defaultSeason =
    matchOptions?.defaultSeason ?? [...seasons].sort().at(-1) ?? null;
  const activeSeason = selectedSeason ?? defaultSeason;
  const routeParts = useMemo(
    () => pathname
      .split("/")
      .filter(Boolean)
      .map(part => {
        try {
          return decodeURIComponent(part);
        } catch (error) {
          if (error instanceof URIError) return part;
          throw error;
        }
      }),
    [pathname]
  );

  const matchRequest = useMemo(() => {
    if (currentPath.startsWith("/team/") && routeParts[2]) {
      return { type: "team", teams: [routeParts[2]] };
    }
    if (currentPath.startsWith("/match/") && routeParts[2] && routeParts[3]) {
      return { type: "team", teams: [routeParts[2], routeParts[3]] };
    }
    if (currentPath.startsWith("/lig/")) {
      return { type: "fixtures", season: activeSeason };
    }
    if (currentPath === "/goals" || currentPath === "/cards" || currentPath === "/corners" || currentPath === "/iy-ms") {
      return { type: "analysis", season: activeSeason, league: selectedLeague };
    }
    if (currentPath === "/statistics" || currentPath === "/todaymatches") {
      return { type: "analysis", season: activeSeason };
    }
    return { type: "fixtures", season: activeSeason };
  }, [activeSeason, currentPath, routeParts, selectedLeague]);

  const {
    data: matches = [],
    isLoading: isLoadingMatches,
    error: matchesError,
  } = useQuery({
    queryKey: ["matches", matchRequest],
    queryFn: async () => {
      if (matchRequest.type === "team") {
        const teamMatches = await Promise.all(
          matchRequest.teams.map(team => getTeamMatches(team))
        );
        return [...new Map(teamMatches.flat().map(match => [match.id, match])).values()];
      }

      if (matchRequest.type === "fixtures") {
        return getMatchFixtures({ season: matchRequest.season });
      }

      return getMatchAnalysis({
        season: matchRequest.season,
        league: matchRequest.league,
      });
    },
    enabled: Boolean(activeSeason),
  });

  const isLoading = isLoadingMatchOptions || isLoadingMatches;
  const error = matchOptionsError || matchesError;

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
    enabled: isStandingsPage && Boolean(activeSeason),
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
    enabled: isCardPage && Boolean(activeSeason && selectedLeague),
    select: data => (Array.isArray(data) ? data : []),
  });

  const {
    data: apiGoalStats = [],
    isLoading: isLoadingGoals,
    error: goalsError,
  } = useQuery({
    queryKey: ["goalStats", activeSeason, selectedLeague],
    queryFn: () => getGoalStats(activeSeason, selectedLeague),
    enabled: isGoalPage && Boolean(activeSeason && selectedLeague),
    select: data => (Array.isArray(data) ? data : []),
  });

  const {
    data: apiCornerStats = [],
    isLoading: isLoadingCorners,
    error: cornersError,
  } = useQuery({
    queryKey: ["cornerStats", activeSeason, selectedLeague],
    queryFn: () => getCornerStats(activeSeason, selectedLeague),
    enabled: isCornerPage && Boolean(activeSeason && selectedLeague),
    select: data => (Array.isArray(data) ? data : []),
  });
  // Lig listesi (seçili sezon)
  const leagues = useMemo(() => {
    return matchOptions?.leaguesBySeason?.[activeSeason] ?? [];
  }, [activeSeason, matchOptions]);

  // Tüm ligler için istatistikler (Bugünkü Maçlar – her maç kendi ligine göre)
  const goalStatsByLeague = useMemo(() => {
    if (pathname.toLowerCase() !== "/todaymatches" && isAuthenticated) return {};
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
  }, [pathname, isAuthenticated, seasonMatches, leagues]);

  const cardStatsByLeague = useMemo(() => {
    if (pathname.toLowerCase() !== "/todaymatches" && isAuthenticated) return {};
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
  }, [pathname, isAuthenticated, seasonMatches, leagues]);

  const cornerStatsByLeague = useMemo(() => {
    if (pathname.toLowerCase() !== "/todaymatches" && isAuthenticated) return {};
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
  }, [pathname, isAuthenticated, seasonMatches, leagues]);

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