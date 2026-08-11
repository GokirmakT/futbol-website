import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Typography, Stack, Divider, Box, Chip, Select, MenuItem } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useData } from "../context/DataContext";
import GoalsStats from "../Components/TeamDetail_Goal.jsx";
import CornerStats from "../Components/TeamDetail_Corner.jsx";
import CardStats from "../Components/TeamDetail_Card.jsx";
import TeamFixture from "../Components/TeamFixture.jsx";
import { getTeamLogo } from "../Components/teamLogos.js";

const leagueLogos = {
  "Super Lig": "/leagues/Super Lig.png",
  "Süper Lig": "/leagues/Super Lig.png",
  "Premier League": "/leagues/Premier League.png",
  "EFL Championship": "/leagues/EFL Championship.png",
  LaLiga: "/leagues/LaLiga.png",
  "Serie A": "/leagues/Serie A.png",
  Bundesliga: "/leagues/Bundesliga.png",
  "Ligue 1": "/leagues/Ligue 1.png",
  Eredivisie: "/leagues/Eredivisie.png",
  "UEFA Champions League": "/leagues/UEFA Champions League.png",
  "UEFA Europa League": "/leagues/UEFA Europa League.png",
  "UEFA Europa Conference League": "/leagues/UEFA Europa Conference League.png",
  "UEFA Champions League Qualifying": "/leagues/UEFA Champions League.png",
  "UEFA Europa League Qualifying": "/leagues/UEFA Europa League.png",
  "UEFA Conference League Qualifying": "/leagues/UEFA Europa Conference League.png",
  "Primeira Liga": "/leagues/primeira-liga.webp",
  "Pro League": "/leagues/pro-league.webp",
  "Saudi Pro League": "/leagues/saudi-pro-league.png"
};

const getLeagueLogo = leagueName => leagueLogos[leagueName] || "/leagues/Super Lig.png";

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
  "saudi-pro-league": "Saudi Pro League"
};
const normalizeLeague = value => String(value ?? "")
  .toLocaleLowerCase("tr-TR")
  .replace(/[ıİ]/g, "i")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

const TeamDetail = () => {
  const { league, team } = useParams();
  const { matches, goalStats, setSelectedLeague, selectedLeague, selectedSeason } = useData();
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState(selectedSeason || "2026-2027");
  const leagueLabel = leagueNameMap[league] || league;
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState(leagueLabel || "");

  const availableSeasons = useMemo(() => {
    if (!matches?.length) return ["2026-2027"];
    return [...new Set(matches.map(m => m.season).filter(Boolean))].sort();
  }, [matches]);

  // URL'den gelen lig parametresini selectedLeague'e set et
  useEffect(() => {
    console.log("URL lig parametresi:", league);
    if (league) {
      // URL'deki lig ismini backend formatına çevir
      const leagueName = leagueNameMap[league] || league;
      if (leagueName !== selectedLeague) {
        setSelectedLeague(leagueName);
      }
    }
  }, [league, selectedLeague, setSelectedLeague]);

  // ✅ SADECE SEÇİLEN TAKIMIN MAÇLARI (sezon filtresi dahil)
  const teamMatches = useMemo(() => {
    return matches.filter(
      m =>
        (m.homeTeam === team || m.awayTeam === team) &&
        m.season === selectedSeasonFilter &&
        (!selectedLeagueFilter || normalizeLeague(m.league) === normalizeLeague(selectedLeagueFilter))
    );
  }, [matches, team, selectedSeasonFilter, selectedLeagueFilter]);

  const sortedTeamMatches = useMemo(
    () => [...teamMatches].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [teamMatches]
  );

  const teamLeagueOptions = useMemo(() => {
    return [...new Set(
      matches
        .filter(
          m =>
            (m.homeTeam === team || m.awayTeam === team) &&
            m.season === selectedSeasonFilter
        )
        .map(m => m.league)
        .filter(Boolean)
    )];
  }, [matches, team, selectedSeasonFilter]);

  useEffect(() => {
    setSelectedLeagueFilter("");
  }, [selectedSeasonFilter]);

  const selectedLeagueValue = teamLeagueOptions.find(
    option => normalizeLeague(option) === normalizeLeague(selectedLeagueFilter)
  ) || "";

  const previewMatches = useMemo(
    () => matches
      .filter(match => match.homeTeam === team || match.awayTeam === team)
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [matches, team]
  );

  const previousMatch = [...previewMatches].reverse().find(match => match.winner !== "TBD");
  const nextMatch = previewMatches.find(match => match.winner === "TBD");

  const formatMatchDate = match => match
    ? new Date(match.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "2-digit" })
    : "-";

  const MatchPreview = ({ match, title }) => {
    if (!match) {
      return (
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>{title}</Typography>
          <Box sx={{ p: 1.5, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.32)", color: "rgba(255,255,255,0.62)" }}>
            <Typography variant="body2">Maç bulunamadı</Typography>
          </Box>
        </Box>
      );
    }

    const isUpcoming = match.winner === "TBD";
    const homeScore = isUpcoming ? "-" : (match.goalHome ?? "-");
    const awayScore = isUpcoming ? "-" : (match.goalAway ?? "-");

    return (
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>{title}</Typography>
        <Box sx={{ p: 1, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.32)" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.75 }}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
              <Box component="img" src={getLeagueLogo(match.league)} alt="" sx={{ width: 20, height: 20, objectFit: "contain" }} />
              <Typography variant="caption" noWrap>{match.league}</Typography>
            </Stack>
            <Typography variant="caption" noWrap sx={{ color: "#94a3b8" }}>{formatMatchDate(match)}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Stack spacing={0.3} sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box component="img" src={getTeamLogo(match.homeTeam)} alt="" sx={{ width: 18, height: 18, objectFit: "contain" }} />
                <Typography variant="body2" noWrap>{match.homeTeam}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box component="img" src={getTeamLogo(match.awayTeam)} alt="" sx={{ width: 18, height: 18, objectFit: "contain" }} />
                <Typography variant="body2" noWrap>{match.awayTeam}</Typography>
              </Stack>
            </Stack>
            <Stack alignItems="flex-end" sx={{ minWidth: 18 }}>
              <Typography variant="body2" fontWeight="bold">{homeScore}</Typography>
              <Typography variant="body2" fontWeight="bold">{awayScore}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
      {/* HEADER */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",          
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, sm: 3 },
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
            border: "1px solid rgba(255,255,255,0.12)"
          }
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            component="img"
            src={getTeamLogo(team)}
            alt={`${team} logosu`}
            sx={{
              width: { xs: 88, sm: 108 },
              height: { xs: 88, sm: 108 },
              objectFit: "contain",
              flexShrink: 0,
              p: 1,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.96)",
              border: "4px solid rgba(255,255,255,0.18)"
            }}
          />

          <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.5rem" },
                lineHeight: 1.1,
                wordBreak: "break-word"
              }}
            >
              {team}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<PublicIcon />}
                label="Türkiye"
                size="small"
                sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.12)", "& .MuiChip-icon": { color: "#f87171" } }}
              />
              <Chip
                icon={<EmojiEventsIcon />}
                label={leagueLabel}
                size="small"
                sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.12)", "& .MuiChip-icon": { color: "#fbbf24" } }}
              />
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 2 }}
            sx={{ flex: 1, width: "100%", minWidth: 0 }}
          >
            <MatchPreview match={previousMatch} title="Önceki maç" />
            <MatchPreview match={nextMatch} title="Sonraki maç" />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ position: "relative", zIndex: 1, mt: 2, maxWidth: { sm: 410 } }}
        >
          <Select
            size="small"
            value={selectedSeasonFilter}
            onChange={event => setSelectedSeasonFilter(event.target.value)}
            sx={{
              minWidth: { sm: 150 },
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.1)",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.35)" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.7)" },
              ".MuiSvgIcon-root": { color: "#fff" }
            }}
          >
            {availableSeasons.map(season => (
              <MenuItem key={season} value={season}>{season}</MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={selectedLeagueValue}
            displayEmpty
            onChange={event => {
              const nextLeague = event.target.value;
              setSelectedLeagueFilter(nextLeague);
              setSelectedLeague(nextLeague);
            }}
            sx={{
              minWidth: { sm: 220 },
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.1)",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.35)" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.7)" },
              ".MuiSvgIcon-root": { color: "#fff" }
            }}
          >
            <MenuItem value="">Tüm Ligler</MenuItem>
            {teamLeagueOptions.map(teamLeague => (
              <MenuItem key={teamLeague} value={teamLeague}>{teamLeague}</MenuItem>
            ))}
          </Select>
        </Stack>
      </Box>

      <Divider />

      {/* Fikstür */}
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="bold">
          Fikstür
        </Typography>
        <TeamFixture
          matches={sortedTeamMatches}
          team={team}
          league={league}
          display={"block"}
          selectedSeason={selectedSeasonFilter}
          setSelectedSeason={setSelectedSeasonFilter}
          availableSeasons={availableSeasons}
          leagueFilter={selectedLeagueFilter}
          setLeagueFilter={setSelectedLeagueFilter}
          showSeasonFilter={false}
          showLeagueFilter={false}
        />
      </Stack>

      <Divider />

      {/* Gol İstatistikleri */}
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="bold">
          Gol İstatistikleri
        </Typography>
        <GoalsStats matches={teamMatches} team={team} goalStats={goalStats} />
      </Stack>

      <Divider />

      {/* Korner İstatistikleri */}
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="bold">
          Korner İstatistikleri
        </Typography>
        <CornerStats matches={teamMatches} />
      </Stack>

      <Divider />

      {/* Kart İstatistikleri */}
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="bold">
          Kart İstatistikleri
        </Typography>
        <CardStats matches={teamMatches} />
      </Stack>
    </Stack>
  );
};

export default TeamDetail;
