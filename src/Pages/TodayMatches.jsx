import { useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell, TableHead, TableContainer
} from "@mui/material";
import { useData } from "../context/DataContext";
import { getTeamLogo } from "../Components/teamLogos.js";
import football from "/football.png";
import card from "/yellow-card.png";
import corner from "/corner.png";
import useMediaQuery from "@mui/material/useMediaQuery";
 

function TodayMatches() {
  const { goalStatsByLeague, cornerStatsByLeague, cardStatsByLeague, matches, isLoading, error } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");

    const getBgColor = (percent) => {
    if (percent === "—" || percent == null || (typeof percent === "string" && isNaN(Number(percent)))) return "#e0e0e0";
    const n = Number(percent);
    if (n <= 20) return "#ff4d4d";
    if (n <= 40) return "#ff944d";
    if (n <= 60) return "#ffd11a";
    if (n <= 80) return "#b3ff66";
    return "#66ff66";
    };

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

              const leagueGoalStats = goalStatsByLeague?.[match.league] ?? [];
              const leagueCornerStats = cornerStatsByLeague?.[match.league] ?? [];
              const leagueCardStats = cardStatsByLeague?.[match.league] ?? [];

              const homeGoalStats = leagueGoalStats.find(t => t.team === match.homeTeam);
              const awayGoalStats = leagueGoalStats.find(t => t.team === match.awayTeam);
              const homeGoalOver25 = homeGoalStats?.over25Rate != null ? homeGoalStats.over25Rate.toFixed(0) : "—";
              const awayGoalOver25 = awayGoalStats?.over25Rate != null ? awayGoalStats.over25Rate.toFixed(0) : "—";

              const homeCornerStats = leagueCornerStats.find(t => t.team === match.homeTeam);
              const awayCornerStats = leagueCornerStats.find(t => t.team === match.awayTeam);
              const homeCornerOver85 = homeCornerStats?.over85Rate != null ? homeCornerStats.over85Rate.toFixed(0) : "—";
              const awayCornerOver85 = awayCornerStats?.over85Rate != null ? awayCornerStats.over85Rate.toFixed(0) : "—";

              const homeCardStats = leagueCardStats.find(t => t.team === match.homeTeam);
              const awayCardStats = leagueCardStats.find(t => t.team === match.awayTeam);
              const homeCardOver35 = homeCardStats?.over35Rate != null ? homeCardStats.over35Rate.toFixed(0) : "—";
              const awayCardOver35 = awayCardStats?.over35Rate != null ? awayCardStats.over35Rate.toFixed(0) : "—";

              

              return (
                <Box key={i} mb={2}>
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
                      
                        <TableRow  sx={{ "&:hover": { backgroundColor: "#cecece" } }}>
                        
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeGoalOver25), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{homeGoalOver25 === "—" ? "—" : `${homeGoalOver25}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeCornerOver85), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{homeCornerOver85 === "—" ? "—" : `${homeCornerOver85}%`}</TableCell>
                          <TableCell align="center" sx={{color: "#000000ff",backgroundColor: getBgColor(homeCardOver35), fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{homeCardOver35 === "—" ? "—" : `${homeCardOver35}%`}</TableCell>
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
