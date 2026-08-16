import { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell, TableHead, TableContainer
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import { useData } from "../context/DataContext";
import { getTeamLogo } from "../Components/teamLogos.js";
import football from "/football.png";
import card from "/yellow-card.png";
import corner from "/corner.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

function TodayMatches() {
  const { goalStatsByLeague, cornerStatsByLeague, cardStatsByLeague, matches, seasons, selectedSeason, isLoading, error } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLeague, setSelectedLeague] = useState("ALL");

  const currentSeason = useMemo(() => {
    if (!Array.isArray(seasons) || !seasons.length) return null;
    return [...seasons].sort().at(-1) ?? seasons[seasons.length - 1];
  }, [seasons]);

  const seasonMatches = useMemo(() => {
    if (!Array.isArray(matches) || !currentSeason) return [];
    return matches.filter(match => match.season === currentSeason);
  }, [matches, currentSeason]);

  const latestSeasonGoalStatsByLeague = useMemo(() => {
    if (!Array.isArray(seasonMatches) || !seasonMatches.length) return {};

    const leaguesInSeason = [...new Set(seasonMatches.map(m => m.league).filter(Boolean))];
    const result = {};

    leaguesInSeason.forEach(leagueName => {
      const leagueMatches = seasonMatches.filter(m => m.league === leagueName && m.winner !== "TBD");
      const teamGoals = {};

      leagueMatches.forEach(match => {
        const totalGoals = match.goalHome + match.goalAway;

        if (!teamGoals[match.homeTeam]) {
          teamGoals[match.homeTeam] = { team: match.homeTeam, matchCount: 0, over15Count: 0, over25Count: 0, over35Count: 0 };
        }
        teamGoals[match.homeTeam].matchCount++;
        if (totalGoals > 1.5) teamGoals[match.homeTeam].over15Count++;
        if (totalGoals > 2.5) teamGoals[match.homeTeam].over25Count++;
        if (totalGoals > 3.5) teamGoals[match.homeTeam].over35Count++;

        if (!teamGoals[match.awayTeam]) {
          teamGoals[match.awayTeam] = { team: match.awayTeam, matchCount: 0, over15Count: 0, over25Count: 0, over35Count: 0 };
        }
        teamGoals[match.awayTeam].matchCount++;
        if (totalGoals > 1.5) teamGoals[match.awayTeam].over15Count++;
        if (totalGoals > 2.5) teamGoals[match.awayTeam].over25Count++;
        if (totalGoals > 3.5) teamGoals[match.awayTeam].over35Count++;
      });

      result[leagueName] = Object.values(teamGoals).map(t => ({
        team: t.team,
        over15Rate: (t.over15Count / t.matchCount) * 100,
        over25Rate: (t.over25Count / t.matchCount) * 100,
        over35Rate: (t.over35Count / t.matchCount) * 100,
      }));
    });

    return result;
  }, [seasonMatches]);

  const latestSeasonCornerStatsByLeague = useMemo(() => {
    if (!Array.isArray(seasonMatches) || !seasonMatches.length) return {};

    const leaguesInSeason = [...new Set(seasonMatches.map(m => m.league).filter(Boolean))];
    const result = {};

    leaguesInSeason.forEach(leagueName => {
      const leagueMatches = seasonMatches.filter(m => m.league === leagueName && m.winner !== "TBD");
      const teamCorners = {};

      leagueMatches.forEach(match => {
        const matchCorners = match.cornerHome + match.cornerAway;

        if (!teamCorners[match.homeTeam]) {
          teamCorners[match.homeTeam] = { team: match.homeTeam, matchCount: 0, over85Count: 0, over95Count: 0, over105Count: 0 };
        }
        teamCorners[match.homeTeam].matchCount++;
        if (matchCorners > 8.5) teamCorners[match.homeTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.homeTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.homeTeam].over105Count++;

        if (!teamCorners[match.awayTeam]) {
          teamCorners[match.awayTeam] = { team: match.awayTeam, matchCount: 0, over85Count: 0, over95Count: 0, over105Count: 0 };
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
  }, [seasonMatches]);

  const latestSeasonCardStatsByLeague = useMemo(() => {
    if (!Array.isArray(seasonMatches) || !seasonMatches.length) return {};

    const leaguesInSeason = [...new Set(seasonMatches.map(m => m.league).filter(Boolean))];
    const result = {};

    leaguesInSeason.forEach(leagueName => {
      const leagueMatches = seasonMatches.filter(m => m.league === leagueName && m.winner !== "TBD");
      const teamCards = {};

      leagueMatches.forEach(match => {
        const matchTotalPenaltyScore = (match.yellowHome * 1) + (match.redHome * 2) + (match.yellowAway * 1) + (match.redAway * 2);

        if (!teamCards[match.homeTeam]) {
          teamCards[match.homeTeam] = { team: match.homeTeam, matchCount: 0, penaltyOver25Count: 0, penaltyOver35Count: 0, penaltyOver45Count: 0 };
        }
        teamCards[match.homeTeam].matchCount++;
        if (matchTotalPenaltyScore > 2.5) teamCards[match.homeTeam].penaltyOver25Count++;
        if (matchTotalPenaltyScore > 3.5) teamCards[match.homeTeam].penaltyOver35Count++;
        if (matchTotalPenaltyScore > 4.5) teamCards[match.homeTeam].penaltyOver45Count++;

        if (!teamCards[match.awayTeam]) {
          teamCards[match.awayTeam] = { team: match.awayTeam, matchCount: 0, penaltyOver25Count: 0, penaltyOver35Count: 0, penaltyOver45Count: 0 };
        }
        teamCards[match.awayTeam].matchCount++;
        if (matchTotalPenaltyScore > 2.5) teamCards[match.awayTeam].penaltyOver25Count++;
        if (matchTotalPenaltyScore > 3.5) teamCards[match.awayTeam].penaltyOver35Count++;
        if (matchTotalPenaltyScore > 4.5) teamCards[match.awayTeam].penaltyOver45Count++;
      });

      result[leagueName] = Object.values(teamCards).map(t => ({
        team: t.team,
        penaltyOver25Rate: (t.penaltyOver25Count / t.matchCount) * 100,
        penaltyOver35Rate: (t.penaltyOver35Count / t.matchCount) * 100,
        penaltyOver45Rate: (t.penaltyOver45Count / t.matchCount) * 100,
      }));
    });

    return result;
  }, [seasonMatches]);

  const effectiveGoalStatsByLeague = currentSeason === selectedSeason ? goalStatsByLeague : latestSeasonGoalStatsByLeague;
  const effectiveCornerStatsByLeague = currentSeason === selectedSeason ? cornerStatsByLeague : latestSeasonCornerStatsByLeague;
  const effectiveCardStatsByLeague = currentSeason === selectedSeason ? cardStatsByLeague : latestSeasonCardStatsByLeague;

  const leagueIconMap = {
    "Süper Lig": "/leagues/Super Lig.png",
    "Super Lig": "/leagues/Super Lig.png",
    "Premier League": "/leagues/Premier League.png",
    "EFL Championship": "/leagues/EFL Championship.png",
    "LaLiga": "/leagues/LaLiga.png",
    "La Liga": "/leagues/LaLiga.png",
    "Serie A": "/leagues/Serie A.png",
    "Bundesliga": "/leagues/Bundesliga.png",
    "1. Bundesliga": "/leagues/Bundesliga.png",
    "Bundesliga 1": "/leagues/Bundesliga.png",
    "Ligue 1": "/leagues/Ligue 1.png",
    "Eredivisie": "/leagues/Eredivisie.png",
    "UEFA Champions League": "/leagues/UEFA Champions League.png",
    "UEFA Europa League": "/leagues/UEFA Europa League.png",
    "UEFA Europa Conference League": "/leagues/UEFA Europa Conference League.png",
    "Primeira Liga": "/leagues/Primeira Liga.png",
    "Pro League": "/leagues/Pro League.png",
    "Saudi Pro League": "/leagues/Saudi Pro League.png",
    "UEFA Champions League Qualifying": "/leagues/UEFA Champions League.png",
    "UEFA Europa League Qualifying": "/leagues/UEFA Europa League.png",
    "UEFA Conference League Qualifying": "/leagues/UEFA Europa Conference League.png",
  };

  const normalizeLeagueName = (value) => String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const getLeagueIcon = (leagueName) => {
    if (!leagueName) return football;

    const directMatch = leagueIconMap[leagueName];
    if (directMatch) return directMatch;

    const normalized = normalizeLeagueName(leagueName);
    const matchedKey = Object.keys(leagueIconMap).find((key) => normalizeLeagueName(key) === normalized);
    return matchedKey ? leagueIconMap[matchedKey] : football;
  };

    const getBgColor = (percent) => {
    if (percent === "—" || percent == null || (typeof percent === "string" && isNaN(Number(percent)))) return "#e0e0e0";
    const n = Number(percent);
    if (n <= 20) return "#ff4d4d";
    if (n <= 40) return "#ff944d";
    if (n <= 60) return "#ffd11a";
    if (n <= 80) return "#b3ff66";
    return "#66ff66";
    };

  // UTC saatini ve tarihi Türkiye saatine çevir (UTC+3)
  const convertToTurkeyTime = (utcDate, utcTime) => {
    if (!utcTime || !utcDate) return { date: utcDate, time: utcTime };
    const [hours, minutes] = utcTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return { date: utcDate, time: utcTime };
    
    // 3 saat ekle
    let newHours = hours + 3;
    let dateDiff = 0;
    
    // 24 saat formatında tutmak için modulo ve gün farkını hesapla
    if (newHours >= 24) {
      newHours = newHours % 24;
      dateDiff = 1; // Bir gün ileri
    }
    
    // Tarihi ayarla
    const utcDateObj = new Date(utcDate + "T00:00:00Z");
    utcDateObj.setDate(utcDateObj.getDate() + dateDiff);
    const newDate = utcDateObj.toISOString().split("T")[0];
    
    // Formatı koru (HH:mm)
    const newTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    return { date: newDate, time: newTime };
  };

  // test için sabit tarih
  const today = selectedDate.toISOString().slice(0, 10);

  const groupedMatches = useMemo(() => {
    if (!seasonMatches.length) return {};

    const todayMatches = seasonMatches
      .map(m => {
        if (!m.date || !m.time) return null;

        const [datePart] = m.date.split("T");
        const { date: turkeyDate, time: turkeyTime } = convertToTurkeyTime(datePart, m.time);

        return {
          ...m,
          originalDate: datePart,
          turkeyDate,
          turkeyTime
        };
      })
      .filter(m => m && m.turkeyDate === today);    

    // 🔥 SAATİ Türkiye saatine göre sırala
    todayMatches.sort((a, b) =>
      a.turkeyTime.localeCompare(b.turkeyTime)
    );

    // Liglere göre grupla
    return todayMatches.reduce((acc, match) => {
      if (!acc[match.league]) acc[match.league] = [];
      acc[match.league].push(match);
      return acc;
    }, {});
  }, [matches, today]);

  const allLeagues = useMemo(() => {
    if (!seasonMatches.length) return [];
    return [...new Set(seasonMatches.map(m => m.league).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "tr")
    );
  }, [seasonMatches]);

  if (isLoading) return <Typography textAlign="center">Yükleniyor...</Typography>;
  if (error) return <Typography textAlign="center">Hata oluştu</Typography>;

  const leagues = Object.keys(groupedMatches);
  const visibleLeagues =
    selectedLeague === "ALL"
      ? leagues
      : leagues.filter(league => league === selectedLeague);/*
  if (!leagues.length) return <Typography textAlign="center">Seçilen tarihte maç yok</Typography>;*/

  return (
    <Box maxWidth="800px" mx="auto" mt={3} px={2}>      
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
        <Box display="flex" justifyContent="center" mb={2} bgcolor="#f5f5f5" p={1} borderRadius={1}>
          <DatePicker
            label="Tarih Seçin"
            value={selectedDate}
            minDate={new Date(2026, 6, 1)}
            onChange={(newValue) => {
              if (!newValue) return;
              if (newValue < new Date(2026, 6, 1)) {
                setSelectedDate(new Date(2026, 6, 1));
                return;
              }
              setSelectedDate(newValue);
            }}
            format="dd/MM/yyyy"
          />
        </Box>
      </LocalizationProvider>

      <Paper sx={{ p: 1.5, mb: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Tablo ikonları:
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={2} useFlexGap>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <img src={football} alt="" style={{ width: 18, height: 18 }} />
            <Typography variant="body2">: 2.5 üst gol oranı (%)</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <img src={corner} alt="" style={{ width: 18, height: 18 }} />
            <Typography variant="body2">: 8.5 üst korner oranı (%)</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <img src={card} alt="" style={{ width: 18, height: 18 }} />
            <Typography variant="body2">: 3.5 üst ceza skoru oranı (%)</Typography>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 1.5, mb: 3, backgroundColor: "#fafafa" }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Lig filtresi:
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
          <Button
            size="small"
            variant={selectedLeague === "ALL" ? "contained" : "outlined"}
            onClick={() => setSelectedLeague("ALL")}
            sx={{
              borderRadius: 1,
              whiteSpace: "nowrap",
              minWidth: 120,
              height: 68,
            }}
          >
            Tüm Ligler
          </Button>
          {allLeagues.map(league => {
            const hasMatchInSelectedDate = Boolean(groupedMatches?.[league]?.length);
            const isActive = selectedLeague === league;
            return (
              <Button
                key={league}
                size="small"
                disabled={!hasMatchInSelectedDate}
                variant={isActive ? "contained" : "outlined"}
                onClick={() => setSelectedLeague(league)}
                sx={{
                  borderRadius: 1,
                  minWidth: 58,
                  width: 68,
                  height: 68,
                  p: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: hasMatchInSelectedDate ? 1 : 0.5,
                }}
                title={league}
              >
                <img
                  src={getLeagueIcon(league)}
                  alt={league}
                  style={{ width: 34, height: 34, objectFit: "contain" }}
                />
              </Button>
            );
          })}
        </Stack>
      </Paper>

      {visibleLeagues.map(league => (        
        <Box key={league} mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            {league}
          </Typography>

          <Paper>
            {groupedMatches[league].map((match, i) => {
              const isPlayed = match.winner !== "TBD";

              const leagueGoalStats = effectiveGoalStatsByLeague?.[match.league] ?? [];
              const leagueCornerStats = effectiveCornerStatsByLeague?.[match.league] ?? [];
              const leagueCardStats = effectiveCardStatsByLeague?.[match.league] ?? [];

              const homeGoalStats = leagueGoalStats.find(t => t.team === match.homeTeam);
              const awayGoalStats = leagueGoalStats.find(t => t.team === match.awayTeam);
              const homeGoalOver15 = homeGoalStats?.over15Rate != null ? homeGoalStats.over15Rate.toFixed(0) : "—";
              const awayGoalOver15 = awayGoalStats?.over15Rate != null ? awayGoalStats.over15Rate.toFixed(0) : "—";

              const homeGoalOver25 = homeGoalStats?.over25Rate != null ? homeGoalStats.over25Rate.toFixed(0) : "—";
              const awayGoalOver25 = awayGoalStats?.over25Rate != null ? awayGoalStats.over25Rate.toFixed(0) : "—";

              const homeGoalOver35 = homeGoalStats?.over35Rate != null ? homeGoalStats.over35Rate.toFixed(0) : "—";
              const awayGoalOver35 = awayGoalStats?.over35Rate != null ? awayGoalStats.over35Rate.toFixed(0) : "—";

              const homeCornerStats = leagueCornerStats.find(t => t.team === match.homeTeam);
              const awayCornerStats = leagueCornerStats.find(t => t.team === match.awayTeam);
              const homeCornerOver85 = homeCornerStats?.over85Rate != null ? homeCornerStats.over85Rate.toFixed(0) : "—";
              const awayCornerOver85 = awayCornerStats?.over85Rate != null ? awayCornerStats.over85Rate.toFixed(0) : "—";

              const homeCornerOver95 = homeCornerStats?.over95Rate != null ? homeCornerStats.over95Rate.toFixed(0) : "—";
              const awayCornerOver95 = awayCornerStats?.over95Rate != null ? awayCornerStats.over95Rate.toFixed(0) : "—";

              const homeCornerOver105 = homeCornerStats?.over105Rate != null ? homeCornerStats.over105Rate.toFixed(0) : "—";
              const awayCornerOver105 = awayCornerStats?.over105Rate != null ? awayCornerStats.over105Rate.toFixed(0) : "—";

              const homeCardStats = leagueCardStats.find(t => t.team === match.homeTeam);
              const awayCardStats = leagueCardStats.find(t => t.team === match.awayTeam);
              const homeCardOver25 = homeCardStats?.penaltyOver25Rate != null ? homeCardStats.penaltyOver25Rate.toFixed(0) : "—";
              const awayCardOver25 = awayCardStats?.penaltyOver25Rate != null ? awayCardStats.penaltyOver25Rate.toFixed(0) : "—";

              const homeCardOver35 = homeCardStats?.penaltyOver35Rate != null ? homeCardStats.penaltyOver35Rate.toFixed(0) : "—";
              const awayCardOver35 = awayCardStats?.penaltyOver35Rate != null ? awayCardStats.penaltyOver35Rate.toFixed(0) : "—";

              const homeCardOver45 = homeCardStats?.penaltyOver45Rate != null ? homeCardStats.penaltyOver45Rate.toFixed(0) : "—";
              const awayCardOver45 = awayCardStats?.penaltyOver45Rate != null ? awayCardStats.penaltyOver45Rate.toFixed(0) : "—";

              const toNumberOrNull = (value) => {
                if (value === "—" || value == null) return null;
                const n = Number(value);
                return Number.isNaN(n) ? null : n;
              };

              const avg = (a, b) => {
                if (a == null && b == null) return null;
                if (a == null) return b;
                if (b == null) return a;
                return (a + b) / 2;
              };

              const goal15 = avg(toNumberOrNull(homeGoalOver15), toNumberOrNull(awayGoalOver15));
              const goal25 = avg(toNumberOrNull(homeGoalOver25), toNumberOrNull(awayGoalOver25));
              const goal35 = avg(toNumberOrNull(homeGoalOver35), toNumberOrNull(awayGoalOver35));

              const corner85 = avg(toNumberOrNull(homeCornerOver85), toNumberOrNull(awayCornerOver85));
              const corner95 = avg(toNumberOrNull(homeCornerOver95), toNumberOrNull(awayCornerOver95));
              const corner105 = avg(toNumberOrNull(homeCornerOver105), toNumberOrNull(awayCornerOver105));

              const card25 = avg(toNumberOrNull(homeCardOver25), toNumberOrNull(awayCardOver25));
              const card35 = avg(toNumberOrNull(homeCardOver35), toNumberOrNull(awayCardOver35));
              const card45 = avg(toNumberOrNull(homeCardOver45), toNumberOrNull(awayCardOver45));

              const formatRate = (value) => (value == null ? "—" : `${value.toFixed(0)}%`);

              return (
                <Box
                  key={i}
                  mb={2}
                  component={Link}
                  to={`/match/${encodeURIComponent(match.league)}/${encodeURIComponent(
                    match.homeTeam
                  )}/${encodeURIComponent(match.awayTeam)}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                    borderRadius: 1,
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    py={1.5} 
                  >
                    {/* ⏰ SAAT */}
                    <Typography sx={{ minWidth: 60 }}>
                      {match.turkeyTime || match.time} {/* Türkiye saati (UTC+3) */}
                    </Typography>

                    {/* ⚽ MAÇ */}
                    <Stack sx={{ flex: 1 }} direction="row" justifyContent="center" alignItems="center" spacing={1}>
                      <img src={getTeamLogo(match.homeTeam)} alt={match.homeTeam} style={{ height: 24 }} />
                      <Box component="span" sx={{ textAlign: "center" }}>
                        {match.homeTeam}
                        {isPlayed
                          ? ` ${match.goalHome} - ${match.goalAway} `
                          : " vs "}
                        {match.awayTeam}
                      </Box>
                      <img src={getTeamLogo(match.awayTeam)} alt={match.awayTeam} style={{ height: 24 }} />
                  </Stack>
                </Stack>
                
                <TableContainer
                  component={Paper}
                  sx={{
                    flex: 1,
                    width: "100%",              
                    backgroundColor: "#e2e2e2",
                    overflow: 'hidden',
                    borderRadius: 0             
                  }}
                >
                  <Table size="small" stickyHeader sx={{borderRadius: 0}}>
                    <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#e2e2e2" } }}>
                      <TableRow>
                        <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                        <Stack alignItems={'center'}>
                          <img
                            src={football}
                            style={{ width: 20, height: 20, color: "#fff" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={corner}
                            style={{ width: 20, height: 20, color: "#fff" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={card}
                            style={{ width: 20, height: 20, color: "#fff" }}
                          />    
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: 0, pl: 0}} align="center">
                          
                        </TableCell>

                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={football}
                            style={{ width: 20, height: 20, color: "#fff" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={corner}
                            style={{ width: 20, height: 20, color: "#fff" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={card}
                            style={{ width: 20, height: 20, color: "#fff" }}
                          />    
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      
                        <TableRow>
                        
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeGoalOver25), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{homeGoalOver25 === "—" ? "—" : `${homeGoalOver25}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeCornerOver85), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{homeCornerOver85 === "—" ? "—" : `${homeCornerOver85}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeCardOver35), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{homeCardOver35 === "—" ? "—" : `${homeCardOver35}%`}</TableCell>
                          
                          <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", pr: 1, pl: 1}}></TableCell>

                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(awayGoalOver25), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{awayGoalOver25 === "—" ? "—" : `${awayGoalOver25}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(awayCornerOver85), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{awayCornerOver85 === "—" ? "—" : `${awayCornerOver85}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(awayCardOver35), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{awayCardOver35 === "—" ? "—" : `${awayCardOver35}%`}</TableCell>
                          
                        </TableRow>
                     
                    </TableBody>
                  </Table>
                </TableContainer>
                  {i !== groupedMatches[league].length - 1 && <Divider />}
                  
                </Box>
              );
            })}
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

export default TodayMatches;