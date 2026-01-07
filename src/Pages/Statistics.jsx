import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack, Box, Autocomplete, TextField 
} from "@mui/material";
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import playedMatches from "/white-soccer-field.png";
import { teamLogos } from "../Components/teamLogos.js";

function Statistics() {
  const { matches, leagues } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [selectedLeague, setSelectedLeague] = useState("Premier League");

  function firstHalfGoals(goalMinutes) {
    console.log(goalMinutes);
  if (!goalMinutes) return 0;

  return goalMinutes
    .split("|")
    .map(parseMinute)
    .filter(m => m !== null && m <= 45)
    .length;
}

function parseMinute(minute) {
  if (!minute) return null;
  return Number(minute.split("+")[0]);
}

function getFirstHalfWinner(match) {
  console.log(match);
  const homeGoalsFH = firstHalfGoals(match.homeGoalsMinutes);
  const awayGoalsFH = firstHalfGoals(match.awayGoalsMinutes);

  if (homeGoalsFH > awayGoalsFH) return "HOME";
  if (awayGoalsFH > homeGoalsFH) return "AWAY";
  return "DRAW";
}

  /* ==========================
     FILTER MATCHES
  ========================== */
  const leagueMatches = useMemo(() => {
    return matches.filter(
      m => m.league === selectedLeague && m.winner !== "TBD"
    );
  }, [matches, selectedLeague]);

  /* ==========================
     CALCULATE STATS
  ========================== */
  const stats = useMemo(() => {
    const table = {};

    function initTeam(team) {
      if (!table[team]) {
        table[team] = {
          team,
          played: 0,
          shots: 0,
          shotsOnTarget: 0,
          fouls: 0,
          possession: 0,
          fh_win: 0,
          fh_draw: 0,
          fh_lose: 0,
          fh_over05: 0
        };
      }
    }

    for (const m of leagueMatches) {
      initTeam(m.homeTeam);
      initTeam(m.awayTeam);

      // HOME
      table[m.homeTeam].played++;
      table[m.homeTeam].shots += m.shotsHome;
      table[m.homeTeam].shotsOnTarget += m.shotsOnTargetHome;
      table[m.homeTeam].fouls += m.foulsHome;
      table[m.homeTeam].possession += m.possessionHome;

      // AWAY
      table[m.awayTeam].played++;
      table[m.awayTeam].shots += m.shotsAway;
      table[m.awayTeam].shotsOnTarget += m.shotsOnTargetAway;
      table[m.awayTeam].fouls += m.foulsAway;
      table[m.awayTeam].possession += m.possessionAway;

      const result = getFirstHalfWinner(m);

      if (result === "HOME") {
        table[m.homeTeam].fh_win++;
        table[m.awayTeam].fh_lose++;
      } 
      else if (result === "AWAY") {
        table[m.awayTeam].fh_win++;
        table[m.homeTeam].fh_lose++;
      } 
      else {
        table[m.homeTeam].fh_draw++;
        table[m.awayTeam].fh_draw++;
      }

      const checkOver05 = firstHalfGoals(m.homeGoalsMinutes) + firstHalfGoals(m.awayGoalsMinutes) > 0;

      if (checkOver05) {
        table[m.homeTeam].fh_over05++;
        table[m.awayTeam].fh_over05++;
      }
    }

    return Object.values(table).map(t => ({
      team: t.team,
      matchCount: t.played,
      shotsAvg: (t.shots / t.played).toFixed(2),
      shotsOnTargetAvg: (t.shotsOnTarget / t.played).toFixed(2),
      foulsAvg: (t.fouls / t.played).toFixed(2),
      possessionAvg: (t.possession / t.played).toFixed(1),
      firstHalfWinsAvg: ((t.fh_win / t.played) * 100).toFixed(2),
      firstHalfGoalsOver05Rate: ((t.fh_over05 / t.played) * 100).toFixed(2)
    }));
  }, [leagueMatches]);

  /* ==========================
     RENDER
  ========================== */
  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>

        {/* Lig seçimi */}
        <Box sx={{ width: '70%' }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
          <Typography textAlign="center" variant="h5" sx={{ color: "#fff", fontWeight: "bold"}}>
            {selectedLeague} - İstatistikleri
          </Typography>

          <Autocomplete
            options={leagues}
            value={selectedLeague}
            onChange={(event, val) => setSelectedLeague(val)}
            renderInput={(params) => <TextField {...params} label="Lig Seç" />}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
              mt: 4, pl: 1.5, pr: 1.5, mb: 3,
            }}
          />          
        </Box>

        <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              width: isMobile ? '100%' : '70%',              
              backgroundColor: "#2a3b47",
              overflow: 'hidden',
              borderRadius: 0             
            }}
          >
            <Table size="small" stickyHeader sx={{borderRadius: 0}}>
              <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d" } }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 2 : 2, pl: isMobile ? 0 : 2 }}></TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 2 : 2, pl: isMobile ? 0 : 2 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                  <Stack alignItems={'center'}>
                    <img
                      src={playedMatches}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">Şut</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">İsabetli Şut</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">Faul</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">İy kazanır</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stats.map(row => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#2c2c2c" } }}>
                    <TableCell sx={{ color: "#fff", fontSize: '12px', pr: isMobile ? "1px" : 2, pl: isMobile ? 1 : 2 }}>{row.rank}</TableCell>
                    <TableCell sx={{ color: "#fff",fontSize: '12px', pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}   // icon ile yazı arasındaki boşluk
                      >
                        <img
                          src={teamLogos[row.team]}
                          alt={row.team}
                          style={{ width: 22, height: 22 }}
                        />
                        <span>{row.team}</span>
                    </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.matchCount}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.shotsAvg}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.shotsOnTargetAvg}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.foulsAvg}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.firstHalfWinsAvg}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        
      </Stack>
    </Stack>
  );
}

export default Statistics;
