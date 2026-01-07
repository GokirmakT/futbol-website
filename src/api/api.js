import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// MATCHES
export const getMatches = async () => {
  const res = await api.get("/matches");
  const data = res.data;
  // Eğer data bir dizi değilse, boş dizi döndür
  return Array.isArray(data) ? data : [];
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