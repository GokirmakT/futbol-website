import { useMemo, useState } from "react";
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
  const { goalStatsByLeague, cornerStatsByLeague, cardStatsByLeague, matches, isLoading, error } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [selectedDate, setSelectedDate] = useState(new Date());

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
  const today = selectedDate.toISOString().slice(0, 10);

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

  const leagues = Object.keys(groupedMatches);/*
  if (!leagues.length) return <Typography textAlign="center">Seçilen tarihte maç yok</Typography>;*/

  return (
    <Box maxWidth="800px" mx="auto" mt={3} px={2}>
      <Typography variant="h5" textAlign="center" mb={1}>
        Maç Takvimi - {selectedDate.toLocaleDateString('tr-TR')}
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
        <Box display="flex" justifyContent="center" mb={2}>
          <DatePicker
            label="Tarih Seçin"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
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