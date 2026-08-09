import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
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

const homeLast10 = useMemo(
  () =>
    [...matches]
      .filter(
        m =>
          (m.homeTeam === home || m.awayTeam === home) &&
          m.winner !== "TBD"
      )
      // 1️⃣ önce en yeniye göre sırala
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      // 2️⃣ son 10 maçı al
      .slice(0, 10)
      // 3️⃣ bu 10 maçı kendi içinde eski → yeni sırala
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
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
      .slice(0, 10)
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
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
        .slice(0, 10)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
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
      <Stack alignItems="center" spacing={1} mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Maç Analizi: {home} - {away}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={leagueName} size="small" />
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={8}
        alignItems="stretch"
        sx={{ width: "100%" }}
      >
        {/* EV SAHİBİ */}
        <Box sx={{ flex: 1, minWidth: 0, pr: 3}}>
          <Paper sx={{ width: "100%", maxWidth: 600, minWidth: 0, mx: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
                    { label: "Takım 4.5 Üst", value: homeCorners?.team45Rate },
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
              <TeamFixture matches={homeLast10} team={home} league={""} display={"none"} matchWidth="100%" />
            </Box>
          </Paper>
        </Box>

        {/* DEPLASMAN */}
        <Box sx={{ flex: 1, minWidth: 0, pr: 3 }}>
          <Paper sx={{ width: "100%", maxWidth: 600, minWidth: 0, mx: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
                    { label: "Takım 4.5 Üst", value: awayCorners?.team45Rate },
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
              <TeamFixture matches={awayLast10} team={away} league={""} display={"none"} matchWidth="100%" />
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
            league=""
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
