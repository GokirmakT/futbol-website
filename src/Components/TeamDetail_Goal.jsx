import TeamDetailAnalytics from "./TeamDetailAnalytics.jsx";
import { countMatches, formatAverage, getPlayedTeamMatches } from "../utils/teamDetailStatistics.js";

const GoalsStats = ({ matches, team }) => {
  const rows = getPlayedTeamMatches(matches, team);
  const total = rows.length;
  const count = predicate => countMatches(rows, predicate);
  const homeRows = rows.filter(row => row.isHome);
  const awayRows = rows.filter(row => !row.isHome);
  const points = count(row => row.result === "W") * 3 + count(row => row.result === "D");
  const rate = matchCount => total ? matchCount / total * 100 : 0;
  const splitRate = (splitRows, predicate) => splitRows.length
    ? countMatches(splitRows, predicate) / splitRows.length * 100
    : 0;

  return (
    <TeamDetailAnalytics
      emptyMessage="Seçili filtrelerde gol verisi bulunan oynanmış maç yok."
      summary={[
        { label: "Maç", value: total, detail: "Oynanmış maç sayısı", icon: "▣" },
        { label: "G-B-M", value: `${count(row => row.result === "W")}G · ${count(row => row.result === "D")}B · ${count(row => row.result === "L")}M`, detail: "Galibiyet · Beraberlik · Mağlubiyet", icon: "▥" },
        { label: "Puan / maç", value: total ? (points / total).toFixed(2) : "—", detail: `${points} toplam puan`, accent: "#f1d27a", icon: "★" },
        { label: "Gol / maç", value: formatAverage(rows, row => row.totalGoals), detail: "Maç başına toplam gol", accent: "#f1d27a", icon: "⚽" },
      ]}
      featured={{
        title: "Gol analizi",
        label: "1,5 üst",
        count: count(row => row.totalGoals > 1.5),
        total,
        rate: rate(count(row => row.totalGoals > 1.5)),
        detail: "Maçlarda en az 2 gol gerçekleşme oranı.",
      }}
      distribution={[
        { label: "2,5 üst", count: count(row => row.totalGoals > 2.5), total, rate: rate(count(row => row.totalGoals > 2.5)) },
        { label: "3,5 üst", count: count(row => row.totalGoals > 3.5), total, rate: rate(count(row => row.totalGoals > 3.5)) },
        { label: "4,5 üst", count: count(row => row.totalGoals > 4.5), total, rate: rate(count(row => row.totalGoals > 4.5)) },
        { label: "Takım 1,5 üst", count: count(row => row.goalsFor > 1.5), total, rate: rate(count(row => row.goalsFor > 1.5)) },
        { label: "Takım 2,5 üst", count: count(row => row.goalsFor > 2.5), total, rate: rate(count(row => row.goalsFor > 2.5)) },
        { label: "1,5 alt", count: count(row => row.totalGoals < 1.5), total, rate: rate(count(row => row.totalGoals < 1.5)), accent: "#ef9a9a" },
        { label: "2,5 alt", count: count(row => row.totalGoals < 2.5), total, rate: rate(count(row => row.totalGoals < 2.5)), accent: "#ef9a9a" },
        { label: "Karşılıklı gol", count: count(row => row.bothTeamsScored), total, rate: rate(count(row => row.bothTeamsScored)) },
        { label: "Gol yemedi", count: count(row => row.cleanSheet), total, rate: rate(count(row => row.cleanSheet)) },
        { label: "Gol atamadı", count: count(row => row.failedToScore), total, rate: rate(count(row => row.failedToScore)), accent: "#ef9a9a" },
      ]}
      comparison={[
        {
          label: "İç saha",
          matches: homeRows.length,
          metrics: [
            { label: "Attığı gol / maç", value: formatAverage(homeRows, row => row.goalsFor), valueColor: "#fff", showBar: false },
            { label: "Yediği gol / maç", value: formatAverage(homeRows, row => row.goalsAgainst), valueColor: "#fff", showBar: false },
            { label: "2,5 üst", value: `%${Math.round(splitRate(homeRows, row => row.totalGoals > 2.5))}`, rate: splitRate(homeRows, row => row.totalGoals > 2.5) },
            { label: "3,5 üst", value: `%${Math.round(splitRate(homeRows, row => row.totalGoals > 3.5))}`, rate: splitRate(homeRows, row => row.totalGoals > 3.5) },
            { label: "Takım 1,5 üst", value: `%${Math.round(splitRate(homeRows, row => row.goalsFor > 1.5))}`, rate: splitRate(homeRows, row => row.goalsFor > 1.5) },
            { label: "Takım 2,5 üst", value: `%${Math.round(splitRate(homeRows, row => row.goalsFor > 2.5))}`, rate: splitRate(homeRows, row => row.goalsFor > 2.5) },
            { label: "Karşılıklı gol", value: `%${Math.round(splitRate(homeRows, row => row.bothTeamsScored))}`, rate: splitRate(homeRows, row => row.bothTeamsScored) },
          ],
        },
        {
          label: "Deplasman",
          matches: awayRows.length,
          metrics: [
            { label: "Attığı gol / maç", value: formatAverage(awayRows, row => row.goalsFor), valueColor: "#fff", showBar: false },
            { label: "Yediği gol / maç", value: formatAverage(awayRows, row => row.goalsAgainst), valueColor: "#fff", showBar: false },
            { label: "2,5 üst", value: `%${Math.round(splitRate(awayRows, row => row.totalGoals > 2.5))}`, rate: splitRate(awayRows, row => row.totalGoals > 2.5) },
            { label: "3,5 üst", value: `%${Math.round(splitRate(awayRows, row => row.totalGoals > 3.5))}`, rate: splitRate(awayRows, row => row.totalGoals > 3.5) },
            { label: "Takım 1,5 üst", value: `%${Math.round(splitRate(awayRows, row => row.goalsFor > 1.5))}`, rate: splitRate(awayRows, row => row.goalsFor > 1.5) },
            { label: "Takım 2,5 üst", value: `%${Math.round(splitRate(awayRows, row => row.goalsFor > 2.5))}`, rate: splitRate(awayRows, row => row.goalsFor > 2.5) },
            { label: "Karşılıklı gol", value: `%${Math.round(splitRate(awayRows, row => row.bothTeamsScored))}`, rate: splitRate(awayRows, row => row.bothTeamsScored) },
          ],
        },
      ]}
    />
  );
};

export default GoalsStats;
