import { useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Divider
} from "@mui/material";
import { useData } from "../context/DataContext";
import { teamLogos } from "../Components/TeamLogos.js";

function TodayMatches() {
  const { matches, isLoading, error } = useData();

  // UTC saatini Türkiye saatine çevir (UTC+3)
  const convertToTurkeyTime = (utcTime) => {
    if (!utcTime) return "";
    const [hours, minutes] = utcTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return utcTime;
    
    // 3 saat ekle
    let newHours = hours + 3;
    
    // 24 saat formatında tutmak için modulo
    if (newHours >= 24) {
      newHours = newHours % 24;
    }
    
    // Formatı koru (HH:mm)
    return `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  // test için sabit tarih
  const today = new Date().toISOString().slice(0, 10);

  const groupedMatches = useMemo(() => {
    if (!matches?.length) return {};

    const todayMatches = matches
      .map(m => {
        if (!m.date) return null;

        const [datePart] = m.date.split("T");

        return {
          ...m,
          datePart,
          turkeyTime: convertToTurkeyTime(m.time) // Türkiye saati hesapla
        };
      })
      .filter(m => m && m.datePart === today);    

    // 🔥 SAATİ artık direkt time alanına göre sırala (UTC'ye göre sırala ama TRT göster)
    todayMatches.sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    // Liglere göre grupla
    return todayMatches.reduce((acc, match) => {
      if (!acc[match.league]) acc[match.league] = [];
      acc[match.league].push(match);
      return acc;
    }, {});
  }, [matches, today]);

  if (isLoading) return <Typography textAlign="center">Yükleniyor...</Typography>;
  if (error) return <Typography textAlign="center">Hata oluştu</Typography>;

  const leagues = Object.keys(groupedMatches);
  if (!leagues.length) return <Typography textAlign="center">Bugün maç yok</Typography>;

  return (
    <Box maxWidth="800px" mx="auto" mt={3} px={2}>
      <Typography variant="h5" textAlign="center" mb={3}>
        Bugünün Maçları
      </Typography>

      {leagues.map(league => (
        <Box key={league} mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            {league}
          </Typography>

          <Paper>
            {groupedMatches[league].map((match, i) => {
              const isPlayed = match.winner !== "TBD";

              return (
                <Box key={i}>
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
                      <img src={teamLogos[match.homeTeam]} alt={match.homeTeam} style={{ height: 24 }} />
                      <Box component="span" sx={{ textAlign: "center" }}>
                        {match.homeTeam}
                        {isPlayed
                          ? ` ${match.goalHome} - ${match.goalAway} `
                          : " vs "}
                        {match.awayTeam}
                      </Box>
                      <img src={teamLogos[match.awayTeam]} alt={match.awayTeam} style={{ height: 24 }} />
                  </Stack>
                </Stack>

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
