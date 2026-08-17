import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button,
} from "@mui/material";
import { useData } from "../context/DataContext";
import TeamFixture from "../Components/TeamFixture.jsx";
import { getTeamLogo } from "../Components/teamLogos.js";

const leagueLogos = {
  "Super Lig": "/leagues/Super Lig.png",
  "Süper Lig": "/leagues/Super Lig.png",
  "Premier League": "/leagues/Premier League.png",
  "EFL Championship": "/leagues/EFL Championship.png",
  "LaLiga": "/leagues/LaLiga.png",
  "La Liga": "/leagues/LaLiga.png",
  "La Liga 2": "/leagues/LaLiga.png",
  "Serie A": "/leagues/Serie A.png",
  "Bundesliga": "/leagues/Bundesliga.png",
  "1. Bundesliga": "/leagues/Bundesliga.png",
  "Bundesliga 1": "/leagues/Bundesliga.png",
  "Ligue 1": "/leagues/Ligue 1.png",
  "Eredivisie": "/leagues/Eredivisie.png",
  "UEFA Champions League": "/leagues/UEFA Champions League.png",
  "UEFA Europa League": "/leagues/UEFA Europa League.png",
  "UEFA Europa Conference League": "/leagues/UEFA Europa Conference League.png",
  "UEFA Champions League Qualifying": "/leagues/UEFA Champions League.png",
  "UEFA Europa League Qualifying": "/leagues/UEFA Europa League.png",
  "UEFA Conference League Qualifying": "/leagues/UEFA Europa Conference League.png",
  "Primeira Liga": "/leagues/Primeira Liga.png",
  "Pro League": "/leagues/Pro League.png",
  "Saudi Pro League": "/leagues/Saudi Pro League.png",
};

const normalizeLeagueName = (value) => String(value ?? "")
  .trim()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const getLeagueLogo = (leagueName) => {
  if (!leagueName) return "/leagues/Super Lig.png";

  const directMatch = leagueLogos[leagueName];
  if (directMatch) return directMatch;

  const normalized = normalizeLeagueName(leagueName);
  const matchedKey = Object.keys(leagueLogos).find((key) => normalizeLeagueName(key) === normalized);
  return matchedKey ? leagueLogos[matchedKey] : "/leagues/Super Lig.png";
};

const leagueNameMap = {
  "superlig": "Super Lig",
  "premier-league": "Premier League",
  "laliga": "LaLiga",
  "seriea": "Serie A",
  "bundesliga": "Bundesliga",
  "ligue1": "Ligue 1",
  "eredivisie": "Eredivisie",
  "champions-league": "UEFA Champions League",
  "europa-league": "UEFA Europa League",
  "europa-conference-league": "UEFA Europa Conference League",
  "uefa-champions-league-qualifying": "UEFA Champions League Qualifying",
  "uefa-europa-league-qualifying": "UEFA Europa League Qualifying",
  "uefa-conference-league-qualifying": "UEFA Conference League Qualifying",
  "uefa.champions_qual": "UEFA Champions League Qualifying",
  "uefa.europa_qual": "UEFA Europa League Qualifying",
  "uefa.europa.conf_qual": "UEFA Conference League Qualifying",
  "primeira-liga": "Primeira Liga",
  "pro-league": "Pro League",
  "saudi-pro-league": "Saudi Pro League",
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

const formatRateCell = (value) => {
  return { text: <SemicircleGauge value={value} />, bg: "transparent" };
};

const SemicircleGauge = ({ value }) => {
  const numericValue = Number(value);
  const percent = Number.isFinite(numericValue)
    ? Math.min(100, Math.max(0, numericValue))
    : 0;
  const color = getBgColor(percent);
  const sweep = percent === 0 && Number.isFinite(numericValue) ? 8 : percent * 1.8;

  return (
    <Box
      sx={{
        position: "relative",
        width: 92,
        height: 52,
        mx: "auto",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 92,
          height: 92,
          borderRadius: "50%",
          background: `conic-gradient(from 270deg, ${color} 0deg ${sweep}deg, #c7c7c7 ${sweep}deg 180deg, transparent 180deg)`,
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
        }}
      />
      <Typography
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          color,
          fontWeight: "bold",
          fontSize: 13,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        {Number.isFinite(numericValue) ? `${numericValue.toFixed(1)}%` : "—"}
      </Typography>
    </Box>
  );
};

const MetricGauge = ({ label, value, displayValue, isRate = true }) => {
  const numericValue = Number(value);
  const hasValue = Number.isFinite(numericValue);
  const percent = hasValue && isRate ? Math.min(100, Math.max(0, numericValue)) : 0;
  const color = isRate && hasValue ? getBgColor(percent) : "#8a8a8a";
  const sweep = percent === 0 && hasValue ? 8 : percent * 1.8;

  return (
    <Box sx={{ minWidth: 0, textAlign: "center" }}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          minHeight: 32,
          fontWeight: "bold",
          color: "text.primary",
        }}
      >
        {label}
      </Typography>
      {isRate ? (
        <Box sx={{ position: "relative", width: 92, height: 58, mx: "auto", overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: `conic-gradient(from 270deg, ${color} 0deg ${sweep}deg, #c7c7c7 ${sweep}deg 180deg, transparent 180deg)`,
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))",
            }}
          />
          <Typography sx={{ position: "absolute", bottom: 0, left: 0, right: 0, color, fontWeight: "bold", fontSize: 14, lineHeight: 1 }}>
            {displayValue ?? (hasValue ? `${numericValue.toFixed(1)}%` : "—")}
          </Typography>
        </Box>
      ) : (
        <Typography sx={{ color: "#333", fontWeight: "bold", fontSize: 18, lineHeight: "58px" }}>
          {displayValue ?? (hasValue ? numericValue.toFixed(2) : "—")}
        </Typography>
      )}
    </Box>
  );
};

const MetricGaugeGrid = ({ items }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" },
      gap: 2,
      alignItems: "end",
      py: 1,
    }}
  >
    {items.map(item => <MetricGauge key={item.label} {...item} />)}
  </Box>
);

const getTeamScopeMatches = (matches, teamName, selectedSeason, scope) => {
  const teamMatches = matches.filter(
    match =>
      match.season === selectedSeason &&
      (match.homeTeam === teamName || match.awayTeam === teamName) &&
      match.winner !== "TBD"
  );

  if (!scope || scope === "all") return teamMatches;
  return teamMatches.filter(match => match.league === scope);
};

const buildTeamMatchStats = (teamName, scopeMatches) => {
  if (!scopeMatches.length) {
    return {
      goals: {
        over15Rate: 0,
        over25Rate: 0,
        over35Rate: 0,
        btsRate: 0,
      },
      corners: {
        avgMatchCorners: 0,
        over85Rate: 0,
        team45Rate: 0,
      },
      cards: {
        over25Rate: 0,
        over35Rate: 0,
        RedOver05Rate: 0,
        penaltyOver25Rate: 0,
        penaltyOver35Rate: 0,
        penaltyOver45Rate: 0,
      },
    };
  }

  let over15 = 0;
  let over25 = 0;
  let over35 = 0;
  let bothTeamsScored = 0;
  let totalCorners = 0;
  let over85Corners = 0;
  let over95Corners = 0;
  let over105Corners = 0;
  let teamOver45Corners = 0;
  let teamOver55Corners = 0;
  let over25Yellow = 0;
  let over35Yellow = 0;
  let redOver05 = 0;
  let penaltyOver25 = 0;
  let penaltyOver35 = 0;
  let penaltyOver45 = 0;

  scopeMatches.forEach(match => {
    const homeScore = Number(match.goalHome) || 0;
    const awayScore = Number(match.goalAway) || 0;
    const totalGoals = homeScore + awayScore;
    const teamGoals = match.homeTeam === teamName ? homeScore : awayScore;
    const teamCorners = match.homeTeam === teamName ? Number(match.cornerHome) || 0 : Number(match.cornerAway) || 0;
    const totalYellow = (Number(match.yellowHome) || 0) + (Number(match.yellowAway) || 0);
    const totalRed = (Number(match.redHome) || 0) + (Number(match.redAway) || 0);
    const penaltyScore = (Number(match.yellowHome) || 0) + (Number(match.redHome) || 0) * 2 + (Number(match.yellowAway) || 0) + (Number(match.redAway) || 0) * 2;
    const totalMatchCorners = (Number(match.cornerHome) || 0) + (Number(match.cornerAway) || 0);

    if (totalGoals > 1.5) over15++;
    if (totalGoals > 2.5) over25++;
    if (totalGoals > 3.5) over35++;
    if (homeScore > 0 && awayScore > 0) bothTeamsScored++;

    totalCorners += totalMatchCorners;
    if (totalMatchCorners > 8.5) over85Corners++;
    if (totalMatchCorners > 9.5) over95Corners++;
    if (totalMatchCorners > 10.5) over105Corners++;
    if (teamCorners > 4.5) teamOver45Corners++;
    if (teamCorners > 5.5) teamOver55Corners++;

    if (totalYellow > 2.5) over25Yellow++;
    if (totalYellow > 3.5) over35Yellow++;
    if (totalRed > 0.5) redOver05++;
    if (penaltyScore > 2.5) penaltyOver25++;
    if (penaltyScore > 3.5) penaltyOver35++;
    if (penaltyScore > 4.5) penaltyOver45++;

    if (teamGoals > 0 && totalGoals > 0) {
      // no-op, kept for clarity in future expansions
    }
  });

  const totalMatches = scopeMatches.length || 1;

  return {
    goals: {
      over15Rate: (over15 / totalMatches) * 100,
      over25Rate: (over25 / totalMatches) * 100,
      over35Rate: (over35 / totalMatches) * 100,
      btsRate: (bothTeamsScored / totalMatches) * 100,
    },
    corners: {
      avgMatchCorners: totalCorners / totalMatches,
      over85Rate: (over85Corners / totalMatches) * 100,
      over95Rate: (over95Corners / totalMatches) * 100,
      over105Rate: (over105Corners / totalMatches) * 100,
      team45Rate: (teamOver45Corners / totalMatches) * 100,
      team55Rate: (teamOver55Corners / totalMatches) * 100,
    },
    cards: {
      over25Rate: (over25Yellow / totalMatches) * 100,
      over35Rate: (over35Yellow / totalMatches) * 100,
      RedOver05Rate: (redOver05 / totalMatches) * 100,
      penaltyOver25Rate: (penaltyOver25 / totalMatches) * 100,
      penaltyOver35Rate: (penaltyOver35 / totalMatches) * 100,
      penaltyOver45Rate: (penaltyOver45 / totalMatches) * 100,
    },
  };
};

const MatchDetail = () => {
  const { league, home, away } = useParams();
  const navigate = useNavigate();
  const {
    matches,
    goalStats,
    cardStats,
    cornerStats,
    setSelectedLeague,
    selectedLeague,
    selectedSeason,
  } = useData();

  const leagueName = leagueNameMap[league] || league;
  const [homeScope, setHomeScope] = useState("all");
  const [awayScope, setAwayScope] = useState("all");

  const detailSeason = useMemo(() => {
    if (!Array.isArray(matches) || !matches.length) return selectedSeason;

    const relevantMatches = matches.filter(match =>
      match.league === leagueName &&
      ((match.homeTeam === home && match.awayTeam === away) ||
      (match.homeTeam === away && match.awayTeam === home)) &&
      Boolean(match.season)
    );

    if (!relevantMatches.length) return selectedSeason;

    const seasons = [...new Set(relevantMatches.map(match => match.season))];
    return [...seasons].sort().at(-1) ?? seasons[seasons.length - 1];
  }, [matches, leagueName, home, away, selectedSeason]);

  const homeCompetitionOptions = useMemo(() => {
    const options = [...new Set(
      matches
        .filter(match => match.season === detailSeason && (match.homeTeam === home || match.awayTeam === home) && match.winner !== "TBD")
        .map(match => match.league)
        .filter(Boolean)
    )];
    return ["all", ...options];
  }, [matches, detailSeason, home]);

  const awayCompetitionOptions = useMemo(() => {
    const options = [...new Set(
      matches
        .filter(match => match.season === detailSeason && (match.homeTeam === away || match.awayTeam === away) && match.winner !== "TBD")
        .map(match => match.league)
        .filter(Boolean)
    )];
    return ["all", ...options];
  }, [matches, detailSeason, away]);

  const getScopeMatchCount = (teamName, scope) => {
    if (!matches?.length) return 0;
    const scopedMatches = matches.filter(match =>
      match.season === detailSeason &&
      (match.homeTeam === teamName || match.awayTeam === teamName) &&
      match.winner !== "TBD" &&
      (scope === "all" || match.league === scope)
    );
    return scopedMatches.length;
  };

  useEffect(() => {
    if (leagueName && leagueName !== selectedLeague) {
      setSelectedLeague(leagueName);
    }
  }, [leagueName, selectedLeague, setSelectedLeague]);

  const homeTeamMatches = useMemo(
    () => getTeamScopeMatches(matches, home, detailSeason, homeScope),
    [matches, home, detailSeason, homeScope]
  );
  const awayTeamMatches = useMemo(
    () => getTeamScopeMatches(matches, away, detailSeason, awayScope),
    [matches, away, detailSeason, awayScope]
  );

  const homeGoals = useMemo(
    () => buildTeamMatchStats(home, homeTeamMatches).goals,
    [home, homeTeamMatches]
  );
  const awayGoals = useMemo(
    () => buildTeamMatchStats(away, awayTeamMatches).goals,
    [away, awayTeamMatches]
  );

  const homeCorners = useMemo(
    () => buildTeamMatchStats(home, homeTeamMatches).corners,
    [home, homeTeamMatches]
  );
  const awayCorners = useMemo(
    () => buildTeamMatchStats(away, awayTeamMatches).corners,
    [away, awayTeamMatches]
  );

  const homeCards = useMemo(
    () => buildTeamMatchStats(home, homeTeamMatches).cards,
    [home, homeTeamMatches]
  );
  const awayCards = useMemo(
    () => buildTeamMatchStats(away, awayTeamMatches).cards,
    [away, awayTeamMatches]
  );

const homeLast10 = useMemo(
  () =>
    [...matches]
      .filter(
        m =>
          (m.homeTeam === home || m.awayTeam === home) &&
          m.winner !== "TBD"
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10),
  [matches, home]
);

const awayLast10 = useMemo(
  () =>
    [...matches]
      .filter(
        m =>
          (m.homeTeam === away || m.awayTeam === away) &&
          m.winner !== "TBD"
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10),
  [matches, away]
);

  const headToHeadMatches = useMemo(
    () =>
      [...matches]
        .filter(
          match =>
            match.winner !== "TBD" &&
            ((match.homeTeam === home && match.awayTeam === away) ||
              (match.homeTeam === away && match.awayTeam === home))
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10),
    [matches, home, away]
  );

  const headToHeadStats = useMemo(() => {
    const total = headToHeadMatches.length;
    if (!total) return null;

    const rate = count => (count / total) * 100;
    let over15 = 0;
    let over25 = 0;
    let over35 = 0;
    let bothTeamsScored = 0;
    let over85Corners = 0;
    let teamOver45Corners = 0;
    let yellowOver25 = 0;
    let yellowOver35 = 0;
    let redOver05 = 0;
    let penaltyOver25 = 0;
    let penaltyOver35 = 0;
    let penaltyOver45 = 0;

    headToHeadMatches.forEach(match => {
      const goalHome = Number(match.goalHome) || 0;
      const goalAway = Number(match.goalAway) || 0;
      const totalGoals = goalHome + goalAway;
      const cornerHome = Number(match.cornerHome) || 0;
      const cornerAway = Number(match.cornerAway) || 0;
      const totalCorners = cornerHome + cornerAway;
      const yellowHome = Number(match.yellowHome) || 0;
      const yellowAway = Number(match.yellowAway) || 0;
      const redHome = Number(match.redHome) || 0;
      const redAway = Number(match.redAway) || 0;
      const totalYellow = yellowHome + yellowAway;
      const totalRed = redHome + redAway;
      const penaltyScore = yellowHome + yellowAway + (redHome + redAway) * 2;

      if (totalGoals > 1.5) over15++;
      if (totalGoals > 2.5) over25++;
      if (totalGoals > 3.5) over35++;
      if (goalHome > 0 && goalAway > 0) bothTeamsScored++;
      if (totalCorners > 8.5) over85Corners++;
      if (cornerHome > 4.5) teamOver45Corners++;
      if (cornerAway > 4.5) teamOver45Corners++;
      if (totalYellow > 2.5) yellowOver25++;
      if (totalYellow > 3.5) yellowOver35++;
      if (totalRed > 0.5) redOver05++;
      if (penaltyScore > 2.5) penaltyOver25++;
      if (penaltyScore > 3.5) penaltyOver35++;
      if (penaltyScore > 4.5) penaltyOver45++;
    });

    return {
      goals: {
        over15Rate: rate(over15),
        over25Rate: rate(over25),
        over35Rate: rate(over35),
        btsRate: rate(bothTeamsScored),
      },
      corners: {
        over85Rate: rate(over85Corners),
        team45Rate: (teamOver45Corners / (total * 2)) * 100,
      },
      cards: {
        over25Rate: rate(yellowOver25),
        over35Rate: rate(yellowOver35),
        RedOver05Rate: rate(redOver05),
        penaltyOver25Rate: rate(penaltyOver25),
        penaltyOver35Rate: rate(penaltyOver35),
        penaltyOver45Rate: rate(penaltyOver45),
      },
    };
  }, [headToHeadMatches]);


  return (
    <Box
      maxWidth="1200px"
      mx="auto"
      mt={3}
      px={2}
      pb={4}
      sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", overflowX: "hidden" }}
    >
      {/* Başlık */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, sm: 3 },
          mb: 3,
          borderRadius: 3,
          color: "#fff",
          background: "linear-gradient(115deg, #111827 0%, #1f2937 58%, #0f766e 150%)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.18)",
          "&::after": {
            content: '""',
            position: "absolute",
            width: 220,
            height: 220,
            right: -80,
            top: -110,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems="center"
          justifyContent="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            component="img"
            src={getTeamLogo(home)}
            alt={`${home} logosu`}
            sx={{
              width: { xs: 72, sm: 92 },
              height: { xs: 72, sm: 92 },
              objectFit: "contain",
              flexShrink: 0,
              p: 1,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.96)",
              border: "4px solid rgba(255,255,255,0.18)",
            }}
          />

          <Stack spacing={1} alignItems="center" sx={{ minWidth: 0, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" justifyContent="center">
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, fontSize: { xs: "1.8rem", sm: "2.5rem" }, lineHeight: 1.1 }}>
                {home}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, opacity: 0.9 }}>
                -
              </Typography>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, fontSize: { xs: "1.8rem", sm: "2.5rem" }, lineHeight: 1.1 }}>
                {away}
              </Typography>
            </Stack>

            <Chip
              icon={
                <Box
                  component="img"
                  src={getLeagueLogo(leagueName)}
                  alt={leagueName}
                  sx={{ width: 50, height: 50, objectFit: "contain" }}
                />
              }
              label={leagueName}
              size="medium"
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontWeight: 700,
                fontSize: "0.96rem",
                height: 34,
                px: 0.75,
                borderRadius: 999,
                "& .MuiChip-icon": {
                  marginLeft: "10px",
                  marginRight: "4px",
                  width: 22,
                  height: 22,
                },
                "& .MuiChip-label": {
                  px: 0.75,
                  lineHeight: 1.2,
                },
              }}
            />
          </Stack>

          <Box
            component="img"
            src={getTeamLogo(away)}
            alt={`${away} logosu`}
            sx={{
              width: { xs: 72, sm: 92 },
              height: { xs: 72, sm: 92 },
              objectFit: "contain",
              flexShrink: 0,
              p: 1,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.96)",
              border: "4px solid rgba(255,255,255,0.18)",
            }}
          />
        </Stack>
      </Box>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={8}
        alignItems="stretch"
        sx={{ width: "100%" }}
      >
        {/* EV SAHİBİ */}
        <Box sx={{ flex: 1, minWidth: 0, pr: 3}}>
          <Paper sx={{ width: "100%", maxWidth: 600, minWidth: 0, mx: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              onClick={() => navigate(`/team/${league}/${home}`)}
              sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline", color: "primary.main" } }}
            >
              {home}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ev sahibi takımın gol, korner ve kart profili (seçili sezon ve lig filtresi bazlı).
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
              {homeCompetitionOptions.map(option => {
                const matchCount = getScopeMatchCount(home, option);
                const isSelected = homeScope === option;
                return (
                  <Box key={option} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                    <Button
                      size="small"
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => setHomeScope(option)}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        minWidth: 0,
                        px: option === "all" ? 1.5 : 0.75,
                        ...(isSelected
                          ? { backgroundColor: "#0f766e", color: "#fff", borderColor: "#0f766e" }
                          : { color: "#0f172a", borderColor: "rgba(15, 23, 42, 0.2)" }),
                      }}
                    >
                      {option === "all" ? (
                        "Tüm Maçlar"
                      ) : (
                        <Box
                          component="img"
                          src={getLeagueLogo(option)}
                          alt={option}
                          sx={{ width: 50, height: 50, objectFit: "contain", display: "block" }}
                        />
                      )}
                    </Button>

                    <Typography
                      variant="caption"
                      sx={{
                        color: isSelected ? "#0f766e" : "text.secondary",
                        fontWeight: isSelected ? 700 : 500,
                        maxWidth: 120,
                        textAlign: "center",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {`${matchCount} maç`}
                    </Typography>

                    
                  </Box>
                );
              })}
            </Stack>

            {/* Gol tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Gol İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <MetricGaugeGrid
                  items={[
                    { label: " 1.5 Üst", value: homeGoals?.over15Rate },
                    { label: " 2.5 Üst", value: homeGoals?.over25Rate },
                    { label: " 3.5 Üst", value: homeGoals?.over35Rate },
                    { label: "KG Var", value: homeGoals?.btsRate },
                  ]}
                />
                <Table sx={{ display: "none" }} size="small" stickyHeader>
                  <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d", color: "#fff", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>Metri̇k</TableCell>
                      <TableCell align="center">Oran</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {homeGoals ? (
                      <>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>1.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeGoals.over15Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>2.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeGoals.over25Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>3.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeGoals.over35Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>KG Var</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeGoals.btsRate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ color: "#fff" }}>
                          Veri yok
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Korner tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Korner İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <MetricGaugeGrid
                  items={[
                    { label: "Maç Başı Korner", value: homeCorners?.avgMatchCorners, displayValue: homeCorners?.avgMatchCorners?.toFixed(2), isRate: false },
                    { label: "Toplam 8.5 Üst", value: homeCorners?.over85Rate },
                    { label: "Toplam 9.5 Üst", value: homeCorners?.over95Rate },
                    { label: "Toplam 10.5 Üst", value: homeCorners?.over105Rate },
                    { label: "Takım 4.5 Üst", value: homeCorners?.team45Rate },
                    { label: "Takım 5.5 Üst", value: homeCorners?.team55Rate },
                  ]}
                />
                <Table sx={{ display: "none" }} size="small" stickyHeader>
                  <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d", color: "#fff", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>Metri̇k</TableCell>
                      <TableCell align="center">Oran</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {homeCorners ? (
                      <>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Maç Başı Korner</TableCell>
                          <TableCell align="center" sx={{ color: "#fff" }}>
                            {homeCorners.avgMatchCorners.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Toplam 8.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCorners.over85Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Toplam 9.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCorners.over95Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Toplam 10.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCorners.over105Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Takım 4.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCorners.team45Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Takım 5.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCorners.team55Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ color: "#fff" }}>
                          Veri yok
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Kart tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Kart İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <MetricGaugeGrid
                  items={[
                    { label: "Sarı Kart 2.5 Üst", value: homeCards?.over25Rate },
                    { label: "Sarı Kart 3.5 Üst", value: homeCards?.over35Rate },
                    { label: "Kırmızı Kart 0.5 Üst", value: homeCards?.RedOver05Rate },
                    { label: "Ceza Skoru 2.5 Üst", value: homeCards?.penaltyOver25Rate },
                    { label: "Ceza Skoru 3.5 Üst", value: homeCards?.penaltyOver35Rate },
                    { label: "Ceza Skoru 4.5 Üst", value: homeCards?.penaltyOver45Rate },
                  ]}
                />
                <Table sx={{ display: "none" }} size="small" stickyHeader>
                  <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d", color: "#fff", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>Metri̇k</TableCell>
                      <TableCell align="center">Oran</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {homeCards ? (
                      <>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Sarı Kart 2.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCards.over25Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Sarı Kart 3.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCards.over35Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Kırmızı Kart (0.5 Üst)</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCards.RedOver05Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Ceza Skoru 2.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCards.penaltyOver25Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Ceza Skoru 3.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCards.penaltyOver35Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Ceza Skoru 4.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(homeCards.penaltyOver45Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ color: "#fff" }}>
                          Veri yok
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Son 10 maç */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Son 10 Maç Analizi
              </Typography>
              <TeamFixture matches={homeLast10} team={home} league={leagueName} display={"none"} matchWidth="100%" />
            </Box>
          </Paper>
        </Box>

        {/* DEPLASMAN */}
        <Box sx={{ flex: 1, minWidth: 0, pr: 3 }}>
          <Paper sx={{ width: "100%", maxWidth: 600, minWidth: 0, mx: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              onClick={() => navigate(`/team/${league}/${away}`)}
              sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline", color: "primary.main" } }}
            >
              {away}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deplasman takımının gol, korner ve kart profili (seçili sezon ve lig filtresi bazlı).
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
              {awayCompetitionOptions.map(option => {
                const matchCount = getScopeMatchCount(away, option);
                const isSelected = awayScope === option;
                return (
                  <Box key={option} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                    <Button
                      size="small"
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => setAwayScope(option)}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        minWidth: 0,
                        px: option === "all" ? 1.5 : 0.75,
                        ...(isSelected
                          ? { backgroundColor: "#0f766e", color: "#fff", borderColor: "#0f766e" }
                          : { color: "#0f172a", borderColor: "rgba(15, 23, 42, 0.2)" }),
                      }}
                    >
                      {option === "all" ? (
                        "Tüm Maçlar"
                      ) : (
                        <Box
                          component="img"
                          src={getLeagueLogo(option)}
                          alt={option}
                          sx={{ width: 50, height: 50, objectFit: "contain", display: "block" }}
                        />
                      )}
                    </Button>

                    <Typography
                      variant="caption"
                      sx={{
                        color: isSelected ? "#0f766e" : "text.secondary",
                        fontWeight: isSelected ? 700 : 500,
                        maxWidth: 120,
                        textAlign: "center",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {`${matchCount} maç`}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            {/* Gol tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Gol İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <MetricGaugeGrid
                  items={[
                    { label: "1.5 Üst", value: awayGoals?.over15Rate },
                    { label: "2.5 Üst", value: awayGoals?.over25Rate },
                    { label: "3.5 Üst", value: awayGoals?.over35Rate },
                    { label: "KG Var", value: awayGoals?.btsRate },
                  ]}
                />
                <Table sx={{ display: "none" }} size="small" stickyHeader>
                  <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d", color: "#fff", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>Metri̇k</TableCell>
                      <TableCell align="center">Oran</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {awayGoals ? (
                      <>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>1.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayGoals.over15Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}> 2.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayGoals.over25Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}> 3.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayGoals.over35Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>KG Var</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayGoals.btsRate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ color: "#fff" }}>
                          Veri yok
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Korner tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Korner İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <MetricGaugeGrid
                  items={[
                    { label: "Maç Başı Korner", value: awayCorners?.avgMatchCorners, displayValue: awayCorners?.avgMatchCorners?.toFixed(2), isRate: false },
                    { label: "Toplam 8.5 Üst", value: awayCorners?.over85Rate },
                    { label: "Toplam 9.5 Üst", value: awayCorners?.over95Rate },
                    { label: "Toplam 10.5 Üst", value: awayCorners?.over105Rate },
                    { label: "Takım 4.5 Üst", value: awayCorners?.team45Rate },
                    { label: "Takım 5.5 Üst", value: awayCorners?.team55Rate },
                  ]}
                />
                <Table sx={{ display: "none" }} size="small" stickyHeader>
                  <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d", color: "#fff", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>Metri̇k</TableCell>
                      <TableCell align="center">Oran</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {awayCorners ? (
                      <>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Maç Başı Korner</TableCell>
                          <TableCell align="center" sx={{ color: "#fff" }}>
                            {awayCorners.avgMatchCorners.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Toplam 8.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCorners.over85Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Toplam 9.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCorners.over95Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Toplam 10.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCorners.over105Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Takım 4.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCorners.team45Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Takım 5.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCorners.team55Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ color: "#fff" }}>
                          Veri yok
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Kart tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Kart İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <MetricGaugeGrid
                  items={[
                    { label: "Sarı Kart 2.5 Üst", value: awayCards?.over25Rate },
                    { label: "Sarı Kart 3.5 Üst", value: awayCards?.over35Rate },
                    { label: "Kırmızı Kart 0.5 Üst", value: awayCards?.RedOver05Rate },
                    { label: "Ceza Skoru 2.5 Üst", value: awayCards?.penaltyOver25Rate },
                    { label: "Ceza Skoru 3.5 Üst", value: awayCards?.penaltyOver35Rate },
                    { label: "Ceza Skoru 4.5 Üst", value: awayCards?.penaltyOver45Rate },
                  ]}
                />
                <Table sx={{ display: "none" }} size="small" stickyHeader>
                  <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d", color: "#fff", fontWeight: "bold" } }}>
                    <TableRow>
                      <TableCell>Metri̇k</TableCell>
                      <TableCell align="center">Oran</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {awayCards ? (
                      <>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Sarı Kart 2.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCards.over25Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Sarı Kart 3.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCards.over35Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Kırmızı Kart (0.5 Üst)</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCards.RedOver05Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Ceza Skoru 2.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCards.penaltyOver25Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Ceza Skoru 3.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCards.penaltyOver35Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Ceza Skoru 4.5 Üst</TableCell>
                          {(() => {
                            const { text, bg } = formatRateCell(awayCards.penaltyOver45Rate);
                            return (
                              <TableCell align="center" sx={{ backgroundColor: bg, color: "#000" }}>
                                {text}
                              </TableCell>
                            );
                          })()}
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ color: "#fff" }}>
                          Veri yok
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Son 10 maç */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Son 10 Maç Analizi
              </Typography>
              <TeamFixture matches={awayLast10} team={away} league={leagueName} display={"none"} matchWidth="100%" />
            </Box>
          </Paper>
        </Box>
      </Stack>

      <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Karşılıklı Maçlar
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {home} ve {away} takımlarının daha önce oynadığı maçların istatistikleri.
        </Typography>
        {headToHeadMatches.length ? (
          <TeamFixture
            matches={headToHeadMatches}
            team={home}
            league={leagueName}
            display="none"
            matchWidth="100%"
            showResultColor={false}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Bu takımlar arasında oynanmış maç bulunamadı.
          </Typography>
        )}
        {headToHeadStats && (
          <Stack spacing={2} mt={3} mb={3}>
            <Paper sx={{ backgroundColor: "#f5f5f5", p: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Karşılıklı Gol İstatistikleri
              </Typography>
              <MetricGaugeGrid
                items={[
                  { label: "1.5 Üst", value: headToHeadStats.goals.over15Rate },
                  { label: "2.5 Üst", value: headToHeadStats.goals.over25Rate },
                  { label: "3.5 Üst", value: headToHeadStats.goals.over35Rate },
                  { label: "KG Var", value: headToHeadStats.goals.btsRate },
                ]}
              />
            </Paper>
            <Paper sx={{ backgroundColor: "#f5f5f5", p: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Karşılıklı Korner İstatistikleri
              </Typography>
              <MetricGaugeGrid
                items={[
                  { label: "Toplam 8.5 Üst", value: headToHeadStats.corners.over85Rate },
                  { label: "Takım 4.5 Üst", value: headToHeadStats.corners.team45Rate },
                ]}
              />
            </Paper>
            <Paper sx={{ backgroundColor: "#f5f5f5", p: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Karşılıklı Kart İstatistikleri
              </Typography>
              <MetricGaugeGrid
                items={[
                  { label: "Sarı Kart 2.5 Üst", value: headToHeadStats.cards.over25Rate },
                  { label: "Sarı Kart 3.5 Üst", value: headToHeadStats.cards.over35Rate },
                  { label: "Kırmızı Kart 0.5 Üst", value: headToHeadStats.cards.RedOver05Rate },
                  { label: "Ceza Skoru 2.5 Üst", value: headToHeadStats.cards.penaltyOver25Rate },
                  { label: "Ceza Skoru 3.5 Üst", value: headToHeadStats.cards.penaltyOver35Rate },
                  { label: "Ceza Skoru 4.5 Üst", value: headToHeadStats.cards.penaltyOver45Rate },
                ]}
              />
            </Paper>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MatchDetail;
