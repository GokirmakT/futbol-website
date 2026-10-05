import { Box, Stack, Typography } from "@mui/material";
import MetricGrid from "./TeamDetail_MetricGrid.jsx";
import { countMatches, formatAverage, formatRate, getPlayedTeamMatches } from "../utils/teamDetailStatistics.js";

const CornerStats = ({ matches, team }) => {
  const rows = getPlayedTeamMatches(matches, team);
  const total = rows.length;
  const count = predicate => countMatches(rows, predicate);
  const homeRows = rows.filter(row => row.isHome);
  const awayRows = rows.filter(row => !row.isHome);

  if (!total) {
    return <Box sx={{ p: 2, border: "1px solid #39464c", borderRadius: 1, color: "#aab7bc", backgroundColor: "#202a30" }}>Seçili filtrelerde korner verisi bulunan oynanmış maç yok.</Box>;
  }

  const splitMetrics = (splitRows, label) => (
    <Box key={label}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: "#d9e2e5", fontWeight: 700 }}>{label} · {splitRows.length} maç</Typography>
      <MetricGrid columns={{ xs: 1, sm: 2, lg: 2 }} items={[
        { label: "Takım korner / maç", value: formatAverage(splitRows, row => row.cornersFor) },
        { label: "Rakip korner / maç", value: formatAverage(splitRows, row => row.cornersAgainst), accent: "#ef9a9a" },
        { label: "Toplam korner / maç", value: formatAverage(splitRows, row => row.totalCorners), accent: "#f1d27a" },
        { label: "Takım korner üstünlüğü", value: formatRate(countMatches(splitRows, row => row.cornersFor > row.cornersAgainst), splitRows.length) },
      ]} />
    </Box>
  );

  return (
    <Stack spacing={2.5}>
      <MetricGrid items={[
        { label: "Oynanmış maç", value: total, detail: "Seçili sezon ve lig" },
        { label: "Takım korner / maç", value: formatAverage(rows, row => row.cornersFor), detail: `${rows.reduce((sum, row) => sum + row.cornersFor, 0)} takım korneri` },
        { label: "Rakip korner / maç", value: formatAverage(rows, row => row.cornersAgainst), detail: `${rows.reduce((sum, row) => sum + row.cornersAgainst, 0)} rakip korneri`, accent: "#ef9a9a" },
        { label: "Toplam korner / maç", value: formatAverage(rows, row => row.totalCorners), accent: "#f1d27a" },
        { label: "Korner farkı / maç", value: formatAverage(rows, row => row.cornersFor - row.cornersAgainst), detail: "Takım − rakip", accent: "#f1d27a" },
        { label: "Takım korner üstünlüğü", value: formatRate(count(row => row.cornersFor > row.cornersAgainst), total) },
        { label: "Rakip korner üstünlüğü", value: formatRate(count(row => row.cornersAgainst > row.cornersFor), total), accent: "#ef9a9a" },
        { label: "Eşit korner", value: formatRate(count(row => row.cornersFor === row.cornersAgainst), total) },
      ]} />

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, color: "#f4f5f5", fontWeight: 700 }}>Toplam korner çizgileri</Typography>
        <MetricGrid items={[
          { label: "7.5 üst", value: formatRate(count(row => row.totalCorners > 7.5), total) },
          { label: "8.5 üst", value: formatRate(count(row => row.totalCorners > 8.5), total) },
          { label: "9.5 üst", value: formatRate(count(row => row.totalCorners > 9.5), total) },
          { label: "10.5 üst", value: formatRate(count(row => row.totalCorners > 10.5), total) },
          { label: "Takım 4.5 üst", value: formatRate(count(row => row.cornersFor > 4.5), total) },
          { label: "Takım 5.5 üst", value: formatRate(count(row => row.cornersFor > 5.5), total) },
          { label: "Rakip 4.5 üst", value: formatRate(count(row => row.cornersAgainst > 4.5), total) },
          { label: "Rakip 5.5 üst", value: formatRate(count(row => row.cornersAgainst > 5.5), total) },
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

export default CornerStats;