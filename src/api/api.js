import axios from "axios";

const api = axios.create({
  baseURL: "https://futbolsitesi.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// MATCHES
export const getMatches = async () => {
  const res = await api.get("/matches");
  return res.data;
};

// STANDINGS
export const getStandings = async (league = null, season = null) => {
  let url = "/standings";
  const params = [];
  if (league) params.push(`league=${encodeURIComponent(league)}`);
  if (season) params.push(`season=${encodeURIComponent(season)}`);
  if (params.length > 0) url += `?${params.join("&")}`;
  const res = await api.get(url);
  return res.data;
};