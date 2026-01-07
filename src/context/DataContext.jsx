import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMatches, getStandings } from "../api/api";
import PageLoader from "../Components/LoadingPage.jsx";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [selectedLeague, setSelectedLeague] = useState("Super Lig");

  const {
    data: matches = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  const {
    data: standings = [],
    isLoading: isLoadingStandings,
    error: standingsError,
  } = useQuery({
    queryKey: ["standings"],
    queryFn: () => getStandings(),
  });

  // Lig listesi (GLOBAL)
  const leagues = useMemo(() => {
    if (!matches.length) return [];
    return [...new Set(matches.map(m => m.league))].sort();
  }, [matches]);

  // Gol istatistikleri hesaplaması (GLOBAL)
  const goalStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const hasScoredBothHalves = (minutesStr) => {
      if (!minutesStr) return false;
    
      const minutes = minutesStr.split("|").map(m => {
        if (m.includes("+")) {
          const [base, extra] = m.split("+").map(Number);
          return base + extra; // 45+1 → 46 gibi davranır
        }
        return Number(m);
      });
    
      const scoredFirstHalf = minutes.some(m => m <= 45);
      const scoredSecondHalf = minutes.some(m => m >= 46);
    
      return scoredFirstHalf && scoredSecondHalf;
    };    

    const leagueMatches = matches.filter(m => m.league === selectedLeague && m.winner !== "TBD");
    const teamGoals = {};

    leagueMatches.forEach(match => {
      const totalGoals = match.goalHome + match.goalAway;      

      // Home team
      if (!teamGoals[match.homeTeam]) {
        teamGoals[match.homeTeam] = {
          team: match.homeTeam,
          goalsFor: 0,
          goalsAgainst: 0,
          homeMatchCount: 0,
          awayMatchCount: 0,         
          matchCount: 0,
          totalMatchGoals: 0,

          bts: 0,
          homeBts: 0,
          awayBts: 0,

          bothHalvesScored: 0,
          homeBothHalvesScored: 0,
          awayBothHalvesScored: 0,

          over25Count: 0,
          homeOver25Count: 0,
          awayOver25Count: 0,         

          over35Count: 0,
          homeOver35Count: 0,
          awayOver35Count: 0,

          over45Count: 0,
          homeOver45Count: 0,
          awayOver45Count: 0,

          over15Count: 0,
          homeOver15Count: 0,
          awayOver15Count: 0,

          less25Count: 0,
          homeLess25Count: 0,
          awayLess25Count: 0,         

          less35Count: 0,
          homeLess35Count: 0,
          awayLess35Count: 0,

          less45Count: 0,
          homeLess45Count: 0,
          awayLess45Count: 0,

          less15Count: 0,
          homeLess15Count: 0,
          awayLess15Count: 0
        };
      }

        teamGoals[match.homeTeam].goalsFor += match.goalHome;
        teamGoals[match.homeTeam].goalsAgainst += match.goalAway;
        teamGoals[match.homeTeam].homeMatchCount++;
        teamGoals[match.homeTeam].matchCount++;
        teamGoals[match.homeTeam].totalMatchGoals += totalGoals;

        if (match.goalHome > 0 && match.goalAway > 0) {
          teamGoals[match.homeTeam].bts++;
          teamGoals[match.homeTeam].homeBts++;
        }

        if (totalGoals > 2.5) teamGoals[match.homeTeam].over25Count++;
        if (totalGoals > 2.5) teamGoals[match.homeTeam].homeOver25Count++;   

        if (totalGoals > 3.5) teamGoals[match.homeTeam].over35Count++;
        if (totalGoals > 3.5) teamGoals[match.homeTeam].homeOver35Count++;
       
        if (totalGoals > 4.5) teamGoals[match.homeTeam].over45Count++;
        if (totalGoals > 4.5) teamGoals[match.homeTeam].homeOver45Count++;

        if (totalGoals > 1.5) teamGoals[match.homeTeam].over15Count++;
        if (totalGoals > 1.5) teamGoals[match.homeTeam].homeOver15Count++;
        
        if (totalGoals < 2.5) teamGoals[match.homeTeam].less25Count++;
        if (totalGoals < 2.5) teamGoals[match.homeTeam].homeLess25Count++;   

        if (totalGoals < 3.5) teamGoals[match.homeTeam].less35Count++;
        if (totalGoals < 3.5) teamGoals[match.homeTeam].homeLess35Count++;
       
        if (totalGoals < 4.5) teamGoals[match.homeTeam].less45Count++;
        if (totalGoals < 4.5) teamGoals[match.homeTeam].homeLess45Count++;

        if (totalGoals < 1.5) teamGoals[match.homeTeam].less15Count++;
        if (totalGoals < 1.5) teamGoals[match.homeTeam].homeLess15Count++;

        const homeBothHalves = hasScoredBothHalves(match.homeGoalsMinutes);

        if (homeBothHalves) {
          teamGoals[match.homeTeam].bothHalvesScored++;
          teamGoals[match.homeTeam].homeBothHalvesScored++;
        }


      // Away team
      if (!teamGoals[match.awayTeam]) {
        teamGoals[match.awayTeam] = {
            team: match.awayTeam,
            goalsFor: 0,
            goalsAgainst: 0,
            homeMatchCount: 0,
            awayMatchCount: 0,
            matchCount: 0,
            totalMatchGoals: 0,

            bts: 0,
            homeBts: 0,
            awayBts: 0,

            bothHalvesScored: 0,
            homeBothHalvesScored: 0,
            awayBothHalvesScored: 0,

            over25Count: 0,
            homeOver25Count: 0,
            awayOver25Count: 0,

            over35Count: 0,
            homeOver35Count: 0,
            awayOver35Count: 0,

            over45Count: 0,
            homeOver45Count: 0,
            awayOver45Count: 0,

            over15Count: 0,
            homeOver15Count: 0,
            awayOver15Count: 0,

            less25Count: 0,
            homeLess25Count: 0,
            awayLess25Count: 0,         

            less35Count: 0,
            homeLess35Count: 0,
            awayLess35Count: 0,

            less45Count: 0,
            homeLess45Count: 0,
            awayLess45Count: 0,

            less15Count: 0,
            homeLess15Count: 0,
            awayLess15Count: 0

        };
      }

        teamGoals[match.awayTeam].goalsFor += match.goalAway;
        teamGoals[match.awayTeam].goalsAgainst += match.goalHome;
        teamGoals[match.awayTeam].awayMatchCount++;
        teamGoals[match.awayTeam].matchCount++;
        teamGoals[match.awayTeam].totalMatchGoals += totalGoals;

        if (match.goalHome > 0 && match.goalAway > 0) {
          teamGoals[match.awayTeam].bts++;
          teamGoals[match.awayTeam].awayBts++;
        }

        if (totalGoals > 2.5) teamGoals[match.awayTeam].over25Count++;
        if (totalGoals > 2.5) teamGoals[match.awayTeam].awayOver25Count++;

        if (totalGoals > 3.5) teamGoals[match.awayTeam].over35Count++;
        if (totalGoals > 3.5) teamGoals[match.awayTeam].awayOver35Count++;

        if (totalGoals > 4.5) teamGoals[match.awayTeam].over45Count++;
        if (totalGoals > 4.5) teamGoals[match.awayTeam].awayOver45Count++;

        if (totalGoals > 1.5) teamGoals[match.awayTeam].over15Count++;
        if (totalGoals > 1.5) teamGoals[match.awayTeam].awayOver15Count++;

        if (totalGoals < 2.5) teamGoals[match.awayTeam].less25Count++;
        if (totalGoals < 2.5) teamGoals[match.awayTeam].awayLess25Count++;   

        if (totalGoals < 3.5) teamGoals[match.awayTeam].less35Count++;
        if (totalGoals < 3.5) teamGoals[match.awayTeam].awayLess35Count++;
       
        if (totalGoals < 4.5) teamGoals[match.awayTeam].less45Count++;
        if (totalGoals < 4.5) teamGoals[match.awayTeam].awayLess45Count++;

        if (totalGoals < 1.5) teamGoals[match.awayTeam].less15Count++;
        if (totalGoals < 1.5) teamGoals[match.awayTeam].awayLess15Count++;

        const awayBothHalves = hasScoredBothHalves(match.awayGoalsMinutes);

        if (awayBothHalves) {
          teamGoals[match.awayTeam].bothHalvesScored++;
          teamGoals[match.awayTeam].awayBothHalvesScored++;
        }

    });

    const stats = Object.values(teamGoals).map(team => {
        const avgGoalsFor = team.goalsFor / team.matchCount;
        const avgMatchGoals = team.totalMatchGoals / team.matchCount;

        const btsRate = (team.bts / team.matchCount) * 100;
        const homeBtsRate = (team.homeBts / team.homeMatchCount) * 100;
        const awayBtsRate = (team.awayBts / team.awayMatchCount) * 100;

        const over25Rate = (team.over25Count / team.matchCount) * 100;
        const over35Rate = (team.over35Count / team.matchCount) * 100;
        const over45Rate = (team.over45Count / team.matchCount) * 100;
        const over15Rate = (team.over15Count / team.matchCount) * 100;

        const less25Rate = (team.less25Count / team.matchCount) * 100;
        const less35Rate = (team.less35Count / team.matchCount) * 100;
        const less45Rate = (team.less45Count / team.matchCount) * 100;
        const less15Rate = (team.less15Count / team.matchCount) * 100;

        const homeOver25Rate = (team.homeOver25Count / team.homeMatchCount) * 100;
        const awayOver25Rate = (team.awayOver25Count / team.awayMatchCount) * 100;

        const homeOver35Rate = (team.homeOver35Count / team.homeMatchCount) * 100;
        const awayOver35Rate = (team.awayOver35Count / team.awayMatchCount) * 100;

        const homeOver45Rate = (team.homeOver45Count / team.homeMatchCount) * 100;
        const awayOver45Rate = (team.awayOver45Count / team.awayMatchCount) * 100;

        const homeOver15Rate = (team.homeOver15Count / team.homeMatchCount) * 100;
        const awayOver15Rate = (team.awayOver15Count / team.awayMatchCount) * 100;

        const homeLess25Rate = (team.homeLess25Count / team.homeMatchCount) * 100;
        const awayLess25Rate = (team.awayLess25Count / team.awayMatchCount) * 100;

        const homeLess35Rate = (team.homeLess35Count / team.homeMatchCount) * 100;
        const awayLess35Rate = (team.awayLess35Count / team.awayMatchCount) * 100;

        const homeLess45Rate = (team.homeLess45Count / team.homeMatchCount) * 100;
        const awayLess45Rate = (team.awayLess45Count / team.awayMatchCount) * 100;

        const homeLess15Rate = (team.homeLess15Count / team.homeMatchCount) * 100;
        const awayLess15Rate = (team.awayLess15Count / team.awayMatchCount) * 100;

        const bothHalvesRate = (team.bothHalvesScored / team.matchCount) * 100;
        const homeBothHalvesRate = (team.homeBothHalvesScored / team.homeMatchCount) * 100;
        const awayBothHalvesRate = (team.awayBothHalvesScored / team.awayMatchCount) * 100;

      return {        
        ...team,
        avgGoalsFor,
        avgMatchGoals,

        btsRate,
        homeBtsRate,
        awayBtsRate,

        over25Rate,
        over35Rate,
        over45Rate,   
        over15Rate,        
        
        homeOver25Rate,
        awayOver25Rate,
        homeOver35Rate,
        awayOver35Rate,
        homeOver45Rate,
        awayOver45Rate,
        homeOver15Rate,
        awayOver15Rate,

        less25Rate,
        less35Rate,
        less45Rate,   
        less15Rate,        
        
        homeLess25Rate,
        awayLess25Rate,
        homeLess35Rate,
        awayLess35Rate,
        homeLess45Rate,
        awayLess45Rate,
        homeLess15Rate,
        awayLess15Rate,

        bothHalvesRate,
        homeBothHalvesRate,
        awayBothHalvesRate,

      };
    });

    return stats
      .sort((a, b) => b.over25Rate - a.over25Rate)
      .map((t, i) => ({ ...t, rank: i + 1 }));

  }, [selectedLeague, matches]);

  // Seçilen lige göre kartların sıralaması
  const cardStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const leagueMatches = matches.filter(m => m.league === selectedLeague && m.winner !== "TBD");
    const teamCards = {};

    leagueMatches.forEach(match => {
      const matchTotalYellowCards = match.yellowHome +  match.yellowAway;
      const matchTotalRedCards = match.redHome + match.redAway;

      const totalPenaltyScore = (match.yellowHome * 1) + (match.redHome * 2) + (match.yellowAway * 1) + (match.redAway * 2);

      
      // Home team
      if (!teamCards[match.homeTeam]) {
        teamCards[match.homeTeam] = { 
          team: match.homeTeam, 
          yellowCards: 0,
          redCards: 0,
          matchCount: 0,
          totalMatchCards: 0,

          oppYellow: 0,
          oppRed: 0,
          over25Count: 0,
          over35Count: 0,
          over45Count: 0,
          over55Count: 0,

          RedOver05Count: 0,
          RedOver15Count: 0,
          RedOver25Count: 0,

          penaltyOver25Count: 0,
          penaltyOver35Count: 0,
          penaltyOver45Count: 0,
          penaltyOver55Count: 0,

        };
      }
      teamCards[match.homeTeam].yellowCards += match.yellowHome;
      teamCards[match.homeTeam].redCards += match.redHome;
      teamCards[match.homeTeam].matchCount += 1;
      teamCards[match.homeTeam].totalMatchCards += match.yellowHome;
      teamCards[match.homeTeam].oppYellow += match.yellowAway;
      teamCards[match.homeTeam].oppRed += match.redAway;

      if (matchTotalYellowCards > 3.5) teamCards[match.homeTeam].over35Count++;
      if (matchTotalYellowCards > 4.5) teamCards[match.homeTeam].over45Count++;
      if (matchTotalYellowCards > 5.5) teamCards[match.homeTeam].over55Count++;
      if (matchTotalYellowCards > 2.5) teamCards[match.homeTeam].over25Count++;

      if (matchTotalRedCards > 0.5) teamCards[match.homeTeam].RedOver05Count++;
      if (matchTotalRedCards > 1.5) teamCards[match.homeTeam].RedOver15Count++;
      if (matchTotalRedCards > 2.5) teamCards[match.homeTeam].RedOver25Count++;

      if (totalPenaltyScore > 3.5) teamCards[match.homeTeam].penaltyOver35Count++;
      if (totalPenaltyScore > 4.5) teamCards[match.homeTeam].penaltyOver45Count++;
      if (totalPenaltyScore > 5.5) teamCards[match.homeTeam].penaltyOver55Count++;
      if (totalPenaltyScore > 2.5) teamCards[match.homeTeam].penaltyOver25Count++;

      // Away team
      if (!teamCards[match.awayTeam]) {
        teamCards[match.awayTeam] = { 
          team: match.awayTeam, 
          yellowCards: 0,
          redCards: 0,
          matchCount: 0,
          totalMatchCards: 0,

          oppYellow: 0,
          oppRed: 0,
          over25Count: 0,
          over35Count: 0,
          over45Count: 0,
          over55Count: 0,

          RedOver05Count: 0,
          RedOver15Count: 0,
          RedOver25Count: 0,

          penaltyOver25Count: 0,
          penaltyOver35Count: 0,
          penaltyOver45Count: 0,
          penaltyOver55Count: 0,

        };
      }
      teamCards[match.awayTeam].yellowCards += match.yellowAway;
      teamCards[match.awayTeam].redCards += match.redAway;
      teamCards[match.awayTeam].matchCount += 1;
      teamCards[match.awayTeam].totalMatchCards += match.yellowAway;
      teamCards[match.awayTeam].oppYellow += match.yellowHome;
      teamCards[match.awayTeam].oppRed += match.redHome;

      if (matchTotalYellowCards > 3.5) teamCards[match.awayTeam].over35Count++;
      if (matchTotalYellowCards > 4.5) teamCards[match.awayTeam].over45Count++;
      if (matchTotalYellowCards > 5.5) teamCards[match.awayTeam].over55Count++;
      if (matchTotalYellowCards > 2.5) teamCards[match.awayTeam].over25Count++;

      if (matchTotalRedCards > 0.5) teamCards[match.awayTeam].RedOver05Count++;
      if (matchTotalRedCards > 1.5) teamCards[match.awayTeam].RedOver15Count++;
      if (matchTotalRedCards > 2.5) teamCards[match.awayTeam].RedOver25Count++;

      if (totalPenaltyScore > 3.5) teamCards[match.awayTeam].penaltyOver35Count++;
      if (totalPenaltyScore > 4.5) teamCards[match.awayTeam].penaltyOver45Count++;
      if (totalPenaltyScore > 5.5) teamCards[match.awayTeam].penaltyOver55Count++;
      if (totalPenaltyScore > 2.5) teamCards[match.awayTeam].penaltyOver25Count++;

    });

    // Kart puanı hesapla
    const statsWithScore = Object.values(teamCards).map(team => {

      const totalCardCount = team.yellowCards + team.redCards + team.oppYellow + team.oppRed;
      const avgCardCount = totalCardCount / team.matchCount;

      const totalRedCards = team.redCards;

      const avgMatchCards = team.totalMatchCards / team.matchCount;
      const ownPenalty = (team.yellowCards * 1) + (team.redCards * 2);
      const oppPenalty = (team.oppYellow * 1) + (team.oppRed * 2);

      return {
        ...team,
        cardScore: ownPenalty,
        avgCardScore: ownPenalty / team.matchCount,
        totalCardCount,
        avgCardCount,
        avgMatchCards,
        ownPenalty,
        oppPenalty,
        totalRedCards,

        over25Rate: (team.over25Count / team.matchCount) * 100,        
        over35Rate: (team.over35Count / team.matchCount) * 100,        
        over45Rate: (team.over45Count / team.matchCount) * 100,        
        over55Rate: (team.over55Count / team.matchCount) * 100,

        RedOver05Rate: (team.RedOver05Count / team.matchCount) * 100,
        RedOver15Rate: (team.RedOver15Count / team.matchCount) * 100,
        RedOver25Rate: (team.RedOver25Count / team.matchCount) * 100,

        penaltyOver25Rate: (team.penaltyOver25Count / team.matchCount) * 100,
        penaltyOver35Rate: (team.penaltyOver35Count / team.matchCount) * 100,
        penaltyOver45Rate: (team.penaltyOver45Count / team.matchCount) * 100,
        penaltyOver55Rate: (team.penaltyOver55Count / team.matchCount) * 100,
      };
    });

    // Ortalama kart puanına göre sırala
    return statsWithScore
      .sort((a, b) => b.over25Rate - a.over25Rate)
      .map((team, idx) => ({ ...team, rank: idx + 1 }));
  }, [selectedLeague, matches]);

  // Hesaplama
  const cornerStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const leagueMatches = matches.filter(m => m.league === selectedLeague && m.winner !== "TBD");
    const teamCorners = {};

    leagueMatches.forEach(match => {
      const matchCorners = match.cornerHome + match.cornerAway;

      // Home team
      if (!teamCorners[match.homeTeam]) {
        teamCorners[match.homeTeam] = {
            team: match.homeTeam,
            cornersFor: 0,
            cornersAgainst: 0,
            homeMatchCount: 0,
            awayMatchCount: 0,
            matchCount: 0,
            totalMatchCorners: 0,
            over75Count: 0,
            over85Count: 0,
            over95Count: 0,
            over105Count: 0,

            homeOver35Count: 0,
            awayOver35Count: 0,

            homeOver45Count: 0,
            awayOver45Count: 0,

            homeOver55Count: 0,
            awayOver55Count: 0,

            homeOver65Count: 0,
            awayOver65Count: 0,

            homeOver75Count: 0,
            awayOver75Count: 0,

            homeOver85Count: 0,
            awayOver85Count: 0
        };
      }

        teamCorners[match.homeTeam].cornersFor += match.cornerHome;
        teamCorners[match.homeTeam].cornersAgainst += match.cornerAway;
        teamCorners[match.homeTeam].homeMatchCount++;
        teamCorners[match.homeTeam].matchCount++;
        teamCorners[match.homeTeam].totalMatchCorners += matchCorners;
        if (matchCorners > 7.5) teamCorners[match.homeTeam].over75Count++;
        if (matchCorners > 8.5) teamCorners[match.homeTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.homeTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.homeTeam].over105Count++;

        if (match.cornerHome > 3.5) teamCorners[match.homeTeam].homeOver35Count++;
        if (match.cornerHome > 4.5) teamCorners[match.homeTeam].homeOver45Count++;
        if (match.cornerHome > 5.5) teamCorners[match.homeTeam].homeOver55Count++;
        if (match.cornerHome > 6.5) teamCorners[match.homeTeam].homeOver65Count++;
        if (match.cornerHome > 7.5) teamCorners[match.homeTeam].homeOver75Count++;
        if (match.cornerHome > 8.5) teamCorners[match.homeTeam].homeOver85Count++;


      // Away team
      if (!teamCorners[match.awayTeam]) {
        teamCorners[match.awayTeam] = {
            team: match.awayTeam,
            cornersFor: 0,
            cornersAgainst: 0,
            homeMatchCount: 0,
            awayMatchCount: 0,
            matchCount: 0,
            totalMatchCorners: 0,
            over75Count: 0,
            over85Count: 0,
            over95Count: 0,
            over105Count: 0,

            homeOver35Count: 0,
            awayOver35Count: 0,

            homeOver45Count: 0,
            awayOver45Count: 0,

            homeOver55Count: 0,
            awayOver55Count: 0,

            homeOver65Count: 0,
            awayOver65Count: 0,

            homeOver75Count: 0,
            awayOver75Count: 0,

            homeOver85Count: 0,
            awayOver85Count: 0
            
        };
      }

        teamCorners[match.awayTeam].cornersFor += match.cornerHome;
        teamCorners[match.awayTeam].cornersAgainst += match.cornerAway;
        teamCorners[match.awayTeam].awayMatchCount++;
        teamCorners[match.awayTeam].matchCount++;
        teamCorners[match.awayTeam].totalMatchCorners += matchCorners;
        if (matchCorners > 7.5) teamCorners[match.awayTeam].over75Count++;
        if (matchCorners > 8.5) teamCorners[match.awayTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.awayTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.awayTeam].over105Count++;  
        
        if (match.cornerAway > 3.5) teamCorners[match.awayTeam].awayOver35Count++;
        if (match.cornerAway > 4.5) teamCorners[match.awayTeam].awayOver45Count++;
        if (match.cornerAway > 5.5) teamCorners[match.awayTeam].awayOver55Count++;
        if (match.cornerAway > 6.5) teamCorners[match.awayTeam].awayOver65Count++;
        if (match.cornerAway > 7.5) teamCorners[match.awayTeam].awayOver75Count++;
        if (match.cornerAway > 8.5) teamCorners[match.awayTeam].awayOver85Count++;

    });

    const stats = Object.values(teamCorners).map(team => {
      const cornersUsed = team.cornersFor;
      const cornersAgainst = team.cornersAgainst;
      const avgTeamCorners = team.cornersFor / team.matchCount;
      const avgMatchCorners = team.totalMatchCorners / team.matchCount;

      const over75Rate = (team.over75Count / team.matchCount) * 100;
      const over85Rate = (team.over85Count / team.matchCount) * 100;
      const over95Rate = (team.over95Count / team.matchCount) * 100;
      const over105Rate = (team.over105Count / team.matchCount) * 100;

      const team35Rate = ((team.homeOver35Count + team.awayOver35Count) / team.matchCount) * 100;     
      const team45Rate = ((team.homeOver45Count + team.awayOver45Count) / team.matchCount) * 100;
      const team55Rate = ((team.homeOver55Count + team.awayOver55Count) / team.matchCount) * 100; 
      const team65Rate = ((team.homeOver65Count + team.awayOver65Count) / team.matchCount) * 100;
      const team75Rate = ((team.homeOver75Count + team.awayOver75Count) / team.matchCount) * 100;
      const team85Rate = ((team.homeOver85Count + team.awayOver85Count) / team.matchCount) * 100;  
      
      const avgCornersUsed = (cornersUsed / team.matchCount).toFixed(2);

      return {
        ...team,
        avgTeamCorners,
        avgMatchCorners,
        cornersUsed,
        cornersAgainst,

        over75Rate,
        over85Rate,
        over95Rate,
        over105Rate, 

        team35Rate,
        team45Rate,
        team55Rate,
        team65Rate,
        team75Rate,
        team85Rate,
        
        avgCornersUsed
      };
    });

    return stats
      .sort((a, b) => b.over85Rate - a.over85Rate)
      .map((t, i) => ({ ...t, rank: i + 1 }));

  }, [selectedLeague, matches]);

  const value = {
    matches,
    standings,
    leagues,
    selectedLeague,
    setSelectedLeague,
    isLoading,
    isLoadingStandings,
    error,
    standingsError,
    goalStats,
    cardStats,
    cornerStats
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

export const useData = () => useContext(DataContext);
