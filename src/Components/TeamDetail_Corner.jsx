import TeamDetailAnalytics from "./TeamDetailAnalytics.jsx";
import { countMatches, formatAverage, getPlayedTeamMatches } from "../utils/teamDetailStatistics.js";

const CornerStats = ({ matches, team }) => {
  const rows = getPlayedTeamMatches(matches, team);
  const total = rows.length;
  const count = predicate => countMatches(rows, predicate);
  const homeRows = rows.filter(row => row.isHome);
  const awayRows = rows.filter(row => !row.isHome);
  const rate = matchCount => total ? matchCount / total * 100 : 0;
  const splitRate = (splitRows, predicate) => splitRows.length
    ? countMatches(splitRows, predicate) / splitRows.length * 100
    : 0;
  const comparisonMetrics = splitRows => [
    { label: "Takım korner / maç", value: formatAverage(splitRows, row => row.cornersFor), valueColor: "#fff", showBar: false },
    { label: "Rakip korner / maç", value: formatAverage(splitRows, row => row.cornersAgainst), valueColor: "#fff", showBar: false },
    { label: "Toplam korner / maç", value: formatAverage(splitRows, row => row.totalCorners), valueColor: "#fff", showBar: false },
    ...[
      { label: "8,5 üst", predicate: row => row.totalCorners > 8.5 },
      { label: "9,5 üst", predicate: row => row.totalCorners > 9.5 },
      { label: "Takım 5,5 üst", predicate: row => row.cornersFor > 5.5 },
      { label: "Rakip 4,5 üst", predicate: row => row.cornersAgainst > 4.5, accent: "#ef9a9a" },
    ].map(({ label, predicate, accent }) => ({
      label,
      value: `%${Math.round(splitRate(splitRows, predicate))}`,
      rate: splitRate(splitRows, predicate),
      accent,
    })),
  ];

  return (
    <TeamDetailAnalytics
      emptyMessage="Seçili filtrelerde korner verisi bulunan oynanmış maç yok."
      summary={[
        { label: "Maç", value: total, detail: "Oynanmış maç sayısı", icon: "▣" },
        { label: "Takım korner / maç", value: formatAverage(rows, row => row.cornersFor), detail: `${rows.reduce((sum, row) => sum + row.cornersFor, 0)} takım korneri`, icon: "⚑" },
        { label: "Rakip korner / maç", value: formatAverage(rows, row => row.cornersAgainst), detail: `${rows.reduce((sum, row) => sum + row.cornersAgainst, 0)} rakip korneri`, accent: "#ef9a9a", icon: "⚑" },
        { label: "Toplam korner / maç", value: formatAverage(rows, row => row.totalCorners), detail: "İki takımın korner toplamı", accent: "#f1d27a", icon: "◉" },
      ]}
      featured={{
        title: "Korner analizi",
        label: "7,5 üst",
        count: count(row => row.totalCorners > 7.5),
        total,
        rate: rate(count(row => row.totalCorners > 7.5)),
        detail: "Maçlarda toplam korner sayısının 7,5 üstü olma oranı.",
      }}
      distribution={[
        { label: "8,5 üst", count: count(row => row.totalCorners > 8.5), total, rate: rate(count(row => row.totalCorners > 8.5)) },
        { label: "9,5 üst", count: count(row => row.totalCorners > 9.5), total, rate: rate(count(row => row.totalCorners > 9.5)) },
        { label: "10,5 üst", count: count(row => row.totalCorners > 10.5), total, rate: rate(count(row => row.totalCorners > 10.5)) },
        { label: "Takım 4,5 üst", count: count(row => row.cornersFor > 4.5), total, rate: rate(count(row => row.cornersFor > 4.5)) },
        { label: "Takım 5,5 üst", count: count(row => row.cornersFor > 5.5), total, rate: rate(count(row => row.cornersFor > 5.5)) },
        { label: "Rakip 4,5 üst", count: count(row => row.cornersAgainst > 4.5), total, rate: rate(count(row => row.cornersAgainst > 4.5)), accent: "#ef9a9a" },
        { label: "Rakip 5,5 üst", count: count(row => row.cornersAgainst > 5.5), total, rate: rate(count(row => row.cornersAgainst > 5.5)), accent: "#ef9a9a" },
      ]}
      comparison={[
        {
          label: "İç saha",
          matches: homeRows.length,
          metrics: comparisonMetrics(homeRows),
        },
        {
          label: "Deplasman",
          matches: awayRows.length,
          metrics: comparisonMetrics(awayRows),
        },
      ]}
    />
  );
};

export default CornerStats;
