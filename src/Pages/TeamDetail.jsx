import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Typography, Stack, Divider } from "@mui/material";
import { useData } from "../context/DataContext";
import GoalsStats from "../Components/TeamDetail_Goal.jsx";
import CornerStats from "../Components/TeamDetail_Corner.jsx";
import CardStats from "../Components/TeamDetail_Card.jsx";
import TeamFixture from "../Components/TeamFixture.jsx";

const TeamDetail = () => {
  const { league, team } = useParams();
  const { matches, goalStats, setSelectedLeague, selectedLeague } = useData();

  // URL'den gelen lig parametresini selectedLeague'e set et
  useEffect(() => {
    console.log("URL lig parametresi:", league);
    if (league) {
      // URL'deki lig ismini backend formatına çevir
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
        "primeira-liga": "Primeira Liga",
        "pro-league": "Pro League",

      };
      
      const leagueName = leagueNameMap[league] || league;
      if (leagueName !== selectedLeague) {
        setSelectedLeague(leagueName);
      }
    }
  }, [league, selectedLeague, setSelectedLeague]);

  // ✅ SADECE SEÇİLEN TAKIMIN MAÇLARI
  const teamMatches = matches.filter(
    m => (m.homeTeam === team || m.awayTeam === team)
  );

  const sortedTeamMatches = [...teamMatches].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );  

  return (
    <Stack spacing={3}>
      {/* HEADER */}
      <Stack spacing={0.5}>
        <Typography variant="h4">{team}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {league}
        </Typography>
      </Stack>

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
