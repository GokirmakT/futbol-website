import { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Stack,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/TeamLogos.js";

function Standings() {
  const { leagueId } = useParams();
  const {matches, standings, isLoadingStandings, selectedLeague, setSelectedLeague, standingsError } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");

  // League ID'yi backend lig ismine çevir
  const leagueIdToName = {
    "superlig": "Super Lig",
    "premier-league": "Premier League",
    "efl-championship": "EFL Championship",
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
    "saudi-pro-league": "Saudi Pro League"
  };

  const getLast5Form = (teamName, matches) => {
    if (!matches?.length) return [];
  
    return matches
      .filter(
        m =>          
          m.winner !== "TBD" &&
          (m.homeTeam === teamName || m.awayTeam === teamName)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-5)
      .map(m => {
        if (m.winner === "Draw") return "D";
  
        if (m.homeTeam === teamName) {
          return m.winner === "Home" ? "W" : "L";
        }
  
        if (m.awayTeam === teamName) {
          return m.winner === "Away" ? "W" : "L";
        }
  
        return "";
      });
  };   

  // URL'den gelen leagueId varsa, o lige göre filtrele
  const currentLeague = leagueId ? (leagueIdToName[leagueId] || selectedLeague) : selectedLeague;

  // URL'den lig geldiğinde state'i güncelle
  useEffect(() => {    
    if (leagueId && leagueIdToName[leagueId]) {
      setSelectedLeague(leagueIdToName[leagueId]);
    }
  }, [leagueId, setSelectedLeague]);

  // Seçilen lige göre sıralanmış puan durumu
  const sortedStandings = useMemo(() => {
    if (!standings.length || !currentLeague) return [];

    // Lige göre filtrele (hem camelCase hem PascalCase desteği)
    const leagueStandings = standings.filter(
      (s) => (s.league || s.League) === currentLeague
    );

    // Futbol puan tablosu kurallarına göre sırala:
    // 1. Puan (yüksekten düşüğe)
    // 2. Averaj (GoalDiff - yüksekten düşüğe)
    // 3. Attığı gol (GoalFor - yüksekten düşüğe)
    const sorted = [...leagueStandings].sort((a, b) => {
      const aPoints = a.points || a.Points || 0;
      const bPoints = b.points || b.Points || 0;
      const aGoalDiff = a.goalDiff || a.GoalDiff || 0;
      const bGoalDiff = b.goalDiff || b.GoalDiff || 0;
      const aGoalFor = a.goalFor || a.GoalFor || 0;
      const bGoalFor = b.goalFor || b.GoalFor || 0;

      // Önce puan
      if (bPoints !== aPoints) {
        return bPoints - aPoints;
      }
      // Sonra averaj
      if (bGoalDiff !== aGoalDiff) {
        return bGoalDiff - aGoalDiff;
      }
      // Son olarak attığı gol
      return bGoalFor - aGoalFor;
    });

    // Sıralama ekle (rank) ve normalize et
    return sorted.map((team, index) => ({
      ...team,
      rank: index + 1,
      // Normalize: camelCase'e çevir
      team: team.team || team.Team || "",
      played: team.played || team.Played || 0,
      win: team.win || team.Win || 0,
      draw: team.draw || team.Draw || 0,
      lose: team.lose || team.Lose || 0,
      goalFor: team.goalFor || team.GoalFor || 0,
      goalAgainst: team.goalAgainst || team.GoalAgainst || 0,
      goalDiff: team.goalDiff || team.GoalDiff || 0,
      points: team.points || team.Points || 0,
    }));
  }, [standings, currentLeague]);

  if (isLoadingStandings) {    
    return (
      <Typography textAlign="center" sx={{ color: "#fff", mt: 3 }}>
        Yükleniyor...
      </Typography>
    );
  }

  if (standingsError) {
    return (
      <Typography textAlign="center" sx={{ color: "#ff4d4d", mt: 3 }}>
        Hata oluştu: {standingsError.message}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        py: 1,
        px: isMobile ? 0 : 4,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Puan Durumu
        </Typography>

        {currentLeague && (
          <Typography variant="h6" textAlign="center" sx={{ color: "#ccc" }}>
            {currentLeague}
          </Typography>
        )}

        {/* Puan Tablosu */}
        {currentLeague && sortedStandings.length > 0 ? (
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
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center", 
                      pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2                     
                    }}
                  >
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      pl: isMobile ? 1 : 2,
                    }}
                  >
                    Takım
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                      pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                    }}
                  >
                    O
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                      textAlign: "center",
                      pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                    }}
                  >
                    G
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFA726",
                      fontWeight: "bold",
                      textAlign: "center",
                      pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                    }}
                  >
                    B
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#EF5350",
                      fontWeight: "bold",
                      textAlign: "center",
                      pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                    }}
                  >
                    M
                  </TableCell>                  
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                      pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                    }}
                  >
                    AV
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFD700",
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#1d1d1d",                      
                      pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                    }}
                  >
                    P
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedStandings.map((team) => (
                  <TableRow
                    key={team.id || team.team}
                    sx={{
                      "&:hover": { backgroundColor: "#2c2c2c" },
                      backgroundColor:
                        team.rank <= 3
                          ? "rgba(76, 175, 80, 0.1)"
                          : team.rank >= sortedStandings.length - 2
                          ? "rgba(239, 83, 80, 0.1)"
                          : "transparent",
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                        pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2,
                        fontSize: isMobile ? "12px" : "14px"
                      }}
                    >
                      {team.rank}
                    </TableCell>
                    <TableCell sx={{ color: "#fff",  pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }}>
                      <Stack direction="column">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <img
                            src={
                              teamLogos[team.team] ||
                              "/logos/default.png"
                            }
                            alt={team.team}
                            style={{
                              width: 24,
                              height: 24,
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />                       
                          <span style={{ fontSize: isMobile ? "14px" : "14px" }}>
                            {team.team}
                          </span>      
                                                                      
                        </Stack>

                        <Stack direction="row" sx={{ mt: "3px", alignItems: "flex-end"  }} spacing={1}>
                          {getLast5Form(team.team, matches).map((r, i) => {
                            const isLastMatch = i === 4;

                            return (
                              <Box
                                key={i}
                                sx={{
                                  width: isLastMatch ? 22 : 18,
                                  height: isLastMatch ? 22 : 18,
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "4px",
                                  color: "#fff",
                                  backgroundColor:
                                    r === "W"
                                      ? "#2e7d32"
                                      : r === "D"
                                      ? "#ed6c02"
                                      : "#d32f2f",
                                }}
                              >
                                {r}
                              </Box>
                            );
                          })}
                        </Stack>    

                      </Stack>

                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                        pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                      }}
                    >
                      {team.played}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#4CAF50",
                        textAlign: "center",
                        fontWeight: "bold",
                        pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                      }}
                    >
                      {team.win}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#FFA726",
                        textAlign: "center",
                        fontWeight: "bold",
                        pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                      }}
                    >
                      {team.draw}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#EF5350",
                        textAlign: "center",
                        fontWeight: "bold",
                        pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                      }}
                    >
                      {team.lose}
                    </TableCell>                    
                    <TableCell
                      sx={{
                        color: team.goalDiff >= 0 ? "#4CAF50" : "#EF5350",
                        textAlign: "center",
                        fontWeight: "bold",
                        pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                      }}
                    >
                      {team.goalDiff >= 0 ? "+" : ""}
                      {team.goalDiff}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#FFD700",
                        textAlign: "center",
                        fontWeight: "bold",                                               
                        pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2
                      }}
                    >
                      {team.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            textAlign="center"
            sx={{ color: "#999", mt: 3 }}
          >
            {currentLeague
              ? "Bu lig için puan durumu bulunamadı."
              : "Lütfen bir lig seçiniz."}
          </Typography>
        )}

        {/* Açıklama */}
        {sortedStandings.length > 0 && (
          <Box
            sx={{
              mt: 2,              
              backgroundColor: "#2a3b47",
              borderRadius: 2,
              width: isMobile ? "100%" : "70%",
            }}
          >
            <Typography variant="body2" sx={{ color: "#ccc", fontSize: "12px", px: 1 }}>
              <strong>S:</strong> Sıra | <strong>O:</strong> Oynanan |{" "}
              <strong>G:</strong> Galibiyet | <strong>B:</strong> Beraberlik |{" "}
              <strong>M:</strong> Mağlubiyet | <strong>AV:</strong> Averaj |
              <strong> P:</strong> Puan
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#4CAF50", fontSize: "12px", mt: 1, px: 1 }}
            >
              Yeşil arka plan: Şampiyonlar Ligi / Avrupa Ligi bölgesi
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#EF5350", fontSize: "12px", px: 1 }}
            >
              Kırmızı arka plan: Düşme hattı
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default Standings;

