import { Box, Stack, Typography } from "@mui/material";
import MetricGrid from "./TeamDetail_MetricGrid.jsx";
import { countMatches, formatAverage, formatRate, getPlayedTeamMatches } from "../utils/teamDetailStatistics.js";

const CardStats = ({ matches, team }) => {
  const rows = getPlayedTeamMatches(matches, team);
  const total = rows.length;
  const count = predicate => countMatches(rows, predicate);
  const homeRows = rows.filter(row => row.isHome);
  const awayRows = rows.filter(row => !row.isHome);

  if (!total) {
    return <Box sx={{ p: 2, border: "1px solid #39464c", borderRadius: 1, color: "#aab7bc", backgroundColor: "#202a30" }}>Seçili filtrelerde kart verisi bulunan oynanmış maç yok.</Box>;
  }

  const splitMetrics = (splitRows, label) => (
    <Box key={label}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: "#d9e2e5", fontWeight: 700 }}>{label} · {splitRows.length} maç</Typography>
      <MetricGrid columns={{ xs: 1, sm: 2, lg: 2 }} items={[
        { label: "Takım sarı / maç", value: formatAverage(splitRows, row => row.yellowFor) },
        { label: "Rakip sarı / maç", value: formatAverage(splitRows, row => row.yellowAgainst), accent: "#f1d27a" },
        { label: "Toplam ceza skoru / maç", value: formatAverage(splitRows, row => row.penaltyScore), accent: "#ef9a9a" },
        { label: "Kırmızı kartlı maç", value: formatRate(countMatches(splitRows, row => row.totalRed > 0), splitRows.length) },
      ]} />
    </Box>
  );

  return (
    <Stack spacing={2.5}>
      <MetricGrid items={[
        { label: "Oynanmış maç", value: total, detail: "Seçili sezon ve lig" },
        { label: "Takım sarı kart / maç", value: formatAverage(rows, row => row.yellowFor), detail: `${rows.reduce((sum, row) => sum + row.yellowFor, 0)} sarı kart` },
        { label: "Rakip sarı kart / maç", value: formatAverage(rows, row => row.yellowAgainst), detail: `${rows.reduce((sum, row) => sum + row.yellowAgainst, 0)} sarı kart`, accent: "#f1d27a" },
        { label: "Toplam sarı kart / maç", value: formatAverage(rows, row => row.totalYellow), accent: "#f1d27a" },
        { label: "Takım kırmızı kart", value: formatRate(count(row => row.redFor > 0), total), detail: `${rows.reduce((sum, row) => sum + row.redFor, 0)} takım kırmızısı`, accent: "#ef9a9a" },
        { label: "Kırmızı kartlı maç", value: formatRate(count(row => row.totalRed > 0), total), detail: `${rows.reduce((sum, row) => sum + row.totalRed, 0)} toplam kırmızı`, accent: "#ef9a9a" },
        { label: "Takım ceza skoru / maç", value: formatAverage(rows, row => row.teamPenaltyScore) },
        { label: "Toplam ceza skoru / maç", value: formatAverage(rows, row => row.penaltyScore), accent: "#ef9a9a" },
      ]} />

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, color: "#f4f5f5", fontWeight: 700 }}>Ceza skoru çizgileri</Typography>
        <MetricGrid items={[
          { label: "2.5 üst", value: formatRate(count(row => row.penaltyScore > 2.5), total) },
          { label: "3.5 üst", value: formatRate(count(row => row.penaltyScore > 3.5), total) },
          { label: "4.5 üst", value: formatRate(count(row => row.penaltyScore > 4.5), total) },
          { label: "Takım 1.5 üst", value: formatRate(count(row => row.teamPenaltyScore > 1.5), total) },
          { label: "Takım kart üstünlüğü", value: formatRate(count(row => row.yellowFor + row.redFor > row.yellowAgainst + row.redAgainst), total) },
          { label: "Eşit kart sayısı", value: formatRate(count(row => row.yellowFor + row.redFor === row.yellowAgainst + row.redAgainst), total) },
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

export default CardStats;