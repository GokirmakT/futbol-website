import { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useData } from "../context/DataContext";
import { getTeamLogo } from "../Components/teamLogos.js";
import {
  IY_MS_PATTERNS,
  getIyMsResult,
  aggregateIyMsStats,
} from "../utils/iyMsUtils";

const getBgColor = (percent) => {
  if (percent === 0 || percent == null || Number.isNaN(percent)) return "#424242";
  if (percent <= 15) return "#8e0000";
  if (percent <= 30) return "#b71c1c";
  if (percent <= 45) return "#ef6c00";
  if (percent <= 60) return "#f9a825";
  if (percent <= 75) return "#7cb342";
  return "#2e7d32";
};

const IyMsAnalysis = () => {
  const { matches } = useData();

  const teams = useMemo(() => {
    const set = new Set();
    matches.forEach(m => {
      if (m.homeTeam) set.add(m.homeTeam);
      if (m.awayTeam) set.add(m.awayTeam);
    });
    return Array.from(set).sort();
  }, [matches]);

  const [selectedTeam, setSelectedTeam] = useState(teams[0] || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPatternFilter, setSelectedPatternFilter] = useState("");

  const filteredMatches = useMemo(() => {
    if (!selectedTeam) return [];
    return matches.filter(m => {
      if (!m.date) return false;
      const isTeam = m.homeTeam === selectedTeam || m.awayTeam === selectedTeam;
      if (!isTeam) return false;
      const datePart = m.date.split("T")[0];
      if (startDate && datePart < startDate) return false;
      if (endDate && datePart > endDate) return false;
      return m.winner !== "TBD";
    });
  }, [matches, selectedTeam, startDate, endDate]);

  const stats = useMemo(
    () => (selectedTeam ? aggregateIyMsStats(matches, selectedTeam) : null),
    [matches, selectedTeam]
  );

  const detailedMatches = useMemo(() => {
    return filteredMatches.map(m => ({
      ...m,
      iyms: getIyMsResult(m),
    }));
  }, [filteredMatches]);

  const visibleMatches = useMemo(() => {
    if (!selectedPatternFilter) return detailedMatches;
    return detailedMatches.filter(m => m.iyms.pattern === selectedPatternFilter);
  }, [detailedMatches, selectedPatternFilter]);

  const totalMatches = stats?.overall.total || 0;
  const totalHomeMatches = stats?.home.total || 0;
  const totalAwayMatches = stats?.away.total || 0;
  const bestPattern = stats?.mostFrequentPattern?.pattern || null;
  const bestCount = stats?.mostFrequentPattern?.count || 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#2a3b47",
        color: "#fff",
        py: 3,
      }}
    >
      <Box maxWidth="1400px" mx="auto" px={{ xs: 1.5, md: 3 }}>
        {/* Üst Bölüm */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center" flex={1}>
            {selectedTeam && (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "#263238",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 12px rgba(0,0,0,0.7)",
                }}
              >
                <img
                  src={getTeamLogo(selectedTeam)}
                  alt={selectedTeam}
                  style={{ width: 40, height: 40 }}
                />
              </Box>
            )}
            <Box>
              <Typography variant="h5" fontWeight="bold">
                İlk Yarı / Maç Sonucu Analizi
              </Typography>
              <Typography variant="body2" color="grey.400">
                Seçilen takım için 1/1, 1/X, 1/2 ... 2/2 İY/MS paternlerinin detaylı analizi
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: "#fff" }}>Takım</InputLabel>
              <Select
                label="Takım"
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
                sx={{ color: "#fff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#546e7a" } }}
              >
                {teams.map(team => (
                  <MenuItem key={team} value={team}>
                    {team}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {/* Info & Özet */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 2,
                background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
                color: "#fff",
              }}
            >
              <Typography variant="subtitle2">Toplam Maç</Typography>
              <Typography variant="h5" fontWeight="bold">
                {totalMatches}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">
                Filtrelere uyan ve sonucu belirlenmiş maç sayısı
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, backgroundColor: "#263238" }}>
              <Typography variant="subtitle2">En Sık Gelen İY/MS Paterni</Typography>
              {bestPattern ? (
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <Chip label={bestPattern} color="primary" sx={{ fontWeight: "bold" }} />
                  <Typography variant="h6" fontWeight="bold">
                    {bestCount} kez
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="grey.400">
                  Veri yok
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, backgroundColor: "#263238" }}>
              <Typography variant="subtitle2">Otomatik Analiz</Typography>
              <Typography variant="body2" color="grey.300" mt={1}>
                {bestPattern
                  ? `Bu takım için en sık görülen İY/MS paterni ${bestPattern}. Özellikle bu skora uygun maç dinamiği ve oyun tarzı dikkat çekiyor.`
                  : "Yeterli veri bulunamadı. Daha geniş tarih aralığı veya farklı takım seçerek tekrar deneyin."}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Kart Grid (9 İY/MS) */}
        <Typography variant="h6" fontWeight="bold" mb={1}>
          İY/MS Patern Kartları
        </Typography>
        <Grid container spacing={2} mb={4}>
          {IY_MS_PATTERNS.map(pattern => {
            const count = stats?.overall.patterns[pattern] || 0;
            const perc = stats?.overallPerc[pattern] || 0;
            const isBest = pattern === bestPattern && bestCount > 0;
            const isActive = selectedPatternFilter === pattern;
            return (
              <Grid item xs={12} sm={6} md={4} key={pattern}>
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: "#1c262b",
                    borderRadius: 2,
                    boxShadow: isBest
                      ? "0 0 16px rgba(255,215,0,0.6)"
                      : "0 4px 10px rgba(0,0,0,0.6)",
                    border: isActive
                      ? "1px solid #42a5f5"
                      : isBest
                      ? "1px solid #ffd54f"
                      : "1px solid #263238",
                    cursor: "pointer",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.9)",
                      borderColor: "#42a5f5",
                      backgroundColor: "#22313a",
                    },
                  }}
                  onClick={() =>
                    setSelectedPatternFilter(prev => (prev === pattern ? "" : pattern))
                  }
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="bold" color="#fff">
                      {pattern}
                    </Typography>
                    {isBest && (
                      <Chip
                        size="small"
                        label="En Sık"
                        color="warning"
                        sx={{ fontSize: 10, fontWeight: "bold" }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="grey.400">
                    Görülme sayısı:{" "}
                    <Typography component="span" fontWeight="bold">
                      {count}
                    </Typography>
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                    <Box flex={1}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, perc)}
                        sx={{
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: "#37474f",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            backgroundColor: getBgColor(perc),
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 48, textAlign: "right", color: "#fff" }}>
                      {perc.toFixed(1)}%
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Maç Listesi */}
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Maç Listesi
        </Typography>
        <Stack spacing={1.5} mb={2}>
          {visibleMatches.map((m, idx) => {
            const dateText = m.date ? new Date(m.date).toLocaleDateString("tr-TR") : "-";
            const isHomeSelected = m.homeTeam === selectedTeam;

            return (
              <Paper
                key={idx}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: "#1c262b",
                  border: "1px solid #263238",
                }}
              >
                {/* Tarih & Lig & Pattern */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="caption" color="grey.400">
                    {m.league}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="grey.500">
                      {dateText}
                    </Typography>
                    <Chip
                      label={m.iyms.pattern}
                      size="small"
                      sx={{
                        backgroundColor: "#263238",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Takım satırı (TeamFixture benzeri) */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0,1fr) 72px minmax(0,1fr) auto",
                    alignItems: "center",
                    columnGap: 1,
                  }}
                >
                  {/* Home logo */}
                  <img
                    src={getTeamLogo(m.homeTeam)}
                    alt={m.homeTeam}
                    width={28}
                    height={28}
                  />

                  {/* Home name */}
                  <Typography
                    fontWeight={isHomeSelected ? "bold" : "normal"}
                    fontSize="14px"
                    noWrap
                    title={m.homeTeam}
                    sx={{ color: "#eceff1" }}
                  >
                    {m.homeTeam}
                  </Typography>

                  {/* Score box */}
                  <Stack
                    spacing={0.3}
                    alignItems="center"
                    sx={{
                      backgroundColor: "#102027",
                      borderRadius: 1,
                      py: 0.3,
                    }}
                  >
                    <Typography fontWeight="bold" fontSize="14px" color="#fff">
                      {m.iyms.homeHT} - {m.iyms.awayHT}{" "}
                      <Typography component="span" variant="caption" color="grey.400">
                        (İY)
                      </Typography>
                    </Typography>
                    <Typography fontWeight="bold" fontSize="14px" color="#fff">
                      {m.iyms.fullHome} - {m.iyms.fullAway}{" "}
                      <Typography component="span" variant="caption" color="grey.400">
                        (MS)
                      </Typography>
                    </Typography>
                  </Stack>

                  {/* Away name */}
                  <Typography
                    fontWeight={!isHomeSelected ? "bold" : "normal"}
                    fontSize="14px"
                    noWrap
                    textAlign="right"
                    title={m.awayTeam}
                    sx={{ color: "#eceff1" }}
                  >
                    {m.awayTeam}
                  </Typography>

                  {/* Away logo */}
                  <img
                    src={getTeamLogo(m.awayTeam)}
                    alt={m.awayTeam}
                    width={28}
                    height={28}
                  />
                </Box>
              </Paper>
            );
          })}

          {visibleMatches.length === 0 && (
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#1c262b",
                border: "1px solid #263238",
              }}
            >
              <Typography align="center" sx={{ color: "#b0bec5" }}>
                Seçilen filtrelere uygun maç bulunamadı.
              </Typography>
            </Paper>
          )}
        </Stack>

        {/* Grafik Bölümü (basit bar grafikleri) */}
        <Typography variant="h6" fontWeight="bold" mt={4} mb={1}>
          İY/MS Dağılım Grafiği (Genel / İç Saha / Deplasman)
        </Typography>
        <Paper sx={{ p: 2, mb: 4, backgroundColor: "#1c262b" }}>
          <Typography variant="body2" color="grey.300" mb={2}>
            İç saha maçları: {totalHomeMatches}, Deplasman maçları: {totalAwayMatches}
          </Typography>
          <Stack spacing={1.5}>
            {IY_MS_PATTERNS.map(pattern => {
              const overallPerc = stats?.overallPerc[pattern] || 0;
              const homePerc = stats?.homePerc[pattern] || 0;
              const awayPerc = stats?.awayPerc[pattern] || 0;

              return (
                <Box key={pattern}>
                  <Typography variant="body2" color="grey.300" mb={0.5}>
                    {pattern}
                  </Typography>
                  <Stack spacing={0.5}>
                    {[
                      { label: "Genel", value: overallPerc, color: "#42a5f5" },
                      { label: "İç Saha", value: homePerc, color: "#66bb6a" },
                      { label: "Deplasman", value: awayPerc, color: "#ffca28" },
                    ].map(row => (
                      <Stack key={row.label} direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ minWidth: 70 }}>
                          <Typography variant="caption" color="grey.500">
                            {row.label}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 999,
                            backgroundColor: "#263238",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min(100, row.value).toFixed(1)}%`,
                              height: "100%",
                              backgroundColor: row.color,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ minWidth: 40, textAlign: "right", color: "#fff" }}>
                          {row.value.toFixed(1)}%
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default IyMsAnalysis;

