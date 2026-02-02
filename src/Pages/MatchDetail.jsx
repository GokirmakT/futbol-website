import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Grid,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import { useData } from "../context/DataContext";
import TeamFixture from "../Components/TeamFixture.jsx";

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
  if (value == null || Number.isNaN(Number(value))) return { text: "—", bg: "#e0e0e0" };
  const num = Number(value);
  return { text: `${num.toFixed(1)}%`, bg: getBgColor(num) };
};

const MatchDetail = () => {
  const { league, home, away } = useParams();
  const {
    matches,
    goalStats,
    cardStats,
    cornerStats,
    setSelectedLeague,
    selectedLeague,
  } = useData();

  const leagueName = leagueNameMap[league] || league;

  useEffect(() => {
    if (leagueName && leagueName !== selectedLeague) {
      setSelectedLeague(leagueName);
    }
  }, [leagueName, selectedLeague, setSelectedLeague]);

  const homeGoals = useMemo(
    () => goalStats.find(t => t.team === home),
    [goalStats, home]
  );
  const awayGoals = useMemo(
    () => goalStats.find(t => t.team === away),
    [goalStats, away]
  );

  const homeCorners = useMemo(
    () => cornerStats.find(t => t.team === home),
    [cornerStats, home]
  );
  const awayCorners = useMemo(
    () => cornerStats.find(t => t.team === away),
    [cornerStats, away]
  );

  const homeCards = useMemo(
    () => cardStats.find(t => t.team === home),
    [cardStats, home]
  );
  const awayCards = useMemo(
    () => cardStats.find(t => t.team === away),
    [cardStats, away]
  );

const homeLast5 = useMemo(
  () =>
    [...matches]
      .filter(
        m =>
          (m.homeTeam === home || m.awayTeam === home) &&
          m.winner !== "TBD"
      )
      // 1️⃣ önce en yeniye göre sırala
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      // 2️⃣ son 5 maçı al
      .slice(0, 5)
      // 3️⃣ bu 5 maçı kendi içinde eski → yeni sırala
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
  [matches, home]
);

const awayLast5 = useMemo(
  () =>
    [...matches]
      .filter(
        m =>
          (m.homeTeam === away || m.awayTeam === away) &&
          m.winner !== "TBD"
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
  [matches, away]
);


  return (
    <Box maxWidth="1200px" mx="auto" mt={3} px={2} pb={4}>
      {/* Başlık */}
      <Stack alignItems="center" spacing={1} mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Maç Analizi: {home} - {away}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={leagueName} size="small" />
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* EV SAHİBİ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {home}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ev sahibi takımın gol, korner ve kart profili (lig geneli istatistikler).
            </Typography>

            {/* Gol tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Gol İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#2a3b47",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Table size="small" stickyHeader>
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
                          <TableCell sx={{ color: "#fff" }}>Over 1.5</TableCell>
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
                          <TableCell sx={{ color: "#fff" }}>Over 2.5</TableCell>
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
                          <TableCell sx={{ color: "#fff" }}>Over 3.5</TableCell>
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
                  backgroundColor: "#2a3b47",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Table size="small" stickyHeader>
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
                  backgroundColor: "#2a3b47",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Table size="small" stickyHeader>
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

            {/* Son 5 maç */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Son 5 Maç Analizi
              </Typography>
              <TeamFixture matches={homeLast5} team={home} league={""} display={"none"}/>
            </Box>
          </Paper>
        </Grid>

        {/* DEPLASMAN */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {away}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deplasman takımının gol, korner ve kart profili (lig geneli istatistikler).
            </Typography>

            {/* Gol tablosu */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Gol İstatistikleri
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#2a3b47",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Table size="small" stickyHeader>
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
                          <TableCell sx={{ color: "#fff" }}>Over 1.5</TableCell>
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
                          <TableCell sx={{ color: "#fff" }}>Over 2.5</TableCell>
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
                          <TableCell sx={{ color: "#fff" }}>Over 3.5</TableCell>
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
                  backgroundColor: "#2a3b47",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Table size="small" stickyHeader>
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
                  backgroundColor: "#2a3b47",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Table size="small" stickyHeader>
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

            {/* Son 5 maç */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Son 5 Maç Analizi
              </Typography>
              <TeamFixture matches={awayLast5} team={away} league={""} display={"none"} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MatchDetail;
