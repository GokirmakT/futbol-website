import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
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