import { Box, Stack, Typography } from "@mui/material";
import MetricGrid from "./TeamDetail_MetricGrid.jsx";
import { countMatches, formatAverage, formatRate, getPlayedTeamMatches } from "../utils/teamDetailStatistics.js";

const GoalsStats = ({ matches, team }) => {
  const rows = getPlayedTeamMatches(matches, team);
  const total = rows.length;
  const count = predicate => countMatches(rows, predicate);
  const homeRows = rows.filter(row => row.isHome);
  const awayRows = rows.filter(row => !row.isHome);
  const points = count(row => row.result === "W") * 3 + count(row => row.result === "D");

  if (!total) {
    return <Box sx={{ p: 2, border: "1px solid #39464c", borderRadius: 1, color: "#aab7bc", backgroundColor: "#202a30" }}>Seçili filtrelerde gol verisi bulunan oynanmış maç yok.</Box>;
  }

  const splitMetrics = (splitRows, label) => {
    const splitCount = splitRows.length;
    const splitRate = predicate => formatRate(countMatches(splitRows, predicate), splitCount);
    return (
      <Box key={label} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "#d9e2e5", fontWeight: 700 }}>{label} · {splitCount} maç</Typography>
        <MetricGrid columns={{ xs: 1, sm: 2, lg: 2 }} items={[
          { label: "Attığı gol / maç", value: formatAverage(splitRows, row => row.goalsFor) },
          { label: "Yediği gol / maç", value: formatAverage(splitRows, row => row.goalsAgainst), accent: "#ef9a9a" },
          { label: "2.5 üst", value: splitRate(row => row.totalGoals > 2.5) },
          { label: "Karşılıklı gol", value: splitRate(row => row.bothTeamsScored) },
        ]} />
      </Box>
    );
  };

  return (
    <Stack spacing={2.5}>
      <MetricGrid items={[
        { label: "Oynanmış maç", value: total, detail: "Seçili sezon ve lig" },
        { label: "G-B-M", value: `${count(row => row.result === "W")}-${count(row => row.result === "D")}-${count(row => row.result === "L")}`, detail: `${formatRate(count(row => row.result === "W"), total)} galibiyet` },
        { label: "Puan / maç", value: (points / total).toFixed(2), detail: `${points} toplam puan`, accent: "#f1d27a" },
        { label: "Gol ortalaması", value: formatAverage(rows, row => row.totalGoals), detail: "Maç başına toplam gol", accent: "#f1d27a" },
        { label: "Attığı gol / maç", value: formatAverage(rows, row => row.goalsFor) },
        { label: "Yediği gol / maç", value: formatAverage(rows, row => row.goalsAgainst), accent: "#ef9a9a" },
      ]} />

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, color: "#f4f5f5", fontWeight: 700 }}>Gol piyasaları</Typography>
        <MetricGrid items={[
          { label: "1.5 üst", value: formatRate(count(row => row.totalGoals > 1.5), total) },
          { label: "2.5 üst", value: formatRate(count(row => row.totalGoals > 2.5), total) },
          { label: "3.5 üst", value: formatRate(count(row => row.totalGoals > 3.5), total) },
          { label: "4.5 üst", value: formatRate(count(row => row.totalGoals > 4.5), total) },
          { label: "1.5 alt", value: formatRate(count(row => row.totalGoals < 1.5), total), accent: "#ef9a9a" },
          { label: "2.5 alt", value: formatRate(count(row => row.totalGoals < 2.5), total), accent: "#ef9a9a" },
          { label: "Karşılıklı gol", value: formatRate(count(row => row.bothTeamsScored), total) },
          { label: "Gol yemedi", value: formatRate(count(row => row.cleanSheet), total) },
          { label: "Gol atamadı", value: formatRate(count(row => row.failedToScore), total), accent: "#ef9a9a" },
        ]} />
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, color: "#f4f5f5", fontWeight: 700 }}>İç saha / deplasman</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1.5 }}>
          {splitMetrics(homeRows, "İç saha")}
          {splitMetrics(awayRows, "Deplasman")}
        </Box>
      </Box>
    </Stack>
  );
};

export default GoalsStats;