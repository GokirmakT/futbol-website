import { useMemo, useState, useRef, useEffect } from "react";
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
  TableCell,
  TableHead,
  TableContainer,
  Popover,
  IconButton,
} from "@mui/material";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { useData } from "../context/DataContext";
import PageLoader from "../Components/LoadingPage.jsx";
import { getTeamLogo } from "../Components/teamLogos.js";
import football from "/football.png";
import card from "/yellow-card.png";
import corner from "/corner.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const DATE_ACCENT = "#1976d2";

function TodayMatches() {
  const { goalStatsByLeague, cornerStatsByLeague, cardStatsByLeague, matches, seasons, selectedSeason, isLoading, error } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLeague, setSelectedLeague] = useState("ALL");
  const [isLeaguePanelOpen, setIsLeaguePanelOpen] = useState(false);
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const dateStripRef = useRef(null);
  const dateButtonRefs = useRef({});

  useEffect(() => {
    if (!isLeaguePanelOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [isLeaguePanelOpen]);

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
    "UEFA Nations League": "/leagues/UEFA Nations League.png",
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

  const today = format(selectedDate, "yyyy-MM-dd");
  const dateWindowSize = isMobile ? 61 : 7;
  const weekDays = useMemo(() => {
    const midpoint = Math.floor(dateWindowSize / 2);
    return Array.from({ length: dateWindowSize }, (_, index) => addDays(selectedDate, index - midpoint));
  }, [selectedDate, dateWindowSize]);

  const selectDate = (date) => {
    if (!date) return;
    setSelectedDate(date < new Date(2026, 6, 1) ? new Date(2026, 6, 1) : date);
    setCalendarAnchor(null);
  };

  const shiftSelectedDate = days => selectDate(addDays(selectedDate, days));

  useEffect(() => {
    const selectedKey = format(selectedDate, "yyyy-MM-dd");
    const selectedButton = dateButtonRefs.current[selectedKey];
    const strip = dateStripRef.current;

    if (!selectedButton || !strip) return;

    const stripRect = strip.getBoundingClientRect();
    const buttonRect = selectedButton.getBoundingClientRect();
    const targetScrollLeft =
      strip.scrollLeft + buttonRect.left - stripRect.left - (strip.clientWidth - buttonRect.width) / 2;

    strip.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: "auto" });
  }, [selectedDate, isLoading, isMobile]);

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
  }, [seasonMatches, today]);

  const allLeagues = useMemo(() => {
    if (!seasonMatches.length) return [];
    return [...new Set(seasonMatches.map(m => m.league).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "tr")
    );
  }, [seasonMatches]);

  const leagueOptions = [
    { label: "Tüm Maçlar", value: "ALL", icon: football },
    ...allLeagues.map(league => ({
      label: league,
      value: league,
      icon: getLeagueIcon(league),
    })),
  ];

  if (isLoading) return <PageLoader label="Maçlar yükleniyor..." />;
  if (error) return <Typography textAlign="center">Hata oluştu</Typography>;

  const leagues = Object.keys(groupedMatches);
  const visibleLeagues =
    selectedLeague === "ALL"
      ? leagues
      : leagues.filter(league => league === selectedLeague);/*
  if (!leagues.length) return <Typography textAlign="center">Seçilen tarihte maç yok</Typography>;*/

  return (
    <Box
      maxWidth="1280px"
      width="100%"
      mx="auto"
      mt={3}
      px={2}
      sx={{ boxSizing: "border-box", minWidth: 0 }}
    >
      <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 0.75 }, mb: 2, alignItems: "center" }}>
        <Paper
          sx={{
            flex: { xs: "0 0 64px", sm: "0 0 90px" },
            height: { xs: 84, sm: 101 },
            p: 0,
            overflow: "hidden",
            backgroundColor: "#171b1d",
            border: "1px solid #303638",
            borderRadius: "8px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
          }}
        >
          <Button
            fullWidth
            onClick={() => setIsLeaguePanelOpen(true)}
            sx={{
              height: "100%",
              minWidth: 0,
              px: 0.5,
              py: 1,
              gap: 0.25,
              flexDirection: "column",
              justifyContent: "center",
              textTransform: "none",
              color: "#f4f5f5",
              borderRadius: "7px",
              "&:hover": { backgroundColor: "#222729" },
            }}
          >
            <img
              src={selectedLeague === "ALL" ? football : getLeagueIcon(selectedLeague)}
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
              alt={selectedLeague === "ALL" ? "Tüm Maçlar" : selectedLeague}
            />
            <Typography variant="caption" sx={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedLeague === "ALL" ? "Lig Seç" : selectedLeague}
            </Typography>
          </Button>
        </Paper>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0, backgroundColor: "#171b1d", border: "1px solid #303638", borderRadius: "8px", boxShadow: "0 3px 12px rgba(0,0,0,0.18)" }}>
            {!isMobile && (
              <IconButton
                aria-label="Bir gün geri git"
                onClick={() => shiftSelectedDate(-1)}
                disabled={isSameDay(selectedDate, new Date(2026, 6, 1)) || selectedDate < new Date(2026, 6, 1)}
                sx={{ flex: "0 0 auto", mr: 0.5, color: DATE_ACCENT }}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>
            )}
            <Box
              ref={dateStripRef}
              aria-label="Gün seçici"
              sx={{
                flex: 1,
                minWidth: 0,
                height: { xs: 83, sm: 100 },
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: { xs: 0.25, sm: 1.5 },
                mb: 0,
                px: { xs: 0.25, sm: 1 },
                
                backgroundColor: "#171b1d",
                borderBottom: "1px solid #303638",
                overflowX: "auto",
                overflowY: "hidden",
                touchAction: "pan-x",
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {weekDays.map((date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());
                const dayLabel = isToday ? "Bugün" : format(date, "EEE", { locale: tr });

                return (
                  <Button
                    key={dateKey}
                    aria-label={format(date, "EEEE d MMMM", { locale: tr })}
                    aria-pressed={isSelected}
                    ref={(node) => {
                      if (node) dateButtonRefs.current[dateKey] = node;
                      else delete dateButtonRefs.current[dateKey];
                    }}
                    onClick={() => selectDate(date)}
                    sx={{
                      flex: isMobile ? "0 0 48px" : "1 1 0",
                      minWidth: isMobile ? 48 : 0,
                      width: isMobile ? 48 : "100%",
                      height: { xs: 68, sm: 92 },
                      px: 0.5,
                      py: 1,
                      borderRadius: "18px",
                      color: "#f4f5f5",
                      backgroundColor: isSelected ? DATE_ACCENT : "transparent",
                      textTransform: "none",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,
                      "&:hover": {
                        backgroundColor: isSelected ? "#1565c0" : "#222729",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: "0.78rem", sm: "0.95rem" }, lineHeight: 1 }}>
                      {isToday ? dayLabel : dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1, 3)}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "1.35rem", sm: "1.7rem" }, fontWeight: 700, lineHeight: 1 }}>
                      {format(date, "d")}
                    </Typography>
                    {isToday && !isSelected && (
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: DATE_ACCENT }} />
                    )}
                  </Button>
                );
              })}
            </Box>

            {!isMobile && (
              <IconButton
                aria-label="Bir gün ileri git"
                onClick={() => shiftSelectedDate(1)}
                sx={{ flex: "0 0 auto", ml: 0.5, color: DATE_ACCENT }}
              >
                <ChevronRightRoundedIcon />
              </IconButton>
            )}

            <IconButton
              aria-label="Takvimi aç"
              onClick={(event) => setCalendarAnchor(event.currentTarget)}
              sx={{
                flex: "0 0 auto",
                width: { xs: 44, sm: 52 },
                height: { xs: 44, sm: 52 },
                ml: { xs: 0.25, sm: 1 },
                backgroundColor: "#171b1d",
                border: `3px solid ${DATE_ACCENT}`,
                borderRadius: "18px",
                color: DATE_ACCENT,
                "&:hover": { backgroundColor: "#222729" },
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
            </IconButton>
            <Popover
              open={Boolean(calendarAnchor)}
              anchorEl={calendarAnchor}
              onClose={() => setCalendarAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <DateCalendar
                value={selectedDate}
                minDate={new Date(2026, 6, 1)}
                onChange={selectDate}
                sx={{
                  color: "#f4f5f5",
                  backgroundColor: "#171b1d",
                  border: "1px solid #303638",
                  borderRadius: "8px",
                  "& .MuiPickersCalendarHeader-label, & .MuiPickersCalendarHeader-switchViewButton, & .MuiPickersArrowSwitcher-button": { color: "#f4f5f5" },
                  "& .MuiDayCalendar-weekDayLabel": { color: "#aeb6b8" },
                  "& .MuiPickersDay-root": { color: "#f4f5f5" },
                  "& .MuiPickersDay-root:hover": { backgroundColor: "#303638" },
                  "& .MuiPickersDay-root.Mui-selected": { color: "#fff", backgroundColor: DATE_ACCENT },
                  "& .MuiPickersDay-root.Mui-selected:hover": { backgroundColor: "#1565c0" },
                  "& .MuiPickersDay-root.MuiPickersDay-today:not(.Mui-selected)": { borderColor: DATE_ACCENT },
                  "& .MuiPickersDay-root.Mui-disabled": { color: "#687174" },
                }}
              />
            </Popover>
          </Box>
        </LocalizationProvider>
      </Box>

      {isLeaguePanelOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setIsLeaguePanelOpen(false)}
        >
          <Paper
            sx={{
              maxWidth: 700,
              width: "92%",
              maxHeight: "80vh",
              backgroundColor: "#171b1d",
              color: "#f4f5f5",
              border: "1px solid #303638",
              borderRadius: "8px",
              boxShadow: 24,
              p: 2,
            }}
            onClick={event => event.stopPropagation()}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Lig Seçimi</Typography>
              <Button
                onClick={() => setIsLeaguePanelOpen(false)}
                sx={{ minWidth: 0, color: "#fff", p: 0.5 }}
                aria-label="Lig seçim panelini kapat"
              >
                <CloseIcon />
              </Button>
            </Stack>

            <Typography variant="body2" color="grey.400" mb={2}>
              Oynamak istediğin ligi seçmek için kartlara tıkla.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
                gap: 1.5,
                maxHeight: "60vh",
                overflowY: "auto",
                pr: 0.5,
              }}
            >
              {leagueOptions.map(option => {
                const isActive = option.value === selectedLeague;
                const hasMatchInSelectedDate = option.value === "ALL"
                  ? leagues.length > 0
                  : Boolean(groupedMatches?.[option.value]?.length);

                return (
                  <Paper
                    key={option.value}
                    onClick={() => {
                      if (!hasMatchInSelectedDate && option.value !== "ALL") return;
                      setSelectedLeague(option.value);
                      setIsLeaguePanelOpen(false);
                    }}
                    sx={{
                      cursor: hasMatchInSelectedDate || option.value === "ALL" ? "pointer" : "default",
                      backgroundColor: isActive ? DATE_ACCENT : "#fff",
                      color: isActive ? "#fff" : "#263238",
                      border: "1px solid",
                      borderColor: isActive ? DATE_ACCENT : "#e1e5e7",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      p: 1,
                      minHeight: 104,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      opacity: 1,
                      transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.35)",
                        borderColor: isActive ? "#1976d2" : "#c6ced1",
                        backgroundColor: isActive ? "#1565c0" : "#f1f4f5",
                        color: isActive ? "#fff" : "#263238",
                      },
                    }}
                  >
                    <img
                      src={option.icon}
                      width={64}
                      height={64}
                      alt={option.label}
                      style={{
                        objectFit: "contain",
                        marginBottom: 6,
                        opacity: hasMatchInSelectedDate || option.value === "ALL" ? 1 : 0.55,
                        filter: hasMatchInSelectedDate || option.value === "ALL" ? "none" : "grayscale(1)",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? "bold" : "normal",
                        color: isActive ? "#fff" : hasMatchInSelectedDate ? "#263238" : "#7b858a",
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
          </Paper>
        </Box>
      )}

      <Paper sx={{ p: 1.5, mb: 3, color: "#f4f5f5", backgroundColor: "#171b1d", border: "1px solid #303638", borderRadius: "8px", boxShadow: "0 3px 12px rgba(0,0,0,0.18)" }}>
        <Typography variant="subtitle2" sx={{ color: "#aeb6b8" }} gutterBottom>
          Tablo ikonları:
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={2} useFlexGap>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <img src={football} alt="" style={{ width: 18, height: 18 }} />
            <Typography variant="body2">: 2.5 üst gol oranı (%)</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <img src={corner} alt="" style={{ width: 18, height: 18, filter: "brightness(0) invert(1)" }} />
            <Typography variant="body2" sx={{ color: "#f4f5f5" }}>: 8.5 üst korner oranı (%)</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <img src={card} alt="" style={{ width: 18, height: 18, filter: "brightness(0) invert(1)" }} />
            <Typography variant="body2" sx={{ color: "#f4f5f5" }}>: 3.5 üst ceza skoru oranı (%)</Typography>
          </Stack>
        </Stack>
      </Paper>

      {visibleLeagues.map(league => (        
        <Box
          key={league}
          mb={4}
          sx={{
            p: { xs: 1, sm: 1.5 },
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <img
              src={getLeagueIcon(league)}
              alt={`${league} logosu`}
              style={{ width: 34, height: 34, objectFit: "contain", flex: "0 0 auto" }}
            />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: "#fff",
                fontSize: { xs: "1rem", sm: "1.25rem" },
                lineHeight: 1.2,
                overflowWrap: "anywhere",
              }}
            >
              {league}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 1.25, sm: 1.5 },
              alignItems: "start",
            }}
          >
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
                  component={Link}
                  to={`/match/${encodeURIComponent(match.league)}/${encodeURIComponent(
                    match.homeTeam
                  )}/${encodeURIComponent(match.awayTeam)}`}
                  sx={{
                    textDecoration: "none",
                    color: "#f4f5f5",
                    display: "block",
                    minWidth: 0,
                    overflow: "hidden",
                    backgroundColor: "#171b1d",
                    border: "1px solid #303638",
                    borderRadius: 2,
                    boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
                    transition: "transform 0.18s ease, border-color 0.18s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: "#626b6e",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={0.75}
                    px={1.25}
                    py={1.5}
                    sx={{ minHeight: 100 }}
                  >
                    <Stack sx={{ flex: 1, minWidth: 0 }} alignItems="center" spacing={0.5}>
                      <img src={getTeamLogo(match.homeTeam)} alt={match.homeTeam} style={{ height: 40, maxWidth: 48, objectFit: "contain" }} />
                      <Typography sx={{ width: "100%", textAlign: "center", fontSize: { xs: "0.78rem", sm: "0.9rem" }, lineHeight: 1.15, overflowWrap: "anywhere" }}>
                        {match.homeTeam}
                      </Typography>
                    </Stack>
                    <Stack alignItems="center" spacing={0.35} sx={{ flex: "0 0 auto", minWidth: 54 }}>
                      <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, fontWeight: 700, color: "#f4f5f5" }}>
                        {match.turkeyTime || match.time}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#aeb6b8", lineHeight: 1 }}>
                        {isPlayed ? `${match.goalHome} - ${match.goalAway}` : "vs"}
                      </Typography>
                    </Stack>
                    <Stack sx={{ flex: 1, minWidth: 0 }} alignItems="center" spacing={0.5}>
                      <img src={getTeamLogo(match.awayTeam)} alt={match.awayTeam} style={{ height: 40, maxWidth: 48, objectFit: "contain" }} />
                      <Typography sx={{ width: "100%", textAlign: "center", fontSize: { xs: "0.78rem", sm: "0.9rem" }, lineHeight: 1.15, overflowWrap: "anywhere" }}>
                        {match.awayTeam}
                      </Typography>
                  </Stack>
                </Stack>
                
                <TableContainer
                  component={Paper}
                  sx={{
                    flex: 1,
                    width: "100%",              
                    backgroundColor: "#252a2c",
                    overflow: 'hidden',
                    borderRadius: 0,
                    boxShadow: "none",
                  }}
                >
                  <Table
                    size="small"
                    sx={{
                      borderRadius: 0,
                      tableLayout: "fixed",
                      "& .MuiTableCell-root": { borderBottom: "none" },
                    }}
                  >
                    <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#252a2c", py: 0.75 } }}>
                      <TableRow>
                        <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                        <Stack alignItems={'center'}>
                          <img
                            src={football}
                            style={{ width: isMobile ? 28 : 24, height: isMobile ? 28 : 24, objectFit: "contain" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={corner}
                            style={{ width: isMobile ? 28 : 24, height: isMobile ? 28 : 24, objectFit: "contain", filter: "brightness(0) invert(1)" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={card}
                            style={{ width: isMobile ? 28 : 24, height: isMobile ? 28 : 24, objectFit: "contain", filter: "brightness(0) invert(1)" }}
                          />    
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: 0, pl: 0}} align="center">
                          
                        </TableCell>

                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={football}
                            style={{ width: isMobile ? 28 : 24, height: isMobile ? 28 : 24, objectFit: "contain" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={corner}
                            style={{ width: isMobile ? 28 : 24, height: isMobile ? 28 : 24, objectFit: "contain", filter: "brightness(0) invert(1)" }}
                          />    
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                          <Stack alignItems={'center'}>
                          <img
                            src={card}
                            style={{ width: isMobile ? 28 : 24, height: isMobile ? 28 : 24, objectFit: "contain", filter: "brightness(0) invert(1)" }}
                          />    
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      
                        <TableRow>
                        
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeGoalOver25), fontWeight: "bold", px: isMobile ? 0.25 : 0.5, py: 0.75, fontSize: isMobile ? "0.8rem" : "0.9rem"}}>{homeGoalOver25 === "—" ? "—" : `${homeGoalOver25}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeCornerOver85), fontWeight: "bold", px: isMobile ? 0.25 : 0.5, py: 0.75, fontSize: isMobile ? "0.8rem" : "0.9rem"}}>{homeCornerOver85 === "—" ? "—" : `${homeCornerOver85}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeCardOver35), fontWeight: "bold", px: isMobile ? 0.25 : 0.5, py: 0.75, fontSize: isMobile ? "0.8rem" : "0.9rem"}}>{homeCardOver35 === "—" ? "—" : `${homeCardOver35}%`}</TableCell>
                          
                          <TableCell align="center" sx={{color: "#000000ff", backgroundColor: "#171b1d", fontWeight: "bold", px: 0, py: 0}}></TableCell>

                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(awayGoalOver25), fontWeight: "bold", px: isMobile ? 0.25 : 0.5, py: 0.75, fontSize: isMobile ? "0.8rem" : "0.9rem"}}>{awayGoalOver25 === "—" ? "—" : `${awayGoalOver25}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(awayCornerOver85), fontWeight: "bold", px: isMobile ? 0.25 : 0.5, py: 0.75, fontSize: isMobile ? "0.8rem" : "0.9rem"}}>{awayCornerOver85 === "—" ? "—" : `${awayCornerOver85}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(awayCardOver35), fontWeight: "bold", px: isMobile ? 0.25 : 0.5, py: 0.75, fontSize: isMobile ? "0.8rem" : "0.9rem"}}>{awayCardOver35 === "—" ? "—" : `${awayCardOver35}%`}</TableCell>
                          
                        </TableRow>
                     
                    </TableBody>
                  </Table>
                </TableContainer>
                  
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default TodayMatches;