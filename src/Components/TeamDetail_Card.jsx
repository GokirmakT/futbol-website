import TeamDetailAnalytics from "./TeamDetailAnalytics.jsx";
import { countMatches, formatAverage, formatRate, getPlayedTeamMatches } from "../utils/teamDetailStatistics.js";

const CardStats = ({ matches, team }) => {
  const rows = getPlayedTeamMatches(matches, team);
  const total = rows.length;
  const count = predicate => countMatches(rows, predicate);
  const homeRows = rows.filter(row => row.isHome);
  const awayRows = rows.filter(row => !row.isHome);
  const rate = matchCount => total ? matchCount / total * 100 : 0;
  const splitRate = (splitRows, predicate) => splitRows.length
    ? countMatches(splitRows, predicate) / splitRows.length * 100
    : 0;
  const teamCards = row => row.yellowFor + row.redFor;
  const opponentCards = row => row.yellowAgainst + row.redAgainst;

  return (
    <TeamDetailAnalytics
      emptyMessage="Seçili filtrelerde kart verisi bulunan oynanmış maç yok."
      summary={[
        { label: "Maç", value: total, detail: "Oynanmış maç sayısı", icon: "▣" },
        { label: "Takım sarı / maç", value: formatAverage(rows, row => row.yellowFor), detail: `${rows.reduce((sum, row) => sum + row.yellowFor, 0)} takım sarı kartı`, icon: "▰" },
        { label: "Rakip sarı / maç", value: formatAverage(rows, row => row.yellowAgainst), detail: `${rows.reduce((sum, row) => sum + row.yellowAgainst, 0)} rakip sarı kartı`, accent: "#f1d27a", icon: "▰" },
        { label: "Ceza skoru / maç", value: formatAverage(rows, row => row.penaltyScore), detail: "Kırmızı kart × 2 ağırlıklı", accent: "#ef9a9a", icon: "▰" },
      ]}
      featured={{
        title: "Kart analizi",
        label: "2,5 üst Ceza skoru",
        count: count(row => row.penaltyScore > 2.5),
        total,
        rate: rate(count(row => row.penaltyScore > 2.5)),
        detail: "Sarı kartlar 1, kırmızı kartlar 2 ceza puanı olarak hesaplanır.",
      }}
      distribution={[
        { label: "3,5 üst ceza skoru", count: count(row => row.penaltyScore > 3.5), total, rate: rate(count(row => row.penaltyScore > 3.5)) },
        { label: "4,5 üst ceza skoru", count: count(row => row.penaltyScore > 4.5), total, rate: rate(count(row => row.penaltyScore > 4.5)) },
        { label: "Takım 1,5 üst", count: count(row => row.teamPenaltyScore > 1.5), total, rate: rate(count(row => row.teamPenaltyScore > 1.5)) },
        { label: "Takım kart üstünlüğü", count: count(row => teamCards(row) > opponentCards(row)), total, rate: rate(count(row => teamCards(row) > opponentCards(row))) },
        { label: "Eşit kart sayısı", count: count(row => teamCards(row) === opponentCards(row)), total, rate: rate(count(row => teamCards(row) === opponentCards(row))) },
        { label: "Kırmızı kartlı maç", count: count(row => row.totalRed > 0), total, rate: rate(count(row => row.totalRed > 0)), accent: "#ef9a9a" },
        { label: "Takım kırmızı kartı", count: count(row => row.redFor > 0), total, rate: rate(count(row => row.redFor > 0)), accent: "#ef9a9a" },
      ]}
      comparison={[
        {
          label: "İç saha",
          matches: homeRows.length,
          metrics: [
            { label: "Takım sarı / maç", value: formatAverage(homeRows, row => row.yellowFor), valueColor: "#fff", showBar: false },
            { label: "Rakip sarı / maç", value: formatAverage(homeRows, row => row.yellowAgainst), valueColor: "#fff", showBar: false },
            { label: "Ceza skoru / maç", value: formatAverage(homeRows, row => row.penaltyScore), valueColor: "#fff", showBar: false },
            { label: "2,5 üst ceza skoru", value: formatRate(countMatches(homeRows, row => row.penaltyScore > 2.5), homeRows.length), rate: splitRate(homeRows, row => row.penaltyScore > 2.5), accent: "#ef9a9a" },
            { label: "3,5 üst ceza skoru", value: formatRate(countMatches(homeRows, row => row.penaltyScore > 3.5), homeRows.length), rate: splitRate(homeRows, row => row.penaltyScore > 3.5), accent: "#ef9a9a" },
            { label: "Takım kart üstünlüğü", value: formatRate(countMatches(homeRows, row => teamCards(row) > opponentCards(row)), homeRows.length), rate: splitRate(homeRows, row => teamCards(row) > opponentCards(row)) },
          ],
        },
        {
          label: "Deplasman",
          matches: awayRows.length,
          metrics: [
            { label: "Takım sarı / maç", value: formatAverage(awayRows, row => row.yellowFor), valueColor: "#fff", showBar: false },
            { label: "Rakip sarı / maç", value: formatAverage(awayRows, row => row.yellowAgainst), valueColor: "#fff", showBar: false },
            { label: "Ceza skoru / maç", value: formatAverage(awayRows, row => row.penaltyScore), valueColor: "#fff", showBar: false },
            { label: "2,5 üst ceza skoru", value: formatRate(countMatches(awayRows, row => row.penaltyScore > 2.5), awayRows.length), rate: splitRate(awayRows, row => row.penaltyScore > 2.5), accent: "#ef9a9a" },
            { label: "3,5 üst ceza skoru", value: formatRate(countMatches(awayRows, row => row.penaltyScore > 3.5), awayRows.length), rate: splitRate(awayRows, row => row.penaltyScore > 3.5), accent: "#ef9a9a" },
            { label: "Takım kart üstünlüğü", value: formatRate(countMatches(awayRows, row => teamCards(row) > opponentCards(row)), awayRows.length), rate: splitRate(awayRows, row => teamCards(row) > opponentCards(row)) },
          ],
        },
      ]}
    />
  );
};

export default CardStats;
